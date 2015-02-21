"use strict";

var BTCE = require('btce');
var Q = require('q');
var creds = require('./creds.json')
var btce = new BTCE(creds.btce.key, creds.btce.token);
var coinbase = require("coinbase-api")(creds.coinbase.token);

function getBtcePrices(){
	var defered = Q.defer();
	var btcePrice = {};
	btce.ticker({
			pair: 'btc_usd'
		}, function(err, data) {
			if(err === null){
				btcePrice = {
					'buy': data.ticker.buy,
					'sell': data.ticker.sell
				};
					defered.resolve(btcePrice);
				}
			else{
				console.log('error geting btce prices:');
				console.log(err);
				defered.reject(err);
			}
		}
	);
	return defered.promise;
}

function getCoinbaseBuyPrice(){
	var defered = Q.defer();
	coinbase.prices.buy(function(err, json) {
		if(err === null){
			defered.resolve(json.amount * 0.99);
		}
		else{
			console.log('error geting coinbase buy price:');
			console.log(err);
			defered.reject(err);
		}
	});
	return defered.promise;
}

function getCoinbaseSellPrice(){
	var defered = Q.defer();
	coinbase.prices.sell(function(err, json) {
		if(err === null){
			defered.resolve(json.amount * 1.01);
		}
		else{
			console.log('error geting coinbase sell price:');
			console.log(err);
			defered.reject(err);
		}
	});
	return defered.promise;
}

function getCoinbaseToBTCEData(){
	var defered = Q.defer();
	Q.all([getBtcePrices(), getCoinbaseBuyPrice(), getCoinbaseSellPrice()]).then(function(obj){
		var returnVal = {
			'btce': obj[0],
			'coinbase': {
				'buy': obj[1],
				'sell': obj[2],
			}
		};
		defered.resolve(returnVal);
	}, function(err){
		defered.reject(err);
	});
	return defered.promise;
}

/*

var defered = Q.defer();
	coinbase.prices.buy(function(err, json) {
		coinbasePrice.buy = json.amount;
		coinbase.prices.sell(function(err, json) {
			coinbasePrice.sell = json.amount;
			var differenceBC = coinbasePrice.sell - btcePrice.buy;
			if(differenceBC < 0){
				differenceBC = "(% " + Math.abs(differenceBC)/btcePrice.buy*100 +")";
			}else{
				differenceBC = " % " + differenceBC/btcePrice.buy*100;
			}

			var differenceCB = btcePrice.sell - coinbasePrice.buy;
			if(differenceCB < 0){
				differenceCB = "(% " + Math.abs(differenceCB)/coinbasePrice.buy*100 +")";
			}else{
				differenceCB = " % " + differenceCB/coinbasePrice.buy*100;
			}
			var Prices = "Coin -> buy: " + coinbasePrice.buy + "\tsell: " + coinbasePrice.sell + "\t" + "Btce -> buy: " + btcePrice.buy + "\tsell: " + btcePrice.sell + "\t b->c" + differenceBC + "\t c->b" + differenceCB;
			console.log(Prices);
		});
	});

*/

module.exports = {
	'getBtcePrices' : getBtcePrices,
	'getCoinbaseBuyPrice': getCoinbaseBuyPrice,
	'getCoinbaseSellPrice': getCoinbaseSellPrice,
	'getCoinbaseToBTCEData': getCoinbaseToBTCEData
};