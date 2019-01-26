"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.hashPassword = (password) => new Promise((resolve, reject) => {
    bcrypt_1.default.genSalt(10, (err, salt) => {
        if (err)
            reject(err);
        else
            bcrypt_1.default.hash(password, salt, (err, hash) => {
                if (err)
                    reject(err);
                else
                    resolve(hash);
            });
    });
});
exports.verifyPassword = (password, user) => new Promise((resolve, reject) => {
    bcrypt_1.default.compare(password, user.password, (err, result) => {
        if (err)
            reject(err);
        else
            resolve({ isValid: result, id: user.id });
    });
});
exports.uploadFile = (file, uploadPath) => new Promise((resolve, reject) => {
    file.mv(uploadPath, (err) => {
        if (err)
            reject(err);
        resolve();
    });
});
exports.getFileNameExt = (str) => {
    const file = str.split('/').pop();
    return file.substr(file.lastIndexOf('.') + 1, file.length);
};
