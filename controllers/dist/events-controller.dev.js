"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var db = require("../models/db.js");

var Events = db.events;
var Users = db.users;
var Enrollments = db.enrollments;
var Receipts = db.receipts;

var _require = require('sequelize'),
    Op = _require.Op;

var areasModel = require("../models/areas-model.js");

var _require2 = require("./users-controller.js"),
    updateUser = _require2.updateUser; // Display list of all events


exports.findAll = function _callee(req, res) {
  var _req$query, type, name, price, closed, condition, events;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //definir as querys strings
          _req$query = req.query, type = _req$query.type, name = _req$query.name, price = _req$query.price, closed = _req$query.closed; //definir a condiçao

          condition = null; //verificar se existe a key name nos query params

          if (name) {
            if (condition == null) {
              condition = {
                name: _defineProperty({}, Op.like, "%".concat(name, "%"))
              };
            } else {
              condition['name'] = _defineProperty({}, Op.like, "%".concat(name, "%"));
            }
          } //verificar se existe a key type nos query params


          if (type) {
            if (condition == null) {
              condition = {
                id_event_type: type
              };
            } else {
              condition["id_event_type"] = type;
            }
          } //verificar se existe a key price nos query params


          if (price) {
            if (condition == null) {
              if (price == 'free') {
                condition = {
                  price: 0
                };
              } else if (price == 'paid') {
                condition = {
                  price: _defineProperty({}, Op.gte, 1)
                };
              }
            } else {
              if (price == 'free') {
                condition['price'] = 0;
              } else if (price == 'paid') {
                condition['price'] = _defineProperty({}, Op.gte, 1);
              }
            }
          } //verificar se existe a key closed nos query params


          if (closed) {
            if (condition == null) {
              if (closed == 'true') {
                condition = {
                  closed: true
                };
              } else {
                condition = {
                  closed: false
                };
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
              };
            } else {
              condition['closed'] = false;
            }
          }

          _context.prev = 6;
          _context.next = 9;
          return regeneratorRuntime.awrap(Events.findAll({
            where: condition
          }));

        case 9:
          events = _context.sent;

          if (!(events.length == 0)) {
            _context.next = 13;
            break;
          }

          res.status(404).json({
            message: "Could not find any events."
          });
          return _context.abrupt("return");

        case 13:
          res.status(200).json(events);
          _context.next = 19;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](6);
          res.status(500).json({
            message: err.message || "Some error occurred while retrieving events."
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 16]]);
}; // Handle event create on POST


exports.createEvent = function _callee2(req, res) {
  var findEventByName, events;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (req.body) {
            _context2.next = 5;
            break;
          }

          res.status(400).json({
            message: "Request body can not be empty!"
          });
          return _context2.abrupt("return");

        case 5:
          if (req.body.id_event_type) {
            _context2.next = 10;
            break;
          }

          res.status(400).json({
            message: "Event Type must be defined."
          });
          return _context2.abrupt("return");

        case 10:
          if (req.body.name) {
            _context2.next = 15;
            break;
          }

          res.status(400).json({
            message: "Event name can not be empty!"
          });
          return _context2.abrupt("return");

        case 15:
          if (req.body.description) {
            _context2.next = 20;
            break;
          }

          res.status(400).json({
            message: "Event description can not be empty!"
          });
          return _context2.abrupt("return");

        case 20:
          if (req.body.photo) {
            _context2.next = 25;
            break;
          }

          res.status(400).json({
            message: "Event photo can not be empty!"
          });
          return _context2.abrupt("return");

        case 25:
          if (req.body.date) {
            _context2.next = 30;
            break;
          }

          res.status(400).json({
            message: "Event date can not be null!"
          });
          return _context2.abrupt("return");

        case 30:
          if (req.body.date_limit) {
            _context2.next = 35;
            break;
          }

          res.status(400).json({
            message: "Event date limit can not be null!"
          });
          return _context2.abrupt("return");

        case 35:
          if (req.body.time) {
            _context2.next = 38;
            break;
          }

          res.status(400).json({
            message: "Event time can not be null!"
          });
          return _context2.abrupt("return");

        case 38:
          _context2.prev = 38;
          _context2.next = 41;
          return regeneratorRuntime.awrap(Events.findOne({
            where: {
              name: req.body.name
            }
          }));

        case 41:
          findEventByName = _context2.sent;

          if (!(findEventByName != null)) {
            _context2.next = 45;
            break;
          }

          res.status(400).json({
            message: "Event " + req.body.name + " already exists!"
          });
          return _context2.abrupt("return");

        case 45:
          _context2.next = 47;
          return regeneratorRuntime.awrap(Events.create({
            id_event_type: req.body.id_event_type,
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            photo: req.body.photo,
            date_time_event: req.body.date + " " + req.body.time,
            date_limit: req.body.date_limit,
            link: req.body.link,
            address: req.body.address,
            nrLimit: req.body.nrLimit,
            closed: false
          }));

        case 47:
          events = _context2.sent;
          res.status(201).json({
            message: "New event created.",
            location: "/events/" + events.id
          });
          _context2.next = 54;
          break;

        case 51:
          _context2.prev = 51;
          _context2.t0 = _context2["catch"](38);

          if (_context2.t0.name === 'SequelizeValidationError') {
            res.status(400).json({
              message: _context2.t0.errors[0].message
            });
          } else {
            res.status(500).json({
              message: _context2.t0.message || "Some error ocurred while creating event."
            });
          }

        case 54:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[38, 51]]);
}; // Remove one event


