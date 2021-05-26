const dbConfig = require('../config/db-config.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect
    ,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const db = {};
db.sequelize = sequelize;

//export TUTORIAL model
db.events = require("./events-model.js")(sequelize, DataTypes);
db.events_type = require("./events-type-model.js")(sequelize, DataTypes);
db.offers = require('./offers-model.js')(sequelize, DataTypes);
db.offers_type = require('./offers-type-model.js')(sequelize, DataTypes);
db.companies = require('./companies-model.js')(sequelize, DataTypes);
db.areas = require('./areas-model.js')(sequelize, DataTypes);

db.offers_type.hasMany(db.offers);
db.offers.belongsTo(db.offers_type);

db.areas.hasMany(db.offers);
db.offers.belongsTo(db.areas);

db.companies.hasMany(db.offers);
db.offers.belongsTo(db.companies);


/* db.events_type.hasMany(db.events); 
db.events.belongsTo(db.events_type); */

module.exports = db;