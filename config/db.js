const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME, // DB name
  process.env.DB_USERNAME, // DB user name
  process.env.DB_PASSWORD, // DB user password
  {
    host: process.env.DB_HOST, // DB host
    dialect: 'postgres', // DB type
    operatorsAliases: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

  }
);
const FileModel = require('../models/Files');
const UserModel = require('../models/Users');

const File = FileModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = {
  File,
  User
};


