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
    verify_secret: process.env.VERIFY_SECRET,
    neo4j: 'local',
    'neo4j-local': 'bolt://localhost:7687',
    'neo4j-remote': process.env.NEO4JREMOTE,
    base_url: 'http://localhost:3000',
    client_url: 'http://localhost:3001',
    api_path: '/api/v0',
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    MAILGUN_API_KEY: process.env.MAILGUN_KEY,
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
    image_base: process.env.CLOUDINARY_ACCESS,
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
    media: {
      image: {
        maxLength: 1000000,
      },
    },
    stories: {
      title: {
        minLength: 1,
        maxLength: 200,
      },
    },
  });

module.exports = nconf;
