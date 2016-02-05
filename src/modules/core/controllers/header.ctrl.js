'use strict';
/*jshint -W030 */
/*jshint -W106 */
angular.module('com.module.core')
	/*  */
	.controller('HeaderController', function ($scope, $interval, alertService, $http, $state, $stateParams, $rootScope, getCoords, uiGmapGoogleMapApi, localStorageService, blockUI) {
		$scope.isCollapsed = true;
		// clock
		$scope.currenttime = Date.now();
		$interval(function () {
			$scope.currenttime = Date.now();
		}, 5000);

		// go search
		$scope.doSearch = function (address) {
			if (angular.isUndefined(address.point1.geometry)) {
				return;
			}
			var adr = {
				point1: getCoords(address.point1),
				point2: getCoords(address.point2)
			};
			$state.go('main.taxi.list', {address:JSON.stringify(adr)});
			//$rootScope.$broadcast('search', );
		};

		$scope.address = {point1: {}, point2: {}};
		$scope.autocompleteOptions = {
			componentRestrictions: { country: 'ch' },
			types: ['geocode']
		};
		$scope.$on('travelData', function (event, data) {
			$scope.travelData = data;
		});
		// Point 1 select
		$scope.$watch('address.point1.geometry', function (model, oldModel) {
			if (model && !_.isUndefined(model.location)) {
				if ($rootScope.geo && $rootScope.geo.checked) {
					$rootScope.$broadcast('point1', $rootScope.geo.coords);
					$rootScope.geo.checked = false;
				} else {
					$rootScope.$broadcast('point1', getCoords(model));
				}
			}
		});

		// Point 2 select
		$scope.$watch('address.point2.geometry', function (model) {
			$rootScope.$broadcast('point2', getCoords(model));
		});
		$scope.city1 = 'Citie 0';
		$scope.cities = ['Citie 0','Citie 1','Citie 1','Citie 1','Citie 1','Citie 1','Citie 1','Citie 1','Citie 1']
		//
		$scope.getCurrent = function () {
			blockUI.start();
			//
			var options = {
				enableHighAccuracy: true
			};
			//
			navigator.geolocation.getCurrentPosition(function(pos) {
				// localStorageService.set('geo', {
				// 	checked: true,
				// 	coords: {
				// 		latitude: pos.coords.latitude,
				// 		longitude: pos.coords.longitude
				// 	}
				// });
				// $rootScope.geo = localStorageService.get('geo');
				$rootScope.geo = {
					checked: true,
					coords: {
						latitude: pos.coords.latitude,
						longitude: pos.coords.longitude
					}
				};
				// uiGmapGoogleMapApi.then(function(maps) {
					var geocoder = new google.maps.Geocoder();
					var latLng = new google.maps.LatLng($rootScope.geo.coords.latitude, $rootScope.geo.coords.longitude);
					geocoder.geocode({
								'latLng': latLng
						}, function (results, status) {
							$scope.address.point1 = {
								formatted_address: results[0].formatted_address,
								geometry: {
									location: {
										lat: results[0].geometry.location.lat(),
										lng: results[0].geometry.location.lng()
									}
								}
							};
							blockUI.stop();
						});
				// });
			},
			function(error) {
				blockUI.stop();
				alert('Unable to get location: ' + error.message);
			}, options);
		};
	});
