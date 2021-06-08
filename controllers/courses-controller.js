const db = require('../models/db.js');
const Courses = db.courses;

exports.getCourses = async (req, res) => {
    try {
        let courses = await Courses.findAll();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}