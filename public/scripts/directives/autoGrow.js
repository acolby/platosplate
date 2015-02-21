'use strict';

/*jshint -W117 */

angular.module('platosplate')
	.directive('autogrow', [
	function() {
		return {
			priority: 10,
			controller: ['$scope', '$element', '$interval', function($scope, $element, $interval){
				var minHeight = $element[0].offsetHeight,
					paddingLeft = $element.css('paddingLeft'),
					paddingRight = $element.css('paddingRight');

				var $shadow = angular.element('<div></div>').css({
					position: 'absolute',
					top: -10000,
					left: -10000,
					width: $element[0].offsetWidth - parseInt(paddingLeft || 0, 10) - parseInt(paddingRight || 0, 10),
					fontSize: $element.css('fontSize'),
					fontFamily: $element.css('fontFamily'),
					lineHeight: $element.css('lineHeight'),
					resize:     'none'
				});
				angular.element(document.body).append($shadow);

				var update = function() {
					$shadow.css({
						width: $element[0].offsetWidth - parseInt(paddingLeft || 0, 10) - parseInt(paddingRight || 0, 10),
					});

					var times = function(string, number) {
						for (var i = 0, r = ''; i < number; i++) {
							r += string;
						}
						return r;
					};

					var val = $element.val().replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/&/g, '&amp;')
						.replace(/\n$/, '<br/>&nbsp;')
						.replace(/\n/g, '<br/>')
						.replace(/\s{2,}/g, function(space) { return times('&nbsp;', space.length - 1) + ' '; });
					$shadow.html(val);
					$element.css('height', Math.max($shadow[0].offsetHeight + 30 /* the "threshold" */, minHeight) + 'px');
				};

				$element.bind('keyup keydown keypress change click', function(){
					update();
				});
				update();

				$interval(function(){
					update();
				}, 500);

				$scope.$on('$destroy', function() {
					$shadow.remove();
				});
			}]
		};
	}]);

