const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const IdeaSchema = new Schema({
  
  Gender:{
    type: String,
    required: true
  },
  activity:{
    type: Number,
    required: true
  },

  Age:{
    type: Number,
    required: true
  },
  Name:{
    type: String,
    required: true
  },
  Weight:{
    type: Number,
    required: true
  },
  Height:{
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('ideas', IdeaSchema);