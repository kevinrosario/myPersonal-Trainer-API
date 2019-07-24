const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  muscles: [{
    type: Number,
    required: true
  }],
  musclesSecondary: [{
    type: Number
  }],
  category: [{
    type: Number
  }],
  equipment: [{
    type: Number
  }],
  description: {
    type: String
  },
  sets: {
    type: Number,
    default: 0
  },
  repetions: {
    type: Number,
    default: 0
  },
  weight: {
    type: Number,
    default: 0
  },
  restTime: {
    type: Number,
    default: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  id: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Exercise', exerciseSchema)
