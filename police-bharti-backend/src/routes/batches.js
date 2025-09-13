// src/routes/batches.js
const express = require('express');
const Batch = require('../models/batch');
const { auth, requireRole } = require('../middlewares/auth');
const router = express.Router();

// Create batch (owner only)
router.post('/', auth, requireRole(['owner']), async (req, res) => {
  try {
    const { title, startDate, endDate, teachers } = req.body;
    if (!title || !startDate || !endDate) return res.status(400).json({ message: 'Missing fields' });

    const batch = new Batch({
      title,
      startDate,
      endDate,
      teachers: teachers || [],
      createdBy: req.user._id
    });
    await batch.save();
    res.json({ message: 'Batch created', batch });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List batches (owner sees all, teacher sees assigned)
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'teacher') {
      query = { teachers: req.user._id };
    }
    const batches = await Batch.find(query).populate('teachers', 'name email');
    res.json({ batches });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get batch detail
router.get('/:id', auth, async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id).populate('teachers', 'name email');
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    // if teacher requesting ensure they belong to this batch
    if (req.user.role === 'teacher' && !batch.teachers.some(t => t._id.equals(req.user._id))) {
      return res.status(403).json({ message: 'Not allowed for this batch' });
    }

    res.json({ batch });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update batch (owner only)
router.patch('/:id', auth, requireRole(['owner']), async (req, res) => {
  try {
    const updates = (({ title, startDate, endDate, teachers, isActive }) => ({ title, startDate, endDate, teachers, isActive }))(req.body);
    const batch = await Batch.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('teachers', 'name email');
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    res.json({ message: 'Batch updated', batch });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
