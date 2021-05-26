module.exports = (sequelize, DataTypes) => {
    const Offers_Type = sequelize.define("type_offer", {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: {msg: "Description can not be empty"}}
        }
    }, {
        timestamps: false
    });
    return Offers_Type;
};