const express = require('express');
const mongoose = require('mongoose');
const user = require('./routes/user.routes');
const session = require('express-session');
const passport = require('passport');
const Grid = require('gridfs-stream');
const multer = require('multer');
const bodyParser = require('body-parser')
const GridFsStorage = require('multer-gridfs-storage');
const methodOverride = require('method-override');
const crypto = require('crypto');
const path = require('path')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(session({
	secret: "ajslkfdjlkent",
	resave: false,
	saveUnitialized: false
}));
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
	gfs = Grid(connection.db, mongoose.mongo);
	gfs.collection('uploads');
	module.exports = gfs
});

app.use('/user', user);

app.listen(port, () => {
	console.log('App listening on port: ' + port);
});