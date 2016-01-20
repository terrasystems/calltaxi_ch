'use strict';
/**
 * @ngdoc function
 * @name com.module.auth.controller:publicController
 * @description
 * # authController
 * Controller of the public Editor
 */
angular.module('com.module.auth')
//
.controller('RegistrationController', function($scope, publicRequest, $state, alertService, blockUI, getGeoCountry, $rootScope) {
	// Вчисляем страну по IP
	getGeoCountry();
	$scope.submitForm = function(isValid) {
		if (isValid) {
			$scope.sendRegistration = true;
			// Блокируем интерфейс
			blockUI.start();
			$scope.reg.country = $rootScope.country_code;
			publicRequest.post({url: 'registration'}, $scope.reg, function(data) {
				// Разблокируем интерфейс
				blockUI.stop();
					window.location = data.result.domain + '/#/regactivation/' + data.result.authkey;

				data = null;
			});
		}
	};
});