exports.deleteEvent = function _callee3(req, res) {
  var removeEnrollments, event;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Enrollments.destroy({
            where: {
              eventId: req.params.eventID
            }
          }));

        case 3:
          removeEnrollments = _context3.sent;
          _context3.next = 6;
          return regeneratorRuntime.awrap(Events.destroy({
            where: {
              id: req.params.eventID
            }
          }));

        case 6:
          event = _context3.sent;

          //verificar se eliminou algum evento
          if (event == 1 && removeEnrollments > 0) {
            res.status(200).json({
              message: "Event with id ".concat(req.params.eventID, " was successfully deleted!")
            });
          } else {
            res.status(404).json({
              message: "Not found event with id=".concat(req.params.eventID, ".")
            });
          }

          _context3.next = 13;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: _context3.t0.message || "Error deleting event with id=".concat(req.params.eventID, ".")
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // List just one event


exports.findOneEvent = function _callee4(req, res) {
  var event, user, _event, _event2;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;

          if (!(req.loggedUserId == null)) {
            _context4.next = 11;
            break;
          }

          _context4.next = 4;
          return regeneratorRuntime.awrap(Events.findByPk(req.params.eventID));

        case 4:
          event = _context4.sent;

          if (!(event == null)) {
            _context4.next = 8;
            break;
          }

          res.status(404).json({
            message: "Not found event with id ".concat(req.params.eventID, ".")
          });
          return _context4.abrupt("return");

        case 8:
          res.status(200).json(event);
          _context4.next = 27;
          break;

        case 11:
          _context4.next = 13;
          return regeneratorRuntime.awrap(Users.findByPk(req.loggedUserId));

        case 13:
          user = _context4.sent;

          if (!(user == null)) {
            _context4.next = 17;
            break;
          }

          res.status(404).json({
            message: "Not found user with id ".concat(req.loggedUserId, ".")
          });
          return _context4.abrupt("return");

        case 17:
          _context4.next = 19;
          return regeneratorRuntime.awrap(Events.findByPk(req.params.eventID, {
            include: {
              model: Enrollments,
              where: {
                userId: user.id
              },
              include: {
                model: Users
              }
            }
          }));

        case 19:
          _event = _context4.sent;

          if (!(_event == null)) {
            _context4.next = 26;
            break;
          }

          _context4.next = 23;
          return regeneratorRuntime.awrap(Events.findByPk(req.params.eventID));

        case 23:
          _event2 = _context4.sent;
          res.status(200).json({
            message: 'logged',
            event: _event2
          });
          return _context4.abrupt("return");

        case 26:
          res.status(200).json({
            message: 'enrolled',
            event: _event
          });

        case 27:
          _context4.next = 32;
          break;

        case 29:
          _context4.prev = 29;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: _context4.t0.message || "Error retrieving event with id ".concat(req.params.eventID, ".")
          });

        case 32:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 29]]);
}; // Update One Event


