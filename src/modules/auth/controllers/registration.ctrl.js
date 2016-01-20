'use strict';
/**
 * @ngdoc function
 * @name com.module.auth.controller:publicController
 * @description
 * # authController
 * Controller of the public Editor
 */
angular.module('com.module.auth').controller('RegistrationController', function($scope, taxiRequest, $state,
	alertService, blockUI, $rootScope, $translate, $log) {
	//
	$scope.options = {
		formState: {}
	};
	//
	$scope.fields = [
		{
			key: 'firstName',
			type: 'input',
			templateOptions: {
				labelSrOnly: true,
				label: $translate.instant('FIRSTNAME'),
				placeholder: $translate.instant('FIRSTNAME'),
				addonLeft: {
					class: 'fa fa-user'
				}
			},
			expressionProperties: {
				'templateOptions.label': '"FIRSTNAME" | translate',
				'templateOptions.placeholder': '"FIRSTNAME" | translate'
			}
      },
		{
			key: 'lastName',
			type: 'input',
			templateOptions: {
				label: $translate.instant('LASTNAME'),
				placeholder: $translate.instant('LASTNAME')
			},
			expressionProperties: {
				'templateOptions.label': '"LASTNAME" | translate',
				'templateOptions.placeholder': '"LASTNAME" | translate'
			}
      },
		{
			key: 'email',
			type: 'input',
			templateOptions: {
				label: $translate.instant('EMAIL'),
				placeholder: $translate.instant('EMAIL'),
				type: 'email'
			},
			expressionProperties: {
				'templateOptions.label': '"EMAIL" | translate',
				'templateOptions.placeholder': '"EMAIL" | translate'
			}
		},
		{
			key: 'password',
			type: 'input',
			templateOptions: {
				label: $translate.instant('PASSWORD'),
				placeholder: $translate.instant('PASSWORD'),
				type: 'password'
			},
			expressionProperties: {
				'templateOptions.label': '"PASSWORD" | translate',
				'templateOptions.placeholder': '"PASSWORD" | translate'
			}
		},
		{
			key: 'phoneNumber',
			type: 'input',
			templateOptions: {
				label: $translate.instant('PHONENUMBER'),
				placeholder: $translate.instant('PHONENUMBER'),
				type: 'tel'
			},
			expressionProperties: {
				'templateOptions.label': '"PHONENUMBER" | translate',
				'templateOptions.placeholder': '"PHONENUMBER" | translate'
			}
      }
    ];
	$scope.originalFields = angular.copy($scope.fields);
	$scope.onSubmit = function() {
		angular.extend($scope.model, {url:'user', action:'signup'});
		taxiRequest.get($scope.model, function (res) {
			$log.info(res);
		}, function (err) {
			$log.error(err);
		});
		$scope.options.updateInitialValue();
	};
});
