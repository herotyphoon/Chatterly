const User = require("../models/user.model");

async function validateSignupRequest(req, res, next) {
    try {
        req.body.fullName = req.body.fullName?.trim();
        req.body.email = req.body.email?.trim().toLowerCase();

        const {fullName, email, password} = req.body;

        if (!fullName || !email || !password) return res.status(400).json({message: 'All fields are required'});



        if (password.length < 8) return res.status(400).json({message: 'Password must be at least 8 characters'});

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({message: 'Invalid email address'});

        const user = await User.findOne({email});
        if (user) return res.status(400).json({message: 'Email already exists'});

        next();
    } catch (error) {
        console.error('Signup validation error: ', error.message);
        return res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = {validateSignupRequest};