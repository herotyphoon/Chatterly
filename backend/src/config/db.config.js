require('dotenv').config({ quiet: true });
const { connect } = require('mongoose');

async function connectToDB() {
    const connectionString = process.env.MONGODB_URI;
    try {
        await connect(connectionString);
        console.log('MongoDB Connected!');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

module.exports = { connectToDB };