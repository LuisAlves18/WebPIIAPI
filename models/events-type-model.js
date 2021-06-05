module.exports = (sequelize, DataTypes) => {
    const Events_Type = sequelize.define("events_type", {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: {msg: "Description can not be empty"}}
        }
    }, {
        timestamps: false,
        tableName: 'events_type'
    });
    return Events_Type;
};