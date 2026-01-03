const express = require('express');

const { handleSignUp, handleLogin, handleLogout } = require('../controllers/auth.controllers.js');
const {validateSignupRequest} = require("../middleware/signup.middleware.js");

const router = express.Router();

router.post('/signup', validateSignupRequest, handleSignUp);

router.post('/login', handleLogin);

router.post('/logout', handleLogout);

module.exports = router;