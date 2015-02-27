"use strict";

var express = require('express');
var Q = require('q');
var Firebase = require('firebase');
var spark = require('sparknode');
var DA = require('./dataAnalyzer/dataAnalyzer');

var d = require('domain');

var dataRef = new Firebase('https://platosplate.firebaseio.com/values');

var core = new spark.Core({
  accessToken: 'd7e7917e35dfde39c5c9acabab3c13d8e72c702f',
  id: '54ff6f066678574941510867'
});


function runPlatoPlateLogger(){

	var d1 = d.create();

	d1.on('error', function(err){
		runPlatoPlateLogger();
	});

	d1.run(function(){

		core.on('newWeight', function(info) {
		  dataRef.push(info);
		});

	});

}



/*

var analyzer = DA.getDataAnalyzer();
var now = new Date();

analyzer.getSignificantRegionsAfter(now).then(function(success){
		console.log(success.latestTime);
		success = success.significantRegions;
		for(var i = 0; i < success.length; i++){
			for(var j = 0; j < success[i].dataPoints.length; j++){
				console.log(success[i].dataPoints[j]);
			}
			console.log('--------');
		}
	}, function(error){
		console.log('dsss');
		console.log(error);
	}
);

*/



//***************************************************************************************************
// colbitrage cron - don't mind me :)

/*
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

	}, 10000);
}
run();


*/