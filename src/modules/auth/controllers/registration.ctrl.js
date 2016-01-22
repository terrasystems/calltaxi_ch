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
				label: $translate.instant('LABEL.FIRSTNAME'),
				placeholder: $translate.instant('LABEL.FIRSTNAME')
			}
			},
		{
			key: 'lastName',
			type: 'input',
			templateOptions: {
				label: $translate.instant('LABEL.LASTNAME'),
				placeholder: $translate.instant('LABEL.LASTNAME')
			}
			},
		{
			key: 'email',
			type: 'input',
			templateOptions: {
				label: $translate.instant('LABEL.EMAIL'),
				placeholder: $translate.instant('LABEL.EMAIL'),
				type: 'email'
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
		},
		{
			key: 'phoneNumber',
			type: 'input',
			templateOptions: {
				label: $translate.instant('LABEL.PHONENUMBER'),
				placeholder: $translate.instant('LABEL.PHONENUMBER'),
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
				label: $translate.instant('LABEL.LICENSENUMBER'),
				placeholder: $translate.instant('LABEL.LICENSENUMBER'),
				type: 'text'
			}
		},
		{
			key: 'address',
			type: 'input',
			templateOptions: {
				label: $translate.instant('LABEL.ADDRESS'),
				placeholder: $translate.instant('LABEL.ADDRESS'),
				type: 'text'
			}
		},
		{
			key: 'companyName',
			type: 'input',
			templateOptions: {
				label: $translate.instant('LABEL.COMPANYNAME'),
				placeholder: $translate.instant('LABEL.COMPANYNAME'),
				type: 'text'
			}
		},
		{
			key: 'website', //className: 'col-xs-6',
			type: 'input',
			templateOptions: {
				label: $translate.instant('LABEL.WEBSITE'),
				placeholder: $translate.instant('LABEL.WEBSITE'),
				type: 'text'
			}
		},
		{
			className: 'row',
			fieldGroup: [
				{
					key: 'latitude',
					className: 'col-xs-6',
					type: 'input',
					templateOptions: {
						label: $translate.instant('LABEL.LATIT'),
						placeholder: $translate.instant('LABEL.LATIT'),
						type: 'number'
					}
				},
				{
					key: 'longitude',
					className: 'col-xs-6',
					type: 'input',
					templateOptions: {
						label: $translate.instant('LABEL.LONGIT'),
						placeholder: $translate.instant('LABEL.LONGIT'),
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
						label: $translate.instant('LABEL.VEHICLENUMBER'),
						placeholder: $translate.instant('LABEL.VEHICLENUMBER'),
						type: 'number'
					}
				},
				{
					key: 'driverName',
					className: 'col-xs-6',
					type: 'input',
					templateOptions: {
						label: $translate.instant('LABEL.DRIVERNAME'),
						placeholder: $translate.instant('LABEL.DRIVERNAME'),
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
			title: $translate.instant('LABEL.USER'),
			active: true,
			form: {
				options: {},
				model: $scope.model,
				fields: userFields
			}
    },
		// supl tab
		{
			title: $translate.instant('LABEL.SUPPLIER'),
			form: {
				options: {},
				model: $scope.model,
				fields: suplFields
			}
	},
		// supl tab
		{
			title: $translate.instant('LABEL.DRIVER'),
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
			action: 'signup'
			});
		switch ($scope.tabIndex) {
			case 0:
				angular.extend($scope.model, {
					url: 'user',
					role: 'ROLE_USER'
				});
			  break;
			case 1:
				angular.extend($scope.model, {
					url: 'supplier',
					role: 'ROLE_SUPPLIER'
				});
				break;
			case 2:
				angular.extend($scope.model, {
					url: 'driver',
					role: 'ROLE_DRIVER'
				});
				break;
		}

		taxiRequest.post($scope.model, null, function(res) {
			//$log.info(res);
			if (res.data)
			 alertService.add(3, res.data);
		}, function(err) {
			$log.error(err);
		});
		//$scope.options.updateInitialValue();
		invokeOnAllFormOptions('updateInitialValue');
	};
	$scope.getindex = function(index)
	{
		$scope.tabIndex = index;
	};

	function invokeOnAllFormOptions(fn) {
		angular.forEach($scope.tabs, function(tab) {
			if (tab.form.options && tab.form.options[fn]) {
				tab.form.options[fn]();
			}
		});
	}
});
