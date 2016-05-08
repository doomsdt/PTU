var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = new Schema({
	_id: String,
	pic: String,
	name: String
});

module.exports = mongoose.model('User', userSchema);