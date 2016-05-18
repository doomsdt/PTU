var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var groupSchema = new Schema({
	name: String,
	leader: {type: String},
	members: [{type: String}]
});

module.exports = mongoose.model('Group', groupSchema);