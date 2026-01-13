const express = require('express');
const bcrypt = require('bcrypt');
const Teacher = require('../models/teacher');
const { auth, requireRole } = require('../middlewares/auth');
const router = express.Router();

// ------------------- LIST ALL TEACHERS -------------------
router.get('/', auth, requireRole(['owner']), async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json({ teachers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------- CREATE TEACHER -------------------
router.post('/', auth, requireRole(['owner']), async (req, res) => {
  try {
    const {
      name, email, password, dob, gender, mobile, address,
      highestDegree, college, graduationYear, certifications,
      teachingExperience, previousInstitutions, specialSkills,
      subjectsTaught, availabilityTimings, preferredDays,
      willingToTravel, onlineTeaching, maxStudentsPerBatch,
      expectedSalary, additionalNotes, isActive
    } = req.body;

    // Required fields validation
    const mandatoryFields = [
      'name','email','password','dob','gender','mobile','address',
      'highestDegree','college','graduationYear','certifications',
      'teachingExperience','previousInstitutions','specialSkills',
      'subjectsTaught','availabilityTimings','preferredDays',
      'maxStudentsPerBatch','expectedSalary'
    ];
    for (let field of mandatoryFields) {
      if (!req.body[field]) return res.status(400).json({ message: `${field} is required` });
    }

    // Check email uniqueness
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) return res.status(400).json({ message: 'Email already used' });

    // ✅ Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const teacherData = {
      name,
      email,
      password: hashedPassword, // store hashed password
      dob,
      gender,
      mobile,
      address,
      highestDegree,
      college,
      graduationYear,
      certifications,
      teachingExperience,
      previousInstitutions,
      specialSkills,
      subjectsTaught: Array.isArray(subjectsTaught) ? subjectsTaught : JSON.parse(subjectsTaught),
      availabilityTimings: Array.isArray(availabilityTimings) ? availabilityTimings : JSON.parse(availabilityTimings),
      preferredDays: Array.isArray(preferredDays) ? preferredDays : JSON.parse(preferredDays),
      willingToTravel: willingToTravel === 'true' || willingToTravel === true,
      onlineTeaching: onlineTeaching === 'true' || onlineTeaching === true,
      maxStudentsPerBatch,
      expectedSalary,
      additionalNotes,
      isActive: isActive === 'true' || isActive === true,
    };

    const teacher = new Teacher(teacherData);
    await teacher.save();

    res.json({ message: 'Teacher created successfully', teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------- UPDATE TEACHER -------------------
router.put('/:id', auth, requireRole(['owner']), async (req, res) => {
  try {
    const updates = { ...req.body };

    if (typeof updates.subjectsTaught === 'string') updates.subjectsTaught = JSON.parse(updates.subjectsTaught);
    if (typeof updates.availabilityTimings === 'string') updates.availabilityTimings = JSON.parse(updates.availabilityTimings);
    if (typeof updates.preferredDays === 'string') updates.preferredDays = JSON.parse(updates.preferredDays);

    updates.willingToTravel = updates.willingToTravel === 'true' || updates.willingToTravel === true;
    updates.onlineTeaching = updates.onlineTeaching === 'true' || updates.onlineTeaching === true;
    updates.isActive = updates.isActive === 'true' || updates.isActive === true;

    // ✅ Hash new password if provided
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedTeacher) return res.status(404).json({ message: 'Teacher not found' });

    res.json({ message: 'Teacher updated successfully', teacher: updatedTeacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------- GET SINGLE TEACHER -------------------
// ------------------- GET SINGLE TEACHER -------------------
router.get('/:id', auth, async (req, res) => {
  try {
    // Teachers can access only their own profile
    if (req.user.role === 'teacher' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const teacher = await Teacher.findById(req.params.id)
      .populate({
        path: 'batches',
        model: 'Batch',
        populate: {
          path: 'teachers',
          model: 'Teacher',
          select: 'name email subjectsTaught',
        },
      });

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    res.json({ teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
