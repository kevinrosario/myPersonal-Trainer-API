const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  muscles: [{
    type: String,
    required: true
  }],
  description: {
    type: String
  },
  sets: {
    type: Number,
    required: true
  },
  repetions: {
    type: Number,
    required: true
  },
  weight: {
    type: Number
  },
  restTime: {
    type: Number,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Exercise', exerciseSchema)
