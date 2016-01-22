'use strict';
/**
 * @ngdoc function
 * @name com.module.addtaxi.controller:publicController
 * @description
 * # addtaxiController
 * Controller of the Registration
 */
angular.module('com.module.addtaxi').controller('AddtaxiController', function($scope, taxiRequest, $state,
	alertService, blockUI, $rootScope, $translate, $log, Upload, $timeout) {
	//
	$scope.model = {
		id: null,
		name: '',
		description: '',
		acVehicle: null,
		maxPassengerCapacity: null,
		maxLuggageCapacity: null,
		meetingPoint: null,
		cancellationPolicy: null,
		additionalInformation: null,
		latitude: 1,
		longitude: 1,
		inclusions: [],
		exclusions: [],
		imageInfos: [],
		currency: null,
		transporttype: null,
		cartype: null,
		pickUpLocation: null,
		dropOffLocation: null,
		source: null,
		destination: null,
		price: null,
		taxiBookingOptions: [],
		starRating: null,
		active: null,
		updatedOn: null,
		countryDTO: null,
		cityDTO: null,
		supplierDTO: null,
		reviews: null
	};
	$scope.options = {
		formState: {}
	};
	//
	var userFields = [
		{
			key: 'name',
			type: 'input',
			templateOptions: {
				label: $translate.instant('NAME'),
				placeholder: $translate.instant('NAME')
			}
			},
		{
			key: 'description',
			type: 'textarea',
			templateOptions: {
				label: $translate.instant('DESCR'),
				placeholder: $translate.instant('DESCR')
			}
			},
		{
			key: 'cartype',
			type: 'select',
			defaultValue: 0,
			templateOptions: {
				label: $translate.instant('CARTYPE'),
				placeholder: $translate.instant('CARTYPE'),
				options:[
					{	name: 'taxi',value: 0},
					{	name: 'van',value: 1},
					{	name: 'bus',value: 2}
				]
			}
		},
		{
			key: 'maxPassengerCapacity',
			type: 'select',
			defaultValue: 1,
			templateOptions: {
				label: $translate.instant('MAXPASSENGERCAPACITY'),
				placeholder: $translate.instant('MAXPASSENGERCAPACITY'),
				options:[
					{	name: '1',value: 1},
					{	name: '2',value: 2},
					{	name: '3',value: 3},
					{	name: '4',value: 4},
					{	name: '5',value: 5},
					{	name: '6',value: 6},
					{	name: '7',value: 7},
					{	name: '8',value: 8},
					{	name: '9',value: 9},
					{	name: '10',value: 10}
				]
			}
		},
		{
			key: 'maxLuggageCapacity',
			type: 'select',
			defaultValue: 1,
			templateOptions: {
				label: $translate.instant('MAXLUGGAGECAPACITY'),
				placeholder: $translate.instant('MAXLUGGAGECAPACITY'),
				options:[
					{	name: '1',value: 1},
					{	name: '2',value: 2},
					{	name: '3',value: 3},
					{	name: '4',value: 4},
					{	name: '5',value: 5},
					{	name: '6',value: 6},
					{	name: '7',value: 7},
					{	name: '8',value: 8},
					{	name: '9',value: 9},
					{	name: '10',value: 10}
				]
			}
			},
		{
			key: 'acVehicle',
			type: 'select',
			defaultValue: true,
			templateOptions: {
				label: $translate.instant('ACVEHICLE'),
				placeholder: $translate.instant('ACVEHICLE'),
				options:[
					{	name: 'yes',value: true},
					{	name: 'no',value: false}
				]
			}
		},
		{
			key: 'meetingPoint',
			type: 'textarea',
			templateOptions: {
				label: $translate.instant('MEETINGPOINT'),
				placeholder: $translate.instant('MEETINGPOINT'),
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
		},
		{
			key: 'cancellationPolicy',
			type: 'textarea',
			templateOptions: {
				label: $translate.instant('CANCELLATIONPOLICY'),
				placeholder: $translate.instant('CANCELLATIONPOLICY'),
				type: 'text'
			}
		},
		{
			key: 'additionalInformation',
			type: 'textarea',
			templateOptions: {
				label: $translate.instant('ADDITIONALINFORMATION'),
				placeholder: $translate.instant('ADDITIONALINFORMATION'),
				type: 'text'
			}
		},
		{
			key: 'inclusions',
			type: 'ui-select-multiple',
			templateOptions: {
				optionsAttr: 'bs-options',
				ngOptions: 'option as option in to.options | filter: $select.search',
				label: 'Multiple Select',
				placeholder: 'Select options',
				options: []
			}
		},
		{
			key: 'exclusions',
			type: 'ui-select-multiple',
			templateOptions: {
				optionsAttr: 'bs-options',
				ngOptions: 'option as option in to.options | filter: $select.search',
				label: 'Multiple Select',
				placeholder: 'Select options',
				options: []
			}
		},
		{
			key: 'countryDTO',
			type: 'select',
			defaultValue: 'CHOUSECOUNTRY',
			templateOptions: {
				label: $translate.instant('COUNTRYNAME'),
				placeholder: $translate.instant('COUNTRYNAME'),
				options:[
					{	name: 'CHOUSECOUNTRY',value: 'CHOUSECOUNTRY'},
					{	name: 'Switzerland',value: 'Switzerland'}
				]
			}
		},
		{
			key: 'cityDTO',
			type: 'select',
			defaultValue: 'Basel',
			templateOptions: {
				label: $translate.instant('CITYNAME'),
				placeholder: $translate.instant('CITYNAME'),
				options:[
					{	name: 'Basel',value: 'Basel'},
					{	name: 'Bern',value: 'Bern'}
				]
			}
		},
		{
			key: 'currency',
			type: 'select',
			defaultValue: 'CHF',
			templateOptions: {
				label: $translate.instant('CURRENCY'),
				placeholder: $translate.instant('CURRENCY'),
				options:[
					{	name: 'CHF',value: 'CHF'},
					{	name: 'EUR',value: 'EUR'},
					{	name: 'USD',value: 'USD'}
				]
			}
		}
		/*,
		{
			key: 'transporttypeAirport',
			type: 'checkbox',
			templateOptions: {
				label: $translate.instant('TRANSPORTTYPEAIRPORT')
			}
		},
		{
			key: 'transporttypePointToPoint',
			type: 'checkbox',
			templateOptions: {
				label: $translate.instant('TRANSPORTTYPEPOINTTOPOINT')
			}
		},
		{
			key: 'transporttypeOutstation',
			type: 'checkbox',
			templateOptions: {
				label: $translate.instant('TRANSPORTTYPEOUTSTATION')
			}
		}*/
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

		//angular.extend($scope.model, {id: null});

		taxiRequest.post({url:'taxi',version:'v1',action: 'create'}, $scope.model, function(res) {
			//$log.info(res);
			if (res.data)
			 alertService.add(3, res.data);
		}, function(err) {
			$log.error(err);
		});
		//$scope.options.updateInitialValue();
		invokeOnAllFormOptions('updateInitialValue');
	};

	function invokeOnAllFormOptions(fn) {
			if ($scope.form.options && $scope.form.options[fn]) {
				$scope.form.options[fn]();
			}
	}

	// for multiple files:
	$scope.uploadFiles = function(files, errFiles) {
		$scope.files = files;
		$scope.errFiles = errFiles;
		taxiRequest.get({url: 'taxi', action: 'uploadurl'}, function (resp) {
			if (resp.data) {
				var tmp = resp.data.replace('http://3.gesappuat.appspot.com/', '');
				angular.forEach(files, function (file) {
					file.upload = Upload.upload({
						url: tmp,
						data: {file: file}
					});
					file.upload.then(function (response) {
						$timeout(function () {
							file.result = response.data;
						});
					}, function (response) {
						$log.error(response);
						if (response.status > 0)
							$scope.errorMsg = response.status + ': ' + response.data;
					}, function (evt) {
						file.progress = Math.min(100, parseInt(100.0 *
							evt.loaded / evt.total));
					});
				});
			}
		}, function (err) {
			$log.error(err);
		});
		//end
	};
});
