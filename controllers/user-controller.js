var Member = require('../models/users.js');

exports.list = function(req,res){
	var tmp;
	if(req.body.id){
		Member.find({_id:req.body.id}).exec(function(err,members){
			tmp = JSON.stringify(members);
			res.send(tmp);
		});
	}
	else{
		Member.find().exec(function(err,members){
			tmp = JSON.stringify(members);
			res.send(tmp);
		});
	}
	
}

exports.exist = function(req,res){
	var tmp;
	Member.find({uid : req.body.fId}).count(function(err,num){
		tmp = JSON.stringify(num);
		res.send(tmp);
	});
}

exports.groups = function(req,res){
	var tmp;
	Member.find({uid:req.body.userId},'groups',function(err,arr){
		tmp = JSON.stringify(arr);
		res.send(tmp);
	});
}

exports.create = function(req,res){

	new Member({
		uid : req.body.uid,
		name : req.body.name,
		pic : req.body.picUrl
	},function(err){}).save();
	
	res.end();
	
}

exports.update = function(req,res){
	Member.update(
			{_id: req.body.id},
			{$addToSet: {groups: req.body.groupId}},
			function(err){}
			
		);
		
		res.end();
}