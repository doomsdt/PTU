var Task = require('../models/tasks.js');

exports.list = function(req, res) {
	var tmp;
	if(req.body.userId){
		Task.find({date : {$gte:req.body.startDate, $lte:req.body.endDate}, user:req.body.userId}).sort({date: 1, startTime: 1}).exec(function(err,tasks){
	
			tmp = JSON.stringify(tasks);
			res.send(tmp);
		});
	} else{
		Task.find({date : {$gte:req.body.startDate, $lte:req.body.endDate}}).or([{group : req.body.group}, {user : {$in : JSON.parse(req.body.members)}}]).sort({date: 1, startTime: 1}).exec(function(err,tasks){
			tmp = JSON.stringify(tasks);
			res.send(tmp);
		});
	}
};

exports.create = function(req, res) {
	if(req.body.user){
		Task.find(function(err, tasks) {
			new Task({
				user: req.body.user,
				date: req.body.date,
				startTime:req.body.startTime,
				endTime: req.body.endTime,
				contents: req.body.contents
			}).save();			
		});
	}
	
	else{
		Task.find(function(err, tasks) {
			new Task({
				group: req.body.group,
				date: req.body.date,
				startTime:req.body.startTime,
				endTime: req.body.endTime,
				contents: req.body.contents
			}).save();			
		});
	}
	res.end();
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