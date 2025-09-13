// src/routes/users.js
const express = require('express');
const User = require('../models/user');
const { auth, requireRole } = require('../middlewares/auth');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require("bcryptjs"); 

// Create teacher (owner only)
router.post('/teachers', auth, requireRole(['owner']), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Missing name or email' });

    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already used' });

    // Generate temp password
    const tempPassword = password || crypto.randomBytes(4).toString('hex'); // 8 hex chars

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const teacher = new User({ name, email, password: hashedPassword, role: 'teacher' });
    await teacher.save();

    return res.json({ message: 'Teacher created', teacher: teacher.toJSON(), tempPassword });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});


// List all teachers (owner)
router.get('/teachers', auth, requireRole(['owner']), async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    res.json({ teachers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user (enable/disable) - owner only
router.patch('/:id', auth, requireRole(['owner']), async (req, res) => {
  try {
    const updates = {};
    if (typeof req.body.isActive !== 'undefined') updates.isActive = !!req.body.isActive;
    if (req.body.name) updates.name = req.body.name;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Owner resets a teacher password (returns temp password) - owner only
router.post('/:id/reset-password', auth, requireRole(['owner']), async (req, res) => {
  try {
    const tempPassword = crypto.randomBytes(5).toString('hex'); // 10 hex chars
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Hash before saving
    user.password = await bcrypt.hash(tempPassword, 10);
    await user.save();

    res.json({ message: 'Password reset', tempPassword });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Logged-in user change their password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await user.comparePassword(oldPassword);
    if (!ok) return res.status(400).json({ message: 'Old password incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
