const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
	username: { type: String, required: true},
	comment: { type: String, required: true },
	date: { type: Date, required: true },
});

const likeSchema = new Schema({
	username: { type: String, required: true },
	date: { type: Date, required: true }
})

const postSchema = new Schema({
	fileid: { type: String, required: true },
	caption: { type: String, required: false },
	comments: { type: [commentSchema] },
	likes: { type: [likeSchema] },
	date: { type: Date, required: false }
});


module.exports = postSchema;