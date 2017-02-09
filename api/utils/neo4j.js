/* eslint-disable no-param-reassign */
import { v1 as neo4j } from 'neo4j-driver';
import _ from 'lodash';
import nconf from '../config';

const driver = neo4j.driver(nconf.get('neo4j-local'), neo4j.auth.basic(nconf.get('LOCAL_USERNAME'), nconf.get('LOCAL_PASSWORD')));

const getSession = (context) => {
  if (context.neo4jSession) {
    return context.neo4jSession;
  }
  context.neo4jSession = driver.session();
  return context.neo4jSession;
};

const compose = {
  match: (node, params) => {
    const queryParam = `{${_.map(_.keys(params), param => `${param}: {${param}}`).join(',')}}`;
    return `MATCH (${node.name}:${node.label} ${queryParam}) `;
  },
  matchNode: (matchingNode, matchingParam, startNode, startParam, rel) => {
    const matchingQuery = _.isEmpty(matchingParam) ? '' : `{${_.map(_.keys(matchingParam), param => `${param}: {${matchingParam[param]}}`).join(',')}}`;
    const startQuery = `{${_.map(_.keys(startParam), param => `${param}: {${startParam[param]}}`).join(',')}}`;
    return `MATCH (${matchingNode.name}:${matchingNode.label} ${matchingQuery})-[${rel.name}:${rel.label}]->(${startNode.name}:${startNode.label} ${startQuery}) `;
  },
  matchAs: (node, params) => {
    const queryParam = `{${_.map(_.keys(params), param => `${param}: {${params[param]}}`).join(',')}}`;
    return `MATCH (${node.name}:${node.label} ${queryParam}) `;
  },
  create: (node, params) => {
    const queryParam = `{${_.map(_.keys(params), param => `${param}: {${param}}`).join(',')}}`;
    return `CREATE (${node.name}:${node.label} ${queryParam}) `;
  },
  createAs: (node, params, mappedParams) => {
    const queryParam = `${_.map(_.keys(params), param => `${param}: {${param}}`).join(',')}`;
    const queryMappedParams = `${_.map(_.keys(mappedParams), param => `${param}: {${mappedParams[param]}}`).join(',')}`;
    return `CREATE (${node.name}:${node.label} {${queryParam},${queryMappedParams}}) `;
  },
  matchRel: (start, end, rel, startParams, endParams) => {
    return `MATCH (${start.name}:${start.label} ${startParams})-[${rel.name}:${rel.label}]->(${end.name}:${end.label} ${endParams}) `;
  },
  matchRe: (start, end, rel, startParams, endParams) => {
    const startParamsQuery = `${_.map(_.keys(startParams), param => `${param}: {${startParams[param]}}`).join(',')}`;
    const endParamsQuery = `${_.map(_.keys(endParams), param => `${param}: {${endParams[param]}}`).join(',')}`;
    return `MATCH (${start.name}:${start.label} {${startParamsQuery}})-[${rel.name}:${rel.label}]->(${end.name}:${end.label} {${endParamsQuery}}) `;
  },
  merge: (node, params) => {
    const queryParam = '{ id: {id} }';
    // const queryParam = `{${_.map(_.keys(params), param => `${param}: {${param}}`).join(',')}}`;
    const updateQuery = _.map(_.keys(params), param => `${param}: {${param}}`);
    return `MATCH (${node.name}:${node.label} ${queryParam})
            SET ${node.name} += {${updateQuery}}`;
  },
  onMatchSet: (node, params) => {
    const updateQuery = _.map(_.keys(params), param => `${param}: {${param}}`);
    return `SET ${node.name} += {${updateQuery}}`;
  },
  relate: (start, end, rel) => (
    `CREATE (${start.name})-[:${rel}]->(${end.name})`
  ),
};

const Users = {
  read: params => (
    `${compose.match({ name: 'user', label: 'User' }, params)} RETURN user`
  ),
  save: params => (
    `${compose.create({ name: 'user', label: 'User' }, params)} RETURN user`
  ),
  update: params => (
    `${compose.merge({ name: 'user', label: 'User' }, params)} RETURN user`
  ),
};

const Events = {
  read: params => (
    `${compose.match({ name: 'event', label: 'Event' }, params)} RETURN event`
  ),
  readAll: userParams => (
    `${compose.matchNode({ name: 'user', label: 'User' }, userParams, { name: 'event', label: 'Event' }, {}, { name: 'r', label: 'OWNS' })}
    RETURN event`
  ),
  save: (eventParams, userParams, names, eventMappedProp) => {
    const eventNode = { name: names.event, label: 'Event' };
    const userNode = { name: names.user, label: 'User' };
    return `${compose.matchAs(userNode, userParams)}
      ${compose.createAs(eventNode, eventParams, eventMappedProp)}
      ${compose.relate(userNode, eventNode, 'OWNS')} RETURN ${names.event}`;
  },
  delete: (eventParams, userParams, names) => (
    `${compose.matchRel({ name: names.user, label: 'User' }, { name: names.event, label: 'Event' }, { name: names.rel, label: 'OWNS' }, userParams, eventParams)}
    WITH ${names.event}, ${names.event}.id AS event_id, ${names.event}.image AS image DETACH DELETE ${names.event} RETURN event_id, image`
  ),
  update: (eventParams, userParams, names, newParams) => (
    `${compose.matchRe({ name: names.user, label: 'User' }, { name: names.event, label: 'Event' }, { name: names.rel, label: 'OWNS' }, userParams, eventParams)}
    ${compose.onMatchSet({ name: names.event, label: 'Event', item: eventParams.id }, newParams)} RETURN ${names.event}`
  ),
  updateReturnOrg: (eventParams, userParams, names, newParams) => (
    `${compose.matchRe({ name: names.user, label: 'User' }, { name: names.event, label: 'Event' }, { name: names.rel, label: 'OWNS' }, userParams, eventParams)}
    WITH ${names.event}, ${names.event}.image AS orgImage
    ${compose.onMatchSet({ name: names.event, label: 'Event', item: eventParams.id }, newParams)} RETURN ${names.event}, orgImage`
  ),
};

// ref: http://stackoverflow.com/questions/25750016/nested-maps-and-collections-in-neo4j-2

module.exports = {
  getSession,
  Users,
  Events,
};
