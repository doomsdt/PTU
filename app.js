
/**
 * Module dependencies.
 */

var express = require('express')
//  , routes = require('./routes')
//  , user = require('./routes/user')
//  , controllers = require('./controllers')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/js', express.static(__dirname + '/node_modules/bootstrap-drawer/dist/js')); 
app.use('/css', express.static(__dirname + '/node_modules/bootstrap-drawer/dist/css'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./router.js').route(app);
require('./db.js').connect();

//app.get('/', controllers.index);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
