const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors')
const UserModel = require('./models/User');
const TodoModel = require('./models/Todo');

/** connect to mongoose */
mongoose.connect('mongodb://localhost/tododb');
mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;

/** require auth */
require('./auth/auth');

/** require routes */
const routes = require('./routes/routes');
const todoRoute = require('./routes/todo-routes')

/** app init */
const app = express();

/** cors */
app.use(cors());
/** bodyParser sets */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

/** root route */
app.use('/', routes);
/** check token, if not redirect /login */
app.use((req, res, next) => {
    if (req.query.secret_token) next()
    else res.redirect('/login')
})

/** only verified users can access this route */
app.use('/api', passport.authenticate('jwt', { session: false }), todoRoute);

/** static route */
app.use('/uploads', express.static('./uploads'));

/** Handle errors */
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});

/** listen on port 3000 */
app.listen(3000, () => {
    console.log('Server started.')
});