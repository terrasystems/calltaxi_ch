'use strict';
/**
 * @ngdoc function
 * @name com.module.auth.controller:publicController
 * @description
 * # authController
 * Controller of the Registration
 */
angular.module('com.module.auth').controller('RegistrationController', function($scope, taxiRequest, $state,
	alertService, blockUI, $rootScope, $translate, $log) {
	//
	$scope.model = {};
	$scope.options = {
		formState: {}
	};
	//
	var userFields = [
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
			}
			},
		{
			key: 'lastName',
			type: 'input',
			templateOptions: {
				label: $translate.instant('LASTNAME'),
				placeholder: $translate.instant('LASTNAME')
			}
			},
		{
			key: 'email',
			type: 'input',
			templateOptions: {
				label: $translate.instant('EMAIL'),
				placeholder: $translate.instant('EMAIL'),
				type: 'email'
			}
		},
		{
			key: 'password',
			type: 'input',
			templateOptions: {
				label: $translate.instant('PASSWORD'),
				placeholder: $translate.instant('PASSWORD'),
				type: 'password'
			}
		},
		{
			key: 'phoneNumber',
			type: 'input',
			templateOptions: {
				label: $translate.instant('PHONENUMBER'),
				placeholder: $translate.instant('PHONENUMBER'),
				type: 'tel'
			}
			}
		];
	var suplFields = []; //driverFields = [];
	suplFields = userFields.concat([
		{
			key: 'licenseNumber',
			type: 'input',
			templateOptions: {
				label: $translate.instant('LICENSENUMBER'),
				placeholder: $translate.instant('LICENSENUMBER'),
				type: 'text'
			}
		},
		{
			key: 'address',
			type: 'input',
			templateOptions: {
				label: $translate.instant('ADDRESS'),
				placeholder: $translate.instant('ADDRESS'),
				type: 'text'
			}
		},
		{
			key: 'companyName',
			type: 'input',
			templateOptions: {
				label: $translate.instant('COMPANYNAME'),
				placeholder: $translate.instant('COMPANYNAME'),
				type: 'text'
			}
		},
		{
			key: 'website', //className: 'col-xs-6',
			type: 'input',
			templateOptions: {
				label: $translate.instant('WEBSITE'),
				placeholder: $translate.instant('WEBSITE'),
				type: 'url'
			}
		},
		{
			className: 'row',
			fieldGroup: [
				{
					key: 'latit',
					className: 'col-xs-6',
					type: 'input',
					templateOptions: {
						label: $translate.instant('LATIT'),
						placeholder: $translate.instant('LATIT'),
						type: 'number'
					}
				},
				{
					key: 'longit',
					className: 'col-xs-6',
					type: 'input',
					templateOptions: {
						label: $translate.instant('LONGIT'),
						placeholder: $translate.instant('LONGIT'),
						type: 'number'
					}
				}
			]
		},
		{
			className: 'row',
			fieldGroup: [
				{
					key: 'vehicleNumber',
					className: 'col-xs-6',
					type: 'input',
					templateOptions: {
						label: $translate.instant('VEHICLENUMBER'),
						placeholder: $translate.instant('VEHICLENUMBER'),
						type: 'number'
					}
				},
				{
					key: 'driverName',
					className: 'col-xs-6',
					type: 'input',
					templateOptions: {
						label: $translate.instant('DRIVERNAME'),
						placeholder: $translate.instant('DRIVERNAME'),
						type: 'text'
					}
				}
			]
		}
	]);
	//angular.copy(suplFields, driverFields);
	//
	$scope.tabs = [
		//user tab
		{
			title: $translate.instant('USER'),
			active: true,
			form: {
				options: {},
				model: $scope.model,
				fields: userFields
			}
    },
		// supl tab
		{
			title: $translate.instant('SUPPLIER'),
			form: {
				options: {},
				model: $scope.model,
				fields: suplFields
			}
	},
		// supl tab
		{
			title: $translate.instant('DRIVER'),
			form: {
				options: {},
				model: $scope.model,
				fields: suplFields
			}
	}
    ];
	$scope.originalTabs = angular.copy($scope.form);
	//$scope.originalFields = angular.copy($scope.fields);
	$scope.resetAllForms = invokeOnAllFormOptions.bind(null, 'resetModel');
	$scope.onSubmit = function() {
		angular.extend($scope.model, {
			url: 'user',
			action: 'signup'
		});
		taxiRequest.post($scope.model, {}, function(res) {
			$log.info(res);
		}, function(err) {
			$log.error(err);
		});
		//$scope.options.updateInitialValue();
		invokeOnAllFormOptions('updateInitialValue');
	};

	function invokeOnAllFormOptions(fn) {
		angular.forEach($scope.tabs, function(tab) {
			if (tab.form.options && tab.form.options[fn]) {
				tab.form.options[fn]();
			}
		});
	}
});
