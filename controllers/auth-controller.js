const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require('../config/auth-config.js');
const db = require('../models/db.js');
const User = db.users;
const Roles = db.roles;
const Status = db.status;


exports.signup = async (req, res) => {
    try {
        //let check duplicate email
        let user = await User.findOne({ where: { email: req.body.email } });
        if (user) {
            return res.status(400).json({ message: "Este email já existe!" });
        } else {
            user = await User.findOne({ where: { alumni_number: req.body.alumni_number } })
            if (user) {
                return res.status(400).json({ message: "O número de alumni já existe!" });
            }
        }

        //validate request body informations
        if (!req.body) {
            res.status(400).json({ message: "Corpo do pedido não pode ser vazio!" });
            return;
        } else if (!req.body.first_name) {
            res.status(400).json({ message: "Primeiro nome não pode ser vazio!" });
            return;
        } else if (!req.body.last_name) {
            res.status(400).json({ message: "Último nome não pode ser vazio!" });
            return;
        } else if (!req.body.email) {
            res.status(400).json({ message: "Email não pode ser vazio!" });
            return;
        } else if (!req.body.alumni_number) {
            res.status(400).json({ message: "Número de alumni não pode ser nulo!" });
            return;
        } else if (!req.body.password) {
            res.status(400).json({ message: "Password não pode ser vazia!" });
            return;
        }else if (!req.body.courseId) {
            res.status(400).json({ message: "Curso frequentado pelo aluno não pode ser vazio!" });
            return;
        }else if (!req.body.areaId) {
            res.status(400).json({ message: "Área de interesse do aluno não pode ser vazia!" });
            return;
        }




        user = await User.create({
            alumni_number: req.body.alumni_number,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            cv: '',
            facebook: '',
            instagram: '',
            linkedIn: '',
            photo: '',
            points: 0,
            roleId: 2,
            statusId: 3, //estado pendente aguarda confirmação de admin
            courseId: req.body.courseId,
            areaId: req.body.areaId
        });
        return res.json({ message: "Utilizador registado à espera de aprovação!" });



    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.signin = async (req, res) => {
    try {
        let user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            return res.status(404).json({ message: "Utilizador não encontrado!" });
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password, user.password
        );

        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null, message: "Password inválida!"
            });
        }

        let status = await Status.findByPk(user.statusId);

        if (status.description == 'blocked') {
            return res.status(401).json({
                accessToken: null, message: "A tua conta encontra-se bloqueada!"
            });
        } else if (status.description == 'pending') {
            return res.status(401).json({
                accessToken: null, message: "A tua conta ainda não foi aceite!"
            });
        }

        const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 }); //24h expira

        let role = await Roles.findByPk(user.roleId)

        return res.status(200).json({
            id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: role.description, accessToken: token
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({
            message: "Nenhum token enviado!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Sem autorização!" });
        }
        req.loggedUserId = decoded.id;
        console.log(decoded.id);
        next();

    })

}

exports.verifyLoginUser = (req,res,next) => {
    let token = req.headers['x-access-token'];

    if (!token) {
        req.loggedUserId = null;
        next();
    } else {
        jwt.verify(token, config.secret, (err, decoded)=>{
            if (err) {
                return res.status(401).send({message: "Sem autorização!"});
            }

            req.loggedUserId = decoded.id;
            next();
        })
    }
}

exports.verifyUserRole = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) {
        req.loggedUserRole = 'user';
        req.loggedUserId = null;
        next();
    } else {
        jwt.verify(token, config.secret, (err, decoded)=>{
            if (err) {
                return res.status(401).send({message: "Sem autorização!"});
            }

            req.loggedUserId = decoded.id;
            next();
            
        })
    }
}

exports.isAdmin = async (req, res, next) => {
    let user = await User.findByPk(req.loggedUserId);
    let role = await user.getRole();
    req.loggedUserRole = role.description;
    if (role.description != 'admin') {
        return res.status(403).send({ message: "Necessário ser admin para executar esta ação!" })

    }
    next();
};

exports.isAdminOrLoggedUser = async (req, res, next) => {
    let user = await User.findByPk(req.loggedUserId);
    let role = await user.getRole();
    req.loggedUserRole = role.description;
    if (role.description != 'admin' && user.id != req.params.userID) {
        return res.status(403).send({ message: "Necessário ser admin para executar esta ação!" })
    }
    next();


}

exports.isLoggedUser = async (req, res, next) => {
    let user = await User.findByPk(req.loggedUserId);
    let role = await user.getRole();
    req.loggedUserRole = role.description;
    if (role.description == 'admin') {
        return res.status(403).send({ message: "Necessário ser utilizador para executar esta ação!" })
    }
    next();


}

exports.checkIsUserOrAdmin = async (req, res, next) => {
    if (req.loggedUserId != null) {
        let user = await User.findByPk(req.loggedUserId);
        if (user.roleId == 1) {
            req.loggedUserRole = 'admin';
            next();
        } else {
            req.loggedUserRole = 'user';
            next();
        }
    }
}