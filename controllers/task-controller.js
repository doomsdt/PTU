var Task = require('../models/tasks.js');

exports.list = function(req, res) {
	
	var tmp;
	Task.find({date : {$gte:req.body.startDate, $lte:req.body.endDate}}).sort({date: 1, startTime: 1}).exec(function(err,tasks){

		tmp = JSON.stringify(tasks);
		res.send(tmp);
	});
};

exports.create = function(req, res) {
	
	Task.find(function(err, tasks) {
		new Task({
			date: req.body.date,
			startTime:req.body.startTime,
			endTime: req.body.endTime,
			contents: req.body.contents
		}).save();
		
		res.end();
		
	});
};

exports.update = function(req, res) {
	
	Task.update({
		contents : req.body.contents
	}, {
		status : req.body.status
	}, function(err, numberAffected, raw) {
		if (err)
			throw err;
		console.log('The number of updated documents was %d', numberAffected);
		console.log('The raw response from MongoDB was ', raw);
	});
	res.redirect('/');
	res.end();
};

exports.remove = function(req,res) {
	
	Task.remove({
		contents : req.body.contents,
		date : req.body.date,
		startTime : req.body.startTime
	}, function(err){
		if(err)
			throw err;
	});

	res.end();
};