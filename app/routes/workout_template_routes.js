const express = require('express')
const passport = require('passport')
const WorkoutTemplate = require('../models/workoutTemplate')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

router.get('/workout-templates', (req, res, next) => {
  WorkoutTemplate.find()
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
  req.body.workoutTemplate.owner = req.user.id

  WorkoutTemplate.create(req.body.workoutTemplate)
    .then(workoutTemplate => {
      res.status(201).json({ workoutTemplate: workoutTemplate.toObject() })
    })
    .catch(next)
})

router.patch('/workout-templates/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.workoutTemplate.owner

  WorkoutTemplate.findById(req.params.id)
    .then(handle404)
    .then(workoutTemplate => {
      requireOwnership(req, workoutTemplate)
      return workoutTemplate.update(req.body.workoutTemplate)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
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
