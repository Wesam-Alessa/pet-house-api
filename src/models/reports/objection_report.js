const mongoose = require('mongoose');

const objectionReportSchema = new mongoose.Schema({
  email: {type: String},
  content: {
    type: String
  },
  answer: {
    type: String,
    default: 'No response yet from management'
  },
  date: {
    type: Date,
    default: Date.now
  },
  responseDate: {
    type: Date,
    default: Date.now
  },
  respondentId: {type: String},
});

const ObjectionReport = mongoose.model('Objection Reports', objectionReportSchema);

exports.ObjectionReport = ObjectionReport;