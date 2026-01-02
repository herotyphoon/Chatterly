const express = require('express');

const authRoutes = require('./routes/auth.routes.js');
const messageRoutes = require('./routes/message.routes.js');

const app = express();

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

module.exports = app;