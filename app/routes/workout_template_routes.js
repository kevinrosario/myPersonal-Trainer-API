const express = require('express')
const passport = require('passport')
const WorkoutTemplate = require('../models/workoutTemplate')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// INDEX
// GET /workout-templates
router.get('/workout-templates', requireToken, (req, res, next) => {
  WorkoutTemplate.find()
    .then(workoutTemplates => {
      // `workoutTemplates` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return workoutTemplates.map(workoutTemplate => workoutTemplate.toObject())
    })
    // respond with status 200 and JSON of the workoutTemplates
    .then(workoutTemplates => res.status(200).json({ workoutTemplates: workoutTemplates }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /workout-templates/
router.get('/workout-templates/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  WorkoutTemplate.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "workoutTemplate" JSON
    .then(workoutTemplate => res.status(200).json({ workoutTemplate: workoutTemplate.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /workout-templates
router.post('/workout-templates', requireToken, (req, res, next) => {
  // set owner of new workoutTemplate to be current user
  req.body.workoutTemplate.owner = req.user.id

  WorkoutTemplate.create(req.body.workoutTemplate)
    // respond to succesful `create` with status 201 and JSON of new "workoutTemplate"
    .then(workoutTemplate => {
      res.status(201).json({ workoutTemplate: workoutTemplate.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /workout-templates
router.patch('/workout-templates/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.workoutTemplate.owner

  WorkoutTemplate.findById(req.params.id)
    .then(handle404)
    .then(workoutTemplate => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, workoutTemplate)

      // pass the result of Mongoose's `.update` to the next `.then`
      return workoutTemplate.update(req.body.workoutTemplate)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /workout-templates
router.delete('/workout-templates/:id', requireToken, (req, res, next) => {
  WorkoutTemplate.findById(req.params.id)
    .then(handle404)
    .then(workoutTemplate => {
      // throw an error if current user doesn't own `workoutTemplate`
      requireOwnership(req, workoutTemplate)
      // delete the workoutTemplate ONLY IF the above didn't throw
      workoutTemplate.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
