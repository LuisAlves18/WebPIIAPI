module.exports = (sequelize, DataTypes) => {
    const Roles = sequelize.define("role", {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: {msg: "Description can not be empty"}}
        }
    }, {
        timestamps: false
    });
    return Roles;
};