"use strict";

var jwt = require("jsonwebtoken");

var bcrypt = require("bcryptjs");

var config = require('../config/auth-config.js');

var db = require('../models/db.js');

var _require = require("../models/db.js"),
    users = _require.users;

var User = db.users;
var Events = db.events;
var Enrollments = db.enrollments;
var Role = db.roles;

exports.getAllUsers = function _callee(req, res) {
  var _users;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.findAll());

        case 3:
          _users = _context.sent;
          res.status(200).json(_users);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.updateUser = function _callee2(req, res) {
  var user, updateUser, _user, checkEmails, passwordIsValid, _updateUser;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (!(req.loggedUserRole == 'admin')) {
            _context2.next = 22;
            break;
          }

          if (req.body) {
            _context2.next = 7;
            break;
          }

          res.status(400).json({
            message: "Request body can not be empty!"
          });
          return _context2.abrupt("return");

        case 7:
          if (req.body.statusId) {
            _context2.next = 10;
            break;
          }

          res.status(400).json({
            message: "User status must be defined."
          });
          return _context2.abrupt("return");

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(User.findByPk(req.params.userID));

        case 12:
          user = _context2.sent;

          if (!(user == null)) {
            _context2.next = 16;
            break;
          }

          res.status(404).json({
            message: "Not found User with id ".concat(req.params.userID, ".")
          });
          return _context2.abrupt("return");

        case 16:
          _context2.next = 18;
          return regeneratorRuntime.awrap(User.update(req.body, {
            where: {
              id: req.params.userID
            }
          }));

        case 18:
          updateUser = _context2.sent;

          //verificar se o update foi bem sucedido
          if (updateUser == 1) {
            res.status(200).json({
              message: "User id=".concat(req.params.userID, " was updated successfully.")
            });
          } else {
            res.status(400).json({
              message: "No updates were made on User id=".concat(req.params.userID, ".")
            });
          }

          _context2.next = 50;
          break;

        case 22:
          if (req.body) {
            _context2.next = 27;
            break;
          }

          res.status(400).json({
            message: "Request body can not be empty!"
          });
          return _context2.abrupt("return");

        case 27:
          if (req.body.email) {
            _context2.next = 30;
            break;
          }

          res.status(400).json({
            message: "User email can not be null."
          });
          return _context2.abrupt("return");

        case 30:
          _context2.next = 32;
          return regeneratorRuntime.awrap(User.findByPk(req.params.userID));

        case 32:
          _user = _context2.sent;

          if (!(_user == null)) {
            _context2.next = 36;
            break;
          }

          res.status(404).json({
            message: "Not found User with id ".concat(req.params.userID, ".")
          });
          return _context2.abrupt("return");

        case 36:
          _context2.next = 38;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              email: req.body.email
            }
          }));

        case 38:
          checkEmails = _context2.sent;

          if (!(checkEmails.id != req.params.userID)) {
            _context2.next = 42;
            break;
          }

          res.status(400).json({
            message: "Sorry that email is already taken!"
          });
          return _context2.abrupt("return");

        case 42:
          passwordIsValid = bcrypt.compareSync(req.body.password, _user.password);

          if (!passwordIsValid) {
            _context2.next = 45;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "New Password matches old password!"
          }));

        case 45:
          req.body.password = bcrypt.hashSync(req.body.password, 8); //no caso de encontrar, atualiza o evento

          _context2.next = 48;
          return regeneratorRuntime.awrap(User.update(req.body, {
            where: {
              id: req.params.userID
            }
          }));

        case 48:
          _updateUser = _context2.sent;

          //verificar se o update foi bem sucedido
          if (_updateUser == 1) {
            res.status(200).json({
              message: "User id=".concat(req.params.userID, " was updated successfully.")
            });
          } else {
            res.status(400).json({
              message: "No updates were made on User id=".concat(req.params.userID, ".")
            });
          }

        case 50:
          _context2.next = 55;
          break;

        case 52:
          _context2.prev = 52;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: _context2.t0.message
          });

        case 55:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 52]]);
};

exports.getOneUser = function _callee3(req, res) {
  var user, _user2;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;

          if (!(req.params.userID == req.loggedUserId)) {
            _context3.next = 11;
            break;
          }

          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findByPk(req.params.userID, {
            include: {
              model: Enrollments,
              include: {
                model: Events
              }
            }
          }));

        case 4:
          user = _context3.sent;

          if (!(user == null)) {
            _context3.next = 8;
            break;
          }

          res.status(404).json({
            message: "User with id = ".concat(req.params.userID, " not found.")
          });
          return _context3.abrupt("return");

        case 8:
          return _context3.abrupt("return", res.status(200).json(user));

        case 11:
          _context3.next = 13;
          return regeneratorRuntime.awrap(User.findByPk(req.params.userID));

        case 13:
          _user2 = _context3.sent;

          if (!(_user2 == null)) {
            _context3.next = 17;
            break;
          }

          res.status(404).json({
            message: "User with id = ".concat(req.params.userID, " not found.")
          });
          return _context3.abrupt("return");

        case 17:
          return _context3.abrupt("return", res.status(200).json(_user2));

        case 18:
          _context3.next = 23;
          break;

        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: _context3.t0.message
          });

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

exports.removeUser = function _callee4(req, res) {
  var removeEnrollments, removeUser;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Enrollments.destroy({
            where: {
              userId: req.params.userID
            }
          }));

        case 3:
          removeEnrollments = _context4.sent;
          _context4.next = 6;
          return regeneratorRuntime.awrap(User.destroy({
            where: {
              id: req.params.userID
            }
          }));

        case 6:
          removeUser = _context4.sent;

          if (!(removeUser == 1 && removeEnrollments > 0)) {
            _context4.next = 12;
            break;
          }

          res.status(200).json({
            message: "User with id ".concat(req.params.userID, " was successfully deleted!")
          });
          return _context4.abrupt("return");

        case 12:
          res.status(404).json({
            message: "User with id = ".concat(req.params.userID, " not found.")
          });
          return _context4.abrupt("return");

        case 14:
          _context4.next = 19;
          break;

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: _context4.t0.message
          });

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 16]]);
};