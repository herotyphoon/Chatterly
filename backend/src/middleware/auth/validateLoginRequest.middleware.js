function validateLogin(req, res, next) {
    try {
        req.body.username = req.body.username?.trim();

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const usernameRegex = /^[a-z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        next();
    } catch (error) {
        console.error('Login validation error: ', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {validateLogin};