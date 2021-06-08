const db = require('../models/db.js');
const Areas = db.areas;

exports.getAreas = async (req, res) => {
    try {
        let areas = await Areas.findAll();
        res.status(200).json(areas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}