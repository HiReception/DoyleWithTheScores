/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var randomizer = require('./randomizer');
var app = express();

// all environments
app.set('port', process.env.PORT || 5000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/:teamname-left', function(req, res){
	res.sendfile(__dirname + '/public/afl/icons-left/' + req.params.teamname + '.png');
});

app.get('/:teamname-right', function(req, res){
	res.sendfile(__dirname + '/public/afl/icons-right/' + req.params.teamname + '.png');
});

app.get('/:teamname-circle', function(req, res){
	res.sendfile(__dirname + '/public/afl/icons-circle/' + req.params.teamname + '.png');
});

app.get('/teampositions.json', function(req, res){
	res.sendfile(__dirname + '/afl/teampositions.json');
});

app.get('/mostrecentgames.json', function(req, res){
	res.sendfile(__dirname + '/afl/mostrecentgames.json');
});

app.get('/upcominggames.json', function(req, res){
	res.sendfile(__dirname + '/afl/upcominggames.json');
});

app.get('/averageforagainst.json', function(req, res){
	res.sendfile(__dirname + '/afl/averageforagainst.json');
});
	
	

//create the server
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//Socket IO specifics
io = require('socket.io').listen(server, { log: false });
io.sockets.on('connection', function (socket) {
    var interval = setInterval(function() {
        var randomData = randomizer.getRandomData();
        socket.emit('dataSet', randomData);
    }, 1);
});
