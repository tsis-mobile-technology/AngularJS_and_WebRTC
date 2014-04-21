'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  "checklist-model",
  "base64"
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
	$routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
	$routeProvider.otherwise({redirectTo: '/view2'});
}])
.run(['$rootScope', function($rootScope) {
	console.log("myApp run.....");

	//Login/Logout visiable Control
	$rootScope.loginForm = true;
	$rootScope.logoutForm = false;
}]);
