const db = require("../models/db.js");
const Events = db.events;
const { Op } = require('sequelize');

// Display list of all events
exports.findAll = (req, res) => {
    Events.findAll()
        .then(data => {
            // convert response data into custom format
            
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};