'use strict';

angular.module('platosplate', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'ui',
  'chart.js'
])
  .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        
        .when('/', {
          templateUrl: 'views/home.html',
          controller: 'HomeCtrl'
        })
        .otherwise({
          templateUrl: 'views/home.html',
          controller: 'HomeCtrl'
        });
    }]);