exports.updateOneEvent = function _callee5(req, res) {
  var event, updateEvent;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (req.body) {
            _context5.next = 5;
            break;
          }

          res.status(400).json({
            message: "Request body can not be empty!"
          });
          return _context5.abrupt("return");

        case 5:
          if (req.body.id_event_type) {
            _context5.next = 10;
            break;
          }

          res.status(400).json({
            message: "Event Type must be defined."
          });
          return _context5.abrupt("return");

        case 10:
          if (req.body.name) {
            _context5.next = 15;
            break;
          }

          res.status(400).json({
            message: "Event name can not be empty!"
          });
          return _context5.abrupt("return");

        case 15:
          if (req.body.description) {
            _context5.next = 20;
            break;
          }

          res.status(400).json({
            message: "Event description can not be empty!"
          });
          return _context5.abrupt("return");

        case 20:
          if (req.body.photo) {
            _context5.next = 25;
            break;
          }

          res.status(400).json({
            message: "Event photo can not be empty!"
          });
          return _context5.abrupt("return");

        case 25:
          if (req.body.date_time_event) {
            _context5.next = 30;
            break;
          }

          res.status(400).json({
            message: "Event date can not be null!"
          });
          return _context5.abrupt("return");

        case 30:
          if (req.body.date_limit) {
            _context5.next = 33;
            break;
          }

          res.status(400).json({
            message: "Event date limit can not be null!"
          });
          return _context5.abrupt("return");

        case 33:
          _context5.prev = 33;
          _context5.next = 36;
          return regeneratorRuntime.awrap(Events.findByPk(req.params.eventID));

        case 36:
          event = _context5.sent;

          if (!(event == null)) {
            _context5.next = 40;
            break;
          }

          res.status(404).json({
            message: "Not found Event with id ".concat(req.params.eventID, ".")
          });
          return _context5.abrupt("return");

        case 40:
          _context5.next = 42;
          return regeneratorRuntime.awrap(Events.update(req.body, {
            where: {
              id: req.params.eventID
            }
          }));

        case 42:
          updateEvent = _context5.sent;

          //verificar se o update foi bem sucedido
          if (updateEvent == 1) {
            res.status(200).json({
              message: "Event id=".concat(req.params.eventID, " was updated successfully.")
            });
          } else {
            res.status(400).json({
              message: "No updates were made on Event id=".concat(req.params.eventID, ".")
            });
          }

          _context5.next = 49;
          break;

        case 46:
          _context5.prev = 46;
          _context5.t0 = _context5["catch"](33);
          res.status(500).json({
            message: _context5.t0.message || "Error updating Event with id=".concat(req.params.eventID, ".")
          });

        case 49:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[33, 46]]);
}; // Obter todas as inscrições de um evento


exports.getEventEnrollments = function _callee6(req, res) {
  var event, eventEnrollments;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Events.findByPk(req.params.eventID));

        case 3:
          event = _context6.sent;

          if (!(event == null)) {
            _context6.next = 7;
            break;
          }

          res.status(404).json({
            message: "Event id ".concat(req.params.eventID, " not found!")
          });
          return _context6.abrupt("return");

        case 7:
          _context6.next = 9;
          return regeneratorRuntime.awrap(Enrollments.findAll({
            where: {
              eventId: req.params.eventID
            },
            include: [{
              model: Users
            }, {
              model: Events
            }]
          }));

        case 9:
          eventEnrollments = _context6.sent;

          if (!(eventEnrollments == null)) {
            _context6.next = 13;
            break;
          }

          res.status(404).json({
            message: "Event id ".concat(req.params.eventID, " doesn't have any enrollments!")
          });
          return _context6.abrupt("return");

        case 13:
          return _context6.abrupt("return", res.status(200).json(eventEnrollments));

        case 16:
          _context6.prev = 16;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            message: _context6.t0.message || "Error retrieving all enrollments for event with id ".concat(req.params.eventID, ".")
          });

        case 19:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 16]]);
}; // Inscrever num evento


