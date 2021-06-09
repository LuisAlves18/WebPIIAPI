const db = require('../models/db.js');
const Companies = db.companies;
const Offers = db.offers;

exports.getCompanies = async (req, res) => {
    try {
        let companies = await Companies.findAll();

        if (companies == null) {
            res.status(404).json({
                message: `Could not find any companies.`
            });
            return;
        }

        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.createCompany = async (req, res) => {
    try {

        //verificar se o conteudo necessario vem no body
        if (!req.body) {
            res.status(400).json({
                message: `Request body can not be empty`
            });
            return;
        } else if (!req.body.name) {
            res.status(400).json({
                message: `Company name can not be empty`
            });
            return;
        } else if (!req.body.email) {
            res.status(400).json({
                message: `Company email can not be empty`
            });
            return;
        } else if (!req.body.address) {
            res.status(400).json({
                message: `Company address can not be empty`
            });
            return;
        } else if (!req.body.website) {
            res.status(400).json({
                message: `Company website can not be empty`
            });
            return;
        } else if (!req.body.logo) {
            res.status(400).json({
                message: `Company logo can not be empty`
            });
            return;
        } else if (!req.body.linkedIn) {
            res.status(400).json({
                message: `Company linkedIn link can not be empty`
            });
            return;
        } else if (!req.body.about) {
            res.status(400).json({
                message: `Company about text can not be empty`
            });
            return;
        }

        //verificar se a empresa ja existe pelo nome
        let company = await Companies.findOne({where: {name: req.body.name}});

        if (company != null) {
            res.status(400).json({
                message: `Company ${req.body.name} already exists!`
            });
            return;
        }

        //criar a empresa
        let createCompany = await Companies.create(req.body);

        res.status(201).json({
            message: "New company created.",
            location: "/companies/" + createCompany.id
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.getOneCompany = async (req, res) => {
    try {
        //verificar se existe a empresa
        let company = await Companies.findByPk(req.params.companyID);

        if (company == null) {
            res.status(404).json({
                message: `Company with id ${req.params.companyID} not found.`
            });
            return;
        }

        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.deleteCompany = async (req,res) => {
    try {
        //eliminar caso existam ofertas relacionadas com a empresa
        let removeOffers = await Offers.destroy({where: {companyId: req.params.companyID}});
        //elimnar a empresa
        let removeCompany = await Companies.destroy({where: {id: req.params.companyID}});

        if (removeCompany == 1) {
            res.status(200).json({
                message: `Company successfuly deleted.`
            });
            return;
        } else {
            res.status(404).json({
                message: `Company with id ${req.params.companyID} not found.`
            });
            return;
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.updateCompany = async (req, res) => {
    try {
        //verificar se a empresa existe
        let company = await Companies.findByPk(req.params.companyID);

        if (company == null) {
            res.status(404).json({
                message: `Company with id ${req.params.companyID} not found.`
            });
            return;
        }

        //verificar se o conteudo necessario vem no body
        if (!req.body) {
            res.status(400).json({
                message: `Request body can not be empty`
            });
            return;
        } else if (!req.body.name) {
            res.status(400).json({
                message: `Company name can not be empty`
            });
            return;
        } else if (!req.body.email) {
            res.status(400).json({
                message: `Company email can not be empty`
            });
            return;
        } else if (!req.body.address) {
            res.status(400).json({
                message: `Company address can not be empty`
            });
            return;
        } else if (!req.body.website) {
            res.status(400).json({
                message: `Company website can not be empty`
            });
            return;
        } else if (!req.body.logo) {
            res.status(400).json({
                message: `Company logo can not be empty`
            });
            return;
        } else if (!req.body.linkedIn) {
            res.status(400).json({
                message: `Company linkedIn link can not be empty`
            });
            return;
        } else if (!req.body.about) {
            res.status(400).json({
                message: `Company about text can not be empty`
            });
            return;
        }

        let updateCompany = await Companies.update(req.body, {where: {id: req.params.companyID}});

        if (updateCompany == 1) {
            res.status(200).json({
                message: `Company with id ${req.params.companyID} updated successfully.`
            });
            return;
        }


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}