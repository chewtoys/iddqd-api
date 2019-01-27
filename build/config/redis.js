"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const util_1 = require("util");
const client = redis_1.default.createClient();
client.on("error", (err) => {
    console.log("Error " + err);
});
const getAsync = util_1.promisify(client.get).bind(client);
exports.redisGetAsync = getAsync;
const delAsync = util_1.promisify(client.del).bind(client);
exports.redisDelAsync = delAsync;
const setAsync = util_1.promisify(client.set).bind(client);
exports.redisSetAsync = setAsync;
const keysAsync = util_1.promisify(client.keys).bind(client);
exports.redisKeysAsync = keysAsync;
exports.default = client;
