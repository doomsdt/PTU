var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var taskSchema = new Schema({
	user: String,
	group: String,
	date: String,
	startTime: String,
	endTime: String,
	contents: String,
	repeat: Number,
	repEndDate: String
});

module.exports = mongoose.model('Task', taskSchema);