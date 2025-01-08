const express = require('express');
const app = express();
const cors = require('cors');

const userRoutes = require('./routes/User');
const pathRoutes = require('./routes/Path');
const conversationRoutes = require('./routes/Conversation');
const messageRoutes = require('./routes/Message');
const progressRoutes = require('./routes/Progress');
const todoListRoutes = require('./routes/ToDoList');
const taskRoutes = require('./routes/Task');

// Configure CORS options
const corsOptions = {
    origin: '*', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};
app.use(express.json());
app.use(cors(corsOptions));




// Use each route file
app.use('/user', userRoutes);
app.use('/path', pathRoutes);
app.use('/conversation', conversationRoutes);
app.use('/message', messageRoutes);
app.use('/progress', progressRoutes);
app.use('/ToDoList', todoListRoutes);
app.use('/task', taskRoutes);



module.exports = app;
