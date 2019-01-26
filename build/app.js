"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const jwt_1 = require("./middlewares/jwt");
const Users_1 = __importDefault(require("./controllers/Users"));
const app = express_1.default();
app.use(express_fileupload_1.default());
app.use(body_parser_1.default.urlencoded({
    extended: true
}));
app.use(body_parser_1.default.json());
app.get('/ping', (req, res) => res.status(200).json({
    msg: 'pong'
}));
app.post('/user/create', Users_1.default.createUser);
app.patch('/user/password', jwt_1.checkToken, Users_1.default.changePassword);
app.post('/user/session', Users_1.default.login);
app.delete('/user/logout', jwt_1.checkToken, Users_1.default.logout);
app.delete('/user/logout/all', jwt_1.checkToken, Users_1.default.logoutOfAllSessions);
exports.default = app;
