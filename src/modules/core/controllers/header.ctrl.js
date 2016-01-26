'use strict';
/*jshint -W030 */
/*jshint -W106 */
angular.module('com.module.core')
	/*  */
	.controller('HeaderController', function ($scope, $interval, alertService, $http, $state, $stateParams, $rootScope, getCoords) {
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
		$scope.$watch('address.point1', function (model) {
			$rootScope.$broadcast('point1', getCoords(model));
		});

		// Point 2 select
		$scope.$watch('address.point2', function (model) {
			$rootScope.$broadcast('point2', getCoords(model));
		});

	});
