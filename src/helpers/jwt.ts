import { redisSetAsync } from "../config/redis";
import Config from "../config";
import jwt from "jsonwebtoken";
import uuid from "uuid/v4";

export type TTokenPayload = {
  sessionKey?: string;
  userPermissions: string;
  userLogin: string;
  userId: number;
};

export type TToken = {
  token: string;
  expiresAt: number;
};

export const generateSessionKey = (userId: number): string =>
  `${userId}:${uuid()}`;

export const generateJWT = (
  payload: TTokenPayload,
  lifeTime: number = Number(Config.jwt_lifetime)
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
