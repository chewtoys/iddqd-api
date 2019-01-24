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
import Config from '../../config';

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

    validateLogin({ email, password })
      .then(() => updateLastLogin(email))
      .then(() => authentication(email, password))
      .then((authResult) => authorization(authResult))
      .then((result) => authorizationComplete(result))
      .catch((err) => res.json({ err }));

    const authorizationComplete = (result) => {
      res.json({
        msg: 'Authentication successful!',
        token: {
          token: result.token,
          expiresAt: result.expiresAt
        }
      });
    };

    const authentication = async (email, password) => {
      const user = await DB.User.findOne({ where: { email } });
      const verify = await verifyPassword(password, user);

      return {
        login: user.login,
        token_lifetime: user.token_lifetime,
        permissions: user.permissions,
        isAuthorized: verify.isValid,
        id: verify.id
      }
    };

    const authorization = (authData) => new Promise((resolve, reject) => {
      const {
        login,
        isAuthorized,
        token_lifetime,
        permissions
      } = authData;

      if (isAuthorized) {
        const current_time = new Date();
        const expiresAt = current_time.setSeconds(current_time.getSeconds() + token_lifetime);
        const token_payload = {
          login,
          permissions
        };
        const token = signToken(token_payload, token_lifetime);

        resolve({
          token,
          expiresAt
        });
      } else {
        reject('Incorrect login or password')
      }
    });

    const updateLastLogin = (email) => new Promise((resolve, reject) => {
      DB.User.findOne({ where: { email } })
        .then((user) => {
          if (!user) reject('User not found');

          user.last_login_attempt = +new Date();
          return user.save();
        })
        .then(() => resolve())
        .catch((err) => reject(err))
    });

    const signToken = (payload, expiresIn = '4h') => jwt.sign(payload, Config.jwt_secret, {
      expiresIn,
    });
  }
};
