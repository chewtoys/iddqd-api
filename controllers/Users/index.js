const jwt = require('jsonwebtoken');
const config = require('../../config');
const {
  validateUserData,
  validateEmail,
  verifyPassword,
  hashPassword
} = require('../../helpers');
const { User } = require('../../config/db');
const moment = require('moment');

const Users = {
  createUser: (req, res) => {
    const data = { name, email, password } = req.body;

    validateUserData(data)
      .then(() => hashPassword(password))
      .then((hash) => User.create({
        name,
        email,
        password: hash,
        created_at: +new Date,
        updated_at: +new Date
      }))
      .then((data) => {
        data = data.get({ plain: true });
        console.log(data)
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

  login: (req, res) => {
    const data = { email, password } = req.body;

    const LoginHandler = (data) => new Promise((resolve, reject) => {
      if (!data.email || !data.password) reject('Email and/or password is missing');
      else {
        resolve((async () => {
          let user = await User.findOne({ where: { email: data.email } });

          user.last_login_attempt = +new Date(); // update last login
          user.save().then(() => console.log('Saving'));

          user = user.get({ plain: true });

          const verify = await verifyPassword(data.password, user);

          return {
            isAuthorized: verify.isValid,
            token_lifetime: user.token_lifetime,
            id: verify.id
          };
        })())
      }
    });

    LoginHandler(data)
      .then((data) => {
        if (data.isAuthorized) {
          let token = jwt.sign({name: data.name},
            config.secret, {
              expiresIn: process.env.JWT_EXPIRATION || '24h'
            }
          );

          const expiresAt = moment(new Date()).add(data.token_lifetime, 's').format('DD/MM/YYYY HH/mm');

          res.json({
            msg: 'Authentication successful!',
            token: {
              token,
              expiresAt
            }
          });
        } else {
          res.status(403).json({
            msg: 'Incorrect name or password'
          });
        }
      })
      .catch((err) => {
        res.json({
          msg: err
        })
      });
  }
};

module.exports = Users;
