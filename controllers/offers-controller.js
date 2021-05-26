const db = require("../models/db.js");
const Offers = db.offers;
const { Op } = require('sequelize');

// Display list of all events
exports.findAll = async (req, res) => {
    //definir as querys strings
    let { type, name, area } = req.query;

    //definir a condiçao
    let condition = null;

    /* //verificar se existe a key name nos query params
        if (name) {
            if (condition == null) {
                condition = {
                    name: { [Op.like]: `%${name}%` }
                }
            } else {
                condition['name'] = {[Op.like]: `%${name}%`} ;
            }
        } */

    //verificar se existe a key type nos query params
    if (type) {
        if (condition == null) {
            condition = {
                typeOfferId: type
            }
        } else {
            condition["typeOfferId"] = type;
        }

    }

    //verificar se existe a key area nos query params
    if (area) {
        if (condition == null) {
            condition = {
                areaId: area
            }
        } else {
            condition["areaId"] = area;
        }

    }



    try {
        //obter todos os eventos com a condiçao no caso de ela estar definida
        let offers = await Offers.findAll({ where: condition })

        //verificar se retorna eventos
        if (offers.length == 0) {
            res.status(404).json({
                message: `Could not find any offers.`
            });
            return;
        }

        res.status(200).json(offers);

    } catch (e) {
        res.status(500).json({
            message:
                err.message || "Some error occurred while retrieving offers."
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

exports.findOne = async (req, res) => {
    try {
        //procurar uma oferta atraves do id enviado como parametro
        let offer = await Offers.findByPk(req.params.offerID);

        //verificar se encontrou a oferta procurada
        if (offer == null) {
            res.status(404).json({
                message: `Not found offer with id ${req.params.offerID}.`
            });
            return;
        }

        res.status(200).json(offer);
    } catch (e) {
        res.status(500).json({
            message: e.message || `Error retrieving offer with id ${req.params.offerID}.`
        });
    }
}

exports.createOffer = async (req, res) => {
    // verificar se os seguintes dados existem no corpo do pedido
    if (!req.body) {
        res.status(400).json({ message: "Request body can not be empty!" });
        return;
    } else if (!req.body.companyId) {
        res.status(400).json({ message: "Company id can not be null!" });
        return;
    } else if (!req.body.areaId) {
        res.status(400).json({ message: "Area id can not be null!" });
        return;
    } else if (!req.body.typeOfferId) {
        res.status(400).json({ message: "Offer Type id can not be null!" });
        return;
    } else if (!req.body.description) {
        res.status(400).json({ message: "Offer Description can not be empty!" });
        return;
    } else if (!req.body.emailContact) {
        res.status(400).json({ message: "Company contact email can not be empty!" });
        return;
    } else if (!req.body.duration) {
        res.status(400).json({ message: "Offer Duration can not be empty!" });
        return;
    }




    try {
      //procurar um evento com o nome definido no corpo do pedido
        let findExistingOffer = await Offers.findOne({ where: {typeOfferId : req.body.typeOfferId, areaId: req.body.areaId, companyId: req.body.companyId}});

        //no caso de existir nao deixa criar
        if (findExistingOffer != null) {
          res.status(400).json({
            message: "Offer already exists!"
          });
          return;
        }

        //no caso de nao existir, cria a nova oferta
        let offer = await Offers.create(req.body);

        res.status(201).json({
          message: "New offer created.",
          location: "/offers/" + offer.id});
    } catch (e) {
      if (e.name === 'SequelizeValidationError') {
        res.status(400).json({
          message: e.errors[0].message
        });
      }
      else {
        res.status(500).json({
          message: e.message || "Some error ocurred while creating offer."
        });
      }
    }

}