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

router.post('/exercises', requireToken, (req, res, next) => {
  req.body.exercise.owner = req.user.id
  Exercise.create(req.body.exercise)
    .then(workoutTemplate => {
      res.status(201).json({ workoutTemplate: workoutTemplate.toObject() })
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
    .then(() => {
      WorkoutTemplate.findById(req.body.id)
        .populate('exercises')
        .then(handle404)
        .then(workoutTemplate => res.status(200).json({ workoutTemplate: workoutTemplate.toObject() }))
        .catch(next)
    })
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
