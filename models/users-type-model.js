module.exports = (sequelize, DataTypes) => {
    const Users_Type = sequelize.define("type_user", {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: {msg: "Description can not be empty"}}
        }
    }, {
        timestamps: false
    });
    return Users_Type;
};