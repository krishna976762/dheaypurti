// src/routes/users.js
const express = require('express');
const User = require('../models/user');
const { auth, requireRole } = require('../middlewares/auth');
const router = express.Router();
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { requireOwnerOrSelf } = require('../middlewares/auth');

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'teachers');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});
const upload = multer({ storage });

// ------------------- LIST ALL TEACHERS -------------------
router.get('/teachers', auth, requireRole(['owner']), async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    res.json({ teachers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


router.post('/teachers', auth, requireRole(['owner']), async (req, res) => {
  try {
    const {
      name, email, password, dob, gender, mobile, address,
      highestDegree, college, graduationYear, certifications,
      teachingExperience, previousInstitutions, specialSkills,
      subjectsTaught, availabilityTimings, preferredDays,
      willingToTravel, onlineTeaching, maxStudentsPerBatch,
      expectedSalary, additionalNotes,
      documents, salary, isActive
    } = req.body;

    // Validate required fields
    const mandatoryFields = ['name','email','password','dob','gender','mobile','address','highestDegree','college','graduationYear','certifications','teachingExperience','previousInstitutions','specialSkills','subjectsTaught','availabilityTimings','preferredDays','maxStudentsPerBatch','expectedSalary'];
    for (let field of mandatoryFields) {
      if (!req.body[field]) return res.status(400).json({ message: `${field} is required` });
    }

    // Check email uniqueness
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already used' });

    const newTeacher = new User({
      name, email, password, role: 'teacher', dob, gender, mobile, address,
      highestDegree, college, graduationYear, certifications,
      teachingExperience, previousInstitutions, specialSkills,
      subjectsTaught: Array.isArray(subjectsTaught) ? subjectsTaught : JSON.parse(subjectsTaught),
      availabilityTimings: Array.isArray(availabilityTimings) ? availabilityTimings : JSON.parse(availabilityTimings),
      preferredDays: Array.isArray(preferredDays) ? preferredDays : JSON.parse(preferredDays),
      willingToTravel: willingToTravel === 'true' || willingToTravel === true,
      onlineTeaching: onlineTeaching === 'true' || onlineTeaching === true,
      maxStudentsPerBatch,
      expectedSalary, additionalNotes,
      isActive: isActive === 'true' || isActive === true,
      documents,
      salary
    });

    await newTeacher.save();
    return res.json({ message: 'Teacher created', teacher: newTeacher.toJSON() });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

// ------------------- UPDATE TEACHER -------------------
router.put('/teachers/:id', auth, requireRole(['owner']), async (req, res) => {
  try {
    const updates = { ...req.body };

    // Convert arrays from JSON strings if needed
    if (typeof updates.subjectsTaught === 'string') updates.subjectsTaught = JSON.parse(updates.subjectsTaught);
    if (typeof updates.availabilityTimings === 'string') updates.availabilityTimings = JSON.parse(updates.availabilityTimings);
    if (typeof updates.preferredDays === 'string') updates.preferredDays = JSON.parse(updates.preferredDays);

    // Convert booleans
    updates.willingToTravel = updates.willingToTravel === 'true' || updates.willingToTravel === true;
    updates.onlineTeaching = updates.onlineTeaching === 'true' || updates.onlineTeaching === true;
    updates.isActive = updates.isActive === 'true' || updates.isActive === true;

    const updatedTeacher = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!updatedTeacher) return res.status(404).json({ message: 'Teacher not found' });

    res.json({ message: 'Teacher updated', teacher: updatedTeacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------- GET SINGLE TEACHER -------------------
router.get('/teachers/:id', auth, requireOwnerOrSelf, async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).select('-password');
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
