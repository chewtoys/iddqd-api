"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(require("../../controllers/Users"));
const jwt_1 = require("../../middlewares/jwt");
const router = require('express').Router();
router.post('/create', Users_1.default.createUser);
router.patch('/password', jwt_1.checkToken, Users_1.default.changePassword);
router.post('/session', Users_1.default.login);
router.delete('/logout', jwt_1.checkToken, Users_1.default.logout);
router.delete('/logout/all', jwt_1.checkToken, Users_1.default.logoutOfAllSessions);
exports.default = router;
