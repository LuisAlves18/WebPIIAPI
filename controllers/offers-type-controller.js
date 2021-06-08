const db = require("../models/db.js");
const Events = db.events;
const OffersType = db.offers_type;
const { Op } = require('sequelize');


exports.getAllOffersType = async (req, res) => {
    try {
        let offersType = await OffersType.findAll();
        res.status(200).json(offersType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
