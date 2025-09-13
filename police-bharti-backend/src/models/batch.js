// src/models/batch.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const batchSchema = new Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  teachers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // one or more teachers
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, // owner who created
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);
