const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;

const strategy = new LocalStrategy(
	{
		usernameField: 'username'
	},
	function(username, password, done) {
		User.findOne({ username: username }, (err, user) => {
			if (err) {
				return done(err);
			} if (!user) {
				return done(null, false, { message: 'incorrect username' })
			} if(!user.checkPassword(password)) {
				return done(null, false, { message: 'incorrect password'})
			}
			return done(null, user)
		})
	}
)

module.exports = strategy;