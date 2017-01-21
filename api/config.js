import nconf from 'nconf';

nconf.env(['PORT', 'NODE_ENV'])
  .argv({
    p: {
      alias: 'PORT',
      describe: 'Default PORT to run on',
      demand: false,
      default: 3000,
    },
  })
  .defaults({
    LOCAL_USERNAME: process.env.NEO4JUSERLOCAL,
    LOCAL_PASSWORD: process.env.NEO4JPWLOCAL,
    REMOTE_USERNAME: process.env.NEO4JUSERREMOTE,
    REMOTE_PASSWORD: process.env.NEO4JPWREMOTE,
    neo4j: 'local',
    'neo4j-local': 'bolt://localhost:7474',
    'neo4j-remote': 'bolt://hobby-mejhniliojekgbkeamlhjool.dbs.graphenedb.com:24786',
    base_url: 'http://localhost:3000',
    api_path: '/api/v0',
  });

module.exports = nconf;
