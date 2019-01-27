import bcrypt from "bcrypt";

export const hashPassword = (password: string): Promise<string> =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (saltErr, salt) => {
      if (saltErr) reject(saltErr);
      else
        bcrypt.hash(password, salt, (hashErr, hash) => {
          if (hashErr) reject(hashErr);
          else resolve(hash);
        });
    });
  });

type User = {
  id: number;
  password: string;
};

export const verifyPassword = (password: string, user: User): Promise<boolean> =>
  new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) reject(err);
      else resolve(Boolean(result));
    });
  });

export const uploadFile = (file: any, uploadPath: string): Promise<void> =>
  new Promise((resolve, reject) => {
    file.mv(uploadPath, (err) => {
      if (err) reject(err);
      resolve();
    });
  });

export const getFileNameExt = (str: string): string => {
  const file = str.split("/").pop();
  return file.substr(file.lastIndexOf(".") + 1, file.length);
};
