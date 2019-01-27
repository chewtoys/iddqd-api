"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const _1 = __importDefault(require("./"));
const sequelize = new sequelize_1.default(_1.default.db_name, // DB name
_1.default.db_username, // DB user name
_1.default.db_password, // DB user password
{
    host: _1.default.db_host,
    dialect: 'postgres',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});
// import FileModel from '../models/Files';
const Users_1 = __importDefault(require("../models/Users"));
sequelize
    .authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
})
    .catch(err => {
    console.error('Unable to connect to the database:', err);
});
exports.default = {
    // File: FileModel(sequelize, Sequelize),
    User: Users_1.default(sequelize, sequelize_1.default)
};
