// get resource model (definition and DB operations)
const Tutorial = require('../models/events-model.js');
// EXPORT function to display list of all tutorials (required by ROUTER)
/* exports.findAll = (req, res) => {

    if (Object.keys(req.query).length) {
        if(!req.query.title) {
            res.status(400).json({message: "Tutorials can only be filtered by title"})
            return;
        }
    }

    Tutorial.getAll(req.query.title, (err, data) => {
        if (err) // send error response 
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        else
            res.status(200).json(data); // send OK response with all tutorials data
    });
}; */

/* exports.findOne = (req, res) => {
    Tutorial.findById(req.params.tutorialID, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).json({
                    message: `Not found Tutorial with id ${req.params.tutorialID}.`
                })
            } else {
                res.status(500).json({
                    message: `Error retrieving Tutorial with id ${req.params.tutorialID}.`
                })
            }
        } else {
            res.status(200).json(data);
        }
    });
}; */
/* 
exports.delete = (req, res) => {
    Tutorial.removeByID(req.params.tutorialID, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(404).json({
                    message: `Not found Tutorial with id ${req.params.tutorialID}.`
                })
            } else {
                res.status(500).json({
                    message: `Error retrieving Tutorial with id ${req.params.tutorialID}.`
                })
            }
        } else {
            res.status(200).json({
                message: `Tutorial with id ${req.params.tutorialID} removed sucessfully.`
            });
        }
    });
};
 */
/* exports.create = (req, res) => {
    if (!req.body || !req.body.title) {
        res.status(400).json({ message: 'Title can not be empty' });
        return;
    }

    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    };
    Tutorial.create(tutorial, (err, data) => {

        if (err) {

            res.status(500).json({
                message: `Error retrieving Tutorial with id ${req.params.tutorialID}.`
            });
        } else {
            res.status(200).json(data);
        }
    });
}; */

/* exports.update = (req, res) => {
    if (!req.body || !req.body.title) {
        res.status(400).json({ message: 'Title can not be empty' });
        return;
    }

    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    };
    Tutorial.update(tutorial, req.params.tutorialID, (err, data) => {

        if (err) {
            if (err.kind == "not_found") {
                res.status(404).json({
                    message: `Not found Tutorial with id ${req.params.tutorialID}.`
                })
            } else {
                res.status(500).json({
                    message: `Error retrieving Tutorial with id ${req.params.tutorialID}.`
                })
            }
        } else {
            res.status(200).json({message: `Tutorial with id ${req.params.tutorialID} updated sucessfully.`});
        }
    });
}; */

/* exports.published = (req, res) => {
    const publishedTutorials = 1;
    Tutorial.published(publishedTutorials, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        } else {
            res.status(200).json(data);
        }
    });
};
 */