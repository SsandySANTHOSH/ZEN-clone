const mongoose = require("mongoose");
const QuerySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  voice: {
    type: String,
    required: true,
  },
 
 
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  userid:{
    type: mongoose.Schema.Types.ObjectId,
  },
  mentorid:{
    type: mongoose.Schema.Types.ObjectId,
  },
  status:{
    type:String,
  },
  fromtime:{
    type:String,
  },
  totime:{
    type:String,
  }


});

const querydb = new mongoose.model("Query", QuerySchema);

module.exports = querydb;