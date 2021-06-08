const db = require('../models/db.js');
const Status = db.status;

exports.getStatus = async (req, res) => {
    try {
        let usersStatus = await Status.findAll();
        res.status(200).json(usersStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}