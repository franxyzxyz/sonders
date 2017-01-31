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
  create: (node, params) => {
    const queryParam = `{${_.map(_.keys(params), param => `${param}: {${param}}`).join(',')}}`;
    return `CREATE (${node.name}:${node.label} ${queryParam}) `;
  },
  merge: (node, id, params) => {
    const queryParam = '{ id: {id} }';
    // const queryParam = `{${_.map(_.keys(params), param => `${param}: {${param}}`).join(',')}}`;
    const updateQuery = _.map(_.keys(params), param => `${param}: {${param}}`);
    return `MATCH (${node.name}:${node.label} ${queryParam})
            SET ${node.name} += {${updateQuery}}`;
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
  update: (id, params) => (
    `${compose.merge({ name: 'user', label: 'User' }, id, params)} RETURN user`
  ),
};

const Events = {
  save: (params, user) => {
    const eventNode = { name: 'event', label: 'Event' };
    const userNode = { name: 'user', label: 'User' };
    return `${compose.match(userNode, { id: user.id })}
      ${compose.create(eventNode, params)}
      ${compose.relate(eventNode, userNode, 'BELONGS_TO')} RETURN event`;
  },
};

// ref: http://stackoverflow.com/questions/25750016/nested-maps-and-collections-in-neo4j-2


module.exports = {
  getSession,
  Users,
  Events,
};
