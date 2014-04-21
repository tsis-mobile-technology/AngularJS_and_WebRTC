'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
	value('version', '0.1')

	.factory('Servlet', ['$timeout', '$http',  function($timeout, $http) {
		var factory = {};
		var server = "http://localhost:8080";
		var service = "/mobile.sql.json.do?_tRequestJson=";
		var requestJson = "['loginid','passwd']";
		var sqlName = "&_sqlName=tsisGWLogin.json";
		var dsName = "&_dsName=tsgw";

		factory.signIn = function(loginid, passwd) {
			$http({method:'POST', url:server + service + "[" + requestJson + "," + "[" + loginid + "," + passwd + "]" + "]" + sqlName + dsName, timeout: 5000}).
			success(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(config);
				return data;
			}).
			error(function(data, status, headers, config) {
				if(status == 500) console.log("Call Fail:" + status);
				return data;
			});

		};

		return factory;
	}]);
