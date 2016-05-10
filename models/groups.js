var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var groupSchema = new Schema({
	name: String,
	leader: {type: Schema.Types.ObjectId, ref: 'Member'},
	members: [{type: Schema.Types.ObjectId, ref: 'Member'}]
});

module.exports = mongoose.model('Group', groupSchema);