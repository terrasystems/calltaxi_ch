'use strict';
/*  */
angular.module('com.module.core')
//
.service('insertTableData', function (privateRequest, $q, alertService, $rootScope) {
	return function (url, action, add, scope) {
		var deferred = $q.defer();
		privateRequest.post({url: url, action: action}, add, function (data) {
			if (data) {
				$rootScope.$broadcast('crudAction.insert');
				$rootScope.$broadcast('crudAction');
				alertService.add(0, "SUCCESSADD");
				scope.data.push(data.result);
				scope.showAdd = false;
				scope.add = {};
				deferred.resolve(data.result);
			} else {
				deferred.reject(false);
			}
			scope.tableParams.reload();
		});
		return deferred.promise;
	};
})
//
.service('editData', function () {
	return function (obj, scope) {
		if (scope.olditem != null) scope.olditem.$edit = false;
		scope.newValue = angular.copy(obj);
		scope.olditem = obj;
	};
})
//
.service('deleteTableData', function (privateRequest, $q, alertService, $rootScope) {
	return function (url, action, id, scope) {
		var deferred = $q.defer();
		//scope.del = angular.copy(obj);
		privateRequest.post({url: url, action: action}, id, function (data) {
			if (data) {
				$rootScope.$broadcast('crudAction.delete');
				$rootScope.$broadcast('crudAction');
				alertService.add(0, "SUCCESSDEL");
				//scope.data.splice(scope.data.indexOf(obj), 1);
				scope.tableParams.reload();
				deferred.resolve(true);
			} else {
				deferred.reject(false);
			}
		});
		return deferred.promise;
	};
})
// update для таблицы который отменяет редактирование и перегружает таблицу
.service('updateTableData', function (privateRequest, $q, alertService, $rootScope) {
	return function (url, action, obj, item, scope) {
		var deferred = $q.defer();
		privateRequest.post({url: url, action: action}, obj, function (data) {
			if (data) {
				deferred.resolve(true);
				$rootScope.$broadcast('crudAction.update');
				$rootScope.$broadcast('crudAction');
				alertService.add(0, "SUCCESSUPD");
				item = angular.copy(data.result);
				item.$edit = false;
			} else deferred.reject(false);
			scope.tableParams.reload();
		});
		scope.showAdd = false;
		return deferred.promise;
	};
})
// select table
.service('selectTableData', function ($http, $state, $rootScope, $q, ngTableParams, $filter, blockUI,
localStorageService, privateRequest) {
	var selectTableData = function (url, scope, action, callback) {
		//scope.data = [];
		if (angular.isUndefined(scope.$data)) scope.$data = [];
		if (!scope.backfilter) scope.backfilter = {};
		scope.backfilter.pagination = {};
		scope.backfilter.pagination.firstResult = 0;
		if (!scope.count) scope.count = 50;
		scope.backfilter.pagination.maxResults = scope.count;
		var deferred = $q.defer();
		// Параметры таблицы
		var getparams = function () {
			deferred = $q.defer();
			if (scope.tableParams !== undefined) scope.tableParams.reload();
			else {
				// Восстановление сортировки
				var sortingParam = localStorageService.get('sortingParam') || {};
				sortingParam = sortingParam[$state.current.name + '.' + $rootScope.authToken.split(':')[0]] || {};
				scope.tableParams = new ngTableParams({
					page: 1, // show first page
					count: scope.count, // count per page
					filter: scope.backfilter.filtering,
					sorting: sortingParam
				}, {
					groupBy: scope.groupby,
					counts: [], // hide page counts control
					total: scope.$data.length, // value less than count hide
					getData: function ($defer, params) {
						//scope.backfilter.filtering = scope.filters.filtering;
						if(!scope.backfilter.pagination) scope.backfilter.pagination = {};
						scope.backfilter.pagination.firstResult = (params.page() - 1) * params.count();
						scope.backfilter.sorting = params.sorting();
						blockUI.start();
						// Запрос
						if (url) {
							//$http.get(url, paramfilt).success(function (res) {
							privateRequest.get({url: url, action: action}, {backfilter: scope.backfilter}, function (res) {
								if (res.result != null) {
									scope.$data = res.result;
									if  (url == 'employees') {
										if  ( (scope.$data.length>0) && ($rootScope.currentuser=='Demo') ) {
											var i = scope.$data.length;
											while (i--) { scope.$data[i].dateActivated = 1; }
											}
									};
								}
								// Пересчёт количества элементов
								if (res.pagination.totalCount)
									params.total(res.pagination.totalCount);
								scope.totalCount = res.pagination.totalCount;
								// Сохранение сортировки
								var sortingParam = localStorageService.get('sortingParam') || {};
								sortingParam[$state.current.name + '.' + $rootScope.authToken.split(':')[0]] = params.sorting();
								localStorageService.set('sortingParam', sortingParam);
								$defer.resolve(scope.$data);
								$rootScope.$broadcast('crudAction.select');
								$rootScope.$broadcast('crudAction');
								// Если нет данных - то нужно возвращать промис, если его кто то ждёт...
								// if (scope.$data.length > 0)
								//FIXME: походу этот уже промис ненужно так как он есть в функции getData()
								deferred.resolve(true);
								blockUI.stop();
								if (callback)
								callback();
							});
						}
					}
				});
			}
		};
		getparams();
		return deferred.promise;
	};
	return selectTableData;
})
/**
 * @ngdoc overview
 * @name privateRequest
 * @module com.module.core
 * @description for private reuquest
 * @requires miniApp
 */
.factory('privateRequest', function ($resource) {
	return $resource('serv/private/:url/:action', {url: '@url', action: '@action'}, {
		post: {method: 'POST'},
		get: {method: 'GET', params: {backfilter: '@backfilter'}},
		query: {method: 'GET', params: {backfilter: '@backfilter'}, isArray: true}
	});
})
/**
 * @ngdoc overview
 * @name publicRequest
 * @module com.module.core
 * @description for public reuquest
 * @requires miniApp
 */
.factory('publicRequest', function ($resource) {
	return $resource('serv/public/:url/:action', {url: '@url', action: '@action'}, {
		post: {method: 'POST'},
		get: {method: 'GET', params: {backfilter: '@backfilter'}},
		query: {method: 'GET', params: {backfilter: '@backfilter'}, isArray: true}
	});
})
;