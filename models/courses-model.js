module.exports = (sequelize, DataTypes) => {
    const Courses = sequelize.define("course", {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: {msg: "Description can not be empty"}}
        }
    }, {
        timestamps: false,
        tableName: 'courses'
    });
    return Courses;
};