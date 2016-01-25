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
		$state, $stateParams, $translate, mapsG) {
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
			$scope.markers = [];
			$scope.idx = 2;

			$scope.data = [];
			//$scope.$on('search', function(event, address) {
			if ($stateParams.address) {
				var address = JSON.parse($stateParams.address);
			var loc1 = {};
			if (address.point1)
				loc1 = address.point1;
			$http.post('/app/taxi/listByGeoLocation.json?latitude=' + loc1.latitude + '&longitude=' + loc1.longitude +
				'&distance=10&radius=1000')
				.then(function (res) {

					if (res.data.length > 0) {
						$scope.data = res.data;

						//angular.forEach($scope.data, function(value){
							for (var i = 0; i < $scope.data.length; i++) {

								$scope.data[i]['distance'] = mapsG.distancekm(address.point1.latitude,address.point1.longitude, $scope.data[i].latitude, $scope.data[i].longitude, 'k');
						var marker = {id: $scope.idx, latitude: $scope.data[i].latitude, longitude: $scope.data[i].longitude};
							$scope.markers.push(marker);
								$scope.idx += 1;
						}

						if (address.point1) {
							$rootScope.$broadcast('point1', address.point1);
						}
						if (address.point2) {
							$rootScope.$broadcast('point2', address.point2);
						}
					}
				});
		}
			//});
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
		/*					$scope.markers = $scope.markers.concat([$scope.marker1, $scope.marker2]);
							var bounds = new google.maps.LatLngBounds();
							angular.forEach($scope.markers, function(marker){
								bounds.extend(marker.coords); // your marker position, must be a LatLng instance
							});

							$scope.map.fitBounds(bounds);*/
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
		$scope.contact = {};
		$scope.contactForm = {
			options: {},
			model: $scope.contact,
			fields: [
				{
					key: 'name',
					type: 'input',
					templateOptions: {
						label: $translate.instant('LABEL.NAME'),
						placeholder: $translate.instant('LABEL.NAME')
					}
				},
				{
					key: 'email',
					type: 'input',
					templateOptions: {
						label: $translate.instant('LABEL.EMAIL'),
						placeholder: $translate.instant('LABEL.EMAIL'),
						type: 'email'
					}
				},
				{
					key: 'subject',
					type: 'input',
					templateOptions: {
						label: $translate.instant('LABEL.SUBJECT'),
						placeholder: $translate.instant('LABEL.SUBJECT')
					}
				},
				{
					key: 'message',
					type: 'input',
					templateOptions: {
						label: $translate.instant('LABEL.MESSAGE'),
						placeholder: $translate.instant('LABEL.MESSAGE'),
						type: 'textarea'
					}
				}
			]
		};
		$scope.resetAllForms = invokeOnAllFormOptions.bind(null, 'resetModel');

		function invokeOnAllFormOptions(fn) {
			if ($scope.form.options && $scope.form.options[fn]) {
				$scope.form.options[fn]();
			}
		}
	});
