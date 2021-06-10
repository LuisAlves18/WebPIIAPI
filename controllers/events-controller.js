const db = require("../models/db.js");
const Events = db.events;
const Users = db.users;
const Enrollments = db.enrollments;
const Receipts = db.receipts;
const { Op } = require('sequelize');
const areasModel = require("../models/areas-model.js");
const { updateUser } = require("./users-controller.js");

// Display list of all events
exports.findAll = async (req, res) => {
    //definir as querys strings
    let { type, name, price, closed } = req.query;

    //definir a condiçao
    let condition = null;

    //verificar se existe a key name nos query params
    if (name) {
        if (condition == null) {
            condition = {
                name: { [Op.like]: `%${name}%` }
            }
        } else {
            condition['name'] = { [Op.like]: `%${name}%` };
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
                    price: { [Op.gte]: 1 }
                }
            }

        } else {
            if (price == 'free') {
                condition['price'] = 0;
            } else if (price == 'paid') {
                condition['price'] =
                    { [Op.gte]: 1 };
            }

        }
    }

    console.log('role', req.loggedUserRole);
    if (req.loggedUserRole == 'user') {
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
    }




    try {
        //obter todos os eventos com a condiçao no caso de ela estar definida
        let events = await Events.findAll({ where: condition })

        //verificar se retorna eventos
        if (events.length == 0) {
            res.status(404).json({
                message: `Não foi possivel encontrar eventos.`
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

};

// Handle event create on POST
exports.createEvent = async (req, res) => {
    // verificar se os seguintes dados existem no corpo do pedido
    if (!req.body) {
        res.status(400).json({ message: "Corpo do pedido não pode ser vazio!" });
        return;
    } else if (!req.body.id_event_type) {
        res.status(400).json({ message: "Tipo de evento não pode ser nulo!" });
        return;
    } else if (!req.body.name) {
        res.status(400).json({ message: "Nome do evento não pode ser vazio!" });
        return;
    } else if (!req.body.description) {
        res.status(400).json({ message: "Descrição do evento não pode ser vazia!" });
        return;
    } else if (!req.body.photo) {
        res.status(400).json({ message: "Fotografia do evento não pode ser vazia!" });
        return;
    } else if (!req.body.date) {
        res.status(400).json({ message: "Data do evento não pode ser nula!" });
        return;
    } else if (!req.body.date_limit) {
        res.status(400).json({ message: "Data limite de inscrição no evento não pode ser nula!" });
        return;
    } else if (!req.body.time) {
        res.status(400).json({ message: "Hora do evento não pode ser nula!" });
        return;
    }

    try {
        //procurar um evento com o nome definido no corpo do pedido
        let findEventByName = await Events.findOne({ where: { name: req.body.name } });

        //no caso de existir nao deixa criar
        if (findEventByName != null) {
            res.status(400).json({
                message: "Evento " + req.body.name + " já existe!"
            });
            return;
        }

        //no caso de nao existir, cria o novo evento
        let events = await Events.create({
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
        });

        res.status(201).json({
            message: "Evento criado com sucesso.",
            location: "/events/" + events.id
        });
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
};

// Remove one event
exports.deleteEvent = async (req, res) => {

    try {


        let removeEnrollments = await Enrollments.destroy({ where: { eventId: req.params.eventID } });
        //remover um evento atraves do id passado como parametro
        let event = await Events.destroy({ where: { id: req.params.eventID } })



        //verificar se eliminou algum evento
        if (event == 1) {
            res.status(200).json({
                message: `Evento ${req.params.eventID} removido com sucesso!`
            });
        } else {
            res.status(404).json({
                message: `Evento ${req.params.eventID} não existe.`
            });
        }

    } catch (e) {
        res.status(500).json({
            message: e.message || `Error deleting event with id=${req.params.eventID}.`
        });
    }

};

// List just one event
exports.findOneEvent = async (req, res) => {
    // obtains only a single entry from the table, using the provided primary key

    try {

        //verificar se o login está feito
        if (req.loggedUserId == null) {
            //procurar um evento atraves do id enviado como parametro
            let event = await Events.findByPk(req.params.eventID);

            //verificar se encontrou o evento procurado
            if (event == null) {
                res.status(404).json({
                    message: `Evento ${req.params.eventID} não existe.`
                });
                return;
            }

            res.status(200).json({
                message: 'none',
                event
            });
        } else {
            // procurar o user
            let user = await Users.findByPk(req.loggedUserId);

            if (user == null) {
                res.status(404).json({
                    message: `Utilizador ${req.loggedUserId} não econtrado.`
                });
                return;
            }

            //procurar o evento
            let event = await Events.findByPk(req.params.eventID, { include: { model: Enrollments, where: { userId: user.id }, include: { model: Users } } });

            //verificar se encontrou o evento procurado
            if (event == null) {
                let event = await Events.findByPk(req.params.eventID);
                if (event == null) {
                    res.status(404).json({
                        message: `Evento ${req.params.eventID} não existe.`
                    })
                    return;
                }
                res.status(200).json({
                    message: 'logged',
                    event
                });
                return;
            }

            res.status(200).json({
                message: 'enrolled',
                event
            });
        }



    } catch (e) {
        res.status(500).json({
            message: e.message || `Error retrieving event with id ${req.params.eventID}.`
        });
    }
};

// Update One Event
exports.updateOneEvent = async (req, res) => {
    // verificar se os seguintes dados existem no corpo do pedido
    if (!req.body) {
        res.status(400).json({ message: "Corpo do pedido não pode ser vazio!" });
        return;
    } else if (!req.body.id_event_type) {
        res.status(400).json({ message: "Tipo de evento não pode ser nulo!" });
        return;
    } else if (!req.body.name) {
        res.status(400).json({ message: "Nome do evento não pode ser vazio!" });
        return;
    } else if (!req.body.description) {
        res.status(400).json({ message: "Descrição do evento não pode ser vazia!" });
        return;
    } else if (!req.body.photo) {
        res.status(400).json({ message: "Fotografia do evento não pode ser vazia!" });
        return;
    } else if (!req.body.date) {
        res.status(400).json({ message: "Data do evento não pode ser nula!" });
        return;
    } else if (!req.body.date_limit) {
        res.status(400).json({ message: "Data limite de inscrição no evento não pode ser nula!" });
        return;
    } else if (!req.body.time) {
        res.status(400).json({ message: "Hora do evento não pode ser nula!" });
        return;
    }

    try {
        //procurar o evento pelo id definido nos parametros
        let event = await Events.findByPk(req.params.eventID);

        //verificar se encontrou o evento pretendido
        if (event == null) {
            res.status(404).json({
                message: `Evento ${req.params.eventID} não existe.`
            });
            return;
        }

        //no caso de encontrar, atualiza o evento
        let updateEvent = await Events.update({
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
        }, { where: { id: req.params.eventID } });

        //verificar se o update foi bem sucedido
        if (updateEvent == 1) {
            res.status(200).json({
                message: `Evento ${req.params.eventID} alterado com sucesso.`
            });
        } else {
            res.status(400).json({
                message: `Não foi possivel efetuar alteração de dados no evento ${req.params.eventID}.`
            });
        }
    } catch (e) {
        res.status(500).json({
            message: e.message || `Error updating Event with id=${req.params.eventID}.`
        });
    }
};

// Obter todas as inscrições de um evento
exports.getEventEnrollments = async (req, res) => {
    try {
        let event = await Events.findByPk(req.params.eventID);

        if (event == null) {
            res.status(404).json({
                message: `Evento ${req.params.eventID} não encontrado!`
            });
            return;
        }

        let eventEnrollments = await Enrollments.findAll({ where: { eventId: req.params.eventID }, include: [{ model: Users }, { model: Events }] });

        if (eventEnrollments == null) {
            res.status(404).json({
                message: `Evento ${req.params.eventID} não contem inscrições!`
            });
            return;
        }


        return res.status(200).json(eventEnrollments);
    } catch (error) {
        res.status(500).json({
            message: error.message || `Error retrieving all enrollments for event with id ${req.params.eventID}.`
        });
    }
}

// Inscrever num evento
exports.enrollUser = async (req, res) => {
    try {

        /* console.log('logged',req.loggedUserId); */
        let user = await Users.findByPk(req.loggedUserId);

        if (user == null) {
            res.status(404).json({
                message: 'Utilizador não existe!'
            });
            return;
        }

        let event = await Events.findByPk(req.params.eventID);

        if (event == null) {
            res.status(404).json({
                message: 'Evento não existe!'
            });
            return;
        }

        //fazer a verificação da data limite de inscrição
        const currentDate = new Date();
        let limitEventDate = new Date(event.date_limit);

        if (currentDate > limitEventDate) {
            res.status(400).json({
                message: `Evento ${req.params.eventID} fechou as inscrições.`
            });
            return;
        }

        let enrollment = await Enrollments.findOne({ where: { eventId: req.params.eventID, userId: req.loggedUserId } });

        if (enrollment != null) {
            res.status(400).json({
                message: `Utilizador ${req.loggedUserId} já está inscrito no evento ${req.params.eventID}`
            });
            return;
        } else {

            if (event.price == 0) {

                if (event.nrLimit > 0) {
                    let enroll = await Enrollments.create({
                        userId: req.loggedUserId,
                        eventId: req.params.eventID,
                        enrolled: true
                    });

                    let limitPersons = (event.nrLimit - 1);

                    if (limitPersons > 0) {
                        let eventUpdate = { nrLimit: limitPersons }
                        let updateEventLimitPersons = await Events.update(eventUpdate, { where: { id: req.params.eventID } });

                        res.status(201).json({
                            message: `Utilizador ${req.loggedUserId} inscrito com sucesso no evento ${req.params.eventID}`
                        });
                        return;
                    } else {
                        let eventUpdate = { nrLimit: limitPersons, closed: true }
                        let updateEventLimitPersons = await Events.update(eventUpdate, { where: { id: req.params.eventID } });

                        res.status(201).json({
                            message: `Utilizador ${req.loggedUserId} inscrito com sucesso no evento ${req.params.eventID}`
                        });
                        return;
                    }


                } else {
                    res.status(400).json({
                        message: `Evento ${req.params.eventID} não contem mais lotação para inscrições.`
                    });
                    return;
                }


            } else {
                let enroll = await Enrollments.create({
                    userId: req.loggedUserId,
                    eventId: req.params.eventID,
                    enrolled: false
                });

                res.status(201).json({
                    message: `Inscrição pendente! Evento ${req.params.eventID} necessita de pagamento.`
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

// Cancelar inscrição num evento
exports.cancelEnrollment = async (req, res) => {
    try {

        /* console.log('logged',req.loggedUserId); */
        let user = await Users.findByPk(req.loggedUserId);

        if (user == null) {
            res.status(404).json({
                message: 'Utilizador não encontrado!'
            });
            return;
        }

        let event = await Events.findByPk(req.params.eventID);

        if (event == null) {
            res.status(404).json({
                message: 'Evento não existe!'
            });
            return;
        }

        //fazer a verificação da data limite de inscrição
        const currentDate = new Date();
        let limitEventDate = new Date(event.date_limit);

        if (currentDate > limitEventDate) {
            res.status(400).json({
                message: `Evento ${req.params.eventID} já fechou inscrições.`
            });
            return;
        }

        let enrollment = await Enrollments.findOne({ where: { eventId: req.params.eventID, userId: req.loggedUserId } });

        if (enrollment == null) {
            res.status(404).json({
                message: `Utilizador ${req.loggedUserId} não está inscrito no evento ${req.params.eventID}.`
            });
            return;
        }

        let maxLotation = (event.nrLimit + 1);

        if (event.closed == true) {
            let eventUpdateObject = { nrLimit: maxLotation, closed: false };
            let updateEvent = await Events.update(eventUpdateObject, { where: { id: req.params.eventID } });

            let cancelEnroll = await Enrollments.destroy({ where: { id: enrollment.id } });

            if (cancelEnroll == 1) {
                res.status(200).json({
                    message: `Inscrição para o evento ${req.params.eventID} cancelada com sucesso.`
                });
                return;
            }
        } else {
            let eventUpdateObject = { nrLimit: maxLotation };
            let updateEvent = await Events.update(eventUpdateObject, { where: { id: req.params.eventID } });

            let cancelEnroll = await Enrollments.destroy({ where: { id: enrollment.id } });

            if (cancelEnroll == 1) {
                res.status(200).json({
                    message: `Inscrição para o evento ${req.params.eventID} cancelada com sucesso.`
                });
                return;
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message || `Error canceling enrollment to event with id ${req.params.eventID}.`
        });
    }
}

// Pagar inscrição num evento
exports.payEnrollment = async (req, res) => {
    try {

        let user = await Users.findByPk(req.loggedUserId);

        if (user == null) {
            res.status(404).json({
                message: 'Utilizador não existe!'
            });
            return;
        }

        let event = await Events.findByPk(req.params.eventID);

        if (event == null) {
            res.status(404).json({
                message: 'Evento não existe!'
            });
            return;
        }

        //fazer a verificação da data limite de inscrição/pagamento
        const currentDate = new Date();
        let limitEventDate = new Date(event.date_limit);

        if (currentDate > limitEventDate) {
            res.status(400).json({
                message: `Evento ${req.params.eventID} já fechou pagamentos de inscrição.`
            });
            return;
        }

        let enrollment = await Enrollments.findOne({ where: { eventId: req.params.eventID, userId: req.loggedUserId } });

        if (enrollment == null) {
            res.status(404).json({
                message: `Utilizador ${req.loggedUserId} não está inscrito no evento ${req.params.eventID}.`
            });
            return;
        }

        if (enrollment.enrolled == true) {
            res.status(400).json({
                message: `Utilizador ${req.loggedUserId} já está inscrito no evento ${req.params.eventID}.`
            });
            return;
        }

        if (!req.body) {
            res.status(400).json({
                message: `Corpo do pedido não pode ser vazio.`
            });
            return;
        } else if (req.body.discountPoints == null) {
            res.status(400).json({
                message: `Pontos de desconto não podem ser nulos.`
            });
            return;
        }

        if (req.body.discountPoints > user.points) {
            res.status(400).json({
                message: `Não tens esse montante de pontos disponiveis.`
            });
            return;
        }

        //fazer o pagamento
        //retirar o nr de pontos que o user gastou
        //colocar no recibo
        let payUserEnrollment = await Enrollments.update({
            enrolled: true
        }, { where: { id: enrollment.id } });
        let paidPrice = 0;
        if (req.body.discountPoints <= 25 && req.body.discountPoints > 0) {
            let updateUserPoints = await Users.update({
                points: user.points - req.body.discountPoints
            }, { where: { id: user.id } });
            paidPrice = event.price * (req.body.discountPoints / 100);
        } else if (req.body.discountPoints > 25) {
            let updateUserPoints = await Users.update({
                points: user.points - 25
            }, { where: { id: user.id } });
            paidPrice = event.price * (25 / 100);
        } else if (req.body.discountPoints == 0) {
            paidPrice = event.price;
        }

        if (payUserEnrollment != 1) {
            res.status(400).json({
                message: `Não foi possivel efetuar o pagamento`
            });
            return;
        } else {
            res.status(200).json({
                message: `Pagamento para o evento ${req.params.eventID} feito com sucesso.`
            });
            return;
        }




    } catch (error) {
        res.status(500).json({
            message: error.message || `Error paying enrollment to event with id ${req.params.eventID}.`
        });
    }
}

exports.givePoints = async (req, res) => {
    try {
        //encontrar o evento
        let event = await Events.findByPk(req.params.eventID);

        if (event == null) {
            res.status(404).json({
                message: `Evento ${req.params.eventID} não existe.`
            });
            return;
        }

        //encontrar todas as inscrições relacionadas com o evento em questão
        let enrollments = await Enrollments.findAll({ where: { eventId: req.params.eventID } });

        if (enrollments == null) {
            res.status(404).json({
                message: `Não há inscrições para o evento ${req.params.eventID}.`
            });
            return;
        }
        const currentDate = new Date();
        let eventDate = new Date(event.date_time_event);
        if (eventDate > currentDate) {
            res.status(400).json({
                message: `Evento ainda não foi terminado.`
            });
            return;
        }

        for (const enrollment of enrollments) {
            //encontrar o utilizador relacionado com a inscrição
            let user = await Users.findByPk(enrollment.userId);
            let newPoints = 0;
            if (event.price == 0) {
                newPoints = user.points + 2;
            } else {
                newPoints = user.points + 5
            }
            let updateUserPoints = await Users.update({
                points: newPoints
            }, { where: { id: user.id } });

            let deleteEnrollment = await Enrollments.destroy({ where: { id: enrollment.id } });
            
        }
        let deleteEvent = await Events.destroy({ where: { id: req.params.eventID } });


        res.status(200).json({
            message: `Pontos atribuidos a todos os utilizadores inscritos.`
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}