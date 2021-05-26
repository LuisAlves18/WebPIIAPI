module.exports = (sequelize, DataTypes) => {
    const Offers = sequelize.define("offer", {
        /* companyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: {msg: "Company can not be null"}}
        }, */
        /* type_offer: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: {msg: "The offer must have a type."}}
        }, */
        /* areaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { notNull: {msg: "Area can not be null"}}
        }, */
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: {msg: "You must write some description!"}}
        },
        emailContact: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: {msg: "The offer must have a contact email!"}}
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: {msg: "You must put a duration for the offer."}}
        }
    }, {
        timestamps: false
    });
    return Offers;
};