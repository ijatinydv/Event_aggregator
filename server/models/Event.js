const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Hackathon', 'Workshop', 'Tech Talk', 'Conference', 'Other']
  },
  college: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text indices for search functionality
eventSchema.index({ 
  name: 'text', 
  college: 'text', 
  location: 'text', 
  description: 'text' 
});

module.exports = mongoose.model('Event', eventSchema); 