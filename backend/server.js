const express = require('express');
const mongoose = require('mongoose');
const user = require('./routes/user.routes');
const session = require('express-session');
const passport = require('passport');
const multer = require('multer');
const bodyParser = require('body-parser')
const methodOverride = require('method-override');
const crypto = require('crypto');
const path = require('path');
const MongoStore = require('connect-mongo')(session)

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(session({
	secret: "ajslkfdjlkent",
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({mongooseConnection: mongoose.connection, collection: 'session'})
}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json())
app.use(methodOverride('_method'))

let gfs;
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	})
	.catch(err => console.log(err));
const connection = mongoose.connection;
connection.once('open', () => {
	console.log("MongoDB database connection established successfully");
	const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, 'uploads');
	module.exports.gfs = gfs
});

app.use('/user', user);

app.listen(port, () => {
	console.log('App listening on port: ' + port);
});