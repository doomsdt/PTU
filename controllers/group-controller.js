var Group = require('../models/groups.js');

exports.list = function(req, res){
	var tmp;
	Task.find(function(err,groups){

		tmp = JSON.stringify(groups);
		res.send(tmp);
	});
}

exports.create = function(req, res){
	console.log('Info : ' + req.body.name + ' ' + req.body.leader);
	new Group({
		name: req.body.name,
		leader: req.body.leader
	}).save();
	
	res.end();
}

exports.update = function(req, res){
	console.log('Info : ' + req.body.name + ' ' + req.body.member_id);
	Group.update(
		{name: req.body.name},
		{$addToSet: {members: req.body.member_id}},
		function(err){}
		
	);
	
	res.end();
}

exports.remove = function(req, res){
	
	Group.remove(
		{
			name: req.body.name,
			leader: req.body.leader
		}
	)
	
	res.end();
	
}