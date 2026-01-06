const express = require('express');

const { handleSignUp, handleLogin, handleLogout, handleUpdateProfile } = require('../controllers/auth.controllers.js');
const {validateSignupRequest} = require('../middleware/auth/validateSignupRequest.middleware.js');
const {checkAuthorization} = require('../middleware/auth.middleware.js');
const {validateLogin} = require('../middleware/auth/validateLoginRequest.middleware.js');
const {validateUpdateProfile} = require('../middleware/auth/validateUpdateProfileRequest.middleware.js');

const router = express.Router();

router.post('/signup', validateSignupRequest, handleSignUp);

router.post('/login', validateLogin, handleLogin);

router.post('/logout', checkAuthorization, handleLogout);

router.patch('/profile', checkAuthorization, validateUpdateProfile, handleUpdateProfile);

module.exports = router;