var express = require('express');
var app = express();
 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/platosPlate/addDatappoint', function(req, res, next) {
  console.log('cool Beens!');
  res.send('yo');
});
 
app.listen(3000);