exports.enrollUser = function _callee7(req, res) {
  var user, event, currentDate, limitEventDate, enrollment, enroll, limitPersons, eventUpdate, updateEventLimitPersons, _eventUpdate, _updateEventLimitPersons, _enroll;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(Users.findByPk(req.loggedUserId));

        case 3:
          user = _context7.sent;

          if (!(user == null)) {
            _context7.next = 7;
            break;
          }

          res.status(404).json({
            message: 'User not found!'
          });
          return _context7.abrupt("return");

        case 7:
          _context7.next = 9;
          return regeneratorRuntime.awrap(Events.findByPk(req.params.eventID));

        case 9:
          event = _context7.sent;

          if (!(event == null)) {
            _context7.next = 13;
            break;
          }

          res.status(404).json({
            message: 'Event not found!'
          });
          return _context7.abrupt("return");

        case 13:
          //fazer a verificação da data limite de inscrição
          currentDate = new Date();
          limitEventDate = new Date(event.date_limit);

          if (!(currentDate > limitEventDate)) {
            _context7.next = 18;
            break;
          }

          res.status(400).json({
            message: "Event ".concat(req.params.eventID, " already closed enrollments.")
          });
          return _context7.abrupt("return");

        case 18:
          _context7.next = 20;
          return regeneratorRuntime.awrap(Enrollments.findOne({
            where: {
              eventId: req.params.eventID,
              userId: req.loggedUserId
            }
          }));

        case 20:
          enrollment = _context7.sent;

          if (!(enrollment != null)) {
            _context7.next = 26;
            break;
          }

          res.status(400).json({
            message: "User with id ".concat(req.loggedUserId, " already enrolled to event with id ").concat(req.params.eventID)
          });
          return _context7.abrupt("return");

        case 26:
          if (!(event.price == 0)) {
            _context7.next = 53;
            break;
          }

          if (!(event.nrLimit > 0)) {
            _context7.next = 49;
            break;
          }

          _context7.next = 30;
          return regeneratorRuntime.awrap(Enrollments.create({
            userId: req.loggedUserId,
            eventId: req.params.eventID,
            enrolled: true
          }));

        case 30:
          enroll = _context7.sent;
          limitPersons = event.nrLimit - 1;

          if (!(limitPersons > 0)) {
            _context7.next = 41;
            break;
          }

          eventUpdate = {
            nrLimit: limitPersons
          };
          _context7.next = 36;
          return regeneratorRuntime.awrap(Events.update(eventUpdate, {
            where: {
              id: req.params.eventID
            }
          }));

        case 36:
          updateEventLimitPersons = _context7.sent;
          res.status(201).json({
            message: "User with id ".concat(req.loggedUserId, " enrolled sucessfully to event with id ").concat(req.params.eventID)
          });
          return _context7.abrupt("return");

        case 41:
          _eventUpdate = {
            nrLimit: limitPersons,
            closed: true
          };
          _context7.next = 44;
          return regeneratorRuntime.awrap(Events.update(_eventUpdate, {
            where: {
              id: req.params.eventID
            }
          }));

        case 44:
          _updateEventLimitPersons = _context7.sent;
          res.status(201).json({
            message: "User with id ".concat(req.loggedUserId, " enrolled sucessfully to event with id ").concat(req.params.eventID)
          });
          return _context7.abrupt("return");

        case 47:
          _context7.next = 51;
          break;

        case 49:
          res.status(400).json({
            message: "Event with id ".concat(req.params.eventID, " reached is enrollments limit.")
          });
          return _context7.abrupt("return");

        case 51:
          _context7.next = 58;
          break;

        case 53:
          _context7.next = 55;
          return regeneratorRuntime.awrap(Enrollments.create({
            userId: req.loggedUserId,
            eventId: req.params.eventID,
            enrolled: false
          }));

        case 55:
          _enroll = _context7.sent;
          res.status(201).json({
            message: "Waiting for payment for event with id ".concat(req.params.eventID, " to enroll user with id ").concat(req.loggedUserId)
          });
          return _context7.abrupt("return");

        case 58:
          _context7.next = 63;
          break;

        case 60:
          _context7.prev = 60;
          _context7.t0 = _context7["catch"](0);
          res.status(500).json({
            message: _context7.t0.message || "Error enrolling user to event with id ".concat(req.params.eventID, ".")
          });

        case 63:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 60]]);
}; // Cancelar inscrição num evento


