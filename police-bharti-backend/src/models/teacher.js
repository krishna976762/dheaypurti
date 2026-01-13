// src/models/teacher.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },

  highestDegree: { type: String, required: true },
  college: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  certifications: { type: [String], default: [] },
  teachingExperience: { type: String },
  previousInstitutions: { type: [String], default: [] },
  specialSkills: { type: [String], default: [] },
  subjectsTaught: { type: [String], default: [] },
  availabilityTimings: { type: [String], default: [] },
  preferredDays: { type: [String], default: [] },
  willingToTravel: { type: Boolean, default: false },
  onlineTeaching: { type: Boolean, default: false },
  maxStudentsPerBatch: { type: Number },
  expectedSalary: { type: Number },
  additionalNotes: { type: String },
  salary: { type: Number },
  isActive: { type: Boolean, default: true },

  // ✅ NEW FIELD: link batches to teachers
  batches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],

}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
