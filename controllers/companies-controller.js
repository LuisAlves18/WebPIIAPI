const db = require('../models/db.js');
const Companies = db.companies;
const Offers = db.offers;

exports.getCompanies = async (req, res) => {
    try {
        let companies = await Companies.findAll();

        if (companies == null) {
            res.status(404).json({
                message: `Não foram encontradas empresas.`
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
                message: `Corpo do pedido não pode ser vazio!`
            });
            return;
        } else if (!req.body.name) {
            res.status(400).json({
                message: `Nome da empresa não pode ser vazio!`
            });
            return;
        } else if (!req.body.email) {
            res.status(400).json({
                message: `Email da empresa não pode ser vazio!`
            });
            return;
        } else if (!req.body.address) {
            res.status(400).json({
                message: `Morada da empresa não pode ser vazia!`
            });
            return;
        } else if (!req.body.website) {
            res.status(400).json({
                message: `Website da empresa não pode ser vazio!`
            });
            return;
        } else if (!req.body.logo) {
            res.status(400).json({
                message: `Logotipo da empresa não pode ser vazio!`
            });
            return;
        } else if (!req.body.linkedIn) {
            res.status(400).json({
                message: `Link do linkedIn da empresa não pode ser vazio!`
            });
            return;
        } else if (!req.body.about) {
            res.status(400).json({
                message: `Descrição sobre a empresa não pode ser vazia!`
            });
            return;
        }

        //verificar se a empresa ja existe pelo nome
        let company = await Companies.findOne({where: {name: req.body.name}});

        if (company != null) {
            res.status(400).json({
                message: `Empresas ${req.body.name} já existe!`
            });
            return;
        }

        //criar a empresa
        let createCompany = await Companies.create(req.body);

        res.status(201).json({
            message: "Nova empresa adicionada.",
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
                message: `Empresa ${req.params.companyID} não foi encontrada.`
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
                message: `Empresa removida com sucesso.`
            });
            return;
        } else {
            res.status(404).json({
                message: `Empresa ${req.params.companyID} não existe.`
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
                message: `Empresa ${req.params.companyID} não existe.`
            });
            return;
        }

         //verificar se o conteudo necessario vem no body
         if (!req.body) {
            res.status(400).json({
                message: `Corpo do pedido não pode ser vazio!`
            });
            return;
        } else if (!req.body.name) {
            res.status(400).json({
                message: `Nome da empresa não pode ser vazio!`
            });
            return;
        } else if (!req.body.email) {
            res.status(400).json({
                message: `Email da empresa não pode ser vazio!`
            });
            return;
        } else if (!req.body.address) {
            res.status(400).json({
                message: `Morada da empresa não pode ser vazia!`
            });
            return;
        } else if (!req.body.website) {
            res.status(400).json({
                message: `Website da empresa não pode ser vazio!`
            });
            return;
        } else if (!req.body.logo) {
            res.status(400).json({
                message: `Logotipo da empresa não pode ser vazio!`
            });
            return;
        } else if (!req.body.linkedIn) {
            res.status(400).json({
                message: `Link do linkedIn da empresa não pode ser vazio!`
            });
            return;
        } else if (!req.body.about) {
            res.status(400).json({
                message: `Descrição sobre a empresa não pode ser vazia!`
            });
            return;
        }


        let updateCompany = await Companies.update(req.body, {where: {id: req.params.companyID}});

        if (updateCompany == 1) {
            res.status(200).json({
                message: `Dados da empresa ${req.params.companyID} alterados com sucesso.`
            });
            return;
        }


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}