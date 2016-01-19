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
.controller('PassnewController', function ($scope, $stateParams, $state, blockUI,
tokenRelogin, publicRequest) {
	// Проверка на валидный ключ перехода
	publicRequest.get({url: 'getdaterecoverlink', action: $stateParams.id}, function () {
		$scope.recoveryLinkValid = true;
	}, function () {
		$state.go('main.public.login');
	});
	$scope.newPass = {
		id: '',
		password: '',
		verification: ''
	};
	$scope.activationlink = '';
	$scope.submitForm = function (isValid) {
		if (isValid) {
			$scope.newPass.id = $stateParams.id;
			$scope.passWasSend = true;
			// Блокируем интерфейс
			blockUI.start();
			publicRequest.post({url: 'passnew'}, $scope.newPass, function (data) {
				// Разблокируем интерфейс
				blockUI.stop();
				tokenRelogin(data.result);
				data = null;
			}, function (response) {
				if ((response.data.result) && (response.data.result.activationlink)) $scope.activationlink = response.data.result.activationlink;
			});
		}
	};
});