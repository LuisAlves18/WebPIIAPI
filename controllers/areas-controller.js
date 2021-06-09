const db = require('../models/db.js');
const { Op } = require("sequelize");
const Areas = db.areas;

exports.getAreas = async (req, res) => {
    try {
        let areas = await Areas.findAll({where: {
            description : {[Op.ne] : 'admin'}
        }});
        res.status(200).json(areas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}