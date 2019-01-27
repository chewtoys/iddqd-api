import jwt from 'jsonwebtoken';
import {
  verifyPassword,
  hashPassword
} from '../../helpers';
import {
  validateUserData,
  validatePassword,
  validateComparePassword,
} from '../../helpers/validators';
import DB from '../../config/db';
import redis, { redisDelAsync, redisGetAsync, redisKeysAsync, redisSetAsync } from '../../config/redis';
import uuid from 'uuid/v4';

class AuthError extends Error {
    msg: string;
    status: number;
    constructor (msg = 'Auth Error', status = 500) {
        super();
        this.msg = msg;
        this.status = status;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export default {
  createUser: (req, res) => {
    const {
      login,
      email,
      password
    } = req.body;
    const current_time = +new Date();

    validateUserData({ login, email, password })
      .then(() => hashPassword(password))
      .then((hash) => DB.User.create({
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
          data: {
            ...data,
            created_at: +data.created_at,
            updated_at: +data.updated_at
          }
        })
      })
      .catch((err) => res.status(400).json({
        msg: err
      }));
  },

  changePassword: async (req, res) => {
    const { password, confirmPassword } = req.body;
    // todo добавить смену токена
    validatePassword(password)
      .then(() => validateComparePassword(password, confirmPassword))
      .then(() => DB.User.findById(14))
      .then(async (user) => {
        user.password = await hashPassword(password);
        user.save();
      })
      .then(() => res.status(200).json({
        msg: 'Password has been changed'
      }))
      .catch((err) => res.json({
        msg: err
      }))
  },

  logout: (req, res) => {
    redisDelAsync(req.decoded.sessionKey)
      .then(() => res.json({
        msg: 'Ok'
      }))
      .catch(() => res.json({
        msg: 'Error'
      }))
  },

  logoutOfAllSessions: (req, res) => {
    redisKeysAsync(`${req.decoded.user_id}:*`)
      .then((resp) => Promise.all((resp.map(it => redisDelAsync(it)))))
      .then(() => res.json({
        msg: 'Ok'
      }))
      .catch(() => res.json({
        msg: 'Error'
      }))
  },

  login: (req, res) => {
    const {
      email,
      password
    } = req.body;

    const generateSessionKey = (user_id: number): string => `${user_id}:${uuid()}`;

    (async () => {
      try {
        const user = await DB.User.findOne({
          where: {
            email
          }
        });

        if (!user) throw new AuthError('User not found', 404);

        const current_time: Date = new Date();

        const isVerifyPassword: boolean = await verifyPassword(password, user);

        user.last_login_attempt = +current_time;
        await user.save();

        if (isVerifyPassword) {
          const {
            permissions: userPermissions,
            login: userLogin,
            id: userId,
            token_lifetime: userTokenLifetime
          } = user;

          const secretVal: string = uuid();
          const sessionKey = generateSessionKey(userId);

          await redisSetAsync(sessionKey, secretVal, 'EX', Number(userTokenLifetime));

          const expiresAt: number = Math.round(new Date().getTime() / 1000) + Number(userTokenLifetime); // unix

          const token: string = jwt.sign({
            sessionKey,
            userId,
            userLogin,
            userPermissions
          }, secretVal, {
            expiresIn: Number(userTokenLifetime),
          });

          authorizationComplete({ token, expiresAt })
        } else {
          throw new AuthError('Incorrect login or password', 403);
        }
      } catch (err) {
        res.status(err.status).json({
          msg: err.msg
        })
      }

    })();

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