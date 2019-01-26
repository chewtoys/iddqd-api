"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helpers_1 = require("../../helpers");
const validators_1 = require("../../helpers/validators");
const db_1 = __importDefault(require("../../config/db"));
const redis_1 = require("../../config/redis");
const v4_1 = __importDefault(require("uuid/v4"));
class AuthError extends Error {
    constructor(msg = 'Auth Error', status = 500) {
        super();
        this.msg = msg;
        this.status = status;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
;
exports.default = {
    createUser: (req, res) => {
        const { login, email, password } = req.body;
        const current_time = +new Date();
        validators_1.validateUserData({ login, email, password })
            .then(() => helpers_1.hashPassword(password))
            .then((hash) => db_1.default.User.create({
            login,
            email,
            password: hash,
            created_at: current_time,
            updated_at: current_time
        }))
            .then((data) => {
            data = data.get({ plain: true });
            res.status(201).json({
                msg: 'User has been created',
                data: Object.assign({}, data, { created_at: +data.created_at, updated_at: +data.updated_at })
            });
        })
            .catch((err) => res.status(400).json({
            msg: err
        }));
    },
    changePassword: (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { password, confirmPassword } = req.body;
        // todo добавить смену токена
        validators_1.validatePassword(password)
            .then(() => validators_1.validateComparePassword(password, confirmPassword))
            .then(() => db_1.default.User.findById(14))
            .then((user) => __awaiter(this, void 0, void 0, function* () {
            user.password = yield helpers_1.hashPassword(password);
            user.save();
        }))
            .then(() => res.status(200).json({
            msg: 'Password has been changed'
        }))
            .catch((err) => res.json({
            msg: err
        }));
    }),
    logout: (req, res) => {
        redis_1.redisDelAsync(req.decoded.secret_key)
            .then(() => res.json({
            msg: 'Ok'
        }))
            .catch(() => res.json({
            msg: 'Error'
        }));
    },
    logoutOfAllSessions: (req, res) => {
        redis_1.redisKeysAsync(`${req.decoded.user_id}:*`)
            .then((resp) => Promise.all((resp.map(it => redis_1.redisDelAsync(it)))))
            .then(() => res.json({
            msg: 'Ok'
        }))
            .catch(() => res.json({
            msg: 'Error'
        }));
    },
    login: (req, res) => {
        const { email, password } = req.body;
        const test = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_1.default.User.findOne({
                    where: {
                        email
                    }
                });
                const current_time = new Date();
                if (!user)
                    throw new AuthError('User not found', 404);
                const verify = yield helpers_1.verifyPassword(password, user); // todo добавить типы
                const secretKey = v4_1.default();
                const secretVal = v4_1.default();
                const userSecretKey = `${user.id}:${secretKey}`;
                yield redis_1.redisSetAsync(userSecretKey, secretVal);
                user.last_login_attempt = +current_time;
                yield user.save();
                if (verify.isValid) {
                    const expiresAt = Math.round(new Date().getTime() / 1000) + Number(user.token_lifetime); // unix
                    const token = jsonwebtoken_1.default.sign({
                        secret_key: userSecretKey,
                        user_id: user.id,
                        login: user.login,
                        permissions: user.permissions
                    }, secretVal, {
                        expiresIn: Number(user.token_lifetime),
                    });
                    authorizationComplete({ token, expiresAt });
                }
                else {
                    throw new AuthError('Incorrect login or password', 403);
                }
            }
            catch (err) {
                res.status(err.status).json({
                    msg: err.msg
                });
            }
        });
        test();
        const authorizationComplete = (result) => {
            res.json({
                msg: 'Authentication successful!',
                token: {
                    token: result.token,
                    expiresAt: result.expiresAt
                }
            });
        };
    }
};
