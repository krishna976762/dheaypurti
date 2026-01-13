// src/models/student.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Payment History Schema
const paymentHistorySchema = new Schema({
  amount: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  method: { type: String }, // e.g., Cash / UPI / Bank Transfer
  note: { type: String }
}, { _id: false });

// Student Schema
const studentSchema = new Schema({
  // 🧾 Basic Information
  fullName: { type: String, required: true, trim: true },
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  address: { type: String },
  studentContact: { type: String },
  parentContact: { type: String },
  email: { type: String, trim: true, lowercase: true },

  // 👨‍👩‍👧 Parent / Guardian Details
  guardianName: { type: String },
  relationship: { type: String },
  occupation: { type: String },
  guardianContact: { type: String },
  guardianEmail: { type: String, trim: true, lowercase: true },

  // 🎓 Academic Information
  schoolName: { type: String },
  currentClass: { type: String },
  stream: { type: String }, // Science / Commerce / Arts
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  previousPerformance: { type: String },

  // ⏰ Class Preferences
  preferredTiming: { type: String },
  daysAvailable: { type: String },
 modeOfClass: {
  type: String,
  enum: ['online', 'offline', 'hybrid'], // allowed values
  default: 'offline'
},

  // 💰 Fee Details
  fees: {
    total: { type: Number, default: 0 },
    paymentMode: { type: String }, // Cash / UPI / Bank Transfer
    feePaid: { type: Boolean, default: false },
    paymentDate: { type: Date },
    receiptNumber: { type: String },
    paymentHistory: [{ amount: Number, date: Date, receiptNumber: String }],
  },

  // 🩺 Other Information
  medicalConditions: { type: String },
  emergencyContactName: { type: String },
  emergencyContactNumber: { type: String },

  // System Info
  isActive: { type: Boolean, default: true },
  batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
  enrollmentDate: { type: Date, default: Date.now }

}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
