const User = require('../../models/Users');

module.exports = {
  createUser: (req, res) => {
    User.create(req.body)
      .then(({ id, name, email }) => res.status(201).json({
        message: 'User has been created',
        data: { id, name, email }
      }))
      .catch((err) => res.status(400).json({
          message: err
      }));
  },
};
