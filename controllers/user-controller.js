var Member = require('../models/users.js');

exports.list = function(req,res){
	var tmp;
	if(req.body.id){
		Member.find({uid:req.body.id}).exec(function(err,members){
			tmp = JSON.stringify(members);
			res.send(tmp);
		});
	}
	else if(req.body.members){
		Member.find({uid : {$in : JSON.parse(req.body.members)}},'name',function(err,members){
			tmp = JSON.stringify(members);
			res.send(tmp);
			console.log(tmp);
			res.end();
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
			{uid: req.body.memberId},
			{$addToSet: {groups: req.body.groupId}},
			function(err){}
			
		);
		
		res.end();
}

exports.quit = function(req,res,next){
	if(req.body.memberId){
		Member.update(
			{uid: req.body.memberId},
			{$pull: {groups: req.body.groupId}},
			function(err){}
			
		);
		res.end();
	}
	else{
		Member.update(			
				{},
				{$pullAll: {groups: [req.body.groupId]}},{multi:true},
				function(err){
					if(err) console.log(err);
				}				
			);
		next();
	}
		
		
}