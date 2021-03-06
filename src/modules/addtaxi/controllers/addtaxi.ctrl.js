'use strict';
/*jshint -W109 */
/*jshint -W098 */
/*jshint -W003 */
/**
 * @ngdoc function
 * @name com.module.addtaxi.controller:publicController
 * @description
 * # addtaxiController
 * Controller of the Registration
 */
angular.module('com.module.addtaxi').controller('AddtaxiController', function($scope, taxiRequest, $state,
		alertService, blockUI, $rootScope, $translate, $log, Upload, $timeout, $http, $location) {
		//
		$scope.model = {
			id: null,
			name: '',
			description: '',
			acVehicle: null,
			cancellationPolicy: null,
			additionalInformation: null,
			inclusions: [],
			exclusions: [],
			imageInfos: [],
			transporttype: null,
			pickUpLocation: null,
			dropOffLocation: null,
			source: null,
			destination: null,
			price: null,
			taxiBookingOptions: [],
			starRating: null,
			active: null,
			updatedOn: null,
			supplierDTO: null
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
				type: 'places',
				templateOptions: {
					label: $translate.instant('LABEL.MEETINGPOINT'),
					placeholder: $translate.instant('LABEL.MEETINGPOINT'),
					options: {
						componentRestrictions: {
							country: 'ch'
						},
						types: ['geocode']
					}
				},
				watcher: {
					listener: function(field, newValue, oldValue, scope, stopWatching) {
						if (scope.model.meetingPoint && scope.model.meetingPoint.hasOwnProperty('geometry')) {
							$scope.model.latitude = scope.model.meetingPoint.geometry.location.lat();
							$scope.model.longitude = scope.model.meetingPoint.geometry.location.lng();
							scope.model.meetingPoint = scope.model.meetingPoint.formatted_address;
						}
					}
				}
		},
			{
				className: 'row',
				fieldGroup: [{
					key: 'latitude',
					type: 'input',
					className: 'col-sm-6',
					templateOptions: {
						label: $translate.instant('LABEL.LATIT'),
						placeholder: $translate.instant('LABEL.LATIT'),
						//type: 'number'
					},
					expressionProperties: {
						'templateOptions.disabled': 'true',
					}
		}, {
					key: 'longitude',
					type: 'input',
					className: 'col-sm-6',
					templateOptions: {
						label: $translate.instant('LABEL.LONGIT'),
						placeholder: $translate.instant('LABEL.LONGIT'),
						//type: 'number'
					},
					expressionProperties: {
						'templateOptions.disabled': 'true',
					}
		}]
		},
			{
				key: 'cancellationPolicy',
				type: 'textarea',
				templateOptions: {
					label: $translate.instant('LABEL.CANCELLATIONPOLICY'),
					placeholder: $translate.instant('LABEL.CANCELLATIONPOLICY'),
					type: 'text'
				}
		}, {
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
						defaultValue: 'Switzerland',
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
						defaultValue: 'CHF',
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
		//
		$scope.form = {
			options: {},
			model: $scope.model,
			fields: userFields
		};
		$scope.resetAllForms = invokeOnAllFormOptions.bind(null, 'resetModel');
		$scope.onSubmit = function() {
			blockUI.start();
			taxiRequest.post({
				url: 'taxi',
				version: 'v1',
				action: 'create'
			}, $scope.model, function(res) {
				if (res.data) {
					blockUI.stop();
					alertService.add(3, res.data);
				}
			}, function(err) {
				$log.error(err);
				blockUI.stop();
			});
			$scope.resetAllForms();
			//invokeOnAllFormOptions('updateInitialValue');
		};

		function invokeOnAllFormOptions(fn) {
			if ($scope.form.options && $scope.form.options[fn]) {
				$scope.form.options[fn]();
			}
		}
		// for multiple files:
		$scope.uploadFiles = function(files, errFiles) {
			blockUI.start();
			// taxiRequest.post({
			// 	url: 'taxi',
			// 	action: 'uploadurl.json'
			// }, function(resp) {
			$http.post('app/taxi/uploadurl.json').then(function(resp) {
				if (resp.data) {
					var parser = document.getElementById('parser');
					if (!parser) {
						parser = document.createElement('a');
						parser.setAttribute('id', 'parser');
					}
					parser.href = resp.data.data;
					var tmp = parser.pathname; // resp.data.replace('http://taxi2gui.appspot.com/', '');
					//Upload.isUploadInProgress()
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
						.then(function(res) {
							$scope.model.imageInfos = res.data;
							blockUI.stop();
						}, function(res) {
							$log.error(res.data);
							$scope.errorMsg = res.status + ': ' + res.data;
						}, function(evt) {
							// Math.min is to fix IE which reports 200% sometimes
							Upload.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
						});
					//.catch(errorCallback);
					//finally(callback, notifyCallback);
				}
			}, function(err) {
				$log.error(err);
			});
		};
		$scope.removeImage = function(ind) {
			$http.post('/app/deleteimage.json').then(function(res) {
				// if (res.data) { //TODO: is there SUCCESS status
				$scope.model.imageInfos.splice(ind, 1);
				// }
			}, function(err) {
				$scope.errorMsg = err.status + ': ' + err.data;
				$log.error($scope.errorMsg);
			});
		};
	})
	//
;
