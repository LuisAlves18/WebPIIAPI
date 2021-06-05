module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("user", {
        alumni_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: {msg: "Alumni number cant be null"}}
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: {msg: "First Name cant be empty"}}
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: {msg: "Last Name cant be empty"}}
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: {msg: "Email cant be empty"}}
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: {msg: "Password cant be empty"}}
        },
        cv: {
            type: DataTypes.STRING
        },
        facebook: {
            type: DataTypes.STRING
        },
        instagram: {
            type: DataTypes.STRING
        },
        linkedIn: {
            type: DataTypes.STRING
        },
        photo: {
            type: DataTypes.STRING
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: {msg: "Points cant be null"}}
        }
    }, {
        timestamps: false,
        tableName: 'users'
    });
    return Users;
};