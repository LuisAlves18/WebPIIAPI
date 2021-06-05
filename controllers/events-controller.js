const db = require("../models/db.js");
const Events = db.events;
const Users = db.users;
const Enrollments = db.enrollments;
const { Op } = require('sequelize');

// Display list of all events
exports.findAll = async (req, res) => {
  //definir as querys strings
    let {type, name, price, closed } = req.query;

//definir a condiçao
    let condition = null;

//verificar se existe a key name nos query params
    if (name) {
        if (condition == null) {
            condition = {
                name: { [Op.like]: `%${name}%` }
            }
        } else {
            condition['name'] = {[Op.like]: `%${name}%`} ;
        }
    }

//verificar se existe a key type nos query params
    if (type) {
        if (condition == null) {
            condition = {
                id_event_type: type
            }
        } else {
            condition["id_event_type"] = type;
        }

    }

//verificar se existe a key price nos query params
    if (price) {
        if (condition == null) {
            if (price == 'free') {
                condition = {
                    price: 0
                }
            } else if (price == 'paid') {
                condition = {
                    price: {[Op.gte]: 1}
                }
            }

        } else {
            if (price == 'free') {
                condition['price'] = 0;
            } else if (price == 'paid') {
                condition['price'] =
                     {[Op.gte]: 1};
            }

        }
    }

//verificar se existe a key closed nos query params
    if (closed) {
      if (condition == null) {
        if (closed == 'true') {
          condition = {
            closed: true
          }
        } else {
          condition = {
            closed: false
          }
        }

      } else {
        if (closed == 'true') {
            condition['closed'] = true;
        } else {
          condition['closed'] = false;
        }

      }
    } else {
      if (condition == null) {
        condition = {
          closed: false
        }
      } else {
        condition['closed'] = false;
      }
    }



    try {
      //obter todos os eventos com a condiçao no caso de ela estar definida
      let events = await Events.findAll({ where: condition})

      //verificar se retorna eventos
      if (events.length == 0) {
        res.status(404).json({
          message: `Could not find any events.`
        });
        return;
      }

      res.status(200).json(events);

    } catch (e) {
      res.status(500).json({
          message:
              err.message || "Some error occurred while retrieving events."
      });
    }



    /*Events.findAll({ where: condition})
        .then(data => {
            //console.log('data', data.length)
            if (data.length == 0) {
                res.status(404).json({
                    message: "Could not find events for that search!"
                });
            } else {
                res.status(200).json(data);
            }

        })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while retrieving events."
            });
        });*/
};

// Handle event create on POST
exports.createEvent = async (req, res) => {
    // verificar se os seguintes dados existem no corpo do pedido
    if (!req.body) {
        res.status(400).json({ message: "Request body can not be empty!" });
        return;
    } else if (!req.body.id_event_type) {
        res.status(400).json({ message: "Event Type must be defined." });
        return;
    } else if (!req.body.name) {
        res.status(400).json({ message: "Event name can not be empty!" });
        return;
    } else if (!req.body.description) {
        res.status(400).json({ message: "Event description can not be empty!" });
        return;
    } else if (!req.body.photo) {
        res.status(400).json({ message: "Event photo can not be empty!" });
        return;
    } else if (!req.body.date_time_event) {
        res.status(400).json({ message: "Event date can not be null!" });
        return;
    } else if (!req.body.date_limit) {
        res.status(400).json({ message: "Event date limit can not be null!" });
        return;
    }




    try {
      //procurar um evento com o nome definido no corpo do pedido
        let findEventByName = await Events.findOne({ where: {name : req.body.name}});

        //no caso de existir nao deixa criar
        if (findEventByName != null) {
          res.status(400).json({
            message: "Event " + req.body.name + " already exists!"
          });
          return;
        }

        //no caso de nao existir, cria o novo evento
        let events = await Events.create(req.body);

        res.status(201).json({
          message: "New event created.",
          location: "/events/" + events.id});
    } catch (e) {
      if (e.name === 'SequelizeValidationError') {
        res.status(400).json({
          message: e.errors[0].message
        });
      }
      else {
        res.status(500).json({
          message: e.message || "Some error ocurred while creating event."
        });
      }
    }

    // Save Event in the database
    /*Events.create(req.body)
        .then(data => {
            res.status(201).json({ message: "New event created.", location: "/events/" + data.id });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the event."
                });
        });*/
};

// Remove one event
exports.deleteEvent = async (req, res) => {

    try {
      //remover um evento atraves do id passado como parametro
      let event = await Events.destroy({ where: {id: req.params.eventID}})

      //verificar se eliminou algum evento
      if (event == 1) {
        res.status(200).json({
            message: `Event with id ${req.params.eventID} was successfully deleted!`
        });
      } else {
        res.status(404).json({
            message: `Not found event with id=${req.params.eventID}.`
        });
      }

    } catch (e) {
      res.status(500).json({
          message: e.message ||  `Error deleting event with id=${req.params.eventID}.`
      });
    }

    /*Events.destroy({ where: { id: req.params.eventID } })
        .then(num => {
            if (num == 1) {
                res.status(200).json({
                    message: `Event with id ${req.params.eventID} was successfully deleted!`
                });
            } else {
                res.status(404).json({
                    message: `Not found event with id=${req.params.eventID}.`
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Error deleting event with id=${req.params.eventID}.`
            });
        });*/
};

