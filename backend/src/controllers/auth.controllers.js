const ms = require("ms");

const User = require('../models/user.model.js');
const { generateToken } = require('../services/auth.service.js');

/**
 * Create a new user account and set an authentication session cookie.
 *
 * Reads JWT_EXPIRE from the environment to determine the cookie max age, creates a new user
 * from request body fields (fullName, email, password), generates an auth token, and sets an
 * HTTP-only, same-site (`'strict'`) cookie named `__sessionID` with the token. Responds with
 * HTTP 201 and the created user's public fields and a success message. On error logs a message
 * and responds with HTTP 500 and `{ message: 'Internal Server Error' }`.
 */
async function handleSignUp(req, res) {
    try {
        if (!process.env.JWT_EXPIRE) {
            throw new Error('JWT_EXPIRE environment variable is required');
        }

        const {fullName, email, password} = req.body;

        const jwtExpire = ms(process.env.JWT_EXPIRE);

        if (jwtExpire === undefined) {
            throw new Error('JWT_EXPIRE has invalid format');
        }

        const newUser = await User.create({
            fullName,
            email,
            password,
        });

        const token = generateToken(newUser);

        res.status(201).cookie('__sessionID', token, {
            httpOnly: true,
            maxAge: jwtExpire,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        }).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profileImageUrl: newUser.profileImageUrl,
            message: 'User successfully created!'
        });
    } catch (error) {
        console.error( "Error Signing Up: ", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

/**
 * Authenticate a user and set an HTTP-only session cookie on success.
 *
 * Responds with status 200 and a JSON object containing user details and a success message,
 * sets the `__sessionID` cookie with the generated token, or responds with 400 when credentials are invalid.
 * On unexpected errors, responds with 500 and a generic error message.
 *
 * @param {import('express').Request} req - Express request; expects `req.body.email` and `req.body.password`.
 * @param {import('express').Response} res - Express response used to set the session cookie and send JSON responses.
 */
async function handleLogin(req, res) {
    try {
        const { email, password } = req.body;

        const jwtExpire = ms(process.env.JWT_EXPIRE);

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) return res.status(400).json({message: 'Invalid credentials'});

        const token = generateToken(user);

        res.status(200).cookie('__sessionID', token, {
            httpOnly: true,
            maxAge: jwtExpire,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        }).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            message: 'Login successful!'
        });

    } catch (error) {
        console.error( "Error Logging In: ", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

/**
 * Clear the authentication session cookie and respond with a logout confirmation.
 *
 * Clears the '__sessionID' cookie and sends a 200 JSON response with { message: 'Logged out successfully' }.
 */
function handleLogout(req, res) {
    res.clearCookie('__sessionID');
    res.status(200).json({message: 'Logged out successfully'});
}

module.exports = { handleSignUp, handleLogin, handleLogout };