var task = require('./controllers/task-controller.js');
var group = require('./controllers/group-controller.js');
var member = require('./controllers/user-controller.js');

exports.route = function(app){
	app.get('/',function(req,res){
		res.redirect('/cal.html');
		res.end();
	})
	app.post('/list', task.list);
	app.post('/createTask', task.create);
	app.post('/removeTask', task.remove);
	
	app.post('/listGroup', group.list);
	app.post('/listGroupMembers', group.members);
	app.post('/createGroup', group.create);
	app.post('/updateGroup', group.update, member.update);
	app.post('/quitGroup', group.quit, member.quit);
	app.post('/removeGroup', task.remove, member.quit, group.remove);
	
	app.post('/listMember', member.list);
	app.post('/listMemberGroups', member.groups);
	app.post('/createMember', member.create);
	
	app.post('/userIn', member.exist);
};