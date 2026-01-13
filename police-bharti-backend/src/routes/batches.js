const express = require('express');
const Batch = require('../models/batch');
const { auth, requireRole } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Teacher = require('../models/teacher');
const Student = require('../models/student');

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/banners'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// Create batch (owner only) with optional banner
router.post('/', auth, requireRole(['owner']), upload.single('banner'), async (req, res) => {
  try {
    const { title, startDate, endDate, teacher, teachers, timing, subjects } = req.body;

    if (!title || !startDate || !endDate || !timing) {
      return res.status(400).json({ message: 'Missing required fields (title, startDate, endDate, timing)' });
    }

    // 🧠 Normalize teachers — handle optional
    let teacherArray = [];
    if (teachers) {
      if (Array.isArray(teachers)) teacherArray = teachers.filter(t => !!t);
      else if (typeof teachers === 'string') teacherArray = teachers.split(',').map(t => t.trim());
    } else if (teacher) {
      teacherArray = [teacher];
    }

    // 🧠 Parse subjects — handle optional & empty teacher IDs
    let parsedSubjects = [];
    if (subjects) {
      const rawSubjects = typeof subjects === 'string' ? JSON.parse(subjects) : subjects;
      parsedSubjects = rawSubjects
        .filter(s => s.name) // skip any invalid subjects
        .map(s => ({
          name: s.name,
          teacher: s.teacher || null, // store null instead of empty string
        }));
    }

    const batch = new Batch({
      title,
      startDate,
      endDate,
      timing,
      teachers: teacherArray,
      subjects: parsedSubjects,
      createdBy: req.user._id,
      banner: req.file ? `/uploads/banners/${req.file.filename}` : undefined
    });

    await batch.save();
    res.json({ message: '✅ Batch created successfully', batch });
  } catch (err) {
    console.error('Batch create error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});




// Public GET route
// GET /api/batches
// GET /api/batches
router.get('/', async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate('teachers', 'name email') // populate batch teachers
      .lean(); // convert Mongoose docs to plain objects

    const Teacher = require('../models/teacher');

    for (let batch of batches) {
      const subjectsArray = Array.isArray(batch.subjects) ? batch.subjects : [];

      batch.subjects = await Promise.all(
        subjectsArray.map(async (subj) => {
          if (subj.teacher) {
            const teacher = await Teacher.findById(subj.teacher, 'name email');
            return { ...subj, teacherName: teacher?.name || 'N/A' };
          } else {
            return { ...subj, teacherName: 'N/A' };
          }
        })
      );
    }

    res.json({ batches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Edit batch - owner only
router.put('/:id', auth, requireRole(['owner']), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const batch = await Batch.findById(id);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    Object.assign(batch, updateData); // update fields
    await batch.save();

    res.json({ message: '✅ Batch updated successfully', batch });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete batch - owner only
router.delete('/:id', auth, requireRole(['owner']), async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findById(id);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    await batch.deleteOne();
    res.json({ message: '✅ Batch deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get batch by ID (public or authorized teacher/owner)
// GET /api/batches/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const batch = await Batch.findById(id)
      .populate('teachers', 'name email subjectsTaught') // teachers
      .lean();

    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    // Fetch students linked to this batch
    const students = await Student.find({ batch: batch._id }) // ✅ use ObjectId reference
      .select('fullName studentContact fees feesStatus') // pick fields you need
      .lean();

    // Populate subjects with teacher names
    const Teacher = require('../models/teacher');
    batch.subjects = await Promise.all(
      batch.subjects.map(async (subj) => {
        if (subj.teacher) {
          const teacher = await Teacher.findById(subj.teacher, 'name email subjectsTaught');
          return { ...subj, teacherName: teacher?.name || 'N/A' };
        } else {
          return { ...subj, teacherName: 'N/A' };
        }
      })
    );

    res.json({ batch: { ...batch, students } }); // attach students
  } catch (err) {
    console.error('Get batch by ID error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});




module.exports = router;
