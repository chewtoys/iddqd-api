import jwt from "jsonwebtoken";
import {
  verifyPassword,
  hashPassword
} from "../../helpers";
import {
  validateUserData,
  validatePassword,
  validateComparePassword
} from "../../helpers/validators";
import DB from "../../config/db";
import {
  redisDelAsync,
  redisKeysAsync,
  redisSetAsync
} from "../../config/redis";
import uuid from "uuid/v4";
import statusCodes from '../../config/statusCodes';
import { HttpError } from '../../errorHandler';


type TUser = {
  body: {
    login?: string
    password?: string
    email?: string
    confirmPassword?: string
  }
}

export default {
  createUser: (req: TUser, res) => {
    const {
      login,
      email,
      password
    } = req.body;
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
      .then((data) => {
        data = data.get({ plain: true });
        res.status(201).json({
          msg: "User has been created",
          data: {
            ...data,
            created_at: +data.created_at,
            updated_at: +data.updated_at
          }
        });
      })
      .catch((err) =>
        res.status(statusCodes.BAD_REQUEST).json({
          msg: err
        })
      );
  },

  changePassword: async (req: TUser, res) => {
    const {
      password,
      confirmPassword
    } = req.body;
    // todo добавить смену токена
    validatePassword(password)
      .then(() => validateComparePassword(password, confirmPassword))
      .then(() => DB.User.findById(14))
      .then(async (user) => {
        user.password = await hashPassword(password);
        user.save();
      })
      .then(() =>
        res.status(statusCodes.OK).json({
          msg: "Password has been changed"
        })
      )
      .catch((err) =>
        res.json({
          msg: err
        })
      );
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

  login: (req: TUser, res) => {
    const {
      email,
      password
    } = req.body;

    const generateSessionKey = (userId: number): string => `${userId}:${uuid()}`;

    (async () => {
      try {
        const user: any = await DB.User.findOne({
          where: {
            email
          }
        });

        if (!user) throw new HttpError("User not found", statusCodes.NOT_FOUND);

        const currentTime: Date = new Date();

        const isVerifyPassword: boolean = await verifyPassword(password, user);

        user.last_login_attempt = +currentTime;
        await user.save();

        if (isVerifyPassword) {
          const {
            permissions: userPermissions,
            login: userLogin,
            id: userId,
            token_lifetime: userTokenLifetime
          } = user;

          const secretVal: string = uuid();
          const sessionKey: string = generateSessionKey(userId);

          await redisSetAsync(sessionKey, secretVal, "EX", Number(userTokenLifetime));

          const expiresAt: number =
            Math.round(new Date().getTime() / 1000) + Number(userTokenLifetime); // unix

          const token: string = jwt.sign(
            {
              sessionKey,
              userId,
              userLogin,
              userPermissions
            },
            secretVal,
            {
              expiresIn: Number(userTokenLifetime)
            }
          );

          authorizationComplete({ token, expiresAt });
        } else {
          throw new HttpError("Incorrect login or password", statusCodes.FORBIDDEN);
        }
      } catch (err) {
        res.status(err.status).json({
          msg: err.msg
        });
      }
    })();

    const authorizationComplete = (result) => {
      res.json({
        msg: "Authentication successful!",
        authorizationToken: {
          token: result.token,
          expiresAt: result.expiresAt
        }
      });
    };
  }
};
