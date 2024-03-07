"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const router = (0, express_1.Router)();
router.post('/', users_1.newUser);
router.post('/login', users_1.loginUser);
exports.default = router;
