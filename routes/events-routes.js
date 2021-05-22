const express = require('express');
let router = express.Router();
const eventsController = require('../controllers/events-controller.js');
const { events } = require('../models/db.js');
// middleware for all routes related with events
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(eventsController.findAll)
    .post(eventsController.createEvent)

/*router.route('/notClosed')
    .get(eventsController.findNotClosed)
*/
router.route('/:eventID([0-9]*$)')
    .delete(eventsController.deleteEvent)
    .get(eventsController.findOneEvent)
    .put(eventsController.updateOneEvent)

//send a predefined error message for invalid routes on EVENTS
router.all('*', function (req, res) {
    res.status(404).json({ message: 'EVENTS: what???' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;
