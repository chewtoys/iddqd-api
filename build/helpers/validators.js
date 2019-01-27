"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
exports.validatePassword = (password, min = 6, max = 64) => new Promise((resolve, reject) => {
    if (typeof password !== 'string')
        reject('Password must be a string');
    else if (!validator_1.default.isLength(password, { min, max }))
        reject(`Password must be at least ${min} characters long and not more ${max}`);
    else
        resolve();
});
exports.validateComparePassword = (password, confirmPassword) => new Promise((resolve, reject) => {
    if (!confirmPassword)
        reject('Confirm the password');
    else if (!validator_1.default.equals(password, confirmPassword))
        reject('Passwords do not match');
    else
        resolve();
});
exports.validateEmail = (email) => new Promise((resolve, reject) => {
    if (typeof email !== 'string')
        reject('Email must be a string');
    else {
        if (validator_1.default.isEmail(email))
            resolve();
        else
            reject('Provided email doesn\'t match proper email format');
    }
});
exports.validateUserData = (data) => new Promise((resolve, reject) => {
    if (!data.password || !data.email)
        reject('Email and/or password is missing');
    else
        exports.validatePassword(data.password, 6)
            .then(() => exports.validateEmail(data.email))
            .then(() => resolve()) // todo добавить валидацию логина
            .catch((err) => reject(err));
});
exports.validateLogin = (data) => new Promise((resolve, reject) => {
    if (!data.password || !data.email)
        reject('Email and/or password is missing');
    else
        exports.validatePassword(data.password, 6)
            .then(() => exports.validateEmail(data.email))
            .then(() => resolve())
            .catch((err) => reject(err));
});
