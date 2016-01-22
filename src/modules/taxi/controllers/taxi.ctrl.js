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
	.controller('TaxiController', function ($scope, uiGmapGoogleMapApi, uiGmapLogger, $log, $timeout, $http, $rootScope) {
		//
		uiGmapLogger.currentLevel = uiGmapLogger.LEVELS.warn;
		// uiGmapGoogleMapApi is a promise. The 'then' callback function provides the google.maps object.
		uiGmapGoogleMapApi.then(function (maps) {
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
				zoom: 8,
				events: {
					tilesloaded: function (map) { //https://github.com/angular-ui/angular-google-maps/issues/1680#issuecomment-170588984
						dirDisplay.setMap(map);
					}
				}
			};
			//
			$scope.options = {
				scrollwheel: false
			};
			$scope.marker1 = {
				id: 0,
				coords: {}
			};
			$scope.marker2 = {
				id: 1,
				coords: {}
			};
			$scope.data = [{
				'acVehicle': null,
				'address': 'Route de la Maladière 4,  1022 Chavannes-près-Renens',
				'blobkey': null,
				'cartype': null,
				'currency': null,
				'description': 'Taxi & Navette Léman vous propose ses services',
				'dropOffLocation': null,
				'id': 4808361379889152,
				'imageUrl': null,
				'latitude': 46.207764,
				'longitude': 4.835022,
				'name': 'Navetee Taxi',
				'phoneNumber': '0800107107',
				'pickUpLocation': null,
				'price': '3.6',
				'starRating': 3.5,
				'supplierId': null,
				'transporttype': null,
				'type': 1,
				'website': 'www.navetteleman.ch'
			}];
			$scope.$on('search', function (event, loc) {
				$http.post('/app/taxi/listByGeoLocation.json?latitude=' + loc.latitude + '&longitude=' + loc.longitude + '&distance=10&radius=1000')
					.then(function (res) {
						if (res.data.length) {
							$scope.data = res.data;
						}
					});
			});

			$scope.buildRote = function () {
				if (($scope.marker1.coords.latitude) && ($scope.marker2.coords.latitude)) {
					dirService.route({
						origin: new maps.LatLng($scope.marker1.coords.latitude, $scope.marker1.coords.longitude),
						destination: new maps.LatLng($scope.marker2.coords.latitude, $scope.marker2.coords.longitude),
						travelMode: maps.TravelMode.DRIVING,
						unitSystem: maps.UnitSystem.METRIC
					}, function (response, status) {
						if (status === maps.DirectionsStatus.OK) {
							dirDisplay.setDirections(response);
							// TODO: yak u tipa bulo
							var distance = parseFloat(response['routes'][0]['legs'][0]['distance']['value'] / 1000).toFixed(0); // Converting distance in kms
							var duration = Math.round(response['routes'][0]['legs'][0]['duration']['value'] / 60); // Converting to mins
							// broadcast travel data
							$rootScope.$broadcast('travelData', {'distance': distance, 'duration': duration});
							$scope.map.center = {
								latitude: ($scope.marker1.coords.latitude + $scope.marker2.coords.latitude) / 2,
								longitude: ($scope.marker1.coords.longitude + $scope.marker2.coords.longitude) / 2
							};
						} else {
							$log.error('Directions request failed due to ' + status);
						}
					});
				} else {	// broadcast EMPTY !!! travel data
					$rootScope.$broadcast('travelData', {});
				}
			};

			$scope.$on('point1', function (event, loc) {
				$scope.marker1.coords = loc;
				$scope.buildRote();
			});
			$scope.$on('point2', function (event, loc) {
				$scope.marker2.coords = loc;
				$scope.buildRote();
			});

		});
	})
;
