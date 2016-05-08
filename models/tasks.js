var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var taskSchema = new Schema({
	user: String,
	date: String,
	startTime: String,
	endTime: String,
	contents: String
});

module.exports = mongoose.model('Task', taskSchema);