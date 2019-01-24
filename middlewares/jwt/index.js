import jwt from 'jsonwebtoken';
import config from '../../config';

const checkToken = (req, res, next) => {
  let token = req.headers['authorization'];

  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          msg: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
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
