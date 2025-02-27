import dotenv from 'dotenv';

dotenv.config();

const config = {

  PORT: process.env.PORT || 3000,
  DB_URI: process.env.DB_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  HOST: process.env.HOST || 'localhost',
};

export default config;