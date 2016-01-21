'use strict';
/**
 * @ngdoc function
 * @name com.module.addtaxi.controller:publicController
 * @description
 * # addtaxiController
 * Controller of the Registration
 */
angular.module('com.module.addtaxi').controller('AddtaxiController', function($scope, taxiRequest, $state,
	alertService, blockUI, $rootScope, $translate, $log) {
	//
	$scope.model = {};
	$scope.options = {
		formState: {}
	};
	//
	var userFields = [
		{
			key: 'name',
			type: 'input',
			templateOptions: {
				labelSrOnly: true,
				label: $translate.instant('NAME'),
				placeholder: $translate.instant('NAME')
			}
			},
		{
			key: 'description',
			type: 'input',
			templateOptions: {
				label: $translate.instant('DESCR'),
				placeholder: $translate.instant('DESCR')
			}
			},
		{
			key: 'acVehicle',
			type: 'input',
			templateOptions: {
				label: $translate.instant('ACVEHICLE'),
				placeholder: $translate.instant('ACVEHICLE'),
				type: 'text'
			}
		},
		{
			key: 'maxPassengerCapacity',
			type: 'input',
			templateOptions: {
				label: $translate.instant('MAXPASSENGERCAPACITY'),
				placeholder: $translate.instant('MAXPASSENGERCAPACITY'),
				type: 'text'
			}
		},
		{
			key: 'maxLuggageCapacity',
			type: 'input',
			templateOptions: {
				label: $translate.instant('MAXLUGGAGECAPACITY'),
				placeholder: $translate.instant('MAXLUGGAGECAPACITY'),
				type: 'text'
			}
			},
		{
			key: 'meetingPoint',
			type: 'input',
			templateOptions: {
				label: $translate.instant('MEETINGPOINT'),
				placeholder: $translate.instant('MEETINGPOINT'),
				type: 'text'
			}
		},
		{
			key: 'cancellationPolicy',
			type: 'input',
			templateOptions: {
				label: $translate.instant('CANCELLATIONPOLICY'),
				placeholder: $translate.instant('CANCELLATIONPOLICY'),
				type: 'text'
			}
		},
		{
			key: 'additionalInformation',
			type: 'input',
			templateOptions: {
				label: $translate.instant('ADDITIONALINFORMATION'),
				placeholder: $translate.instant('ADDITIONALINFORMATION'),
				type: 'text'
			}
		},
		{
			key: 'latitude',
			type: 'input',
			templateOptions: {
				label: $translate.instant('LATITUDE'),
				placeholder: $translate.instant('LATITUDE'),
				type: 'number'
			}
		},
		{
			key: 'longitude',
			type: 'input',
			templateOptions: {
				label: $translate.instant('LONGITUDE'),
				placeholder: $translate.instant('LONGITUDE'),
				type: 'number'
			}
		}
		];

	//angular.copy(suplFields, driverFields);
	//

	$scope.form = {
				options: {},
				model: $scope.model,
				fields: userFields
			};
	$scope.resetAllForms = invokeOnAllFormOptions.bind(null, 'resetModel');
	$scope.onSubmit = function() {

		angular.extend($scope.model, {
			action: 'signup'
			});

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
