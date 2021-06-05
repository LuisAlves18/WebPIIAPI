module.exports = (sequelize, DataTypes) => {
    const Enrollments = sequelize.define("enrollment", {
        enrolled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: { notNull: {msg: "Enrolled can not be empty"}}
        }
    }, {
        timestamps: false
    });
    return Enrollments;
};