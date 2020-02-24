const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const postSchema = require('./post.model');

const userSchema = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	name: { type: String, required: false },
	bio: { type: String, required: false },
	email: { type: String, required: true },
	posts: [ postSchema ],
	followers: [ { username: { type: String, required: false } } ],
	following: [ { username: { type: String, required: false } } ],
	date: { type: Date, required: true }
});

userSchema.methods = {
	checkPassword: function (inputPassword) {
		return bcrypt.compareSync(inputPassword, this.password)
	},
	hashPassword: (plainTextPassword => {
		return bcrypt.hashSync(plainTextPassword, 10)
	})
}

userSchema.pre('save', function (next) {
	if (!this.password) {
		console.log('user.model.js no password provided');
		next();
	} else {
		console.log('user.model.js hashpassword in pre save');
		
		this.password = this.hashPassword(this.password);
		console.log('user.model hash password done')

		next();
	}
})

const User = mongoose.model('User', userSchema);
module.exports = User;