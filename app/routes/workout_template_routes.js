const express = require('express')
const passport = require('passport')

const WorkoutTemplate = require('../models/workoutTemplate')
const Exercise = require('../models/Exercise')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// get the number of workouts created
async function getWorkoutsCreated () {
  const number = await WorkoutTemplate.find().count()
  return number
}

router.get('/workout-templates', (req, res, next) => {
  WorkoutTemplate.find()
    .populate('exercises')
    .then(workoutTemplates => {
      return workoutTemplates.map(workoutTemplate => workoutTemplate.toObject())
    })
    .then(workoutTemplates => res.status(200).json({ workoutTemplates: workoutTemplates }))
    .catch(next)
})

router.get('/user-workout-templates', requireToken, (req, res, next) => {
  WorkoutTemplate.find({ owner: req.user.id })
    .populate('exercises')
    .then(workoutTemplates => {
      return workoutTemplates.map(workoutTemplate => workoutTemplate.toObject())
    })
    .then(workoutTemplates => res.status(200).json({ workoutTemplates: workoutTemplates }))
    .catch(next)
})

router.get('/workout-templates/:id', requireToken, (req, res, next) => {
  WorkoutTemplate.findById(req.params.id)
    .populate('exercises')
    .then(handle404)
    .then(workoutTemplate => res.status(200).json({ workoutTemplate: workoutTemplate.toObject() }))
    .catch(next)
})

router.post('/workout-templates', requireToken, (req, res, next) => {
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

router.patch('/workout-templates/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.workoutTemplate.owner
  console.log(req.body)

  WorkoutTemplate.findById(req.params.id)
    .then(handle404)
    .then(workoutTemplate => {
      requireOwnership(req, workoutTemplate)
      return workoutTemplate.update(req.body.workoutTemplate)
    })
    .then(() => {
      // send the updated template back
      WorkoutTemplate.findById(req.params.id)
        .populate('exercises')
        .then(handle404)
        .then(workoutTemplate => res.status(200).json({ workoutTemplate: workoutTemplate.toObject() }))
        .catch(next)
    })
    .catch(next)
})

router.patch('/workout-templates/:id/add-exercises', requireToken, (req, res, next) => {
  WorkoutTemplate.findByIdAndUpdate(req.params.id,
    { $push: { exercises: req.body.exercises[0]._id } },
    { safe: true, upsert: true },
    function (err, workoutTemplate) {
      if (err) {
        console.log(err)
      } else {
        return res.status(200).json({ workoutTemplate: workoutTemplate.toObject() })
      }
    }
  )
})

router.delete('/workout-templates/:id', requireToken, (req, res, next) => {
  WorkoutTemplate.findById(req.params.id)
    .then(handle404)
    .then(workoutTemplate => {
      requireOwnership(req, workoutTemplate)
      workoutTemplate.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
