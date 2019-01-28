import statusCodes from "./config/statusCodes";

export const TokenError = {
  TOKEN_EXPIRED_ERROR: "TokenExpiredError",
  JSON_WEB_TOKEN_ERROR: "JsonWebTokenError",
  NOT_BEFORE_ERROR: "NotBeforeError"
};

export class HttpError extends Error {
  msg: string;
  status: number;

  constructor(
    msg: string = "Auth Error",
    status: number = statusCodes.INTERNAL_SERVER_ERROR
  ) {
    super();

    this.msg = msg;
    this.status = status;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
