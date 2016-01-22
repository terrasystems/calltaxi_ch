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
.controller('LoginController', function ($scope, $http, $state, $translate, alertService) {
	$scope.model = {};
		var userFields = [
			{
				key: 'email',
				type: 'input',
				templateOptions: {
					label: $translate.instant('LABEL.EMAIL'),
					placeholder: $translate.instant('LABEL.EMAIL')
				}
			},
			{
				key: 'password',
				type: 'input',
				templateOptions: {
					label: $translate.instant('LABEL.PASSWORD'),
					placeholder: $translate.instant('LABEL.PASSWORD'),
					type: 'password'
				}
			}
		];
		$scope.form = {
			model: $scope.model,
			fields: userFields
		};
		$scope.resetAllForms = invokeOnAllFormOptions.bind(null, 'resetModel');

		function invokeOnAllFormOptions(fn) {
				if ($scope.form.options && $scope.form.options[fn]) {
					$scope.form.options[fn]();
				}
		}
		$scope.onSubmit = function (isValid) {
		$state.go('main.addtaxi');
		/*if (isValid) {
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
		}*/
	};
});
