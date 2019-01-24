import bcrypt from 'bcrypt';
import Validator from 'validator';

export const hashPassword = (password) => new Promise((resolve, reject) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) reject(err);
    else bcrypt.hash(password, salt, (err, hash) => {
      if (err) reject(err);
      else resolve(hash);
    })
  })
});

export const validatePassword = (password, min = 6, max = 64) => new Promise((resolve, reject) => {
  if (typeof password !== 'string') reject('Password must be a string');
  else if (!Validator.isLength(password, { min, max })) reject(`Password must be at least ${min} characters long and not more ${max}`);
  else resolve();
});

export const validateComparePassword = (password, confirmPassword) => new Promise((resolve, reject) => {
  if (!confirmPassword) reject('Confirm the password');
  else if (!Validator.equals(password, confirmPassword)) reject('Passwords do not match');
  else resolve();
});

export const validateEmail = (email) => new Promise((resolve, reject) => {
  if (typeof email !== 'string') reject('Email must be a string');
  else {
    if (Validator.isEmail(email)) resolve();
    else reject('Provided email doesn\'t match proper email format');
  }
});

export const validateUserData = (data) => new Promise((resolve, reject) => {
  if (!data.password || !data.email) reject('Email and/or password is missing');
  else validatePassword(data.password, 6)
    .then(() => validateEmail(data.email))
    .then(() => resolve()) // todo добавить валидацию логина
    .catch((err) => reject(err))
});

export const verifyPassword = (password, user) => new Promise((resolve, reject) => {
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) reject(err);
    else resolve({ isValid: result, id: user.id });
  });
});

export const validateLogin = (data) => new Promise((resolve, reject) => {
  if (!data.password || !data.email) reject('Email and/or password is missing');
  else validatePassword(data.password, 6)
    .then(() => validateEmail(data.email))
    .then(() => resolve())
    .catch((err) => reject(err))
})

export const uploadFile = (file, uploadPath) => new Promise((resolve, reject) => {
  file.mv(uploadPath, (err) => {
    if (err) reject(err);
    resolve()
  })
});

export const getFileNameExt = (str) => {
  const file = str.split('/').pop();
  return file.substr(file.lastIndexOf('.')+1,file.length)
};
