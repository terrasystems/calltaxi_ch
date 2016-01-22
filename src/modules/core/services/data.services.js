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
	 * @name taxiRequest
	 * @module com.module.core
	 * @description for app reuquest
	 * @requires taxiApp
	 */
	.factory('taxiRequest', function($resource) {
		return $resource('app/:url/:action', {}, { //FIXME: make baseUrl
			post: {
				method: 'POST'
			},
			get: {
				url: 'app/:url/:action',
				method: 'GET'
			},
			query: {
				method: 'GET',
				isArray: true
			}
		});
	});
