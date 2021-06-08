"use strict";

var express = require('express');

var router = express.Router();

var eventsController = require('../controllers/events-controller.js');

var authController = require('../controllers/auth-controller.js');

var _require = require('../models/db.js'),
    events = _require.events; // middleware for all routes related with events


router.use(function (req, res, next) {
  var start = Date.now();
  res.on("finish", function () {
    //finish event is emitted once the response is sent to the client
    var diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed

    console.log("".concat(req.method, " ").concat(req.originalUrl, " completed in ").concat(diffSeconds, " seconds"));
  });
  next();
});
router.route('/').get(eventsController.findAll).post(authController.verifyToken, authController.isAdmin, eventsController.createEvent);
router.route('/:eventID/enrollments').post(authController.verifyToken, authController.isLoggedUser, eventsController.enrollUser).get(authController.verifyToken, authController.isAdmin, eventsController.getEventEnrollments)["delete"](authController.verifyToken, authController.isLoggedUser, eventsController.cancelEnrollment).put(authController.verifyToken, authController.isLoggedUser, eventsController.payEnrollment);
router.route('/:eventID([0-9]*$)')["delete"](authController.verifyToken, authController.isAdmin, eventsController.deleteEvent).get(authController.verifyLoginUser, eventsController.findOneEvent).put(authController.verifyToken, authController.isAdmin, eventsController.updateOneEvent); //send a predefined error message for invalid routes on EVENTS

router.all('*', function (req, res) {
  res.status(404).json({
    message: 'EVENTS: what???'
  });
}); // EXPORT ROUTES (required by APP)

module.exports = router;