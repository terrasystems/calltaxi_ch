'use strict';
/*  */
angular.module('com.module.core')
/**
 * @ngdoc overview
 * @name initDefaults
 * @module com.module.core
 * @description initialize all
 * @requires miniApp
 *
 * initDefaults provides all functions & objects
 *
 */
.service('initDefaults', function ($state, $stateParams, $filter, confirmService, $translate, $sessionStorage, selectTableData, insertTableData,
updateTableData, deleteTableData, editData, $rootScope, privateRequest, selectChartData, checkQCRules) {
	return function (scope, url, action) {
		var stname = $state.current.name;
		var stnametrim = $filter('ltrim')(stname, 'list', 'r');
		var trimurl = $filter('ltrim')(stname, 'main\\.private\\.');
		if (trimurl == 'qualitycontrol.dt') trimurl = 'qualitycontroldt';
		scope.$data = [];
		scope.data = [];
		// table filters
		if (!scope.backfilter) scope.backfilter = {
			filtering: {}
		};
		// watch замість setFilter
		scope.$watch('addfilter', function (addfilter) {
			scope.backfilter.filtering.multi = addfilter || '';
		});
		// periodfilter
		scope.periodfilter = $sessionStorage.periodfilter || '0';
		//scope.period = $sessionStorage.$default({	periodfilter: 0});
		// Выбор
		scope.$watch('periodfilter', function (periodfilter) {
			$sessionStorage.periodfilter = periodfilter;
			scope.backfilter.periodfilter = periodfilter;
			selectTableData(url, scope, action, function () {
				var f = document.getElementById('filter');
				if (f)
					f.focus();
			});
		});
		// переходи
		scope.edit = function (item) {
			$state.go(stnametrim + 'editor', {
				'id': item.id
			});
		};
		scope.view = function (item) {
			$state.go(stnametrim + 'view', {
				'id': item.id
			});
		};
		scope.result = function (item) {
				$state.go(stnametrim + 'dt', {
				'id': item.id
			});
		};
		scope.editRow = function (obj) {
			editData(obj, scope);
		};
		// cancel editing
		scope.cancelAdd = function () {
			scope.showAdd = false;
		};
		// add object
		scope.add = {};
		if (trimurl == 'blanks') scope.add = {isSystem: true};
		// add new row
		scope.setAdd = function () {
			// for jors
			if ((trimurl.indexOf('orders') > -1) || (trimurl.indexOf('labprocess')>-1) || (trimurl.indexOf('qualitycontrol.list')>-1) || (trimurl.indexOf('indicators.list') > -1)) {
				$state.go(stnametrim + 'editor');
			}
			else if (trimurl == 'qualitycontroldt') {
				scope.showAdd = true;
				scope.add.qcid = $stateParams.id;
				scope.add.dateTime = new Date().getTime();
				scope.add.isAccepted = true;
			} else {
				// for dics
				scope.showAdd = true;
				if (trimurl == 'groups') {
					privateRequest.get({url: trimurl, action: 'maxidx'}, function (data) {
						scope.add.idx = data.result;
					});
				} else if (trimurl == 'blanks') {
					scope.add = {isSystem: true};
				}
				scope.add.name = '';
			}
		};
		// insert
		scope.addRow = function (add) {
			if (trimurl == 'complex') add.isComplex = 1;
			//if (trimurl == 'qualitycontrol.dt') trimurl = 'qualitycontroldt';
			insertTableData(trimurl, 'add', add, scope).then(function (res) {
				$rootScope.$broadcast('bagesRecalc.left');
				if (trimurl == 'complex') { // Разворачиваем запись
					scope.showRow(res);
					res.$show = true;
				} else if (trimurl == 'qualitycontroldt') { // ChartData
					selectChartData(scope, $stateParams.id).then(function () {
						scope.initChart();
					});
					checkQCRules($stateParams.id);
					//trimurl = 'qualitycontrol.dt';
				}
			});
		};
		// update
		scope.update = function (obj, item) {
			//if (trimurl == 'qualitycontrol.dt') trimurl = 'qualitycontroldt';
			updateTableData(trimurl, 'upd', obj, item, scope).then(function () {
				if (trimurl == 'qualitycontroldt') { // ChartData
					selectChartData(scope, $stateParams.id).then(function () {
						scope.initChart();
					});
					checkQCRules($stateParams.id);
					//trimurl = 'qualitycontrol.dt';
				}
			});

		};
		// delete
		scope.deleteRow = function (obj) {
			confirmService('DELETERECORDCONF')
			.then(function () {
				if (trimurl.indexOf('indicators') > -1)
					var delurl = $filter('ltrim')(trimurl, '.list', 'r');
				else delurl = trimurl;
				deleteTableData(delurl, 'del', obj.id, scope).then(function () {
					$rootScope.$broadcast('bagesRecalc.left');
				});
			});
		};
	};
})
//
;
