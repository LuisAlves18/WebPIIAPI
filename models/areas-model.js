module.exports = (sequelize, DataTypes) => {
    const Areas = sequelize.define("area", {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: {msg: "Description can not be empty"}}
        }
    }, {
        timestamps: false
    });
    return Areas;
};