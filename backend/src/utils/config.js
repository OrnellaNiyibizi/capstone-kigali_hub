import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT,
  DB_URI: process.env.DB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET + '_refresh',
  HOST: process.env.HOST,
};

if (!config.PORT) {
  throw new Error('PORT is not defined');
}
if (!config.DB_URI) {
  throw new Error('DB_URI is not defined');
}
if (!config.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}
if (!config.HOST) {
  throw new Error('HOST is not defined');
}

export default config;