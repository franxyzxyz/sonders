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
  save: (eventParams, userParams, names, eventMappedProp) => {
    const eventNode = { name: names.event, label: 'Event' };
    const userNode = { name: names.user, label: 'User' };
    return `${compose.matchAs(userNode, userParams)}
      ${compose.createAs(eventNode, eventParams, eventMappedProp)}
      ${compose.relate(eventNode, userNode, 'BELONGS_TO')} RETURN ${names.event}`;
  },
  delete: (eventParams, userParams, names) => (
    `${compose.matchRel({ name: names.event, label: 'Event'}, { name: names.user, label: 'User'}, { name: names.rel, label: 'BELONGS_TO' }, eventParams, userParams)}
    WITH ${names.event}, ${names.event}.id AS event_id DETACH DELETE ${names.event} RETURN event_id`
  ),
  update: (eventParams, userParams, names, newParams) => {
    return `${compose.matchRe({ name: names.event, label: 'Event' }, { name: names.user, label: 'User' }, { name: names.rel, label: 'BELONGS_TO' }, eventParams, userParams)}
    ${compose.onMatchSet({ name: names.event, label: 'Event', item: eventParams.id }, newParams)} RETURN ${names.event}`
  }
};

// ref: http://stackoverflow.com/questions/25750016/nested-maps-and-collections-in-neo4j-2

module.exports = {
  getSession,
  Users,
  Events,
};
