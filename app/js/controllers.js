'use strict';

/* Controllers */

angular.module('myApp.controllers', ["checklist-model", "base64"]).
	controller('MyCtrl1', ['$location', '$scope', '$timeout', '$http', function($location, $scope, $timeout, $http) {

		$scope.connectButton = "";
		$scope.disconnectButton = "disabled";
		$scope.userListSelections = [];

		var server = "http://127.0.0.1:8888";
		// WebRTC LocalRequestSession
		var request = null;
		// WebRTC PeerId
		var my_id = -1;
		// WebRTC signin->hanging
		var hangingGet = null;
		// WebRTC UserConnectionSession
		var other_peers = {};
		// message Counter
		var message_counter = 0;
		// result message
		var returnMessage = [];
		// user list check variable
		var beforeUserListCount = 0, nowUserListCount = 0;

		// Login Server
		$scope.serverSubmit = function() {
			if($scope.loginId == null) {
				alert("Insert LoginId!");
			}
			else {
				// signIn($scope.loginId);
				signIn2($scope.loginId);
				// alert("login....");
				$scope.LoginId = $scope.loginId;
				$scope.connectButton = "disabled";
				$scope.disconnectButton = "";
				$scope.loginForm = false;
				$scope.logoutForm = true;
				$scope.ChatFlag = true;
			}
		};

		// Logout Server
		$scope.serverDisConnect = function() {
			disconnect(request, my_id);
			$scope.connectButton = "";
			$scope.disconnectButton = "disabled";
			//Login/Logout Action Visiable Control
			$scope.loginForm = true;
			$scope.logoutForm = false;
			$scope.ChatFlag = false;
		};

		// Message Send
		$scope.messageSubmit = function() {
			if($scope.userListSelections.peerid == null) {
				return false;
			}
			else {
				for(var i = 0; i < $scope.userListSelections.peerid.length; i++) {
					sendToPeer2($scope.userListSelections.peerid[i], $scope.messageSend);
				}
			}
			$scope.msglists = messageingProcess(my_id, null, $scope.messageSend);
			$scope.peerIds = $scope.userListSelections.peerid;
			$scope.messageSend = "";
		};

		// Message Send
		$scope.messageSubmitPeer = function() {
			console.log($scope.peerIds);
			console.log($scope.peerIds.length);
			if($scope.peerIds == null) {
				return false;
			}
			else {
				for(var i = 0; i < $scope.peerIds.length; i++) {
					sendToPeer2($scope.peerIds[i], $scope.peerMsg);
				}
			}
			$scope.msglists = messageingProcess(my_id, null, $scope.peerMsg);
			$scope.peerMsg = "";
		};

		function disconnect() {
			$http({method:'GET', url:server + "/sign_out?peer_id=" + my_id, timeout: 5000}).
			success(function(data, status, headers, config) {

			}).
			error(function(data, status, headers, config) {

			});
		}

		function signIn2(loginId) {
			$http({method:'GET', url: server + "/sign_in?" + loginId}).
				success(function(data, status, headers, config) {
					var peers = data.split("\n");
			        my_id = parseInt(peers[0].split(',')[1]);
			        for (var i = 1; i < peers.length; ++i) {
			          if (peers[i].length > 0) {
			            console.log("Peer " + i + ": " + peers[i]);
			            var parsed = peers[i].split(',');
			            other_peers[parseInt(parsed[1])] = parsed[0];
			            /**/
			          }
			        }
			        hangingList();
			        startHangingGet2();
				}).
				error(function(data, status, headers, config) {
					console.log("Call Fail:"+status);
				});
		}

		function hangingList() {
			var list = [];
			var x;
			nowUserListCount = 0;

			for( x in other_peers ) {
				var item = new Array();
				item.value = x;
				item.text = other_peers[x];
				list.push(item);
				nowUserListCount++;
			}
			if(beforeUserListCount != nowUserListCount) {
				$scope.userLists = list;
				beforeUserListCount = nowUserListCount;
			}
		}

		function sendToPeer2(peer_id, message) {
			console.log(peer_id);
			console.log(message);
			$http({method:'POST', url:server + "/message?peer_id=" + my_id + "&to=" + peer_id, timeout: 5000, data: message}).
			success(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(config);
			}).
			error(function(data, status, headers, config) {
				if(status == 500) console.log("Call Fail:" + status);
			});
		}

		function startHangingGet2() {
			$http({method:'GET', url:server + "/wait?peer_id=" + my_id , timeout: 5000}).
			success(function(data, status, headers, config) {
				console.log(headers("Pragma"));
				console.log(data);
				console.log(status);
				console.log(config);
				if (headers("Pragma") == my_id) {
					handleServerNotification(data);
					hangingList();
				} else {
					$scope.msglists = messageingProcess(headers("Pragma"), other_peers[headers("Pragma")], data);
					//$scope.userListSelections.peerid = headers("Pragma");
					$scope.peerIds = headers("Pragma");
					console.log(headers("Pragma"));
					console.log($scope.peerIds);
				}
				startHangingGet2();
			}).
			error(function(data, status, headers, config) {
				if(status != 500)
					startHangingGet2();
				else console.log("Call Fail:" + status);
			});
			/* abort process */
		}

		function handleServerNotification(data) {
			var parsed = data.split(',');
			if (parseInt(parsed[2]) != 0)
				other_peers[parseInt(parsed[1])] = parsed[0];
			else if(parseInt(parsed[2]) == 0)
				delete other_peers[parseInt(parsed[1])];
		}

		function messageingProcess(peer_id, peer_name, data) {
			var list = new Array();
			if(peer_name == null)
				list.peer_name = "Me";
			else
				list.peer_name = peer_name;
			list.peer_id = peer_id;
			list.msg = data;
			returnMessage.push(list);
			
			return returnMessage;
		}

	}]).
	controller('MyCtrl2', ['$location', '$scope', '$http', '$base64', 'Servlet',  function($location, $scope, $http, $base64, Servlet) {

		$scope.gwLoginSubmit = function() {
			if($scope.loginid == null) {
				alert("Insert LoginId!");
			}
			else if($scope.passwd == null) {
				alert("Insert Passworld!");
			}
			else {
				// signIn($scope.loginId);
				Servlet.signIn($scope.loginid, $base64.encode($scope.passwd));
				// alert("login....");
				$scope.loginid = "";
				$scope.passwd = "";
			}
		};
	}]);
