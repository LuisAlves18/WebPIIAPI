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
            return res.status(400).json({ message: "Failed! Email is already in use!" });
        } else {
            user = await User.findOne({ where: { alumni_number: req.body.alumni_number } })
            if (user) {
                return res.status(400).json({ message: "Failed! Alumni Number is already in use!" });
            }
        }

        //validate request body informations
        if (!req.body) {
            res.status(400).json({ message: "Request body can not be empty!" });
            return;
        } else if (!req.body.first_name) {
            res.status(400).json({ message: "User First Name can not be empty!" });
            return;
        } else if (!req.body.last_name) {
            res.status(400).json({ message: "User Last Name can not be empty!" });
            return;
        } else if (!req.body.email) {
            res.status(400).json({ message: "User Email can not be empty!" });
            return;
        } else if (!req.body.alumni_number) {
            res.status(400).json({ message: "Alumni number can not be empty!" });
            return;
        } else if (!req.body.password) {
            res.status(400).json({ message: "Password can not be empty!" });
            return;
        }else if (!req.body.courseId) {
            res.status(400).json({ message: "User Course can not be empty!" });
            return;
        }else if (!req.body.areaId) {
            res.status(400).json({ message: "User Interess Area can not be empty!" });
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
            roleId: 1,
            statusId: 1, //estado pendente aguarda confirmação de admin
            courseId: req.body.courseId,
            areaId: req.body.areaId
        });
        return res.json({ message: "User was registered successfully!" });



    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.signin = async (req, res) => {
    try {
        let user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password, user.password
        );

        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null, message: "Invalid Password!"
            });
        }

        /* let status = await Status.findByPk(user.statusId);

        if (status.description == 'blocked') {
            return res.status(401).json({
                accessToken: null, message: "Oops, your account is blocked!"
            });
        } else if (status.description == 'pending') {
            return res.status(401).json({
                accessToken: null, message: "Oops, your account was not acepted yet!"
            });
        } */

        /* let status = await user.getStatus(Status)
        console.log(status); */

        if (user.statusId == 2) {
            return res.status(401).json({
                accessToken: null, message: "Oops, your account is blocked!"
            });
        } else if (user.statusId == 3) {
            return res.status(401).json({
                accessToken: null, message: "Oops, your account was not acepted yet!"
            });
        }

        const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 }); //24h expira

        let role = await Roles.findByPk(user.roleId)

        return res.status(200).json({
            id: user.id, email: user.email, role: role.description, accessToken: token
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
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.loggedUserId = decoded.id;
        console.log(decoded.id);
        next();

    })

}

exports.isAdmin = async (req, res, next) => {
    let user = await User.findByPk(req.loggedUserId);
    let role = await user.getRole();
    req.loggedUserRole = role.description;
    if (role.description != 'admin') {
        return res.status(403).send({ message: "Require admin role!" })

    }
    next();
};

exports.isAdminOrLoggedUser = async (req, res, next) => {
    let user = await User.findByPk(req.loggedUserId);
    let role = await user.getRole();
    req.loggedUserRole = role.description;
    if (role.description != 'admin' && user.id != req.params.userID) {
        return res.status(403).send({ message: "Require admin role" })
    }
    next();


}