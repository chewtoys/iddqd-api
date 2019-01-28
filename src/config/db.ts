import Sequelize from "sequelize";
import Config from "./";

const sequelize = new Sequelize(
  Config.db_name, // DB name
  Config.db_username, // DB user name
  Config.db_password, // DB user password
  {
    host: Config.db_host, // DB host
    dialect: "postgres", // DB type
    operatorsAliases: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);
import FileModel from "../models/File";
import UserModel from "../models/User";

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default {
  File: FileModel(sequelize, Sequelize),
  User: UserModel(sequelize, Sequelize)
};
