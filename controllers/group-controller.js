var Group = require('../models/groups.js');

exports.list = function(req, res){
	var tmp;
	Group.find({},'name leader',function(err,groups){

		tmp = JSON.stringify(groups);
		res.send(tmp);
	});
}

exports.members = function(req, res){
	var tmp;
	Group.find({_id:req.body.groupId},'members',function(err,arr){

		tmp = JSON.stringify(arr);
		res.send(tmp);
	});
}

exports.create = function(req, res){
	new Group({
		name: req.body.name,
		leader: req.body.leader_id
	}).save();
	
	res.end();
}

exports.update = function(req, res){
	Group.update(
		{_id: req.body.id},
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