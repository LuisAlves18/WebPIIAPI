module.exports = (sequelize, DataTypes) => {
    const Companies = sequelize.define("company", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: {msg: "Name can not be empty"}}
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: "Email can not be empty."}
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: "You must put an address."}
            }
        },
        website: {
            type: DataTypes.STRING
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: "You must put an image."}
            }
        },
        linkedIn: {
            type: DataTypes.STRING         
        },
        about: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: "You must write some about your company."}
            }
        }
    }, {
        timestamps: false,
        tableName: 'companies'
    });
    return Companies;
};