const router = require('express').Router();
let postModel = require('../models/post.model.js');
const uuid = require('uuid/v1');

router.route('upload').post((req, res) => {
	const postUuid = uuid();
	const useruuid = req.body.useruuid;
	const caption = req.body.caption;
	const date = new Date();

	const newPost = new postModel({
		postUuid,
		useruuid,
		caption,
		date
	});
	newPost.save()
		.then(() => res.json('Post added'))
		.catch(err => res.status(400).json('Error: ' + err));
})