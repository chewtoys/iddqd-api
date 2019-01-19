const bcrypt = require('bcrypt');

const hashPassword = (password) => new Promise((resolve, reject) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) reject(err);
    else bcrypt.hash(password, salt, (err, hash) => {
      if (err) reject(err);
      else resolve(hash);
    })
  })
});

const validatePassword = (password, minLength = 6) => new Promise((resolve, reject) => {
  if (typeof password !== 'string') reject('Password must be a string');
  else if (password.length < minLength) reject(`Password must be at least ${minLength} characters long`);
  else resolve();
});

const validateEmail = (email) => new Promise((resolve, reject) => {
  if (typeof email !== 'string') reject('Email must be a string');
  else {
    const re = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
    if (re.test(email)) resolve();
    else reject('Provided email doesn\'t match proper email format');
  }
});

const validateUserData = (data) => new Promise((resolve, reject) => {
  if (!data.password || !data.email) reject('Email and/or password is missing');
  else validatePassword(data.password, 6)
    .then(() => validateEmail(data.email))
    .then(() => resolve())
    .catch((err) => reject(err))
});

const verifyPassword = (password, user) => new Promise((resolve, reject) => {
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) reject(err);
    else resolve({ isValid: result, id: user.id });
  });
});

const getFileNameExt = (str) => {
  const file = str.split('/').pop();
  return file.substr(file.lastIndexOf('.')+1,file.length)
};

module.exports = {
  validateUserData,
  validateEmail,
  getFileNameExt,
  validatePassword,
  verifyPassword,
  hashPassword
};
