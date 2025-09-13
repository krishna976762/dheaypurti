// src/routes/students.js
const express = require('express');
const Student = require('../models/student');
const Batch = require('../models/batch');
const { auth, requireRole } = require('../middlewares/auth');
const router = express.Router();

// Create student (owner or teacher) - owner can set fees, teacher cannot
router.post('/', auth, async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.firstName || !body.batch) return res.status(400).json({ message: 'Missing firstName or batch' });

    // check batch exists
    const batch = await Batch.findById(body.batch);
    if (!batch) return res.status(400).json({ message: 'Batch not found' });

    // If teacher, remove fees from payload
    if (req.user.role === 'teacher') {
      delete body.fees;
    }

    const student = new Student(body);
    await student.save();

    // (optional) add student reference in batch (not strictly needed if we query students by batch)
    // await Batch.findByIdAndUpdate(body.batch, { $push: { students: student._id }});

    res.json({ message: 'Student added', student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List students (filter by batch, role-based projection & pagination)
router.get('/', auth, async (req, res) => {
  try {
    const { batch, page = 1, limit = 50, q } = req.query;
    const filter = {};
    if (batch) filter.batch = batch;
    if (q) filter.fullName = { $regex: q, $options: 'i' };

    const projection = (req.user.role === 'teacher') ? '-fees' : ''; // hide fees for teachers

    const students = await Student.find(filter).select(projection)
      .skip((page - 1) * limit).limit(Number(limit))
      .populate('batch', 'title startDate endDate');

    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student by id — owner sees fees, teacher does not
router.get('/:id', auth, async (req, res) => {
  try {
    const student = (req.user.role === 'teacher')
      ? await Student.findById(req.params.id).select('-fees').populate('batch', 'title')
      : await Student.findById(req.params.id).populate('batch', 'title');

    if (!student) return res.status(404).json({ message: 'Student not found' });
    // If teacher, ensure they are allowed (i.e., teacher is assigned to student's batch)
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

// Update student (owner can update fees; teacher cannot modify fees)
router.patch('/:id', auth, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.user.role === 'teacher') delete updates.fees; // enforce server-side

    const student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json({ message: 'Updated', student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
