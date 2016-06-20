var Task = require('../models/tasks.js');
var Repeat = require('../models/repeatId.js');

function get_number_str(num){
	if((num<10&&num>0) || num=='0')
		num = '0' + num;
	return num;
};


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
	
	var t = new Task({
		date: req.body.date,
		startTime:req.body.startTime,
		endTime: req.body.endTime,
		contents: req.body.contents,
		repeat: 0
	});	
	
	if(req.body.user)
		t.user = req.body.user;
	
	else
		t.group = req.body.group;
	
	if(req.body.repeatValue){
		
		var repId;
		
		new Repeat({
			
		}).save(function(err,newDoc){
			console.log(newDoc);
			repId = newDoc._id;
			
			var sd = req.body.date;
			var tmp = req.body.date;
			var ed = req.body.repeatEday;
			var rv = Number(req.body.repeatValue);
			var tdt = new Date(tmp.slice(0,4),Number(tmp.slice(4,6))-1,tmp.slice(6,8));
			var edt = new Date(ed.slice(0,4),Number(ed.slice(4,6))-1,ed.slice(6,8));
			
			while(tdt<=edt){
				var tt = new Task({
					startTime:req.body.startTime,
					endTime: req.body.endTime,
					contents: req.body.contents,
					date: tdt.getFullYear()+""+get_number_str(tdt.getMonth()+1)+""+get_number_str(tdt.getDate()),
					rId: repId,
					repeat: rv,
					repStartDate: sd,
					repEndDate: ed		
				});
				
				if(req.body.user)
					tt.user = req.body.user;
				
				else
					tt.group = req.body.group;
				
				tt.save();
				
				tdt.setDate(tdt.getDate()+rv);
			}
		});
		
	}
	
	else
		t.save();
	
	res.end();
};

exports.remove = function(req,res,next) {
	if(req.body.repeatValue){
		
		Task.remove({
			rId : req.body.repId
		}, function(err){
			if(err)
				throw err;
		});
		
		res.end();
	} else if(req.body.user){					//remove user task

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
	} else if(req.body.groupId){		//group delete cascade
		Task.remove({
			group : req.body.groupId
		}, 
		function(err){
			if(err)
				console.log(err);
		});
		next();
	} else{								//remove group task
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