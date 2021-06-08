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
db.users = require('./users-model.js')(sequelize, DataTypes);
db.courses = require('./courses-model.js')(sequelize, DataTypes);
db.roles = require('./roles-model.js')(sequelize, DataTypes);
db.status = require('./status-model.js')(sequelize, DataTypes);
db.enrollments = require('./enrollments-model.js')(sequelize, DataTypes);
db.receipts = require('./receipts-model.js')(sequelize, DataTypes);



//relationships

//relação entre user e user type
db.roles.hasMany(db.users);
db.users.belongsTo(db.roles);

//relação entre user e user status
db.status.hasMany(db.users);
db.users.belongsTo(db.status);

//relação entre user e course
db.courses.hasMany(db.users);
db.users.belongsTo(db.courses);

//relação entre user e area
db.areas.hasMany(db.users);
db.users.belongsTo(db.areas);

//relação entre offer e type offer
db.offers_type.hasMany(db.offers);
db.offers.belongsTo(db.offers_type);

//relação entre offer e area
db.areas.hasMany(db.offers);
db.offers.belongsTo(db.areas);

//relação entre offer e companie
db.companies.hasMany(db.offers);
db.offers.belongsTo(db.companies);

//relação entre users e enrollments
db.users.hasMany(db.enrollments);
db.enrollments.belongsTo(db.users);

//relação entre events e enrollments
db.events.hasMany(db.enrollments);
db.enrollments.belongsTo(db.events);

//relação entre enrollments e receipts
db.enrollments.hasMany(db.receipts);
db.receipts.belongsTo(db.enrollments);


/* db.events_type.hasMany(db.events); 
db.events.belongsTo(db.events_type); */

module.exports = db;