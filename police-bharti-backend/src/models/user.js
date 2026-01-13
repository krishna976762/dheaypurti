// src/models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['owner', 'teacher'], required: true },
    isActive: { type: Boolean, default: true },

    // Teacher details
    dob: { type: Date },
    gender: { type: String },
    mobile: { type: String },
    address: { type: String },
    highestDegree: { type: String },
    college: { type: String },
    graduationYear: { type: String },
    certifications: { type: String },
    teachingExperience: { type: String },
    previousInstitutions: { type: String },
    specialSkills: { type: String },
    subjectsTaught: [{ type: String }],
    availabilityTimings: [{ type: String }],
    preferredDays: [{ type: String }],
    willingToTravel: { type: Boolean, default: false },
    onlineTeaching: { type: Boolean, default: false },
    maxStudentsPerBatch: { type: Number },
    expectedSalary: { type: Number },
    additionalNotes: { type: String },

    // New sections
    documents: {
      adharNumber: { type: String },
      panNumber: { type: String },
      bank: { type: String }
    },
    salary: {
      accountNumber: { type: String }
    }

  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
