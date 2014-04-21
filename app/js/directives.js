'use strict';

/* Directives */


var app = angular.module('myApp.directives', []);

app.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
}]);

app.directive('focus', function () {
  return function (scope, elm, attrs) {
    attrs.$observe('focus', function (newValue) {
      newValue === 'true' && elm[0].focus();
    });
  }
});