import Validator from "validator";

export const validatePassword = (
  password: string,
  min: number = 6,
  max: number = 64
): Promise<void> =>
  new Promise((resolve, reject) => {
    if (typeof password !== "string") reject("Password must be a string");
    else if (!Validator.isLength(password, { min, max }))
      reject(`Password must be at least ${min} characters long and not more ${max}`);
    else resolve();
  });

export const validateComparePassword = (password: string, confirmPassword: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!confirmPassword) reject("Confirm the password");
    else if (!Validator.equals(password, confirmPassword)) reject("Passwords do not match");
    else resolve();
  });

export const validateEmail = (email: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (typeof email !== "string") reject("Email must be a string");
    else {
      if (Validator.isEmail(email)) resolve();
      else reject("Provided email doesn't match proper email format");
    }
  });

type UserData = {
  email: string;
  password: string;
  login?: string;
};

export const validateUserData = (data: UserData): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!data.password || !data.email) reject("Email and/or password is missing");
    else
      validatePassword(data.password, 6)
        .then(() => validateEmail(data.email))
        .then(() => resolve()) // todo добавить валидацию логина
        .catch((err) => reject(err));
  });

export const validateLogin = (data: UserData): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!data.password || !data.email) reject("Email and/or password is missing");
    else
      validatePassword(data.password, 6)
        .then(() => validateEmail(data.email))
        .then(() => resolve())
        .catch((err) => reject(err));
  });
