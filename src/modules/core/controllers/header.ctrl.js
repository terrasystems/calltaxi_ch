'use strict';
/*  */
angular.module('com.module.core')
	/*  */
	.controller('HeaderController', function($scope, privateRequest, $interval, alertService,
		$stateParams, $state, $translate, $rootScope, bfBuilder) {
		$stateParams.id;
		$scope.isCollapsed = true;
		privateRequest.get({
			url: 'getlastlogin'
		}, function(data) {
			if (data.result) {
				$scope.lasttime = moment.utc(data.result);
			} else {
				$scope.lasttime = Date.now();
			};
		});
		// user
		privateRequest.get({
			url: 'getCurrentUserName'
		}, function(data) {
			$rootScope.currentuserId = data.result.id;
			$rootScope.currentuser = data.result.name;
			$rootScope.currentuserJob = data.result.jobtitle || $translate.instant('JOBTITLENOTSET');
		});
		// clock
		$scope.currenttime = Date.now();
		$interval(function() {
			$scope.currenttime = Date.now();
		}, 5000);
		// hide 3 buttons
		$scope.hide3b = false;
		// search
		$scope.search = function(obj) {
			if (obj !== null) return privateRequest.get({
				url: 'searchorder'
			}, {
				backfilter: bfBuilder.filtering({
					text: obj,
					limit: true
				})
			}).$promise.then(function(data) {
				data.result.unshift({
					search: 'searchall',
					num: obj
				});
				return data.result.map(function(item) {
					return item;
				});
			});
		};
		// go search
		$scope.gosearch = function(obj) {
			if ((obj !== null || obj !== undefined) && obj.search) $state.go('main.private.orders.search', {
				'id': obj.num
			});
			else $state.go('main.private.orders.searchview', {
				'id': obj.id
			});
		};
		$scope.support = function() {
			privateRequest.post({
				url: 'feedback'
			}, $scope.RequestBody, function() {
				alertService.add(3, "SUCCESSOPERATION");
				$scope.RequestBody = '';
				$scope.isCollapsed = true;
			});
		};
		// Вешаем вотч на событие пересчёта верхних бейджиков
		$scope.$on('bagesRecalc.top', function() {
			/* бейджики на меню */
			privateRequest.get({
				url: 'gettopbages'
			}, function(data) {
				$scope.orderbadge = data.result.orderbadge || 0;
				$scope.labprocessbadge = data.result.labprocessbadge || 0;
				$scope.controlbadge = data.result.controlbadge || 0;
			});
		});
		// Вызываем событие пересчёта верхних бейджиков
		$rootScope.$broadcast('bagesRecalc.top');
	});
