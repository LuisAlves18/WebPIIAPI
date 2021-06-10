const db = require("../models/db.js");
const Offers = db.offers;
const Companies = db.companies;
const Offers_Type = db.offers_type;

const { Op } = require('sequelize');

// Todas as ofertas listadas
exports.findAll = async (req, res) => {
    //definir as querys strings
    let { type, name, area } = req.query;

    //definir a condiçao
    let condition = null;
    let condition2 = null;

    //verificar se existe a key name nos query params
    if (name) {
        if (condition2 == null) {
            condition2 = {
                name: { [Op.like]: `%${name}%` }
            }
        } else {
            condition2['name'] = { [Op.like]: `%${name}%` };
        }
    }

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
        //obter todos as ofertas com a condiçao no caso de ela estar definida
        let offers = await Offers.findAll({ where: condition, include: { model: Companies, where: condition2 } })

        //verificar se retorna ofertas
        if (offers.length == 0) {
            res.status(404).json({
                message: `Não existem ofertas disponiveis.`
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
};

// Uma oferta listada pelo id
exports.findOne = async (req, res) => {
    try {
        //procurar uma oferta atraves do id enviado como parametro
        let offer = await Offers.findByPk(req.params.offerID, { include: [{ model: Companies }, { model: Offers_Type}] });

    //verificar se encontrou a oferta procurada
    if (offer == null) {
        res.status(404).json({
            message: `Oferta ${req.params.offerID} não existe.`
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

// Criação de uma nova oferta
exports.createOffer = async (req, res) => {
    // verificar se os seguintes dados existem no corpo do pedido
    if (!req.body) {
        res.status(400).json({ message: "Corpo do pedido não pode ser vazio!" });
        return;
    } else if (!req.body.companyId) {
        res.status(400).json({ message: "Empresa não pode ser nula!" });
        return;
    } else if (!req.body.areaId) {
        res.status(400).json({ message: "Area não pode ser nula!" });
        return;
    } else if (!req.body.typeOfferId) {
        res.status(400).json({ message: "Tipo de oferta não pode ser nula!" });
        return;
    } else if (!req.body.description) {
        res.status(400).json({ message: "Descrição da oferta não pode ser vazia!" });
        return;
    } else if (!req.body.emailContact) {
        res.status(400).json({ message: "Email de contacto da empresa não pode ser vazio!" });
        return;
    } else if (!req.body.duration) {
        res.status(400).json({ message: "Duração da oferta não pode ser vazia!" });
        return;
    }




    try {
        //procurar um evento com o nome definido no corpo do pedido
        let findExistingOffer = await Offers.findOne({ where: { typeOfferId: req.body.typeOfferId, areaId: req.body.areaId, companyId: req.body.companyId } });

        //no caso de existir nao deixa criar
        if (findExistingOffer != null) {
            res.status(400).json({
                message: "Oferta já existe!"
            });
            return;
        }

        //no caso de nao existir, cria a nova oferta
        let offer = await Offers.create(req.body);

        res.status(201).json({
            message: "Oferta criada com sucesso.",
            location: "/offers/" + offer.id
        });
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

// Alteração de dados de uma oferta
exports.updateOne = async (req, res) => {
    // verificar se os seguintes dados existem no corpo do pedido
    if (!req.body) {
        res.status(400).json({ message: "Corpo do pedido não pode ser vazio!" });
        return;
    } else if (!req.body.companyId) {
        res.status(400).json({ message: "Empresa não pode ser nula!" });
        return;
    } else if (!req.body.areaId) {
        res.status(400).json({ message: "Area não pode ser nula!" });
        return;
    } else if (!req.body.typeOfferId) {
        res.status(400).json({ message: "Tipo de oferta não pode ser nula!" });
        return;
    } else if (!req.body.description) {
        res.status(400).json({ message: "Descrição da oferta não pode ser vazia!" });
        return;
    } else if (!req.body.emailContact) {
        res.status(400).json({ message: "Email de contacto da empresa não pode ser vazio!" });
        return;
    } else if (!req.body.duration) {
        res.status(400).json({ message: "Duração da oferta não pode ser vazia!" });
        return;
    }

    try {
        //procurar a oferta pelo id definido nos parametros
        let offer = await Offers.findByPk(req.params.offerID);

        //verificar se encontrou a oferta pretendida
        if (offer == null) {
            res.status(404).json({
                message: `Oferta ${req.params.offerID} não existe.`
            });
            return;
        }

        //no caso de encontrar, atualiza a oferta
        let updateOffer = await Offers.update(req.body, { where: { id: req.params.offerID } });

        //verificar se o update foi bem sucedido
        if (updateOffer == 1) {
            res.status(200).json({
                message: `Oferta ${req.params.offerID} alterada com sucesso.`
            });
        } else {
            res.status(400).json({
                message: `Não foi possivel realizar alterações para a oferta ${req.params.offerID}.`
            });
        }
    } catch (e) {
        res.status(500).json({
            message: e.message || `Error updating Offer with id=${req.params.offerID}.`
        });
    }
}

// Remover uma oferta
exports.deleteOne = async (req, res) => {
    try {
        //remover uma oferta atraves do id passado como parametro
        let offer = await Offers.destroy({ where: { id: req.params.offerID } })

        //verificar se eliminou alguma oferta
        if (offer == 1) {
            res.status(200).json({
                message: `Oferta ${req.params.offerID} removida com sucesso!`
            });
        } else {
            res.status(404).json({
                message: `Oferta ${req.params.offerID} não existe.`
            });
        }

    } catch (e) {
        res.status(500).json({
            message: e.message || `Error deleting offer with id=${req.params.offerID}.`
        });
    }
}