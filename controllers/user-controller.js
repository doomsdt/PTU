var Member = require('../models/users.js');

exports.list = function(req,res){
	var tmp;
	Member.find(function(err,members){
		tmp = JSON.stringify(members);
		res.send(tmp);
	});
	
}


exports.create = function(req,res){
	console.log("name :" + req.body.name);
	new Member({
		name : req.body.name,
		
	},function(err){}).save();
	
	res.end();
	
}