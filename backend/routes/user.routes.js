const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Post = require('../models/post.model')
const passport = require('../passport');
const gfs = require('../server');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');

const isUserAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		console.log('user is authenticated, moving on');
		next()
	} else {
		res.status(403).send("User not authenticated");
	}
}

router.post('/', (req, res) => {
	console.log('user sign up');
	console.log('req body: '+ JSON.stringify(req.body));

	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
	const date = new Date();

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
				password: password,
				date: date,
				email: email
			});
			newUser.save()
				.then(() => {
					res.json('user added')
					console.log("user added: "+ res);
				})
				.catch((err) => {
					res.status(400).json('error: ' + err);
					console.log(err);
				})
				// .then(res => console.log('user saved successfully! : ' + res))
				// .catch(err => console.log('error: ' + err));
		}
	})
});

router.get('/', (req, res) => {
    console.log('===== user!!======')
	console.log(JSON.stringify(req.user))
	if (req.user && req.isAuthenticated()) {
		res.json({ user: {
			username: req.user.username,
			posts: req.user.posts,
			id: req.user._id
		}});
	} else {
		res.json({ user: null });
	}
});
router.post('/login', function(req, res, next) {
		console.log('routes/user.routes.js, login, req.body: ' + JSON.stringify(req.body));
		next();
	}, passport.authenticate('local'), (req, res) => {
		console.log('logged in', req.user);
		let userInfo = {
			user: {
				username: req.user.username,
				posts: req.user.posts
			}
		}
		res.send(userInfo);
	}
);

router.post('/logout', (req, res) => {
    if (req.user) {
        req.logout()
        res.send({ msg: 'logging out' })
    } else {
        res.send({ msg: 'no user to log out' })
    }
});
const storage = new GridFsStorage({
	url: 'mongodb+srv://keola:Lokahi1011@cluster0-zqpvq.mongodb.net/test?retryWrites=true&w=majority',
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err)
			  	}
			  	const filename = buf.toString('hex') + path.extname(file.originalname);
			 	const fileInfo = {
					filename: filename,
					bucketName: 'uploads',
			  	}
			  	resolve(fileInfo)
			})
		})
	}
});
const upload = multer({ storage });

router.post('/upload', isUserAuthenticated, upload.single('file'), (req, res) => {
	console.log(req.file);
	let post = {
		fileid: req.file.id,
		date: req.file.uploadDate,
		caption: req.body.caption ? req.body.caption : null
	}
	console.log('user: ' + JSON.stringify(req.user._id));
	
	User.update({_id: req.user._id}, {$push: { 'posts': post}}, () => {
		console.log('done adding post');
	})

	res.status(200).send();
});

router.get('/users/:username', isUserAuthenticated, (req, res) => {
	
	console.log("req params for get username: " +  req.params.username)
	User.findOne({username: req.params.username}, (err, obj) => {
		console.log("obj console.log for get user: " + obj)
		let userInfo = {
			user: {
				username: obj.username,
				posts: obj.posts,
				name: obj.name,
				bio: obj.bio
			}
		};
		res.json(userInfo);
	});
})

router.post('/users/:username/:post/like', isUserAuthenticated, (req, res) => {
	let date = new Date()
	User.update({
		username: req.params.username,
		posts: {
		_id: req.params.post,
		likes: {$push: {
			userid: req.user._id,
			date: date
		}}
	}}, () => {
		console.log('like added');
	})
})

router.post('/users/:username/:post/comment', isUserAuthenticated, (req, res) => {
	let date = new Date()
	User.update({
		username: req.params.username,
		posts: {
			_id: req.params.post,
			comments: {$push: {
				userid: req.user._id,
				comment: req.body.comment,
				date: date
			}}
		}
	}, () => {
		console.log('comment added')
	})
})

module.exports = router;