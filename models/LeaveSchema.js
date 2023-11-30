const mongoose = require("mongoose");
const LeaveSchema = new mongoose.Schema({
  days: {
    type: String,
    required: true,
  },
  from: {
    type: Date,
    required: true,
  },
 
 
  to: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  userid:{
    type: mongoose.Schema.Types.ObjectId,
  }


});

const leavedb = new mongoose.model("Leave", LeaveSchema);

module.exports = leavedb;