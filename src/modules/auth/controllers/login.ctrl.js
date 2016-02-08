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
.controller('LoginController', function ($rootScope, $scope, $http, $state, $translate, alertService, toastr) {
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
				};
		};
		$scope.onSubmit = function () {
			//$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
			$http.post('/app/user/v2/login', {email: $scope.form.model.email, password: $scope.form.model.password})
			//$http.get('/app/user/v1/login?emailId=test@test.com&password=test')
			.then(
				function(response){
				// success callback
				toastr.success($translate.instant('MESSAGES.LOGIN'));
				$rootScope.user = response.data;
				console.log($rootScope.user);
				$state.go('main.addtaxi');
			},
			function(response){
			// failure callback
			toastr.error($translate.instant('MESSAGES.LOGINERROR'));
		});
		};
});
