import jwt from 'jsonwebtoken';
import {
  redisDelAsync,
  redisGetAsync,
  redisKeysAsync
} from "../../config/redis";

const TokenError = {
  TOKEN_EXPIRED_ERROR: 'TokenExpiredError',
  JSON_WEB_TOKEN_ERROR: 'JsonWebTokenError',
  NOT_BEFORE_ERROR: 'NotBeforeError'
};

const checkToken = (req, res, next) => {
  let token = req.headers['authorization'];

  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    let tokenNotFound = true;
    const decode = jwt.decode(token);

    redisKeysAsync(`${decode.userId}:*`)
      .then(async (userKeys) => {
        if (userKeys.length === 0) {
          res.json({
            success: false,
            msg: 'Token is not valid'
          });
        }

        for (const userKey of userKeys) {
            const secret = await redisGetAsync(userKey);

            jwt.verify(token, secret, async (err, verifyDecoded) => {
              if (err && err.name === TokenError.TOKEN_EXPIRED_ERROR) await redisDelAsync(userKey);

              if (verifyDecoded) {
                req.decoded = verifyDecoded;

                tokenNotFound = false;
                next();
              }
            });
        }

        if (tokenNotFound) {
          return res.json({
            success: false,
            msg: 'Token is not valid'
          });
        }
      })
      .catch((e) => {
        console.log(e)
      })
  } else {
    return res.status(403).json({
      success: false,
      msg: 'Auth token is not supplied'
    });
  }
};

export {
  checkToken
}
