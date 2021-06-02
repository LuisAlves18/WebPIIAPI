const express = require('express');
let router = express.Router();
const usersController = require('../controllers/users-controller.js');
const authController = require('../controllers/auth-controller.js');
const { users } = require('../models/db.js');
// middleware for all routes related with offers
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(authController.verifyToken,authController.isAdmin,usersController.getAllUsers)

router.route('/:userID')
    .put(authController.verifyToken,authController.isAdminOrLoggedUser,usersController.updateUser)
    .get(authController.verifyToken, authController.isAdminOrLoggedUser, usersController.getOneUser)
    .delete(authController.verifyToken, authController.isAdmin, usersController.removeUser)



//send a predefined error message for invalid routes on OFFERS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'USERS: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;
