// src/models/student.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentHistorySchema = new Schema({
  amount: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  method: { type: String },
  note: { type: String }
}, { _id: false });

const studentSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true },
  fullName: { type: String, required: true, trim: true },
  dob: { type: Date },
  degree: { type: String },
  school: { type: String },
  contactNo: { type: String },
  parentContact: { type: String },
  address: { type: String },
  enrollmentDate: { type: Date, default: Date.now },
  batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
  fees: {
    total: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    paymentHistory: [paymentHistorySchema]
  }
}, { timestamps: true });

// auto compute fullName if not provided
studentSchema.pre('validate', function(next) {
  if (!this.fullName) {
    this.fullName = `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
