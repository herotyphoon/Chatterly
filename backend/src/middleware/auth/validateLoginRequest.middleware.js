function validateLogin(req, res, next) {
    try {
        req.body.email = req.body.email?.trim().toLowerCase();

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        next();
    } catch (error) {
        console.error('Login validation error: ', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {validateLogin};