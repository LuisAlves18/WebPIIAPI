const express = require('express');
let router = express.Router();
const tutorialController = require('../controllers/events-controller.js');
// middleware for all routes related with tutorials
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})
/* router.get('/', tutorialController.findAll);

router.get('/published', tutorialController.published);

router.get('/:tutorialID', tutorialController.findOne);

router.delete('/:tutorialID', tutorialController.delete);

router.post('/', tutorialController.create);

router.put('/:tutorialID', tutorialController.update); */



//send a predefined error message for invalid routes on TUTORIALS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'EVENTS: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;