exports.cancelEnrollment = function _callee8(req, res) {
  var user, event, currentDate, limitEventDate, enrollment, maxLotation, eventUpdateObject, updateEvent, cancelEnroll, _eventUpdateObject, _updateEvent, _cancelEnroll;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(Users.findByPk(req.loggedUserId));

        case 3:
          user = _context8.sent;

          if (!(user == null)) {
            _context8.next = 7;
            break;
          }

          res.status(404).json({
            message: 'User not found!'
          });
          return _context8.abrupt("return");

        case 7:
          _context8.next = 9;
          return regeneratorRuntime.awrap(Events.findByPk(req.params.eventID));

        case 9:
          event = _context8.sent;

          if (!(event == null)) {
            _context8.next = 13;
            break;
          }

          res.status(404).json({
            message: 'Event not found!'
          });
          return _context8.abrupt("return");

        case 13:
          //fazer a verificação da data limite de inscrição
          currentDate = new Date();
          limitEventDate = new Date(event.date_limit);

          if (!(currentDate > limitEventDate)) {
            _context8.next = 18;
            break;
          }

          res.status(400).json({
            message: "Event ".concat(req.params.eventID, " already closed enrollments.")
          });
          return _context8.abrupt("return");

        case 18:
          _context8.next = 20;
          return regeneratorRuntime.awrap(Enrollments.findOne({
            where: {
              eventId: req.params.eventID,
              userId: req.loggedUserId
            }
          }));

        case 20:
          enrollment = _context8.sent;

          if (!(enrollment == null)) {
            _context8.next = 24;
            break;
          }

          res.status(404).json({
            message: "User id ".concat(req.loggedUserId, " is not enrolled to event id ").concat(req.params.eventID, ".")
          });
          return _context8.abrupt("return");

        case 24:
          maxLotation = event.nrLimit + 1;

          if (!(event.closed == true)) {
            _context8.next = 38;
            break;
          }

          eventUpdateObject = {
            nrLimit: maxLotation,
            closed: false
          };
          _context8.next = 29;
          return regeneratorRuntime.awrap(Events.update(eventUpdateObject, {
            where: {
              id: req.params.eventID
            }
          }));

        case 29:
          updateEvent = _context8.sent;
          _context8.next = 32;
          return regeneratorRuntime.awrap(Enrollments.destroy({
            where: {
              id: enrollment.id
            }
          }));

        case 32:
          cancelEnroll = _context8.sent;

          if (!(cancelEnroll == 1)) {
            _context8.next = 36;
            break;
          }

          res.status(200).json({
            message: "Enrollment to event id ".concat(req.params.eventID, " canceled successfuly.")
          });
          return _context8.abrupt("return");

        case 36:
          _context8.next = 48;
          break;

        case 38:
          _eventUpdateObject = {
            nrLimit: maxLotation
          };
          _context8.next = 41;
          return regeneratorRuntime.awrap(Events.update(_eventUpdateObject, {
            where: {
              id: req.params.eventID
            }
          }));

        case 41:
          _updateEvent = _context8.sent;
          _context8.next = 44;
          return regeneratorRuntime.awrap(Enrollments.destroy({
            where: {
              id: enrollment.id
            }
          }));

        case 44:
          _cancelEnroll = _context8.sent;

          if (!(_cancelEnroll == 1)) {
            _context8.next = 48;
            break;
          }

          res.status(200).json({
            message: "Enrollment to event id ".concat(req.params.eventID, " canceled successfuly.")
          });
          return _context8.abrupt("return");

        case 48:
          _context8.next = 53;
          break;

        case 50:
          _context8.prev = 50;
          _context8.t0 = _context8["catch"](0);
          res.status(500).json({
            message: _context8.t0.message || "Error canceling enrollment to event with id ".concat(req.params.eventID, ".")
          });

        case 53:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 50]]);
}; // Pagar inscrição num evento


