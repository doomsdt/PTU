var Task = require('../models/tasks.js');

exports.list = function(req, res) {
	var tmp;
	if(req.body.userId){
		Task.find({date : {$gte:req.body.startDate, $lte:req.body.endDate}}).or([{user:req.body.userId}, {group : {$in : JSON.parse(req.body.groups)}}]).sort({date: 1, startTime: 1}).exec(function(err,tasks){	
			tmp = JSON.stringify(tasks);
			res.send(tmp);
		});
	} else{
		Task.find({date : {$gte:req.body.startDate, $lte:req.body.endDate}}).or([{group : {$in : JSON.parse(req.body.groups)}}, {user : {$in : JSON.parse(req.body.members)}}]).sort({date: 1, startTime: 1}).exec(function(err,tasks){
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
				contents: req.body.contents,
				repEndDate: req.body.tmp
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

exports.remove = function(req,res,next) {
	if(req.body.user){
		Task.remove({
			user : req.body.user,
			contents : req.body.contents,
			date : req.body.date,
			startTime : req.body.startTime
		}, function(err){
			if(err)
				throw err;
		});
		res.end();
	} else if(req.body.groupId){
		console.log('task');
		Task.remove({
			group : req.body.groupId
		}, 
		function(err){
			if(err)
				console.log(err);
		});
		next();
	}
	
	else{
		Task.remove({
			group : req.body.group,
			contents : req.body.contents,
			date : req.body.date,
			startTime : req.body.startTime
		}, function(err){
			if(err)
				throw err;
		});
		res.end();
	}

	
};