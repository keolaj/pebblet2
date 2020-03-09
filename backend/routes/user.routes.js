const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const postSchema = require('../models/post.model')
const passport = require('../passport');
const gfs = require('../server');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const videoParser = require('node-video-lib').MP4Parser;
const stream = require('stream');
const sendSeekable = require('send-seekable');

router.use(sendSeekable);

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
	console.log('req body: ' + JSON.stringify(req.body));

	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
	const date = new Date();

	User.findOne({
		username: username
	}, (err, user) => {
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
					console.log("user added: " + res);
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
		console.log('user is authenticated')
		User.findOne({
			_id: req.user._id
		}, (err, obj) => {
			let userInfo = {
				username: obj.username,
				date: obj.date,
				email: obj.email,
				following: obj.following,
				followers: obj.followers,
				posts: obj.posts
			}
			if (err) {
				res.status(400).send();
				return
			}
			res.json({
				user: userInfo
			})
		})
	} else {
		res.json({
			user: null
		});
	}
});

router.post('/login', function (req, res, next) {
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
});

router.post('/logout', (req, res) => {
	if (req.user) {
		req.logout()
		res.send({
			msg: 'logging out'
		})
	} else {
		res.send({
			msg: 'no user to log out'
		})
	}
});
// const storage = new GridFsStorage({
// 	url: 'mongodb+srv://keola:thisismypassword@cluster0-zqpvq.mongodb.net/test?retryWrites=true&w=majority',
// 	file: (req, file) => {
// 		return new Promise((resolve, reject) => {
// 			crypto.randomBytes(16, (err, buf) => {
// 				if (err) {
// 					return reject(err)
// 				}
// 				const filename = buf.toString('hex') + path.extname(file.originalname);
// 				const fileInfo = {
// 					filename: filename,
// 					bucketName: 'uploads',
// 				}
// 				resolve(fileInfo)
// 			})
// 		})
// 	}
// });
const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		return cb(null, true)
	}
});

router.post('/upload', isUserAuthenticated, upload.single('file'), (req, res) => {
	console.log(req.file);
	console.log('upload file from: ' + JSON.stringify(req.user._id));
	console.log("original name extension: " + path.extname(req.file.originalname))
	if (path.extname(req.file.originalname) != ".mp4" && path.extname(req.file.originalname) != ".jpeg") {
		return res.status(404).send();
	} else {
		crypto.randomBytes(16, (err, buf) => {
			if (err) {
				return reject(err)
			}
			if (path.extname(req.file.originalname) === ".mp4") {
				const vid = videoParser.parse(req.file.buffer)
				console.log("resolution: " + vid.resolution())
			}
			const filename = buf.toString('hex') + path.extname(req.file.originalname).toUpperCase();
			const uploadStream = gfs.gfs.openUploadStream(filename)
			uploadStream.write(req.file.buffer);
			uploadStream.end();
			let post = {
				fileid: uploadStream.id,
				date: req.file.uploadDate,
				extension: path.extname(req.file.originalname),
				caption: req.body.caption ? req.body.caption : null
			}
			User.update({
				_id: req.user._id
			}, {
				$push: {
					'posts': post
				}
			}, () => {
				console.log('done adding post');
			})

			res.status(200).send();
		})
	}
});

router.get('/users/:username', isUserAuthenticated, (req, res) => {

	console.log("req params for get username: " + req.params.username)
	let userInfo = {}
	User.findOne({
		username: req.params.username
	}, (err, obj) => {
		if (err) {
			console.log(err);
		} else {
			console.log("obj console.log for get user: " + obj)
			userInfo = {
				user: {
					username: obj.username,
					posts: obj.posts,
					name: obj.name,
					bio: obj.bio
				}
			};
			return res.json(userInfo);
			// userInfo.user.posts.forEach((val, index) => {
			// 	gfs.gfs.findOne({_id: userInfo.user.posts[index].fileid}, (err, file) => {
			// 		console.log('file id: ' + userInfo.user.posts[index].fileid)
			// 		console.log('file test: ' + JSON.stringify(file));
			// 		userInfo.user.posts[index].file = file;
			// 		console.log("file test on user object: " + JSON.stringify(userInfo.user.posts[index].file))
			// 		return res.json(userInfo.user.posts);
			// 	});
			// })
		}
	});
})

