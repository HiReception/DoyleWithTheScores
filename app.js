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

app.get('/Chart.js', function(req, res){
    res.sendfile(__dirname + '/public/javascripts/Chart.Core.js');
});

app.get('/Chart.Scatter.js', function(req, res){
    res.sendfile(__dirname + '/public/javascripts/Chart.Scatter.js');
});


app.get('/afl', function(req, res){
    res.sendfile(__dirname + '/public/afl/index2.html');
});

app.get('/nrl', function(req, res){
    res.sendfile(__dirname + '/public/nrl/index.html');
});

app.get('/aleague', function(req, res){
    res.sendfile(__dirname + '/public/aleague/index.html');
});


app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/:comp/:teamname-left', function(req, res){
	res.sendfile(__dirname + '/public/' + req.params.comp +'/icons-left/' + req.params.teamname + '.png');
});

app.get('/:comp/:teamname-right', function(req, res){
	res.sendfile(__dirname + '/public/' + req.params.comp + '/icons-right/' + req.params.teamname + '.png');
});

app.get('/:comp/:teamname-circle', function(req, res){
	res.sendfile(__dirname + '/public/' + req.params.comp + '/icons-circle/' + req.params.teamname + '.png');
});

app.get('/:comp/:teamname-square', function(req, res){
	res.sendfile(__dirname + '/public/' + req.params.comp + '/icons-square/' + req.params.teamname + '.png');
});

app.get('/:comp-teampositions', function(req, res){
	res.sendfile(__dirname + '/' + req.params.comp + '/teampositions.json');
});

app.get('/:comp-teampositionsheader', function(req, res){
	res.sendfile(__dirname + '/' + req.params.comp + '/teampositionsheader.json');
});

app.get('/:comp-mostrecentgames', function(req, res){
	res.sendfile(__dirname + '/' + req.params.comp + '/mostrecentgames.json');
});

app.get('/:comp-averageforagainst', function(req, res){
	res.sendfile(__dirname + '/' + req.params.comp + '/averageforagainst.json');
});

app.get('/:comp-upcominggames', function(req, res){
	res.sendfile(__dirname + '/' + req.params.comp + '/upcominggames.json');
});

app.get('/:comp-firstFinalOpponent', function(req, res){
	res.sendfile(__dirname + '/' + req.params.comp + '/firstFinalOpponent.json');
});

app.get('/dist/:path', function(req, res) {
    res.sendfile(__dirname + '/bootstrap/dist/' + req.params.path);
});

app.get('/fonts/:path', function(req, res) {
    res.sendfile(__dirname + '/bootstrap/fonts/' + req.params.path);
});

app.use('/css', function(req, res, next) {
  // GET 'http://www.example.com/admin/new'
  res.sendfile(__dirname + '/bootstrap/dist/css' + req.path);
  console.log(req.originalUrl); // '/admin/new'
  console.log(req.baseUrl); // '/admin'
  console.log(req.path); // '/new'
});

app.use('/js', function(req, res, next) {
  // GET 'http://www.example.com/admin/new'
  res.sendfile(__dirname + '/bootstrap/dist/js' + req.path);
  console.log(req.originalUrl); // '/admin/new'
  console.log(req.baseUrl); // '/admin'
  console.log(req.path); // '/new'
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
