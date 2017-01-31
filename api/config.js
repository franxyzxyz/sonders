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
    jwt_secret: process.env.JWT_SECRET,
    neo4j: 'local',
    'neo4j-local': 'bolt://localhost:7687',
    'neo4j-remote': 'bolt://hobby-mejhniliojekgbkeamlhjool.dbs.graphenedb.com:24786',
    base_url: 'http://localhost:3000',
    api_path: '/api/v0',
    users: {
      name: {
        minLength: 1,
        maxLength: 10,
      },
      username: {
        minLength: 1,
        maxLength: 30,
      },
      password: {
        minLength: 8,
        maxLength: 100,
      },
      email: {
        maxLength: 100,
      },
      default: {
        title: {
          maxLength: 100,
        },
        paragraph: {
          maxLength: 1000,
        },
      },
    },
    events: {
      title: {
        minLength: 1,
        maxLength: 200,
      },
    },
  });

module.exports = nconf;
