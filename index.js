var express = require('express');
var app = express();

var numberOfRequests = 0;
 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/platosPlate/addDatappoint/:value', function(req, res, next) {
  var value = req.params.value;
  console.log(numberOfRequests++ + ' cool Beens! ' + value);
  res.send('yoooo');
});

app.all('/*', function(req, res, next) {
  console.log('Intercepting requests ...');
  res.send('other requests'); 
})
 
app.listen(3000);