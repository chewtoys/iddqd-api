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
const redis_1 = require("../../config/redis");
const TokenError = {
    TOKEN_EXPIRED_ERROR: 'TokenExpiredError',
    JSON_WEB_TOKEN_ERROR: 'JsonWebTokenError',
    NOT_BEFORE_ERROR: 'NotBeforeError'
};
const checkToken = (req, res, next) => {
    let token = req.headers['authorization'];
    if (token) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        let tokenNotFound = true;
        const decode = jsonwebtoken_1.default.decode(token);
        redis_1.redisKeysAsync(`${decode.userId}:*`)
            .then((userKeys) => __awaiter(this, void 0, void 0, function* () {
            if (userKeys.length === 0) {
                res.json({
                    success: false,
                    msg: 'Token is not valid'
                });
            }
            for (const userKey of userKeys) {
                const secret = yield redis_1.redisGetAsync(userKey);
                jsonwebtoken_1.default.verify(token, secret, (err, verifyDecoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err && err.name === TokenError.TOKEN_EXPIRED_ERROR)
                        yield redis_1.redisDelAsync(userKey);
                    if (verifyDecoded) {
                        req.decoded = verifyDecoded;
                        tokenNotFound = false;
                        next();
                    }
                }));
            }
            if (tokenNotFound) {
                return res.json({
                    success: false,
                    msg: 'Token is not valid'
                });
            }
        }))
            .catch((e) => {
            console.log(e);
        });
    }
    else {
        return res.status(403).json({
            success: false,
            msg: 'Auth token is not supplied'
        });
    }
};
exports.checkToken = checkToken;
