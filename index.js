"use strict";

var express = require('express');
var Q = require('q');
var Firebase = require('firebase');
var spark = require('sparknode');

var d = require('domain');

var colb = require('./colbitrage/colbitrage');

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

function run(){
	setInterval(function(){

		var d1 = d.create();

		d1.on('error', function(err){
			console.log(err.toString());
			colbitrageErrorRef.push({
				'error': err.toString(),
				'time': Date.now()
			});
			run();
		});

		d1.run(function(){
			colb.getCoinbaseToBTCEData().then(function(obj){
				obj.time = Date.now();
				colbitrageDataRef.push(obj);
			}, function(err){
				throw err;
			});
		});

	}, 4000);
}
run();
