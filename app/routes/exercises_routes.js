const express = require('express')
const passport = require('passport')

const Exercise = require('../models/Exercise')
const WorkoutTemplate = require('../models/workoutTemplate')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.get('/exercises', (req, res, next) => {
  Exercise.find()
    .then(exercises => {
      return exercises.map(exercise => exercise.toObject())
    })
    .then(exercises => res.status(200).json({ exercises: exercises }))
    .catch(next)
})

router.get('/exercises/:id', requireToken, (req, res, next) => {
  Exercise.findById(req.params.id)
    .then(handle404)
    .then(exercise => res.status(200).json({ exercise: exercise.toObject() }))
    .catch(next)
})

async function getWorkoutsCreated () {
  const number = await WorkoutTemplate.find().count()
  return number
}

router.post('/exercises', requireToken, (req, res, next) => {
  // Wait till all the promises are solved
  Promise.all(req.body.exercises.map((exercise) => {
    exercise.owner = req.user.id
    // Return promise of creating a new Exercise
    return Exercise.create(exercise)
      .then(exercise => exercise) // return the exercise when created
      .catch(next)
  }))
    .then(arr => {
      // Get the number of workouts created to this momment
      getWorkoutsCreated()
        .then(workoutID => {
          // Create a new workout template with the given exercises
          const createdExercisesID = arr.map(createdExercise => createdExercise._id)
          WorkoutTemplate.create({
            name: `Workout ${workoutID}`,
            exercises: createdExercisesID,
            owner: req.user.id
          })
            // Send the created workout to the front-end
            .then(workoutTemplate => {
              res.status(201).json({ workoutTemplate: workoutTemplate.toObject() })
            })
            .catch(next)
        })
        .catch(next)
    })
    .catch(next)
})

router.patch('/exercises/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.exercise.owner

  Exercise.findById(req.params.id)
    .then(handle404)
    .then(exercise => {
      requireOwnership(req, exercise)
      return exercise.update(req.body.exercise)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

router.delete('/exercises/:id', requireToken, (req, res, next) => {
  Exercise.findById(req.params.id)
    .then(handle404)
    .then(exercise => {
      requireOwnership(req, exercise)
      exercise.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
