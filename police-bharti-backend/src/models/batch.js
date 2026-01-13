// src/models/batch.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  name: { 
    type: String, 
    enum: ['Math', 'English', 'Reasoning', 'Marathi Grammar'], 
    required: true 
  },
  teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' } // keep teacher reference
});

const batchSchema = new Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  timing: { type: String, required: true },

  // Teachers assigned to this batch
  teachers: [{ type: Schema.Types.ObjectId, ref: 'Teacher' }],

  // Subjects with assigned teachers
  subjects: [subjectSchema],

  // Students enrolled in this batch
 students: [{ type: Schema.Types.ObjectId, ref: 'Student' }], // ✅ NEW

  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  banner: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);