exports.payEnrollment = function _callee9(req, res) {
  var user, event, currentDate, limitEventDate, enrollment, payUserEnrollment, paidPrice, _updateUserPoints, _updateUserPoints2;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(Users.findByPk(req.loggedUserId));

        case 3:
          user = _context9.sent;

          if (!(user == null)) {
            _context9.next = 7;
            break;
          }

          res.status(404).json({
            message: 'User not found!'
          });
          return _context9.abrupt("return");

        case 7:
          _context9.next = 9;
          return regeneratorRuntime.awrap(Events.findByPk(req.params.eventID));

        case 9:
          event = _context9.sent;

          if (!(event == null)) {
            _context9.next = 13;
            break;
          }

          res.status(404).json({
            message: 'Event not found!'
          });
          return _context9.abrupt("return");

        case 13:
          //fazer a verificação da data limite de inscrição/pagamento
          currentDate = new Date();
          limitEventDate = new Date(event.date_limit);

          if (!(currentDate > limitEventDate)) {
            _context9.next = 18;
            break;
          }

          res.status(400).json({
            message: "Event ".concat(req.params.eventID, " already closed payments.")
          });
          return _context9.abrupt("return");

        case 18:
          _context9.next = 20;
          return regeneratorRuntime.awrap(Enrollments.findOne({
            where: {
              eventId: req.params.eventID,
              userId: req.loggedUserId
            }
          }));

        case 20:
          enrollment = _context9.sent;

          if (!(enrollment == null)) {
            _context9.next = 24;
            break;
          }

          res.status(404).json({
            message: "User id ".concat(req.loggedUserId, " is not enrolled to event id ").concat(req.params.eventID, ".")
          });
          return _context9.abrupt("return");

        case 24:
          if (!(enrollment.enrolled == true)) {
            _context9.next = 27;
            break;
          }

          res.status(400).json({
            message: "User id ".concat(req.loggedUserId, " is already enrolled to event id ").concat(req.params.eventID, ".")
          });
          return _context9.abrupt("return");

        case 27:
          if (req.body) {
            _context9.next = 32;
            break;
          }

          res.status(400).json({
            message: "Request body can not be empty."
          });
          return _context9.abrupt("return");

        case 32:
          if (req.body.discountPoints) {
            _context9.next = 35;
            break;
          }

          res.status(400).json({
            message: "Discount points can not be empty."
          });
          return _context9.abrupt("return");

        case 35:
          _context9.next = 37;
          return regeneratorRuntime.awrap(Enrollments.update({
            enrolled: true
          }, {
            where: {
              id: enrollment.id
            }
          }));

        case 37:
          payUserEnrollment = _context9.sent;
          paidPrice = 0;

          if (!(req.body.discountPoints <= 25 && req.body.discountPoints > 0)) {
            _context9.next = 46;
            break;
          }

          _context9.next = 42;
          return regeneratorRuntime.awrap(Users.update({
            points: user.points - req.body.discountPoints
          }, {
            where: {
              id: user.id
            }
          }));

        case 42:
          _updateUserPoints = _context9.sent;
          paidPrice = event.price * (req.body.discountPoints / 100);
          _context9.next = 54;
          break;

        case 46:
          if (!(req.body.discountPoints > 25)) {
            _context9.next = 53;
            break;
          }

          _context9.next = 49;
          return regeneratorRuntime.awrap(Users.update({
            points: user.points - 25
          }, {
            where: {
              id: user.id
            }
          }));

        case 49:
          _updateUserPoints2 = _context9.sent;
          paidPrice = event.price * (25 / 100);
          _context9.next = 54;
          break;

        case 53:
          if (req.body.discountPoints == 0) {
            paidPrice = event.price;
          }

        case 54:
          if (!(payUserEnrollment != 1 && updateUserPoints != 1)) {
            _context9.next = 59;
            break;
          }

          res.status(400).json({
            message: "Could not complete the payment!"
          });
          return _context9.abrupt("return");

        case 59:
          res.status(200).json({
            message: "Payment to event ".concat(req.params.eventID, " completed successfully.")
          });
          return _context9.abrupt("return");

        case 61:
          _context9.next = 66;
          break;

        case 63:
          _context9.prev = 63;
          _context9.t0 = _context9["catch"](0);
          res.status(500).json({
            message: _context9.t0.message || "Error paying enrollment to event with id ".concat(req.params.eventID, ".")
          });

        case 66:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 63]]);
};