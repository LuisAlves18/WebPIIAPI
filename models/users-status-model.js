module.exports = (sequelize, DataTypes) => {
    const Users_status = sequelize.define("status_user", {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: {msg: "Description can not be empty"}}
        }
    }, {
        timestamps: false
    });
    return Users_status;
};