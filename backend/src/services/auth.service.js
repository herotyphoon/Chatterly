require('dotenv').config({quiet: true});
const jwt = require('jsonwebtoken');


function generateToken(User) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is required');
    }
    if (!process.env.JWT_EXPIRE) {
        throw new Error('JWT_EXPIRE environment variable is required');
    }
    try {
        const payload = {
            _id: User._id,
            username: User.username,
            fullName: User.fullName,
            profileImageUrl: User.profileImageUrl,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        return token;
    } catch (error) {
        console.error(`Token generation failed: ${error.message}`);
        throw error;
    }
}

function getUserFromToken(token) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is required');
    }
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }

}

module.exports = {generateToken, getUserFromToken};