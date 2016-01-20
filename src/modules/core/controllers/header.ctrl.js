'use strict';
/*  */
/*jshint -W030 */
angular.module('com.module.core')
	/*  */
	.controller('HeaderController', function($scope, privateRequest, $interval, alertService,
		$stateParams) {
		$stateParams.id;
		$scope.isCollapsed = true;
		// clock
		$scope.currenttime = Date.now();
		$interval(function() {
			$scope.currenttime = Date.now();
		}, 5000);
		// hide 3 buttons
		$scope.hide3b = false;
		// search
		$scope.search = function(obj) {

		};
		// go search
		$scope.gosearch = function(obj) {
		};
		$scope.support = function() {
			privateRequest.post({
				url: 'feedback'
			}, $scope.RequestBody, function() {
				alertService.add(3, 'SUCCESSOPERATION');
				$scope.RequestBody = '';
				$scope.isCollapsed = true;
			});
		};
	});
