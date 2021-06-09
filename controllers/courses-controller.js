const db = require('../models/db.js');
const { Op } = require("sequelize");
const Courses = db.courses;

exports.getCourses = async (req, res) => {
    try {
        let courses = await Courses.findAll({where: {
            description : {[Op.ne] : 'admin'}
        }});
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}