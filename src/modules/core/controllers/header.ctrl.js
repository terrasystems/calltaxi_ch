'use strict';
/*jshint -W030 */
/*jshint -W106 */
angular.module('com.module.core')
	/*  */
	.controller('HeaderController', function($scope, $interval, alertService, $http, $stateParams, $rootScope) {
		$scope.isCollapsed = true;
		// clock
		$scope.currenttime = Date.now();
		$interval(function() {
			$scope.currenttime = Date.now();
		}, 5000);
		// search
		$scope.search = function(obj) {};
		// go search
		$scope.gosearch = function(obj) {};
		$scope.address = {};
		$scope.setPoint1 = function(address) {
			$rootScope.$broadcast('point1', {
				latitude: address.geometry.location.lat,
				longitude: address.geometry.location.lng
			});
		};
		$scope.setPoint2 = function(address) {
			$rootScope.$broadcast('point2', {
				latitude: address.geometry.location.lat,
				longitude: address.geometry.location.lng
			});
		};
		$scope.getLocation = function(val) {
			return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
				params: {
					address: val,
					sensor: false,
					components: {country: 'ch'},
					region: 'CH'
				}
			}).then(function(response) {
				$scope.addresses = response.data.results;
				return response.data.results.map(function(item) {
					return item;
				});
			});
		};
	});
