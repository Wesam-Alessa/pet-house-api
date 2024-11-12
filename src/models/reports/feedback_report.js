const mongoose = require('mongoose');

const feedbackReportSchema = new mongoose.Schema({
  userId: {type: String,},
  date: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
  },
});

const FeedbackReport = mongoose.model('Feedback Reports', feedbackReportSchema);

exports.FeedbackReport = FeedbackReport;