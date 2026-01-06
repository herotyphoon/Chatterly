const ms = require('ms');

const User = require('../models/user.model.js');
const { generateToken } = require('../services/auth.service.js');

async function handleSignUp(req, res) {
    try {
        if (!process.env.JWT_EXPIRE) {
            throw new Error('JWT_EXPIRE environment variable is required');
        }

        const {username, fullName, email, password} = req.body;

        const jwtExpire = ms(process.env.JWT_EXPIRE);

        if (jwtExpire === undefined) {
            throw new Error('JWT_EXPIRE has invalid format');
        }

        const newUser = await User.create({
            username,
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
            username: newUser.username,
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
    try {
        if (!process.env.JWT_EXPIRE) {
            throw new Error('JWT_EXPIRE environment variable is required');
        }

        const jwtExpire = ms(process.env.JWT_EXPIRE);

        if (jwtExpire === undefined) {
            throw new Error('JWT_EXPIRE has invalid format');
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({message: 'Invalid credentials'});
        }

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
        console.error("Error Logging In: ", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

function handleLogout(req, res) {
    res.clearCookie('__sessionID', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({message: 'Logged out successfully'});
}

async function handleUpdateProfile(req, res) {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: req.updates },
            {
                new: true,
                runValidators: true,
            }
        ).select('-password');

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Update profile failed: ', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { handleSignUp, handleLogin, handleLogout, handleUpdateProfile };