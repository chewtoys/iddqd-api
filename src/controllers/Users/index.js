import jwt from 'jsonwebtoken';
import {
  validateUserData,
  validatePassword,
  validateComparePassword,
  verifyPassword,
  validateLogin,
  hashPassword
} from '../../helpers';
import DB from '../../config/db';
import redis, { redisGetAsync, redisSetAsync } from '../../config/redis';
import uuid from 'uuid/v4';

class AuthError extends Error {
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

  login: (req, res) => {
    const {
      email,
      password
    } = req.body;

    const test = async () => {
      try {
        const user = await DB.User.findOne({
          where: {
            email
          }
        });
        const current_time = new Date();

        if (!user) throw new AuthError('User not found', 404);

        const verify = await verifyPassword(password, user);

        const secretKey = uuid();
        const secretVal = uuid();

        await redisSetAsync(`${user.id}:${secretKey}`, secretVal);

        user.last_login_attempt = +current_time;
        await user.save();

        if (verify.isValid) {
          const expiresAt = current_time.setSeconds(current_time.getSeconds() + user.token_lifetime);
          const token = jwt.sign({
            login: user.login,
            permissions: user.permissions
          }, secretVal, {
            expiresIn: user.token_lifetime,
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

    };

    test()

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
