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


exports.create = function(req,res){
	console.log("name :" + req.body.name);
	new Member({
		name : req.body.name,
		
	},function(err){}).save();
	
	res.end();
	
}