const gridSchema = new mongoose.Schema({
	length: {
		type: Number
	}
}, {
	strict: false
});
const Grid = mongoose.model('Grid', gridSchema, 'fs.files')

router.get('/users/:username/:post', isUserAuthenticated, sendSeekable, (req, res) => {
	Grid.findById(req.params.post, (err, obj) => {
		if (obj) {
			console.log("obj: " + obj.length);
			let readStream = gfs.gfs.openDownloadStream(mongoose.Types.ObjectId(req.params.post))
			res.sendSeekable(readStream, {
				type: 'video/mp4',
				length: obj.length
			})
			// readStream.on('data', (file) => {
			// 	res.status(206);

			// 	res.setHeader('Content-Length', obj.length.toString());
			// 	res.send(file)
			// })
		}
	})

})

router.post('/users/:username/:post/like', isUserAuthenticated, (req, res) => {
	let date = new Date()
	User.update({
		username: req.params.username,
		posts: {
			_id: req.params.post,
			likes: {
				$addToSet: {
					username: req.user.username,
					date: date
				}
			}
		}
	}, () => {
		console.log('like added');
	})
})

router.post('/users/:username/:post/comment', isUserAuthenticated, (req, res) => {
	let date = new Date()
	User.update({
		username: req.params.username,
		posts: {
			_id: req.params.post,
			comments: {
				$push: {
					username: req.user.username,
					comment: req.body.comment,
					date: date
				}
			}
		}
	}, () => {
		console.log('comment added')
	})
})

router.post('/users/:username/follow', isUserAuthenticated, (req, res) => {
	if (req.user.username === req.params.username) return res.status(404).json({
		err: 'you are trying to follow yourself'
	});
	User.findOneAndUpdate({
			username: req.params.username,
			'followers.username': {
				$ne: req.user.username
			}
		},
		({
			$addToSet: {
				followers: {
					username: req.user.username
				}
			}
		}), (err, res) => {
			if (err) {
				console.log(err)
			} else {
				console.log('follower added')
			}
		})
	User.findOneAndUpdate({
			username: req.user.username,
			'following.username': {
				$ne: req.params.username
			}
		},
		({
			$addToSet: {
				following: {
					username: req.params.username
				}
			}
		}), (err, res) => {
			if (err) {
				console.log(err)
			} else {
				console.log('following added')
			}
		})
	// let userToFollow = User.findOne({username: req.params.username})
	// if (!userToFollow.followers.find({username: req.user.username})) {
	// 	userToFollow.followers.push({uesrname: req.user.username});
	// 	userToFollow.save(() => {
	// 		console.log('follower added')
	// 	})
	// } else {
	// 	console.log('user already is a follower')
	// }

	// let followingUser = User.findById(req.user._id);
	// if (!followingUser.following.find({username: req.params.username})) {
	// 	followingUser.following.push({username: req.params.username})
	// 	followingUser.save(() => {
	// 		console.log('following added')
	// 	})
	// } else {
	// 	console.log('user is already following')
	// }
});

router.get('/feed/:index', isUserAuthenticated, (req, res) => {
	User.findOne({
		_id: req.user._id
	}, (err, reqUser) => {
		if (err) {
			console.log("feed error: " + err)
			return;
		} else if (reqUser) {
			let feed = []
			let promises = []
			for (user of reqUser.following) {
				const findPromise = User.findOne({username: user.username}).exec();
				promises.push(findPromise);
				findPromise.then(followingUser => {
					if (followingUser) {
						Array.prototype.push.apply(feed, followingUser.posts)
					}
				})
			}
			Promise.all(promises).then(() => {
				res.json({
					feed: feed
				})
			}).catch(err => console.log("promise err: " + err))
		}
	})
})

module.exports = router;