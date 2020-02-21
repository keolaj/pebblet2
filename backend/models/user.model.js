const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
	uuid: { type: String, required: false},
	username: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: false },
	date: { type: Date, required: false }
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

		next();
	}
})

const User = mongoose.model('User', userSchema);
module.exports = User;