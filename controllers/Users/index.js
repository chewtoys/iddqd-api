const jwt = require('jsonwebtoken');
const config = require('../../config');
const {
  validateUserData,
  validateEmail,
  validatePassword,
  validateComparePassword,
  verifyPassword,
  validateLogin,
  hashPassword
} = require('../../helpers');
const { User } = require('../../config/db');
const moment = require('moment');
const Validator = require('validator');

const Users = {
  createUser: (req, res) => {
    const data = {
      login,
      email,
      password
    } = req.body;
    const current_time = +moment();

    validateUserData(data)
      .then(() => hashPassword(password))
      .then((hash) => User.create({
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
      .then(() => User.findById(14))
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
    const data = {
      email,
      password
    } = req.body;

    validateLogin(data)
      .then(() => updateLastLogin(email))
      .then(() => auth(email, password))
      .then((d) => console.log(d))

    const updateLastLogin = (email) => new Promise((resolve, reject) => {
      User.findOne({ where: { email } })
        .then((user) => {

          user.last_login_attempt = +moment();
          return user.save();
        })
        .then(() => resolve())
        .catch((err) => reject(err))
    });

    // const auth = (email, password) => new Promise((resolve, reject) => {
      // User.findOne({ where: { email: data.email } })
      //   .then((user) => verifyPassword(data.password, user))
    // });

    // const signToken = (payload, expiresIn = '1h') => jwt.sign(payload, 'secret', {
    //   expiresIn,
    // });
    //
    const auth = async (email, password) => {
      const user = await User.findOne({ where: { email } });
      const verify = await verifyPassword(password, user);

      return {
        isAuthorized: verify.isValid,
        token_lifetime: user.token_lifetime,
        id: verify.id
      }
    };

    // const LoginHandler = (data) => new Promise((resolve, reject) => {
    //   if (!data.email || !data.password) reject('Email and/or password is missing');
    //   else {
    //     Promise.all([
    //       updateLastLogin(data.email),
    //       auth(data.email, data.password)
    //     ])
        // updateLastLogin(data.email)
          // .then((s) => console.log(s))
          // .then(() => auth(data.email, data.password))
          // .then((d) => console.log(d))
          // .catch((err) => console.log(err))
        // updateLastLogin()
        // resolve((async () => {
        //   try {
        //     let user = await User.findOne({ where: { email: data.email } });
        //
        //     user.last_login_attempt = moment().unix(); // update last login
        //     user.save()
        //       .then(() => console.log('Saving'))
        //       .catch((err) => console.log(err));
        //
        //     user = user.get({ plain: true });
        //
        //     const verify = await verifyPassword(data.password, user);
        //
        //     return {
        //       isAuthorized: verify.isValid,
        //       token_lifetime: user.token_lifetime,
        //       id: verify.id
        //     };
        //   } catch (e) {
        //     console.error(e);
        //   }
        //
        // })())
    //   }
    // });

    // LoginHandler(data)
    //   .then((data) => {
    //     if (data.isAuthorized) {
    //       let token = jwt.sign({login: data.login},
    //         config.secret, {
    //           expiresIn: process.env.JWT_EXPIRATION || '24h'
    //         }
    //       );
    //
    //       const expiresAt = moment(new Date()).add(data.token_lifetime, 's').unix();
    //
    //       res.json({
    //         msg: 'Authentication successful!',
    //         token: {
    //           token,
    //           expiresAt
    //         }
    //       });
    //     } else {
    //       res.status(403).json({
    //         msg: 'Incorrect login or password'
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     res.json({
    //       msg: err
    //     })
    //   });
  }
};

module.exports = Users;