// List just one event
exports.findOneEvent = async (req, res) => {
    // obtains only a single entry from the table, using the provided primary key

    try {
      //procurar um evento atraves do id enviado como parametro
      let event = await Events.findByPk(req.params.eventID);

      //verificar se encontrou o evento procurado
      if (event == null) {
        res.status(404).json({
          message: `Not found event with id ${req.params.eventID}.`
        });
        return;
      }

      res.status(200).json(event);
    } catch (e) {
      res.status(500).json({
          message: e.message || `Error retrieving event with id ${req.params.eventID}.`
      });
    }



    /*Events.findByPk(req.params.eventID)
        .then(data => {
            console.log('data',data)
            if (data === null)
                res.status(404).json({
                    message: `Not found event with id ${req.params.eventID}.`
                });
            else
                res.json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving event with id ${req.params.eventID}.`
            });
        });*/
};

// Update One Event
exports.updateOneEvent = async (req, res) => {
    // verificar se os seguintes dados existem no corpo do pedido
    if (!req.body) {
        res.status(400).json({ message: "Request body can not be empty!" });
        return;
    } else if (!req.body.id_event_type) {
        res.status(400).json({ message: "Event Type must be defined." });
        return;
    } else if (!req.body.name) {
        res.status(400).json({ message: "Event name can not be empty!" });
        return;
    } else if (!req.body.description) {
        res.status(400).json({ message: "Event description can not be empty!" });
        return;
    } else if (!req.body.photo) {
        res.status(400).json({ message: "Event photo can not be empty!" });
        return;
    } else if (!req.body.date_time_event) {
        res.status(400).json({ message: "Event date can not be null!" });
        return;
    } else if (!req.body.date_limit) {
        res.status(400).json({ message: "Event date limit can not be null!" });
        return;
    }

    try {
      //procurar o evento pelo id definido nos parametros
      let event = await Events.findByPk(req.params.eventID);

      //verificar se encontrou o evento pretendido
      if (event == null) {
        res.status(404).json({
            message: `Not found Event with id ${req.params.eventID}.`
        });
        return;
      }

      //no caso de encontrar, atualiza o evento
      let updateEvent = await Events.update(req.body, {where: {id: req.params.eventID}});

      //verificar se o update foi bem sucedido
      if (updateEvent == 1) {
        res.status(200).json({
            message: `Event id=${req.params.eventID} was updated successfully.`
        });
      } else {
        res.status(400).json({
            message: `No updates were made on Event id=${req.params.eventID}.`
        });
      }
    } catch (e) {
      res.status(500).json({
          message: e.message ||  `Error updating Event with id=${req.params.eventID}.`
      });
    }



    /*
    Events.findByPk(req.params.eventID)
        .then(event => {
            // no data returned means there is no event in DB with that given ID
            if (event === null)
                res.status(404).json({
                    message: `Not found Event with id ${req.params.eventID}.`
                });
            else {
                Events.update(req.body, { where: { id: req.params.eventID } })
                    .then(num => {
                        // check if one comment was updated (returns 0 if no data was updated)
                        if (num == 1) {
                            res.status(200).json({
                                message: `Event id=${req.params.eventID} was updated successfully.`
                            });
                        } else {
                            res.status(200).json({
                                message: `No updates were made on Event id=${req.params.eventID}.`
                            });
                        }
                    })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Error updating Event with id=${req.params.eventID}.`
            });
        });
        */
};

exports.getEventEnrollments = async (req, res) => {
    try {
        let event = await Events.findByPk(req.params.eventID);

        if (event == null) {
            res.status(404).json({
                message: `Event id ${req.params.eventID} not found!`
            });
            return;
        }

        let eventEnrollments = await Enrollments.findAll({where: {eventId: req.params.eventID},include: [{ model: Users}, {model: Events}] });

        if (eventEnrollments == null) {
            res.status(404).json({
                message: `Event id ${req.params.eventID} doesn't have any enrollments!`
            });
            return;
        }

        let enrollment_status = '';
        if (eventEnrollments.enrolled == true) {
            enrollment_status = 'Inscrito'
        } else {
            enrollment_status = 'Pendente'
        }

        return res.status(200).json(eventEnrollments);
    } catch (error) {
        res.status(500).json({
            message: error.message || `Error retrieving all enrollments for event with id ${req.params.eventID}.`
        });
    }
}


exports.enrollUser = async (req, res) => {
    try {

        /* if (!req.body) {
            res.status(400).json({ message: "Request body can not be empty!" });
            return;
        } else if (!req.body.enrolled) {
            res.status(400).json({ message: "Enrolled status must be defined." });
            return;
        }  */



        /* console.log('logged',req.loggedUserId); */
        let user = await Users.findByPk(req.loggedUserId);

        if (user == null) {
            res.status(404).json({
                message: 'User not found!'
            });
            return;
        }

        let event = await Events.findByPk(req.params.eventID);

        if (event == null) {
            res.status(404).json({
                message: 'Event not found!'
            });
            return;
        }

        let enrollment = await Enrollments.findOne({where: {eventId: req.params.eventID, userId: req.loggedUserId}});

        if (enrollment != null) {
            res.status(400).json({
                message: `User with id ${req.loggedUserId} already enrolled to event with id ${req.params.eventID}`
            });
            return;
        } else {

            if (event.price == 0) {
                let enroll = await Enrollments.create({
                    userId: req.loggedUserId,
                    eventId: req.params.eventID,
                    enrolled: true
                });

                res.status(201).json({
                    message: `User with id ${req.loggedUserId} enrolled sucessfully to event with id ${req.params.eventID}`
                });
                return;
            } else {
                let enroll = await Enrollments.create({
                    userId: req.loggedUserId,
                    eventId: req.params.eventID,
                    enrolled: false
                });

                res.status(201).json({
                    message: `Waiting for payment for event with id ${req.params.eventID} to enroll user with id ${req.loggedUserId}`
                });
                return;
            }

            
        }
    } catch (error) {
        res.status(500).json({
            message: error.message || `Error enrolling user to event with id ${req.params.eventID}.`
        });
    }
}