require('dotenv').config({quiet: true});
const jwt = require("jsonwebtoken");


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
            fullName: User.fullName,
            email: User.email,
            profileImageUrl: User.profileImageUrl,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        return token;
    } catch (error) {
        console.error(`Token generation failed: ${error.message}`);
    }
}

module.exports = {generateToken};