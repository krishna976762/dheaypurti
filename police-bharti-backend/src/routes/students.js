// src/routes/students.js
const express = require('express');
const Student = require('../models/student');
const Batch = require('../models/batch');
const { auth } = require('../middlewares/auth');
const router = express.Router();

// Create student (owner or teacher)
router.post('/', auth, async (req, res) => {
  try {
    const body = { ...req.body };

    if (!body.fullName || !body.batch) {
      return res.status(400).json({ message: 'Missing fullName or batch' });
    }

    // Check batch exists
    const batch = await Batch.findById(body.batch);
    if (!batch) return res.status(400).json({ message: 'Batch not found' });

    // Teachers cannot modify fees
    if (req.user.role === 'teacher') {
      delete body.fees;
    }

    // Remove invalid empty enum fields
    if (!body.modeOfClass) delete body.modeOfClass;

    // Ensure subjects is an array of ObjectIds
    if (body.subjects && !Array.isArray(body.subjects)) {
      body.subjects = [body.subjects];
    }

    const student = new Student(body);
    await student.save();

    res.status(201).json({ message: 'Student added successfully', student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// List students (filter, search, pagination, role-based projection)
router.get('/', auth, async (req, res) => {
  try {
    const { batch, page = 1, limit = 50, q } = req.query;
    const filter = {};
    if (batch) filter.batch = batch;
    if (q) filter.fullName = { $regex: q, $options: 'i' };

    const projection = (req.user.role === 'teacher') ? '-fees' : ''; // hide fees for teachers

    const students = await Student.find(filter)
      .select(projection)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('batch', 'title startDate endDate');

    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const projection = req.user.role === 'teacher' ? '-fees' : '';
    const student = await Student.findById(req.params.id)
      .select(projection)
      .populate('batch', 'title startDate endDate');

    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Verify teacher permission
    if (req.user.role === 'teacher') {
      const batch = await Batch.findById(student.batch);
      if (!batch || !batch.teachers.some(t => t.equals(req.user._id))) {
        return res.status(403).json({ message: 'Not allowed' });
      }
    }

    res.json({ student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update student
router.patch('/:id', auth, async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.user.role === 'teacher') {
      delete updates.fees; // prevent teacher fee edits
    }

    const student = await Student.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json({ message: 'Student updated successfully', student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
