import * as dotenv from 'dotenv';
dotenv.config();

export default () => ({
  app: {
    environment:
      process.env.APP_ENV === 'production' ? 'production' : process.env.APP_ENV,
    port: parseInt(process.env.APP_PORT, 10) || 3010,

    name: 'scrapay',
  },

  auth0: {
    audience: process.env.AUTH0_AUDIENCE,
    domain: process.env.AUTH0_DOMAIN,
  },

  jwt: {
    access: {
      secret: process.env.JWT_SECRET,
      signInOptions: {
        expiresIn: process.env.JWT_ACCEESS_EXPIRES_IN,
      },
    },
    refresh: {
      secret: process.env.JWT_SECRET,
      signInOptions: {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      },
    },
  },

  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    headers: process.env.CORS_HEADERS || '*',
  },
});
