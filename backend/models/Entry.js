const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  questions: {
    type: [String],
    required: true
  },
  questionTypes: {
    type: [String],
    required: true
  },
  output: {
    type: String,
    required: true
  },
  energyLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Entry', EntrySchema);