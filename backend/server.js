const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const user = require('./routes/user.routes');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(fileUpload());
app.use(session({
	secret: "ajslkfdjlkent",
	resave: false,
	saveUnitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	})
	.catch(err => console.log(err));
const connection = mongoose.connection;
connection.once('open', () => {
	console.log("MongoDB database connection established successfully")
});

app.use('/user', user);

app.listen(port, () => {
	console.log('App listening on port: ' + port);
})