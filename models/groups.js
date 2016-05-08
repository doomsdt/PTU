var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var groupSchema = new Schema({
	name: String,
	leader: String,
	members: [String]
});

module.exports = mongoose.model('Group', groupSchema);