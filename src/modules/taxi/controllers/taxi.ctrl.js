'use strict';
/*jshint -W116 */
/*jshint -W098 */
/*jshint -W069 */
angular.module('com.module.taxi')
/**
 * @ngdoc function
 * @name com.module.taxi.controller:TaxiController
 * @description
 * # TaxiController
 * Controller of the main-common form
 */
	.controller('TaxiController', function($scope, uiGmapGoogleMapApi, uiGmapLogger, $log, $timeout, $http, $rootScope,
		$state, $stateParams) {
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
				zoom: 8,
				events: {
					tilesloaded: function(map) { //https://github.com/angular-ui/angular-google-maps/issues/1680#issuecomment-170588984
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
			$scope.data = [];
			$scope.$on('search', function(event, loc) {
				$http.post('/app/taxi/listByGeoLocation.json?latitude=' + loc.latitude + '&longitude=' + loc.longitude +
						'&distance=10&radius=1000')
					.then(function(res) {
						if (res.data.length > 0) {
							$scope.data = res.data;
						}
					});
			});
			$scope.buildRote = function() {
				if (($scope.marker1.coords.latitude) && ($scope.marker2.coords.latitude)) {
					dirService.route({
						origin: new maps.LatLng($scope.marker1.coords.latitude, $scope.marker1.coords.longitude),
						destination: new maps.LatLng($scope.marker2.coords.latitude, $scope.marker2.coords.longitude),
						travelMode: maps.TravelMode.DRIVING,
						unitSystem: maps.UnitSystem.METRIC
					}, function(response, status) {
						if (status === maps.DirectionsStatus.OK) {
							dirDisplay.setDirections(response);
							// TODO: yak u tipa bulo
							var distance = parseFloat(response['routes'][0]['legs'][0]['distance']['value'] / 1000).toFixed(0); // Converting distance in kms
							var duration = Math.round(response['routes'][0]['legs'][0]['duration']['value'] / 60); // Converting to mins
							// broadcast travel data
							$rootScope.$broadcast('travelData', {
								'distance': distance,
								'duration': duration
							});
							$scope.map.center = {
								latitude: ($scope.marker1.coords.latitude + $scope.marker2.coords.latitude) / 2,
								longitude: ($scope.marker1.coords.longitude + $scope.marker2.coords.longitude) / 2
							};
						} else {
							$log.error('Directions request failed due to ' + status);
						}
					});
				} else { // broadcast EMPTY !!! travel data
					$rootScope.$broadcast('travelData', {});
				}
			};
			$scope.$on('point1', function(event, loc) {
				$scope.marker1.coords = loc;
				$scope.buildRote();
			});
			$scope.$on('point2', function(event, loc) {
				$scope.marker2.coords = loc;
				$scope.buildRote();
			});
			$scope.drillDown = function(argument) {
				//
			};
		});
		//
		$scope.detail = {};
		if ($state.includes('**.detail') && $stateParams.id) {
			$http.get('/app/taxi/v1/details/' + $stateParams.id).then(function(res) {
				$log.info(res);
				$scope.detail = res.data || {
					'id': 5749563331706880,
					'name': 'null',
					'description': 'null',
					'acVehicle': 'null',
					'maxPassengerCapacity': 'null',
					'maxLuggageCapacity': 'null',
					'meetingPoint': 'null',
					'cancellationPolicy': 'null',
					'additionalInformation': 'null',
					'latitude': 47.36866,
					'longitude': 8.539183,
					'phoneNumber': 'null',
					'taxiNumber': 'null',
					'inclusions': [],
					'exclusions': [],
					'imageInfos': [],
					'currency': 'null',
					'transporttype': 'null',
					'cartype': 'null',
					'pickUpLocation': 'null',
					'dropOffLocation': 'null',
					'source': 'null',
					'destination': 'null',
					'price': '9',
					'taxiBookingOptions': [],
					'starRating': 4,
					'active': true,
					'updatedOn': '',
					'city': 'Zurich',
					'supplierDTO': 'null',
					'reviews': null
				};
			}, function(err) {
				$log.error(err);
			});
		}
	});
