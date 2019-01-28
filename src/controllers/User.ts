import { verifyPassword, hashPassword } from "../helpers";
import { validateUserData, validatePassword } from "../helpers/validators";
import DB from "../config/db";
import { redisDelAsync, redisKeysAsync } from "../config/redis";
import statusCodes from "../config/statusCodes";
import { HttpError } from "../errorHandler";
import { TTokenPayload, generateJWT } from "../helpers/jwt";

type TUser = {
  decoded: TTokenPayload;
  body: {
    login?: string;
    password?: string;
    email?: string;
    currentUserPassword?: string;
    newUserPassword?: string;
  };
};

export default {
  checkEmailExist: (req, res) => {
    const { email } = req.body;

    DB.User.findAll({ where: { email } })
      .then((user) =>
        user.length === 0 ? res.status(statusCodes.NOT_FOUND).send() : res.status(statusCodes.OK).send()
      )
      .catch(() => res.status(statusCodes.INTERNAL_SERVER_ERROR).send());
  },

  createUser: (req: TUser, res) => {
    const { login, email, password } = req.body;
    const currentTime = +new Date();

    validateUserData({ login, email, password })
      .then(() => hashPassword(password))
      .then((hash) =>
        DB.User.create({
          login,
          email,
          password: hash,
          created_at: currentTime,
          updated_at: currentTime
        })
      )
      .then(() =>
        res.status(statusCodes.CREATED).json({
          msg: "User has been created"
        })
      )
      .catch((err) =>
        res.status(statusCodes.BAD_REQUEST).json({
          msg: err
        })
      );
  },

  resetPassword: (req, res) => {},

  changePassword: async (req: TUser, res) => {
    try {
      const { newUserPassword, currentUserPassword } = req.body;

      await validatePassword(currentUserPassword);

      const { sessionKey, userId } = req.decoded;
      const user = await DB.User.findByPk(userId);

      const verify = await verifyPassword(currentUserPassword, user.password);

      if (!verify) throw new HttpError("Wrong password", statusCodes.FORBIDDEN);

      const oldPasswordMatch = await verifyPassword(newUserPassword, user.password);

      if (oldPasswordMatch) {
        throw new HttpError("The new password should not be equal to the old one.", statusCodes.UNPROCESSABLE_ENTITY);
      }

      user.password = await hashPassword(newUserPassword);
      user.save();

      await redisDelAsync(sessionKey);

      const { token, expiresAt } = await generateJWT(
        {
          userPermissions: user.permissions,
          userLogin: user.login,
          userId: user.id
        },
        user.token_lifetime
      );

      return res.status(statusCodes.OK).json({
        msg: "Password has been changed",
        authorizationToken: {
          token,
          expiresAt
        }
      });
    } catch ({ msg, status }) {
      return res.status(status).json({
        msg
      });
    }
  },

  logout: (req, res) => {
    redisDelAsync(req.decoded.sessionKey)
      .then(() =>
        res.json({
          msg: "Ok"
        })
      )
      .catch(() =>
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
          msg: "Error"
        })
      );
  },

  logoutOfAllSessions: (req, res) => {
    redisKeysAsync(`${req.decoded.userId}:*`)
      .then((resp) => Promise.all(resp.map((it) => redisDelAsync(it))))
      .then(() =>
        res.json({
          msg: "Ok"
        })
      )
      .catch(() =>
        res.json({
          msg: "Error"
        })
      );
  },

  refreshToken: async (req, res) => {
    const { sessionKey, userId } = req.decoded;
    const user = await DB.User.findByPk(userId);

    await redisDelAsync(sessionKey);

    const { token, expiresAt } = await generateJWT(
      {
        userPermissions: user.permissions,
        userLogin: user.login,
        userId: user.id
      },
      user.token_lifetime
    );

    return res.status(statusCodes.OK).json({
      msg: "Token has been refreshed",
      authorizationToken: {
        token,
        expiresAt
      }
    });
  },

  login: (req: TUser, res) => {
    const { email, password } = req.body;

    (async () => {
      try {
        const user: any = await DB.User.findOne({
          where: {
            email
          }
        });

        if (!user) throw new HttpError("User not found", statusCodes.NOT_FOUND);

        const currentTime: Date = new Date();

        const isVerifyPassword: boolean = await verifyPassword(password, user.password);

        user.last_login_attempt = +currentTime;
        await user.save();

        if (isVerifyPassword) {
          const { token, expiresAt } = await generateJWT(
            {
              userPermissions: user.permissions,
              userLogin: user.login,
              userId: user.id
            },
            user.token_lifetime
          );

          res.json({
            msg: "Authentication successful!",
            authorizationToken: {
              token,
              expiresAt
            }
          });
        } else {
          throw new HttpError("Incorrect login or password", statusCodes.FORBIDDEN);
        }
      } catch (err) {
        res.status(err.status).json({
          msg: err.msg
        });
      }
    })();
  }
};
