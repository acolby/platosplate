'use strict';

angular.module('platosplate')
	.controller('HomeCtrl', ['$routeParams', '$scope', '$location', '$window', '$interval',
		function($routeParams, $scope, $location, $window, $interval) {

			var fullBowl = 485;
			var emptyBowl = 65;

			var foodRef = new Firebase("https://platosplate.firebaseio.com/values");

			$scope.values = [[],[]];
			/*
				{
					'weight':
					'time':
				}
			*/

			foodRef.endAt().on("child_added", function(snapshot) {
				var date = new Date(snapshot.val().published_at);
				var value = Math.max(snapshot.val().data,0);
				$scope.values[0].push(date.getTime());
				$scope.values[1].push(value);

				updatePercentageFull(value);
			});

			$scope.data = [
				[]
			];


			var step  = 60;
			var max   = 550;
			var start = 0;
			$scope.labels = [];
			$scope.options = {
				animation: false,
				showScale: true,
				showTooltips: false,
				pointDot: false,
				datasetStrokeWidth: 0.5,
				scaleOverride: true,
				scaleSteps: Math.ceil((max-start)/step),
				scaleStepWidth: step,
				scaleStartValue: start
			};

			// set intial values
			var initalDataSet = false;
			function setInitalData(){
				// set inital data
				var endTime = Math.floor(Date.now()/1000);
				var beginingTime = endTime - 100;
				var valuesIndex = $scope.values[0].length - 1;
				while(endTime > beginingTime){
					while(Math.floor($scope.values[0][valuesIndex]/1000) > endTime){
						valuesIndex--;
					}
					$scope.labels.push('');
					$scope.data[0].push(Math.max($scope.values[1][valuesIndex],0));
					endTime = endTime - 0.1;
				}
			
				// Update the dataset at 25FPS for a smoothly-animating chart
				$interval(function() {
					// delete the first value
					$scope.data[0] = $scope.data[0].slice(1);

					// add the last value
					$scope.data[0].push(Math.max($scope.values[1][$scope.values[1].length - 1], 0));

					updatePercentageFull($scope.values[1][$scope.values[1].length - 1]);
				}, 100);
			}

			// determine when to first update dude
			$interval(function() {
				// make sure we have enough previous data
				if(initalDataSet === true){
					return;
				}
				var finalTime = $scope.values[0][$scope.values[0].length - 1];
				var startTime = $scope.values[0][0];
				if(!startTime){
					return;
				}
				var spread = (finalTime - startTime)/1000;
				if(spread > 100){
					if(!initalDataSet){
						setInitalData();
					}
					initalDataSet = true;
				}
				return;
			}, 1000);

			var percentageFull = -1;

			function updatePercentageFull(value){
				var bowlValue = Math.max((value - emptyBowl), 0);
				if(bowlValue === 0){
					percentageFull = 0;
				}else{
					percentageFull = (bowlValue)/(fullBowl - emptyBowl)*100;
				}
				percentageFull = Math.min(percentageFull, 100);
				$scope.innerBowlStyle = {'height': percentageFull  + '%'}
			}

			
		}
	]);