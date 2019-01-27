import dotenv from 'dotenv'
dotenv.config({ silent: true });
console.log(process.env.PORT)
export default {
  db_name: process.env.DB_NAME,
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD,
  db_host: process.env.DB_HOST,

  port: process.env.PORT || 3000
};
