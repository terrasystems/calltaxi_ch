'use strict';
/**
 * @ngdoc function
 * @name com.module.public.controller:publicController
 * @description
 * # publicController
 * Controller of the public Editor
 */
angular.module('com.module.public')
//
.controller('LoginController', function ($scope, $http, responseService, tokenRelogin, blockUI, alertService, publicRequest) {
	$scope.submitForm = function (isValid) {
		if (isValid) {
			// Блокируем интерфейс
			blockUI.start();
			// Вызываем логин на сервере
			//$http.post('/serv/public/login', $scope.login).success(function(res) {
			publicRequest.post({url: 'login'}, $scope.login, function (data) {
				// Разблокируем интерфейс
				blockUI.stop();
				// Блокируем логин
				$scope.loginWasSent = true;
				tokenRelogin(data.result);
				data = null;
			}, function (response) {
				if ((response.data.result) && (response.data.result.activationlink)) $scope.activationlink = response.data.result.activationlink;
			});
		}
	};
});