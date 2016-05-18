var Group = require('../models/groups.js');

exports.list = function(req, res){
	var tmp;
	if(req.body.leaderId){	//find by leaderId
		Group.find({leader : req.body.leaderId},'name',function(err,groups){
			tmp = JSON.stringify(groups);
			res.send(tmp);
		});
	}
	else if(req.body.groups){
		Group.find({_id : {$in : JSON.parse(req.body.groups)}},'name',function(err,groups){
			tmp = JSON.stringify(groups);
			res.send(tmp);
		});
	}
	else{					//find by group search
		Group.find({name: {$regex: req.body.groupName, $options: 'i'}},'name leader',function(err,groups){
	
			tmp = JSON.stringify(groups);
			res.send(tmp);
		});
	}
}

exports.members = function(req, res){
	var tmp;
	Group.find({_id:req.body.groupId},'leader members',function(err,arr){

		tmp = JSON.stringify(arr);
		res.send(tmp);
	});
}

exports.create = function(req, res){
	Group.insert({
		name: req.body.name,
		leader: req.body.leader_id
	},function(err,newDoc){
		return newDoc;
	});
	/*
	new Group({
		name: req.body.name,
		leader: req.body.leader_id
	}).save(function(err,newDoc){
		return newDoc;
	});
	*/
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