module.exports = (sequelize, DataTypes) => {
    const Receipts = sequelize.define("receipt", {
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: {msg: "Price can not be empty"}}
        },
        paid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {notNull: {msg: "Paid Property can not be empty"}}
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {notNull: {msg: "Discount can not be empty"}}
        }
    }, {
        timestamps: false,
        tableName: 'receipts'
    });
    return Receipts;
};