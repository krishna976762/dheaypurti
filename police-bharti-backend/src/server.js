require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: '*' })); // later restrict to frontend
app.use(express.json()); // parse JSON body

// Static files
app.use('/uploads/teachers', express.static(path.join(__dirname, 'uploads', 'teachers')));

// Routes
// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users'); 
const batchRoutes = require('./routes/batches');
const studentRoutes = require('./routes/students');
const achievementsRouter = require('./routes/achievements');
const teacherRoutes = require('./routes/teachers'); // 👈 new line

app.use("/api/auth", authRoutes); 
app.use('/api/batches', batchRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/achievements', achievementsRouter);
app.use('/api/users', userRoutes);
app.use('/api/teachers', teacherRoutes); // 👈 new line


// Test route
app.get('/', (req, res) => {
  res.send('Dheypurti API is running 🚀');
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Dheypurti API running on port ${PORT} 🚀`));
})
.catch(err => console.error('❌ MongoDB connection error:', err));
