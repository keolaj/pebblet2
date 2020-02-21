const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const passport = require('../passport');

router.post('/', (req, res) => {
	console.log('user sign up');
	console.log('req body: '+ JSON.stringify(req.body));

	const username = req.body.username;
	const password = req.body.password;

	User.findOne({username: username}, (err, user) => {
		if (err) {
			console.log('user.js error: ' + err);
		} else if (user) {
			res.json({
				error: `Sorry, there is already a user with the username: ${username}`
			})
		} else {
			const newUser = new User({
				username: username,
				password: password
			});
			newUser.save()
				.then(() => res.json('user added'))
				.catch(err => res.status(400).json('error: ' + err))
				// .then(res => console.log('user saved successfully! : ' + res))
				// .catch(err => console.log('error: ' + err));
		}
	})
})
router.post('/login', function(req, res, next) {
		console.log('routes/user.routes.js, login, req.body: ' + req.body);
		next();
	}, passport.authenticate('local'), (req, res) => {
		console.log('logged in', req.user);
		let userInfo = {
			username: req.user.username
		}
		res.send(userInfo);
	}
)

module.exports = router;