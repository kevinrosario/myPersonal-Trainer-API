const mongoose = require('mongoose')

const startedWorkoutSchema = new mongoose.Schema({
  workout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutTemplate'
  },
  finishedExercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  }],
  unfinishedExercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  }],
  approximateDuration: {
    type: Number
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('StartedWorkout', startedWorkoutSchema)
