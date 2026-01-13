// src/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Teacher = require('../models/teacher');
const router = express.Router();

// Login (for both User & Teacher)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Try finding in User model first
    let userData = await User.findOne({ email });
    let role = 'owner';

    // 2️⃣ If not found, try Teacher model
    if (!userData) {
      userData = await Teacher.findOne({ email });
      role = 'teacher';
    }

    if (!userData) {
      return res.status(404).json({ message: 'User or Teacher not found' });
    }

    // 3️⃣ Check password manually (Teacher model may not have comparePassword)
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    if (userData.isActive === false) {
      return res.status(403).json({ message: 'Account is inactive. Contact admin.' });
    }

    // 4️⃣ Generate token
    const token = jwt.sign(
      { id: userData._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      role,
      user: { id: userData._id, name: userData.name, email: userData.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
