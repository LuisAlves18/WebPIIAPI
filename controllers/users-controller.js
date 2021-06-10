const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { Op } = require("sequelize");
const config = require('../config/auth-config.js');
const db = require('../models/db.js');
const { users } = require("../models/db.js");
const User = db.users;
const Events = db.events;
const Enrollments = db.enrollments;
const Role = db.roles;

exports.getAllUsers = async (req, res) => {
    try {
        let users = await User.findAll({where: {
            id : {[Op.ne] : req.loggedUserId}
        }});
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
                res.status(400).json({ message: "Corpo do pedido não pode ser vazio!" });
                return;
            } else if (!req.body.statusId) {
                res.status(400).json({ message: "Estado do utilizador não pode ser vazio." });
                return;
            }

            let user = await User.findByPk(req.params.userID);

            if (user == null) {
                res.status(404).json({
                    message: `Utilizador ${req.params.userID} não existe.`
                });
                return;
            }

            //no caso de encontrar, atualiza o user
            let updateUser = await User.update(req.body, { where: { id: req.params.userID } });

            //verificar se o update foi bem sucedido
            if (updateUser == 1) {
                res.status(200).json({
                    message: `Utilizador ${req.params.userID} alterado com sucesso.`
                });
            } else {
                res.status(400).json({
                    message: `Não foi possivel realizar alterações para o utilizador${req.params.userID}.`
                });
            }
        } else {
            //fazer a parte de um user editar o seu perfil
            if (!req.body) {
                res.status(400).json({ message: "Corpo do pedido não pode ser vazio!" });
                return;
            } else if (!req.body.email) {
                res.status(400).json({ message: "Email do utlizador não pode ser vazio." });
                return;
            }

            let user = await User.findByPk(req.params.userID);

            if (user == null) {
                res.status(404).json({
                    message: `Utilizador ${req.params.userID} não existe.`
                });
                return;
            }

            let checkEmails = await User.findOne({ where: { email: req.body.email } })

            if ( checkEmails != null) {
                if (checkEmails.id != req.params.userID) {
                    res.status(400).json({ message: "O email que escolheu já existe!" });
                    return;
                }
            }
            

            if (req.body.password != null) {
                const passwordIsValid = bcrypt.compareSync(
                    req.body.password, user.password
                );
    
                if (passwordIsValid) {
                    return res.status(400).json({
                        message: "Nova password coincide com a antiga!"
                    });
                }
                req.body.password = bcrypt.hashSync(req.body.password, 8);
            } else {
                req.body.password = user.password;
            }
            
            //no caso de encontrar, atualiza o user
            let updateUser = await User.update(req.body, { where: { id: req.params.userID } });

            //verificar se o update foi bem sucedido
            if (updateUser == 1) {
                res.status(200).json({
                    message: `Utilizador ${req.params.userID} alterado com sucesso.`
                });
                return;
            } else {
                res.status(200).json({
                    message: `Não foi possivel realizar alterações para o user ${req.params.userID}.`
                });
                return;
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
                    message: `Utilizador ${req.params.userID} não existe.`
                });
                return;
            }

            user.password = null;

            return res.status(200).json(user);

        } else {
            let user = await User.findByPk(req.params.userID);

            if (user == null) {
                res.status(404).json({
                    message: `Utilizador ${req.params.userID} não existe.`
                });
                return;
            }
            user.password = "";
            return res.status(200).json(user);
        }



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.removeUser = async (req, res) => {
    try {

        let removeEnrollments = await Enrollments.destroy({where: {userId: req.params.userID}});
        let removeUser = await User.destroy({ where: { id: req.params.userID } });

        if (removeUser == 1 ) {
            res.status(200).json({
                message: `Utilizador ${req.params.userID} removido com sucesso!`
            });
            return;
        } else {
            res.status(404).json({
                message: `Utilizador ${req.params.userID} não existe.`
            });
            return;
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}