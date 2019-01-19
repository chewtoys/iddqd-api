const config = require('../../config');
const db = require('../../config/db');
const {
  validateUserData,
  hashPassword
} = require('../../helpers');

const User = {
  create: (data) => new Promise((resolve, reject) => {
    validateUserData(data)
      .then(() => hashPassword(data.password))
      .then((hash) => db.query('INSERT INTO users (name, email, password, created_at, updated_at) VALUES ($1, $2, $3, current_timestamp, current_timestamp) returning *',[data.name, data.email, hash]))
      .then((res) => resolve(res.rows[0]))
      .catch((err) => reject(err))
  })
};

module.exports = User;
