const UserModel = require('../../models/Users');
const jwt = require('jsonwebtoken');
const config = require('../../config');

const User = {
  createUser: (req, res) => {
    UserModel.create(req.body)
      .then(({ id, name, email }) => res.status(201).json({
        msg: 'User has been created',
        data: { id, name, email }
      }))
      .catch((err) => res.status(400).json({
        msg: err
      }));
  },

  login: (req, res) => {
    UserModel.login(req.body)
      .then((data) => {
        if (data.isAuthorized) {
          let token = jwt.sign({name: data.name},
            config.secret, {
              expiresIn: process.env.JWT_EXPIRATION || '24h'
            }
          );
          res.json({
            success: true,
            msg: 'Authentication successful!',
            token
          });
        } else {
          res.status(403).json({
            success: false,
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

module.exports = User;
