import { v1 as neo4j } from 'neo4j-driver';
import nconf from '../config';

const driver = neo4j.driver(nconf.get('neo4j-local'), neo4j.auth.basic(nconf.get('LOCAL_USERNAME'), nconf.get('LOCAL_PASSWORD')));

const getSession = (context) => {
  if (context.neo4jSession) {
    return context.neo4jSession;
  }
  context.neo4jSession = driver.session();
  return context.neo4jSession;
};

module.exports = {
  getSession,
};
