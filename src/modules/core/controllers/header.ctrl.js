'use strict';
/*jshint -W030 */
/*jshint -W106 */
angular.module('com.module.core')
	/*  */
	.controller('HeaderController', function ($scope, $interval, alertService, $http, $state, $stateParams, $rootScope) {
		$scope.isCollapsed = true;
		// clock
		$scope.currenttime = Date.now();
		$interval(function () {
			$scope.currenttime = Date.now();
		}, 5000);
		$scope.getCoords = function (model) {
			var obj = {};
			if (angular.isDefined(model.geometry) && model.geometry) {
				obj = {
					latitude: model.geometry.location.lat(),
					longitude: model.geometry.location.lng()
				};
			}
			return obj;
		};

		// go search
		$scope.doSearch = function (address) {
			if (angular.isUndefined(address.geometry)) {
				return;
			}
			$rootScope.$broadcast('search', $scope.getCoords(address));
			$state.go('main.taxi.list');
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
		$scope.$watch('address.point1', function (model) {
			$rootScope.$broadcast('point1', $scope.getCoords(model));
		});

		// Point 2 select
		$scope.$watch('address.point2', function (model) {
			$rootScope.$broadcast('point2', $scope.getCoords(model));
		});

	});
