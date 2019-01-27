"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
router.use('/api', require('./api'));
exports.default = router;
