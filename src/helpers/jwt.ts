import { redisSetAsync } from "../config/redis";
import jwt from "jsonwebtoken";
import uuid from "uuid/v4";

type TTokenPayload = {
  [key: string]: any;
};

type TToken = {
  token: string;
  expiresAt: number;
};

export const generateSessionKey = (userId: number): string =>
  `${userId}:${uuid()}`;

export const generateJWT = (
  payload: TTokenPayload,
  lifeTime: number
): Promise<TToken> =>
  new Promise((resolve, reject) => {
    const tokenLifeTime: number = Number(lifeTime);
    const secretVal: string = uuid();
    const sessionKey: string = generateSessionKey(payload.userId);

    redisSetAsync(sessionKey, secretVal, "EX", tokenLifeTime)
      .then(() => {
        const expiresAt: number =
          Math.round(new Date().getTime() / 1000) + tokenLifeTime; // unix

        const token: string = jwt.sign(
          {
            sessionKey,
            ...payload
          },
          secretVal,
          {
            expiresIn: tokenLifeTime
          }
        );

        resolve({
          token,
          expiresAt
        });
      })
      .catch(() => reject("Redis error"));
  });
