const express = require('express');
const rateLimit = require("express-rate-limit");
const { signup_post, login_post } = require("../controllers/authController.js");
const { checkUser } = require("../middleware/authMiddleware.js");

const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
});

router.post('/signup', limiter, signup_post);
router.post('/login', limiter, login_post);
router.post('/', checkUser);

module.exports = router;
