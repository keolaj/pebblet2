const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	uuid: { type: String, required: true },
	username: { type: String, required: true },
	email: { type: String, required: false },
	date: { type: Date, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;