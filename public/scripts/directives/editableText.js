'use strict';

angular.module('platosplate')
	.directive('editableText', function() {
		return {
			scope: {
				'text': '=',
				'editable': '=',
				'type': '@', // this is used for comment labels,
				'label': '=', // this is only true if hthe item is a comment
				'textEditedCallback': '='
			},
			templateUrl: 'views/directives/editableText.html',
			restrict: 'A',
			controller: ['$scope', '$document', '$element',
				function($scope, $document, $element) {
					$scope.$watch('text', function() {
						$scope.textCopy = $scope.text;
					});
					$scope.editClicked = function(){
						if($scope.editable === false){
							return;
						}
						$scope.editing = true;
					};
					$scope.doneClicked = function(e) {
						if($scope.editable === false){
							return;
						}
						if ($scope.textEditedCallback) {
							var newLabel = {};
							if($scope.type){
								for (var i = 0; i < $scope.selectedLabels.length; i ++){
									if($scope.selectedLabels[i].selected === true){
										newLabel.name = $scope.selectedLabels[i].name;
										newLabel.icon = $scope.selectedLabels[i].icon;
									}
								}
							}
							$scope.textEditedCallback($scope.textCopy, newLabel);
						}
						$scope.editing = false;
					};
					$scope.documentClicked = function(inElement){
						if($scope.editable === false){
							return;
						}
						if(!inElement){
							$scope.editing = false;
						}
					};

					// handeling labels
					if($scope.type === undefined){
						return;
					}
					$scope.labelCopy = {};
					$scope.$watch('label', function(){
						if($scope.label !== undefined){
							$scope.labelCopy.name = $scope.label.name;
							$scope.labelCopy.icon = $scope.label.icon;
							$scope.labelClicked($scope.labelCopy);
						}
						return;
					}, true);
					$scope.labelTypes = [
						[
							{
								'name': 'comment',
								'icon': 'fa-comment',
								'selected': false
							},
							{
								'name': 'revision request',
								'icon': 'fa-edit',
								'selected': false
							},
							{
								'name': 'somthing is unclear',
								'icon': 'fa-exclamation',
								'selected': false
							}
						],
						[
							{
								'name': 'pro',
								'icon': 'fa-plus',
								'selected': true
							},
							{
								'name': 'con',
								'icon': 'fa-minus',
								'selected': false
							},
							{
								'name': 'comment',
								'icon': 'fa-comment',
								'selected': false
							},
							{
								'name': 'revision request',
								'icon': 'fa-edit',
								'selected': false
							},
						]
					];
					$scope.labelClicked = function(label){
						for (var i = 0; i < $scope.selectedLabels.length; i ++){
							if(label.name === $scope.selectedLabels[i].name){
								$scope.selectedLabels[i].selected = true;
							}else{
								$scope.selectedLabels[i].selected = false;
							}
						}
					};
					switch($scope.type){
						case 'question':
							$scope.selectedLabels = $scope.labelTypes[0];
							break;
						case 'idea':
							$scope.selectedLabels = $scope.labelTypes[1];
							break;
						case 'comment':
							$scope.selectedLabels = $scope.labelTypes[0];
							break;
						default:
							$scope.selectedLabels = $scope.labelTypes[0];
							break;
					}
				}
			]
		};
	});