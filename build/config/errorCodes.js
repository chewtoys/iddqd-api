"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = __importDefault(require("./statusCodes"));
const errorCodes = {
    NO_ARGUMENT: {
        message: 'Required arguments not supplied',
        status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        code: 'NO_ARGUMENT_ERROR'
    },
    ARGUMENT_TYPE: {
        message: 'Wrong argument type',
        status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        code: 'ARGUMENT_TYPE_ERROR'
    },
    BAD_REQUEST: {
        message: 'Bad request',
        status: statusCodes_1.default.BAD_REQUEST,
        code: 'BAD_REQUEST_ERROR'
    },
    ACCESS: {
        message: 'Access denied',
        status: statusCodes_1.default.FORBIDDEN,
        code: 'ACCESS_ERROR'
    },
    NO_ANONYMOUS_ACCESS: {
        message: 'Access denied. No anonymous access',
        status: statusCodes_1.default.FORBIDDEN,
        code: 'NO_ANONYMOUS_ACCESS_ERROR'
    },
    BAD_ROLE: {
        message: 'Bad role',
        status: statusCodes_1.default.FORBIDDEN,
        code: 'BAD_ROLE_ERROR'
    },
    INVALID_PASSWORD: {
        message: 'Invalid password',
        status: statusCodes_1.default.FORBIDDEN,
        code: 'INVALID_PASSWORD_ERROR'
    },
    TOKEN_EXPIRED: {
        message: 'Token expired',
        status: statusCodes_1.default.UNAUTHORIZED,
        code: 'TOKEN_EXPIRED_ERROR'
    },
    TOKEN_NOT_SIGNED: {
        message: 'Token not signed',
        status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        code: 'TOKEN_NOT_SIGNED_ERROR'
    },
    TOKEN_VERIFY: {
        message: 'Token verify error',
        status: statusCodes_1.default.UNAUTHORIZED,
        code: 'TOKEN_VERIFY_ERROR'
    },
    BAD_REFRESH_TOKEN: {
        message: 'Bad Refresh token',
        status: statusCodes_1.default.UNAUTHORIZED,
        code: 'BAD_REFRESH_TOKEN_ERROR'
    },
    WRONG_RESET_PASSWORD_TOKEN: {
        message: 'Wrong reset password token',
        status: statusCodes_1.default.UNAUTHORIZED,
        code: 'WRONG_RESET_PASSWORD_TOKEN_ERROR'
    },
    WRONG_EMAIL_CONFIRM_TOKEN: {
        message: 'Wrong confirm email token',
        status: statusCodes_1.default.UNAUTHORIZED,
        code: 'WRONG_EMAIL_CONFIRM_TOKEN_ERROR'
    },
    PARSE_TOKEN: {
        message: 'Trying get data from access token. Something wrong',
        status: statusCodes_1.default.UNAUTHORIZED,
        code: 'PARSE_TOKEN_ERROR'
    },
    EMAIL_ALREADY_TAKEN: {
        message: 'This email already taken, try use another',
        status: statusCodes_1.default.CONFLICT,
        code: 'EMAIL_ALREADY_TAKEN_ERROR'
    },
    SEND_EMAIL: {
        message: 'Send email error',
        status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        code: 'SEND_EMAIL_ERROR'
    },
    DECRYPTION: {
        message: 'Decryption error',
        status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        code: 'DECRYPTION_ERROR'
    },
    ROUTE_NOT_FOUND: {
        message: 'Route not found',
        status: statusCodes_1.default.NOT_FOUND,
        code: 'ROUTE_NOT_FOUND_ERROR'
    },
    NOT_FOUND: {
        message: 'Empty response, not found',
        status: statusCodes_1.default.NOT_FOUND,
        code: 'NOT_FOUND_ERROR'
    },
    UNPROCESSABLE_ENTITY: {
        message: 'Unprocessable entity',
        status: statusCodes_1.default.UNPROCESSABLE_ENTITY,
        code: 'UNPROCESSABLE_ENTITY_ERROR'
    },
    DB_DUPLICATE_CONFLICT: {
        message: 'Duplicate conflict. Resource already exists',
        status: statusCodes_1.default.CONFLICT,
        code: 'DB_DUPLICATE_CONFLICT_ERROR'
    },
    DB_NOTNULL_CONFLICT: {
        message: 'Not null conflict',
        status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        code: 'DB_NOTNULL_CONFLICT_ERROR'
    },
    DB: {
        status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        code: 'DB_ERROR'
    }
};
exports.default = errorCodes;
