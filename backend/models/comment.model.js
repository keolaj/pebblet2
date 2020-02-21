const mongoose = require('mongoose');
const Schema = mongoose.Schema

const commentSchema = new Schema({
	postuuid: { type: String, required: true },
	username: { type: String, required: true},
	comment: { type: String, required: true },
	date: { type: Date, required: true }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;