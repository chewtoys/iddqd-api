import express, { Express } from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { checkToken } from './middlewares/jwt';
import User from './controllers/Users';

const app: Express = express();

app.use(fileUpload());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/ping', (req, res) => res.status(200).json({
  msg: 'pong'
}));

import jwt from 'jsonwebtoken';
import redis, {
  redisGetAsync,
  redisKeysAsync,
  redisDelAsync
} from './config/redis';

app.post('/user/create', User.createUser);
app.patch('/user/password', checkToken, User.changePassword);
app.post('/user/session', User.login);
app.delete('/user/logout', checkToken, User.logout);
app.delete('/user/logout/all', checkToken, User.logoutOfAllSessions);

export default app;
