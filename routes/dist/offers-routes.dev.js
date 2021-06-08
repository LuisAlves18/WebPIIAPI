"use strict";

var express = require('express');

var router = express.Router();

var offersController = require('../controllers/offers-controller.js');

var authController = require('../controllers/auth-controller.js');

var _require = require('../models/db.js'),
    offers = _require.offers; // middleware for all routes related with offers


router.use(function (req, res, next) {
  var start = Date.now();
  res.on("finish", function () {
    //finish event is emitted once the response is sent to the client
    var diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed

    console.log("".concat(req.method, " ").concat(req.originalUrl, " completed in ").concat(diffSeconds, " seconds"));
  });
  next();
});
router.route('/').get(authController.verifyToken, offersController.findAll).post(authController.verifyToken, authController.isAdmin, offersController.createOffer);
router.route('/:offerID([0-9]*$)').get(authController.verifyToken, offersController.findOne).put(authController.verifyToken, authController.isAdmin, offersController.updateOne)["delete"](authController.verifyToken, authController.isAdmin, offersController.deleteOne); //send a predefined error message for invalid routes on OFFERS

router.all('*', function (req, res) {
  res.status(404).json({
    message: 'OFFERS: what???'
  });
}); // EXPORT ROUTES (required by APP)

module.exports = router;