const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
	uuid: { type: String, required: true },
	useruuid: { type: String, required: true },
	caption: { type: String, required: false },
	date: { type: Date, required: true }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
