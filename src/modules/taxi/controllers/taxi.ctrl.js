'use strict';
angular.module('com.module.taxi')
/**
 * @ngdoc function
 * @name com.module.taxi.controller:TaxiController
 * @description
 * # TaxiController
 * Controller of the main-common form
 */
.controller('TaxiController', function ($scope, privateRequest, $translate, $sessionStorage, periodObj) {
	/* model toggle */
	$scope.type = 'Pie';
	$scope.periodobject = periodObj;
	// periodfilter
	$scope.periodfilter = $sessionStorage.periodfilter || 0;
	if (!$scope.backfilter) $scope.backfilter = {
		filtering: {}
	};
});
