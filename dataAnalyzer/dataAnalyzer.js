"use strict";

var Q = require('q');

function getDataAnalyzer(firebaseDataRef){

	var sigRDeltaW = 5; // 5 grams
	var sigRDeltaT = 2;  // 60 seconds

	/* 
		-	regions where no sigRDeltaW occurs within sigRDeltaT are removed 
		-	regions where one or multiple sigRDeltaW's occur within sigRDeltaT's are classified as Significant Regions
	*/

	var now = new Date();
	var testTimes = [
		{
			'time': new Date(now.getTime() + 1000),
			'value': 50.0
		},
		{
			'time': new Date(now.getTime() + 2000),
			'value': 50.0
		},
		{
			'time': new Date(now.getTime() + 3000),
			'value': 70.0
		},
		{
			'time': new Date(now.getTime() + 4000),
			'value': 80.0
		},
		{
			'time': new Date(now.getTime() + 10000),
			'value': 90.0
		},
		{
			'time': new Date(now.getTime() + 11000),
			'value': 50.0
		},
		{
			'time': new Date(now.getTime() + 12000),
			'value': 50.0
		},
		{
			'time': new Date(now.getTime() + 13000),
			'value': 50.0
		},
		{
			'time': new Date(now.getTime() + 14000),
			'value': 50.0
		},
		{
			'time': new Date(now.getTime() + 15000),
			'value': 50.0
		}
	];

	console.log(testTimes[2].time);

	var returnObject = {
		'getValueAtTime': function(atTime){
			// returns a promise that resovles to 
			// {'time': |DATETIME|, 'value': |DOUBLE|}
			// and rejects to
			// {'error': |ERROR_CODE|} // -1 date is before sample, -2 date is after sample
			var defered = Q.defer();
			setTimeout(function(){
				for(var i = 0; i < testTimes.length; i++){
					if(atTime.getTime() < testTimes[i].time.getTime()){
						if(i === 0){
							defered.reject({
								'value': -1
							});
							return;
						}
						defered.resolve({
							'time': new Date(atTime.getTime()),
							'value': testTimes[i - 1].value
						});
					}
				}
				defered.reject({
					'value': -2
				});
			},100);
			return defered.promise;
		},
		'getSignificantRegionsAfter': function(startTime){
			// returns all of the significant regions after a specific time
			// significant region definition

			var that = this;

			var baseTime = new Date(startTime.getTime()); // round to the nearest second
			var baseValue = null;
			var compareTime = new Date(startTime.getTime() + 1000);
			var compareValue = null;

			var significantRegions = [];
			var significantRegion = {'dataPoints': []};

			var numberOfCurrentCheckSeconds = 0; // number of times the comparison has been made

			var defered = Q.defer();
			(function checkBaseTimeToCompareTime(baseTime, compareTime){
				Q.all([that.getValueAtTime(baseTime), that.getValueAtTime(compareTime)]).then(function(success){

					baseValue = success[0].value;
					compareValue = success[1].value;

					if(Math.abs(baseValue - compareValue) > sigRDeltaW){
						if(significantRegion.dataPoints.length === 0){
							significantRegion.dataPoints.push(success[0]);
						}
						significantRegion.dataPoints.push(success[1]);
						numberOfCurrentCheckSeconds = 0;
						// set new base and compare values
						baseTime = new Date(compareTime.getTime());
						compareTime = new Date(compareTime.getTime() + 1000);
					}else{
						if(significantRegion.dataPoints.length === 0){
							significantRegion = {'dataPoints': []};
							baseTime = new Date(compareTime.getTime());
							compareTime = new Date(compareTime.getTime() + 1000);
						}else{
							numberOfCurrentCheckSeconds++;

							if(numberOfCurrentCheckSeconds >= sigRDeltaT){
								// make deep copy of significant Region
								var sigRegDeepCopy = {'dataPoints': []};
								for(var i = 0; i < significantRegion.dataPoints.length; i ++){
									var point = {
										'time': new Date(significantRegion.dataPoints[i].time.getTime()),
										'value': significantRegion.dataPoints[i].value
									};
									sigRegDeepCopy.dataPoints.push(point);
								}

								significantRegions.push(sigRegDeepCopy);

								numberOfCurrentCheckSeconds = 0;
								baseTime = new Date(compareTime.getTime());

								significantRegion = {'dataPoints': []};

							}

							compareTime = new Date(compareTime.getTime() + 1000);
						}
					}
					checkBaseTimeToCompareTime(baseTime, compareTime);
					return;
				}, function(error){
					if(error.value === -1){
						checkBaseTimeToCompareTime(new Date(baseTime.getTime() + 1000), new Date(compareTime.getTime() + 1000));
					}else if(error.value === -2){
						var resolveObject = {
							'significantRegions': significantRegions,
							'latestTime': null
						};
						if(significantRegion.dataPoints.length > 0){
							resolveObject.latestTime = new Date(significantRegion.dataPoints[0].time.getTime());
						}else{
							var lastSignificantRegion = significantRegions[significantRegions.length - 1].dataPoints;
							var latestCheckedTime = new Date(lastSignificantRegion[lastSignificantRegion.length - 1].time.getTime());
							resolveObject.latestTime = latestCheckedTime;
						}
						defered.resolve(resolveObject);
					}else{
						defered.reject();
					}
				});
			})(baseTime, compareTime);

			return defered.promise;
		},
		'analyzeSignificantRegion': function(significantRegion){

		}
	};
	return returnObject;
}

module.exports = {
	'getDataAnalyzer' : function(firebaseDataRef){
		return getDataAnalyzer(firebaseDataRef);
	}
};