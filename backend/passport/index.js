const passport = require('passport');
const LocalStrategy = require('./localStrategy');
const User = require('../models/user.model');

passport.serializeUser((user, done) => {
	console.log('serialize user called');
	console.log(user);
	console.log('-----');
	done(null, { _id: user._id })
})

passport.deserializeUser((id, done) => {
	console.log('deserializeuser called');
	User.findOne(
		{ _id: id },
		'username',
		(err, user) => {
			console.log('deserializeuser user: ' + user);
			console.log('------');
			done(null, user);
		}
	)
})

passport.use(LocalStrategy);

module.exports = passport;