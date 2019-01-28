import jwt from "jsonwebtoken";
import { redisGetAsync } from "../../config/redis";
import { HttpError } from "../../errorHandler";
import statusCodes from "../../config/statusCodes";

const checkToken = async (req, res, next) => {
  let token = req.headers["authorization"];

  if (token) {
    try {
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
      }

      const decode = jwt.decode(token);

      const secret = await redisGetAsync(decode.sessionKey);

      jwt.verify(token, secret, (err, verifyDecoded) => {
        if (err) throw new HttpError("Token is not valid", 403);

        if (verifyDecoded) {
          req.decoded = verifyDecoded;
          next();
        }
      });
    } catch ({ msg, status }) {
      return res.status(status).json({
        msg: msg
      });
    }
  } else {
    return res.status(statusCodes.FORBIDDEN).json({
      msg: "Auth token is not supplied"
    });
  }
};

export { checkToken };
