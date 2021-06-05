module.exports = (sequelize, DataTypes) => {
    const Status = sequelize.define("status", {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: {msg: "Description can not be empty"}}
        }
    }, {
        timestamps: false,
        tableName: 'status'
    });
    return Status;
};