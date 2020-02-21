const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(fileUpload());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
	.catch(err => console.log(err));
const connection = mongoose.connection;
connection.once('open', () => {
	console.log("MongoDB database connection established successfully")
});
