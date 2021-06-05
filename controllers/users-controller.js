const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require('../config/auth-config.js');
const db = require('../models/db.js');
const User = db.users;
const Events = db.events;
const Enrollments = db.enrollments;
const Role = db.roles;

exports.getAllUsers = async (req, res) => {
    try {
        let users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateUser = async (req, res) => {
    try {
        /* console.log('id',req.loggedUserId);
        console.log('role', req.loggedUserRole); */
        if (req.loggedUserRole == 'admin') {
            if (!req.body) {
                res.status(400).json({ message: "Request body can not be empty!" });
                return;
            } else if (!req.body.statusId) {
                res.status(400).json({ message: "User status must be defined." });
                return;
            }

            let user = await User.findByPk(req.params.userID);

            if (user == null) {
                res.status(404).json({
                    message: `Not found User with id ${req.params.userID}.`
                });
                return;
            }

            //no caso de encontrar, atualiza o evento
            let updateUser = await User.update(req.body, { where: { id: req.params.userID } });

            //verificar se o update foi bem sucedido
            if (updateUser == 1) {
                res.status(200).json({
                    message: `User id=${req.params.userID} was updated successfully.`
                });
            } else {
                res.status(400).json({
                    message: `No updates were made on User id=${req.params.userID}.`
                });
            }
        } else {
            //fazer a parte de um user editar o seu perfil
            if (!req.body) {
                res.status(400).json({ message: "Request body can not be empty!" });
                return;
            } else if (!req.body.email) {
                res.status(400).json({ message: "User email can not be null." });
                return;
            }

            let user = await User.findByPk(req.params.userID);

            if (user == null) {
                res.status(404).json({
                    message: `Not found User with id ${req.params.userID}.`
                });
                return;
            }

            let checkEmails = await User.findOne({ where: { email: req.body.email } })

            if (checkEmails.id != req.params.userID) {
                res.status(400).json({ message: "Sorry that email is already taken!" });
                return;
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password, user.password
            );

            if (passwordIsValid) {
                return res.status(400).json({
                    message: "New Password matches old password!"
                });
            }
            req.body.password = bcrypt.hashSync(req.body.password, 8);
            //no caso de encontrar, atualiza o evento
            let updateUser = await User.update(req.body, { where: { id: req.params.userID } });

            //verificar se o update foi bem sucedido
            if (updateUser == 1) {
                res.status(200).json({
                    message: `User id=${req.params.userID} was updated successfully.`
                });
            } else {
                res.status(400).json({
                    message: `No updates were made on User id=${req.params.userID}.`
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getOneUser = async (req, res) => {
    try {

        if (req.params.userID == req.loggedUserId) {
            let user = await User.findByPk(req.params.userID, {include: {model: Enrollments, include : {model: Events}}});

            if (user == null) {
                res.status(404).json({
                    message: `User with id = ${req.params.userID} not found.`
                });
                return;
            }

            return res.status(200).json(user);

        } else {
            let user = await User.findByPk(req.params.userID);

            if (user == null) {
                res.status(404).json({
                    message: `User with id = ${req.params.userID} not found.`
                });
                return;
            }

            return res.status(200).json(user);
        }



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.removeUser = async (req, res) => {
    try {
        let removeUser = await User.destroy({ where: { id: req.params.userID } });

        if (removeUser == 1) {
            res.status(200).json({
                message: `User with id ${req.params.userID} was successfully deleted!`
            });
            return;
        } else {
            res.status(404).json({
                message: `User with id = ${req.params.userID} not found.`
            });
            return;
        }



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}