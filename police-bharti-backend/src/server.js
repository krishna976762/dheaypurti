// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// middlewares
app.use(helmet());
app.use(cors({ origin: '*'})); // later restrict to frontend
app.use(express.json()); // parse JSON body


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users'); 
const batchRoutes = require('./routes/batches');
const studentRoutes = require('./routes/students');

// test route
app.get('/', (req, res) => {
  res.send('Dheypurti API is running 🚀');
});

// connect db + start server
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log('Server running on http://localhost:4000');
    });
  })
  .catch(err => console.error(err));

  

app.use("/api/auth", authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/students', studentRoutes);