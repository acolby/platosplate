"use strict";

var express = require('express');
var Q = require('q');
var Firebase = require('firebase');
var spark = require('sparknode');

var colb = require('./colbitrage/colbitrage');

var Firebase = require('firebase');
var dataRef = new Firebase('https://platosplate.firebaseio.com/values');

var core = new spark.Core({
  accessToken: 'd7e7917e35dfde39c5c9acabab3c13d8e72c702f',
  id: '54ff6f066678574941510867'
});

core.on('newWeight', function(info) {
  dataRef.push(info);
});















/***************************************************************************************************/
// colbitrage cron - don't mind me :)
var colbitrageDataRef = new Firebase('https://colbitrage.firebaseio.com/coinbaseToBTCE/Data');
var colbitrageErrorRef = new Firebase('https://colbitrage.firebaseio.com/coinbaseToBTCE/Error');

setInterval(function(){
	colb.getCoinbaseToBTCEData().then(function(obj){
		obj.time = Date.now();
		colbitrageDataRef.push(obj);
	}, function(err){
		err.time = Date.now();
		colbitrageErrorRef.push(obj);
	});
}, 10000);
