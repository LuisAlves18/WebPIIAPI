require('dotenv').config(); // read environment variables from .env file
const express = require('express');
const cors = require('cors'); // middleware to enable CORS (Cross-Origin Resource Sharing)
const app = express();
const port = process.env.PORT || 8080; // if not defined, use port 8080
const host = process.env.HOST || '127.0.0.1'; // if not defined, localhost
app.use(cors()); //enable ALL CORS requests (client requests from other domain)
app.use(express.json()); //enable parsing JSON body data
// root route -- /api/
app.get('/', function(req, res) {
    res.status(200).json({ message: 'home -- alumni api' });
});
// routing middleware for resource TUTORIALS
app.use('/events', require('./routes/events-routes.js'));
app.use('/offers', require('./routes/offers-routes.js'));
app.use('/users', require('./routes/users-routes.js'));
app.use('/auth', require('./routes/auth-routes.js'));
app.use('/eventsType', require('./routes/events-type-routes.js'));
app.use('/offersType', require('./routes/offers-type-routes.js'));
app.use('/status', require('./routes/status-routes.js'));
app.use('/areas', require('./routes/areas-routes.js'));
app.use('/courses', require('./routes/courses-routes.js'));
app.use('/companies', require('./routes/companies-routes.js'));
// handle invalid routes
app.get('*', function(req, res) {
    res.status(404).json({ message: 'WHAT????' });
})
app.listen(port, host, () => console.log(`App listening at http://${host}:${port}/`));
