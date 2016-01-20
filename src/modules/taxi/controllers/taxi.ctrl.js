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
.controller('TaxiController', function ($scope, uiGmapGoogleMapApi, uiGmapLogger) {
	//
	uiGmapLogger.currentLevel = uiGmapLogger.LEVELS.debug;
	// uiGmapGoogleMapApi is a promise. The "then" callback function provides the google.maps object.
  uiGmapGoogleMapApi.then(function(maps) {
		$scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
    $scope.options = {scrollwheel: false};
  });
});
