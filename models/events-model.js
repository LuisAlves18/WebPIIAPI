const sql = require("./db.js"); // get DB connection
// define TUTORIAL model constructor
const Tutorial = function(tutorial) {
    this.title = tutorial.email;
    this.description = tutorial.description;
    this.published = tutorial.published;
};
// define method getAll to handle getting all Tutorials from DB
// result = "(error, data)", meaning it will return either an error message or some sort of data
/* Tutorial.getAll = (title, result) => {

    let queryStr = "SELECT * FROM tutorials";

    if(title) {
        queryStr += "WHERE title LIKE ?"
    }

    sql.query(queryStr, [`%${title}%`] ,(err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res); // the result will be sent to the CONTROLLER
    });
}; */

/* Tutorial.findById = (id, result) => {
    sql.query("SELECT * FROM tutorials WHERE id = ?", [id], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result({kind: "not_found"}, null); // the result will be sent to the CONTROLLER
    });
} */


/* Tutorial.removeByID = (id, result) => {
    sql.query("DELETE FROM tutorials WHERE id = ?", [id], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.affectedRows == 1) {
            result(null, res);
            return;
        }
        result({kind: "not_found"}, null); // the result will be sent to the CONTROLLER
    });
} */
/* 
Tutorial.create = (tutorial, result) => {
    
    sql.query("INSERT INTO tutorials SET ?", tutorial, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        
        result( null, {message: "New tutorial created." , location: "/tutorials/" + res.insertedId}); // the result will be sent to the CONTROLLER
    });
} */
/* 
Tutorial.update = (tutorial, id, result) => {
    
    sql.query("UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?", [tutorial.title,tutorial.description,tutorial.published,id], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.affectedRows == 1) {
            result(null, res);
            return;
        }
        
        result( {kind: "not_found"}, null); // the result will be sent to the CONTROLLER
    });
} */

/* Tutorial.published = (publishedTutorials, result) => {
    
    sql.query("SELECT * FROM tutorials WHERE published = ?", [publishedTutorials], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res);
            return;
        }
        result(null, res); // the result will be sent to the CONTROLLER
    });
} */



Tutorial 
// EXPORT MODEL (required by CONTROLLER)
module.exports = Tutorial;