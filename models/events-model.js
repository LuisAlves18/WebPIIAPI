module.exports = (sequelize, DataTypes) => {
    const Events = sequelize.define("events", {
        id_event_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: {msg: "Event type must be defined"}}
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Name can not be empty!" } } 
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: { msg: "Price can not be null!" } } 
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Description can not be empty!" } }
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Description can not be empty!" } }
        },
        date_time_event: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: { notNull: { msg: "Description can not be empty!" } }
        },
        date_limit: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: { notNull: { msg: "Description can not be empty!" } }
        },
        link: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        nrLimit: {
            type: DataTypes.INTEGER
        },
        closed: {
            type: DataTypes.BOOLEAN
        }
    }, {
        timestamps: false,
        tableName: 'events'
    });
    return Events;
};