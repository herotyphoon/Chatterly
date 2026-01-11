const User = require('../../models/user.model');

async function validateSignupRequest(req, res, next) {
    try {
        req.body.fullName = req.body.fullName?.trim();
        req.body.username = req.body.username?.trim();

        const {username, fullName, password} = req.body;

        if (!username || !fullName || !password) return res.status(400).json({message: 'All fields are required'});

        if (username.length < 5) return res.status(400).json({message: 'Username must be at least 5 characters'});

        if (username.length > 50) return res.status(400).json({message: 'Username must be at most 50 characters'});

        const usernameRegex = /^[a-z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                message: 'Username must contain only lowercase letters, numbers or _'
            });
        }

        if (password.length < 8) return res.status(400).json({message: 'Password must be at least 8 characters'});

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({message: 'Username already exists'});
        }

        next();
    } catch (error) {
        console.error('Signup validation error: ', error.message);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

module.exports = {validateSignupRequest};