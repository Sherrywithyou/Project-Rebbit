var http = require("http");
var express = require('express');
var bodyParser = require('body-parser');
console.log("Started server");
var path = require('path');




var aRouter = express();
var myServer = http.createServer(aRouter);
aRouter.use(express.static(__dirname));
aRouter.use(bodyParser.json());
aRouter.use(bodyParser.urlencoded({ extended: true }));



aRouter.get('/users/:userid', function(req, res){
   res.send("You asked for data from User "+req.params.userid); 

});

aRouter.post('/signUp', function(req, res){

   console.log('body: ' + JSON.stringify(req.body));
	res.send(req.body);
});

aRouter.get('/', function(req, res){
   //res.sendfile(path.join(__dirname + '/index.html'));
   
});

myServer.listen(8080, '0.0.0.0');
