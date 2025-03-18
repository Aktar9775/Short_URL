const mongo = require('mongoose');

const urlSchema = new mongo.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  redirectURL: {
    type: String,
    required: true,
  },
  visitHistory: [{
    timeStamp: { type: Number }
  }],
  createdBy: {
    type: mongo.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
  }
}, { timestamps: true });

const URL = mongo.model('Url', urlSchema);
module.exports = URL;
