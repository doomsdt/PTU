var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var memberSchema = new Schema({
	uid: String,
	pic: String,
	name: String
});

module.exports = mongoose.model('Member', memberSchema);