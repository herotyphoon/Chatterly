const express = require('express');

const { handleSignUp, handleLogin, handleLogout, handleUpdateProfile } = require('../controllers/auth.controllers.js');
const {validateSignupRequest} = require("../middleware/signup.middleware.js");
const {checkAuthorization} = require("../middleware/auth.middleware");

const router = express.Router();

router.post('/signup', validateSignupRequest, handleSignUp);

router.post('/login', handleLogin);

router.post('/logout', checkAuthorization, handleLogout);

router.patch('/profile', checkAuthorization, handleUpdateProfile);

module.exports = router;