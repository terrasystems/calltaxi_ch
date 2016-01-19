'use strict';
/*  */
angular.module('com.module.core')
	/*  */
	.controller('LeftnavController', function($scope, $http, $rootScope, menuService, privateRequest) {
		/* ссылки для бокового меню */
		//$scope.itemsMenu = itemsMenu;
		$scope.menuStatus = menuService.status;
		/* изменение вида меню */
		$scope.$on('menuService.update', function(event, status) {
			$scope.menuStatus = status;
		});
	});
