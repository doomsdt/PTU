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
		Group.find({_id : {$in : JSON.parse(req.body.groups)}},'name leader',function(err,groups){
			tmp = JSON.stringify(groups);
			res.send(tmp);
		});
	}
	else if(req.body.members){	//group member's group
		Group.find({},'_id').or([{members : {$elemMatch : {$in :JSON.parse(req.body.members)}}},{leader : {$in :JSON.parse(req.body.members)}}]).exec(function(err,groups){
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
	
	new Group({
		name: req.body.name,
		leader: req.body.leaderId
	}).save(function(err,newDoc){
		var id = newDoc.id;
		res.send(id);
	});
	
}

exports.update = function(req, res, next){
	Group.update(
		{_id: req.body.groupId},
		{$addToSet: {members: req.body.memberId}},
		function(err){}
		
	);
	next();
}

exports.quit = function(req,res, next){
	Group.update(
		{_id: req.body.groupId},
		{$pull: {members: req.body.memberId}},
		function(err){}
		
	);
	
	next();
}

exports.remove = function(req, res, next){	
	Group.remove(
		{
			_id:req.body.groupId
		},function(err){}
	)
	
	res.end();
	
}