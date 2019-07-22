const express = require('express')
const passport = require('passport')
const StartedWorkout = require('../models/startedWorkout')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// INDEX
// GET /workouts-started
router.get('/workouts-started', requireToken, (req, res, next) => {
  StartedWorkout.find()
    .then(startedWorkouts => {
      // `startedWorkouts` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return startedWorkouts.map(startedWorkout => startedWorkout.toObject())
    })
    // respond with status 200 and JSON of the startedWorkouts
    .then(startedWorkouts => res.status(200).json({ startedWorkouts: startedWorkouts }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /workouts-started/
router.get('/workouts-started/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  StartedWorkout.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "startedWorkout" JSON
    .then(startedWorkout => res.status(200).json({ startedWorkout: startedWorkout.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /workouts-started
router.post('/workouts-started', requireToken, (req, res, next) => {
  // set owner of new startedWorkout to be current user
  req.body.startedWorkout.owner = req.user.id

  StartedWorkout.create(req.body.startedWorkout)
    // respond to succesful `create` with status 201 and JSON of new "startedWorkout"
    .then(startedWorkout => {
      res.status(201).json({ startedWorkout: startedWorkout.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /workouts-started
router.patch('/workouts-started/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.startedWorkout.owner

  StartedWorkout.findById(req.params.id)
    .then(handle404)
    .then(startedWorkout => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, startedWorkout)

      // pass the result of Mongoose's `.update` to the next `.then`
      return startedWorkout.update(req.body.startedWorkout)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /workouts-started
router.delete('/workouts-started/:id', requireToken, (req, res, next) => {
  StartedWorkout.findById(req.params.id)
    .then(handle404)
    .then(startedWorkout => {
      // throw an error if current user doesn't own `startedWorkout`
      requireOwnership(req, startedWorkout)
      // delete the startedWorkout ONLY IF the above didn't throw
      startedWorkout.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
