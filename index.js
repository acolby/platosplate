var express = require('express');
var app = express();
 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res, next) {
  // Handle the get for this route
});

app.post('/endpoint', function(req, res, next) {
 	var obj = {};
	console.log(req);
	res.send(req.body);
});
 
app.listen(3000);