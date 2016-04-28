var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var BALL_FREE = 0;
var playerWithBall = BALL_FREE;
Error.stackTraceLimit = Infinity;

app.get('/mobfootball.css', function(req, res){
		res.sendFile(__dirname + '/mobfootball.css');
	});
	
	app.get('/bundle.js', function(req, res){
		res.sendFile(__dirname + '/bundle.js');
	});
	
	app.get('/', function (req, res) {
		res.sendFile(__dirname + '/index.html');
	});

	// when a user connects
	io.on('connection', function(socket) {
		
		
		http.listen(process.env.PORT || 3000, function() {
		console.log('listening on *:3000');
	});