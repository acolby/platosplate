var express = require('express');
var Q = require('q');
var Firebase = require('firebase');
var HTTP = require('http');
var spark = require('sparknode');

var Firebase = require('firebase');
var dataRef = new Firebase('https://platosplate.firebaseio.com/values');

 
var core = new spark.Core({
  accessToken: 'd7e7917e35dfde39c5c9acabab3c13d8e72c702f',
  id: '54ff6f066678574941510867'
});

core.on('newWeight', function(info) {
  console.log(info);
  console.log(info.data);

  dataRef.push(info);
});
