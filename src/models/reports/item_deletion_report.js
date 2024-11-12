const mongoose = require('mongoose');

const itemDeletionReportSchema = new mongoose.Schema({
  item: {},
  owner: {},
  manager: {},
  admin:{},
  deletedAt: {},
  reportDate: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
  },
  type: {
    type: String,
  },
  deleted: {
    type: Boolean,
  },
});

const ItemDeletionReport = mongoose.model('Deletion Reports', itemDeletionReportSchema);

exports.ItemDeletionReport = ItemDeletionReport;