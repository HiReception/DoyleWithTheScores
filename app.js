/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: "AKIAJCUHCZ5XEIA6TKBQ",
  secretAccessKey: "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",
  region:'ap-southeast-2',
  sslEnabled: true,
});

var s3 = new AWS.S3();

// all environments
app.set('port', process.env.PORT || 5000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname)));

app.get('/icons/:path', function(req, res, next) {
  res.sendfile(__dirname + '/icons/' + req.params.path);
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/:comp/team', function(req, res){
    res.sendfile(__dirname + '/' + req.params.comp + '/team.html');
});

app.get('/Chart.js', function(req, res){
    res.sendfile(__dirname + '/javascripts/Chart.Core.js');
});

app.get('/Chart.Scatter.js', function(req, res){
    res.sendfile(__dirname + '/javascripts/Chart.Scatter.js');
});

app.get('/jumbotron-bg', function(req, res){
    res.sendfile(__dirname + '/jumbotron-bg.jpg');
});


app.get('/afl', function(req, res){
    res.sendfile(__dirname + '/afl/index.html');
});

app.get('/aflw', function(req, res){
    res.sendfile(__dirname + '/aflw/index.html');
});

app.get('/nrl', function(req, res){
    res.sendfile(__dirname + '/nrl/index.html');
});

app.get('/aleague', function(req, res){
    res.sendfile(__dirname + '/aleague/index.html');
});

app.get('/superrugby', function(req, res){
    res.sendfile(__dirname + '/superrugby/index.html');
});

app.get('/bbl', function(req, res) {
    res.sendfile(__dirname + '/bbl/index.html');
})


app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/:comp/:teamname-left', function(req, res){
	res.sendfile(__dirname + '/' + req.params.comp +'/icons-left/' + req.params.teamname + '.png');
});

app.get('/:comp-homeicon', function(req, res){
	res.sendfile(__dirname + '/home-icons/' + req.params.comp + '.png');
});

app.get('/:comp/:teamname-right', function(req, res){
	res.sendfile(__dirname + '/' + req.params.comp + '/icons-right/' + req.params.teamname + '.png');
});

app.get('/:comp/:teamname-circle', function(req, res){
	res.sendfile(__dirname + '/' + req.params.comp + '/icons-circle/' + req.params.teamname + '.png');
});

app.get('/:comp/:teamname-square', function(req, res){
	res.sendfile(__dirname + '/' + req.params.comp + '/icons-square/' + req.params.teamname + '.png');
});

app.get('/:comp-teampositions', function(req, res){
    var params = {
        Bucket: 'doylewiththescores',
        Key: req.params.comp + '/teampositions.json'
    };
	s3.getObject(params, function(err, data) {
	    if (err)
	        console.log(err, err.stack);
	    else {
	        res.send(data.Body.toString());
	    }
	})
});

app.get('/:comp-winsminuslosses', function(req, res){
	var params = {
        Bucket: 'doylewiththescores',
        Key: req.params.comp + '/winsminuslosses.json'
    };
   	s3.getObject(params, function(err, data) {
        if (err)
            console.log(err, err.stack);
        else {
            res.send(data.Body.toString());
        }
    })
});

app.get('/:comp-finalschancebyrecord', function(req, res){
	var params = {
        Bucket: 'doylewiththescores',
        Key: req.params.comp + '/finalschancebyrecord.json'
    };
    s3.getObject(params, function(err, data) {
        if (err)
    	    console.log(err, err.stack);
    	else {
    	    res.send(data.Body.toString());
    	}
    })
});

app.get('/:comp-finalschancebyrecordheader', function(req, res){
	res.sendfile(__dirname + '/' + req.params.comp + '/finalschancebyrecordheader.json');
});

app.get('/:comp-teampositionsheader', function(req, res){
	res.sendfile(__dirname + '/' + req.params.comp + '/teampositionsheader.json');
});

app.get('/:comp/:div-teampositions', function(req, res){
	var params = {
        Bucket: 'doylewiththescores',
        Key: req.params.comp + '/' + req.params.div + '/teampositions.json'
    };
    s3.getObject(params, function(err, data) {
        if (err)
            console.log(err, err.stack);
        else {
            res.send(data.Body.toString());
        }
    })
});

app.get('/:comp/:div-teampositionsheader', function(req, res){
	res.sendfile(__dirname + '/' + req.params.comp + '/' + req.params.div + '/teampositionsheader.json');
});

app.get('/:comp-mostrecentgames', function(req, res){
    var params = {
        Bucket: 'doylewiththescores',
        Key: req.params.comp + '/mostrecentgames.json'
    };
	s3.getObject(params, function(err, data) {
	    if (err)
	        console.log(err, err.stack);
	    else {
	        res.send(data.Body.toString());
	    }
	})
});

app.get('/:comp-averageforagainst', function(req, res){
    var params = {
        Bucket: 'doylewiththescores',
        Key: req.params.comp + '/averageforagainst.json'
    };
	s3.getObject(params, function(err, data) {
	    if (err)
	        console.log(err, err.stack);
	    else {
	        res.send(data.Body.toString());
	    }
	})
});

app.get('/:comp-upcominggames', function(req, res){
    var params = {
        Bucket: 'doylewiththescores',
        Key: req.params.comp + '/upcominggames.json'
    };
	s3.getObject(params, function(err, data) {
	    if (err)
	        console.log(err, err.stack);
	    else {
	        res.send(data.Body.toString());
	    }
	})
});

app.get('/:comp-firstFinalOpponent', function(req, res){
    var params = {
        Bucket: 'doylewiththescores',
        Key: req.params.comp + '/firstfinalopponent.json'
    };
	s3.getObject(params, function(err, data) {
	    if (err)
	        console.log(err, err.stack);
	    else {
	        res.send(data.Body.toString());
	    }
	})
});

app.get('/:comp-matchfinalsimpact', function(req, res){
    var params = {
        Bucket: 'doylewiththescores',
        Key: req.params.comp + '/matchfinalsimpact.json'
    };
	s3.getObject(params, function(err, data) {
	    if (err)
	        console.log(err, err.stack);
	    else {
	        res.send(data.Body.toString());
	    }
	})
});

app.get('/:comp-matchfinalsimpactheader', function(req, res){
	res.sendfile(__dirname + '/' + req.params.comp + '/matchfinalsimpactheader.json');
});

app.get('/dist/:path', function(req, res) {
    res.sendfile(__dirname + '/bootstrap/dist/' + req.params.path);
});

app.get('/fonts/:path', function(req, res) {
    res.sendfile(__dirname + '/bootstrap/fonts/' + req.params.path);
});

app.use('/css', function(req, res, next) {
  res.sendfile(__dirname + '/bootstrap/dist/css' + req.path);
});

app.use('/js', function(req, res, next) {
  res.sendfile(__dirname + '/bootstrap/dist/js' + req.path);
});


	

//create the server
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});