'use strict';
/*jshint -W109 */
/*jshint -W098 */
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
					label: $translate.instant('LABEL.NAME'),
					placeholder: $translate.instant('LABEL.NAME')
				}
			},
			{
				key: 'description',
				type: 'textarea',
				templateOptions: {
					label: $translate.instant('LABEL.DESCRIPTION'),
					placeholder: $translate.instant('LABEL.DESCRIPTION')
				}
			},
			{
				className: 'row',
				fieldGroup: [{
						key: 'cartype',
						className: 'col-sm-4',
						type: 'select',
						defaultValue: 0,
						templateOptions: {
							label: $translate.instant('LABEL.CARTYPE'),
							placeholder: $translate.instant('LABEL.CARTYPE'),
							options: [
								{
									name: 'taxi',
									value: 0
								},
								{
									name: 'van',
									value: 1
								},
								{
									name: 'bus',
									value: 2
								}
				]
						}
		},
					{
						key: 'maxPassengerCapacity',
						className: 'col-sm-4',
						type: 'select',
						defaultValue: 1,
						templateOptions: {
							label: $translate.instant('LABEL.MAXPASSENGERCAPACITY'),
							placeholder: $translate.instant('LABEL.MAXPASSENGERCAPACITY'),
							options: [
								{
									name: '1',
									value: 1
								},
								{
									name: '2',
									value: 2
								},
								{
									name: '3',
									value: 3
								},
								{
									name: '4',
									value: 4
								},
								{
									name: '5',
									value: 5
								},
								{
									name: '6',
									value: 6
								},
								{
									name: '7',
									value: 7
								},
								{
									name: '8',
									value: 8
								},
								{
									name: '9',
									value: 9
								},
								{
									name: '10',
									value: 10
								}
				]
						}
		},
					{
						key: 'maxLuggageCapacity',
						className: 'col-sm-4',
						type: 'select',
						defaultValue: 1,
						templateOptions: {
							label: $translate.instant('LABEL.MAXLUGGAGECAPACITY'),
							placeholder: $translate.instant('LABEL.MAXLUGGAGECAPACITY'),
							options: [
								{
									name: '1',
									value: 1
								},
								{
									name: '2',
									value: 2
								},
								{
									name: '3',
									value: 3
								},
								{
									name: '4',
									value: 4
								},
								{
									name: '5',
									value: 5
								},
								{
									name: '6',
									value: 6
								},
								{
									name: '7',
									value: 7
								},
								{
									name: '8',
									value: 8
								},
								{
									name: '9',
									value: 9
								},
								{
									name: '10',
									value: 10
								}
				]
						}
		}]
	},
			{
				key: 'meetingPoint',
				type: 'textarea',
				templateOptions: {
					label: $translate.instant('LABEL.MEETINGPOINT'),
					placeholder: $translate.instant('LABEL.MEETINGPOINT'),
					type: 'text'
				}
		},
			{
				key: 'latitude',
				type: 'input',
				templateOptions: {
					label: $translate.instant('LABEL.LATIT'),
					placeholder: $translate.instant('LABEL.LATIT'),
					type: 'number'
				}
		},
			{
				key: 'longitude',
				type: 'input',
				templateOptions: {
					label: $translate.instant('LABEL.LONGIT'),
					placeholder: $translate.instant('LABEL.LONGIT'),
					type: 'number'
				}
		},
			{
				key: 'cancellationPolicy',
				type: 'textarea',
				templateOptions: {
					label: $translate.instant('LABEL.CANCELLATIONPOLICY'),
					placeholder: $translate.instant('LABEL.CANCELLATIONPOLICY'),
					type: 'text'
				}
		},
			{
				key: 'additionalInformation',
				type: 'textarea',
				templateOptions: {
					label: $translate.instant('LABEL.ADDITIONALINFORMATION'),
					placeholder: $translate.instant('LABEL.ADDITIONALINFORMATION'),
					type: 'text'
				}
		},
			{
				className: 'row',
				fieldGroup: [{
						key: 'countryDTO',
						className: 'col-sm-4',
						type: 'select',
						templateOptions: {
							label: $translate.instant('LABEL.COUNTRYNAME'),
							placeholder: $translate.instant('LABEL.COUNTRYNAME'),
							options: [
								{
									name: 'Switzerland',
									value: 'Switzerland'
								}
				]
						}
		},
					{
						key: 'cityDTO',
						className: 'col-sm-4',
						type: 'select',
						defaultValue: 'Basel',
						templateOptions: {
							label: $translate.instant('LABEL.CITYNAME'),
							placeholder: $translate.instant('LABEL.CITYNAME'),
							options: [
								{
									name: 'Basel',
									value: 'Basel'
								},
								{
									name: 'Bern',
									value: 'Bern'
								}
				]
						}
		},
					{
						key: 'currency',
						className: 'col-sm-4',
						type: 'select',
						defaultValue: {
							name: 'CHF',
							value: 'CHF'
						},
						templateOptions: {
							label: $translate.instant('LABEL.CURRENCY'),
							placeholder: $translate.instant('LABEL.CURRENCY'),
							options: [
								{
									name: 'CHF',
									value: 'CHF'
								},
								{
									name: 'EUR',
									value: 'EUR'
								},
								{
									name: 'USD',
									value: 'USD'
								}
				]
						}
		}]
	}
		/*
		 {
		 key: 'acVehicle',
		 type: 'select',
		 defaultValue: true,
		 templateOptions: {
		 label: $translate.instant('LABEL.ACVEHICLE'),
		 placeholder: $translate.instant('LABEL.ACVEHICLE'),
		 options:[
		 {	name: 'yes',value: true},
		 {	name: 'no',value: false}
		 ]
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
			taxiRequest.post({
				url: 'taxi',
				version: 'v1',
				action: 'create'
			}, $scope.model, function(res) {
				//$log.info(res);
				if (res.data) {
					alertService.add(3, res.data);
				}
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
			taxiRequest.get({
				url: 'taxi',
				action: 'uploadurl'
			}, function(resp) {
				if (resp.data) {
					var tmp = resp.data.replace('http://3.gesappuat.appspot.com/', '');
					Upload.upload({
							url: tmp,
							data: {
								myFile: files
							},
							arrayKey: '[]',
							headers: {
								'X-Requested-With': 'XMLHttpRequest'
							},
						})
						.then(function(resp) {
							//console.log('file ' + resp.config.data.file.name + 'is uploaded successfully. Response: ' + resp.data);
							console.log(resp.data);
						}, function(resp) {
							console.log(resp.data);
						}, function(evt) {
							//console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.data.file.name);
						});
					//.catch(errorCallback);
					//finally(callback, notifyCallback);
				}
			}, function(err) {
				$log.error(err);
			});
		};

		//
	})
//
.directive('uploadFile', function(taxiRequest, $http) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
			var options = {
				fileName:"myFile",
				multiple:true,
				autoSubmit:true,
				showAbort:false,
				showDone:false,
				maxFileCount : 5,
				allowedTypes : "jpg,jpeg,gif,png",
				showStatusAfterSuccess:false
			};
			// GET URL
			$http.get('/app/taxi/uploadurl.json').then(function(resp) {
				if (resp.data) {
					options.url = (resp.data.data+'').replace('http://3.gesappuat.appspot.com/', '');
					// init upload div
					$(element).uploadFile(options);
				}
			});
    }
  };
})
//
;
