require('dotenv').config();

module.exports = {
  dev: process.env.ENV !== 'production' ? true : false,
  port: process.env.PORT || 3000,
  db: process.env.DB,

  authJwtSecret: process.env.AUTH_JWT_SECRET,

  publicApiKeyToken: process.env.PUBLIC_API_KEY_TOKEN,
  adminApiKeyToken: process.env.ADMIN_API_KEY_TOKEN,

  socketUser: process.env.USER_SOCKET,
  socketPassword: process.env.PASSWORD_SOCKET,

  serviceCorreoUrl: process.env.SERVICE_CORREO_URL,
  serviceCorreoKey: process.env.SERVICE_CORREO_KEY,

  ssrUrl: process.env.SSR_URL,
  adminUrl: process.env.ADMIN_URL,
};
