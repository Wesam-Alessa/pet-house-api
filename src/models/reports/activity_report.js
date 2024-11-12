const mongoose = require('mongoose');

const activityReportSchema = new mongoose.Schema({
  managerId: {type: String,},
  adminId:{type: String,},
  date: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
  },
  title: {
    type: String,
  },
});

const ActivityReport = mongoose.model('Activity Reports', activityReportSchema);

exports.ActivityReport = ActivityReport;