var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var memberSchema = new Schema({
	uid: String,
	pic: String,
	name: String,
	groups: [{type: Schema.Types.ObjectId, ref: 'Group'}]
});

module.exports = mongoose.model('Member', memberSchema);