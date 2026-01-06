require('dotenv').config({quiet: true});

const { connectToDB } = require('./src/config/db.config.js');
const app = require('./src/app.js');

const port = process.env.PORT || 8000;

connectToDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server Listening`);
        });
    })
    .catch((err) => {
        console.log('❌ Failed to start server:', err.message);
    });