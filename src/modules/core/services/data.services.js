'use strict';
/*jshint -W116*/
angular.module('com.module.core')
	/**/
	.service('alertService', function($rootScope, $timeout, toastr, $translate) {
		this.add = function(type, msg, msgParam) {
			this.addFull(type, '', $translate.instant(msg), msgParam);
		};
		this.addFull = function(type, titleText, msg, msgParam) {
			switch (type) {
				case 0:
					type = 'success';
					toastr.success(msg, titleText, msgParam);
					break;
				case 1:
					type = 'warning';
					toastr.warning(msg, titleText, msgParam);
					break;
				case 2:
					type = 'danger';
					toastr.error(msg, titleText, msgParam);
					break;
				default:
					type = 'info';
					toastr.info(msg, titleText, msgParam);
					break;
			}
		};
		return this;
	})
	/**/
	.service('langService', function($translate, localStorageService, amMoment, $location) {
		var translations = ['en'];
		var langService = function(langKey) {
			if (langKey === null) {
				langKey = $location.search().lang;
				if ((angular.isUndefined(langKey)) || (!langKey)) {
					langKey = localStorageService.get('Language');
				}
			}
			if (langKey === null) {
				langKey = navigator.browserLanguage || navigator.language || navigator.userLanguage;
			}
			langKey = langKey.slice(0, 2);
			if (translations.indexOf(langKey.toLowerCase()) == -1) {
				langKey = 'en';
			}
			$translate.use(langKey.toLowerCase());
			amMoment.changeLocale(langKey.toLowerCase());
			localStorageService.set('Language', langKey.toLowerCase());
			localStorageService.cookie.set('Language', langKey.toLowerCase());
		};
		return langService;
	})
	/**/
	.service('menuService', function($rootScope) {
		return {
			status: false,
			setStatus: function(val) {
				this.status = val;
				$rootScope.$broadcast('menuService.update', this.status);
			}
		};
	})
	/**/
	.service('confirmService', function($q, $confirm, $translate) {
		return function(text, detail) {
			var deferred = $q.defer();
			$confirm({
				text: $translate.instant(text, detail)
			}, {
				templateUrl: 'modules/core/views/modalconfirm.tmpl.html'
			}).then(function() {
				deferred.resolve(true);
			}, function() {
				deferred.reject(false);
			});
			return deferred.promise;
		};
	})
/**
 * @ngdoc overview
 * @name getCoords
 * @module com.module.core
 * @description for app reuquest
 * @requires taxiApp
 */
	.service('getCoords', function(){
		 return function (model) {
			var obj = {};
			if (angular.isDefined(model.geometry) && model.geometry) {
				obj = {
					latitude: model.geometry.location.lat(),
					longitude: model.geometry.location.lng()
				};
			}
			return obj;
		};
	}
)
	.service('mapsG', function () {
		return {
			distancekm : function(lat1, lon1, lat2, lon2, unit) {
			var radlat1 = Math.PI * lat1/180;
			var radlat2 = Math.PI * lat2/180;
			//var radlon1 = Math.PI * lon1/180;
			//var radlon2 = Math.PI * lon2/180;
			var theta = lon1-lon2;
			var radtheta = Math.PI * theta/180;
			var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			dist = Math.acos(dist);
			dist = dist * 180/Math.PI;
			dist = dist * 60 * 1.1515;
			if (unit=='K') { dist = dist * 1.609344; }
			if (unit=='N') { dist = dist * 0.8684; }
			dist=dist.toFixed(2);
			return dist;
		}
		};
	})
/**
	 * @ngdoc overview
	 * @name taxiRequest
	 * @module com.module.core
	 * @description for app reuquest
	 * @requires taxiApp
	 */
	.factory('taxiRequest', function($resource) {
		return $resource('app/:url/:version/:action', {}, { //FIXME: make baseUrl
			post: {
				method: 'POST'
			},
			get: {
				url: 'app/:url/:version/:action',
				method: 'GET'
			},
			query: {
				method: 'GET',
				isArray: true
			}
		});
	});
