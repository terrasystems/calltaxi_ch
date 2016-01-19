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
.controller('PassrecoveryController', function($scope, publicRequest, blockUI) {
	$scope.submitForm = function(isValid) {
		if (isValid) {
			// Блокировка кнопки отправки
			$scope.emailWasSent = true;
			// Блокируем интерфейс
			blockUI.start();
			// Отправка
			publicRequest.post({url:'passrecovery'}, $scope.pass, function(res) {
				// Разблокируем интерфейс
				blockUI.stop();
				res = null;
			});
		}
	};
});