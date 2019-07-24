const mongoose = require('mongoose')

const workoutTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  exercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  }],
  approximateDuration: {
    type: Number,
    default: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  usersUsingIt: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('WorkoutTemplate', workoutTemplateSchema)
