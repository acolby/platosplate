'use strict';

angular.module('platosplate')
	.directive('documentClicked', function() {
		return {
			scope: {
				'documentClicked': '='
			},
			restrict: 'A',
			controller: ['$scope', '$document', '$element',
				function($scope, $document, $element) {
					var documentClicked = function(e) {
						if($scope.documentClicked !== undefined){
							$scope.documentClicked(false);
						}
					};
					var elementClicked = function(e) {
						if($scope.documentClicked !== undefined){
							$scope.documentClicked(true);
						}
						e.stopPropagation();
					};
					angular.element($document[0].body).on('click', documentClicked);
					angular.element($element).on('click', elementClicked);
					$scope.$on('$destroy', function() {
						angular.element($document[0].body).off('click', documentClicked);
						angular.element($element).off('click', elementClicked);
					});
				}
			]
		};
	});