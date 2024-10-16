const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const gameRoutes = require('./routes/gameapi'); 

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use('/api', gameRoutes);
mongoose.connect('mongodb://localhost:27017/shadowmatching')
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => {
        console.log('Server running on port 5000');
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});
