const ms = require("ms");

const User = require('../models/user.model.js');
const { generateToken } = require('../services/auth.service.js');

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

async function handleLogin(req, res) {
    res.status(501).json({ message: 'Not implemented' });
}

function handleLogout(req, res) {
    res.status(501).json({ message: 'Not implemented' });
}

module.exports = { handleSignUp, handleLogin, handleLogout };