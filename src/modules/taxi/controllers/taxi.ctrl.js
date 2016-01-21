'use strict';
/*jshint -W116 */
/*jshint -W098 */
angular.module('com.module.taxi')
	/**
	 * @ngdoc function
	 * @name com.module.taxi.controller:TaxiController
	 * @description
	 * # TaxiController
	 * Controller of the main-common form
	 */
	.controller('TaxiController', function($scope, uiGmapGoogleMapApi, uiGmapLogger, $log, $timeout, $http) {
		//
		uiGmapLogger.currentLevel = uiGmapLogger.LEVELS.warn;
		// uiGmapGoogleMapApi is a promise. The 'then' callback function provides the google.maps object.
		uiGmapGoogleMapApi.then(function(maps) {
			var dirDisplay = new maps.DirectionsRenderer({
				preserveViewport: true,
				suppressMarkers: true
			});
			var dirService = new maps.DirectionsService();
			$scope.map = {
				center: {
					latitude: 47.36865,
					longitude: 8.539182
				},
				zoom: 14,
				events: {
					tilesloaded: function(map) { //https://github.com/angular-ui/angular-google-maps/issues/1680#issuecomment-170588984
						dirDisplay.setMap(map);
					}
				}
			};
			$scope.options = {
				scrollwheel: false
			};
			$scope.marker = {
				id: 0,
				coords: {}
			};
			$scope.marker2 = {
				id: 1,
				coords: {}
			};
			// marker example
			$scope.$on('point1', function(event, loc){
				$scope.marker.coords = loc;
			});
			$scope.$on('search', function(event, loc){
				$http.post('/app/taxi/listByGeoLocation.json?latitude='+loc.latitude+'&longitude='+loc.longitude+'&distance=10&radius=1000')
				.then(function (res) {
					$log.info(res);
				})
			});
			$scope.$on('point2', function(event, loc){
				$scope.marker2.coords = loc;
				if ($scope.marker.coords.latitude) {
					dirService.route({
						origin: new maps.LatLng($scope.marker.coords.latitude, $scope.marker.coords.longitude),
						destination: new maps.LatLng($scope.marker2.coords.latitude, $scope.marker2.coords.longitude),
						travelMode: maps.TravelMode.DRIVING,
						unitSystem: maps.UnitSystem.METRIC
					}, function(response, status) {
						if (status === maps.DirectionsStatus.OK) {
							dirDisplay.setDirections(response);
							// TODO: yak u tipa bulo
							var distance = parseFloat(response['routes'][0]['legs'][0]['distance']['value'] / 1000).toFixed(0); // Converting distance in kms
							var duration = Math.round(response['routes'][0]['legs'][0]['duration']['value'] / 60); // Converting to mins
							dirDisplay.setMap($scope.map);
						} else {
							$log.error('Directions request failed due to ' + status);
						}
					});
				}
			});
		});
	});
