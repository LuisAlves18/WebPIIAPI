const express = require('express');
const authController = require("../controllers/auth-controller.js");

let router = express.Router();

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers","x-access-token, Origin, Content-Type, Accept");
    next()
})

router.route('/signup')
    .post(authController.signup);

router.route('/login')
    .post(authController.signin)

router.all('*', function (req, res) {
    res.status(404).json({ message: 'AUTHENTICATION: what???'});
    
})

module.exports = router;