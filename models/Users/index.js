const db = require('../../config/db');
const {
  validateUserData,
  validateEmail,
  verifyPassword,
  hashPassword
} = require('../../helpers');

const User = {
  create: (data) => new Promise((resolve, reject) => {
    validateUserData(data)
      .then(() => hashPassword(data.password))
      .then((hash) => db.query('INSERT INTO users (name, email, password, created_at, updated_at) VALUES ($1, $2, $3, current_timestamp, current_timestamp) returning *', [data.name, data.email, hash]))
      .then((res) => resolve(res.rows[0]))
      .catch((err) => reject(err))
  }),

  findOneByEmail: (email) => new Promise((resolve, reject) => {
    if (!email) reject('Email is missing');
    else validateEmail(email)
      .then(() => db.query('SELECT * FROM users WHERE email = $1', [email]))
      .then((res) => {
        if (res.rows[0]) resolve(res.rows[0]);
        else reject('User not found');
      })
      .catch((err) => reject(err));
  }),

  login: (data) => new Promise((resolve, reject) => {
    if (!data.email || !data.password) reject('Email and/or password is missing');
    else User.findOneByEmail(data.email)
      .then(() => db.query(
        'UPDATE users SET last_login_attempt = current_timestamp WHERE email = $1 returning *',
        [data.email]
      ))
      .then((user) => verifyPassword(data.password, user.rows[0]))
      .then((res) => resolve({ isAuthorized: res.isValid, id: res.id }))
      .catch((err) => reject(err))
  }),

  addLoginSession: () => new Promise((resolve, reject) => {}),

  getLoginSession: (limit = 5) => new Promise((resolve, reject) => {
    // db.query('SELECT * FROM session_history')
  })
};

module.exports = User;
