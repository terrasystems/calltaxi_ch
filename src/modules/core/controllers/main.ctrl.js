'use strict';
/*  */
angular.module('com.module.core')
/*  */
.controller('MainController', function($http, $scope, langService, menuService, logoutUser, localStorageService) {
	/* Translations */
	$scope.translations = ['en'];
	$scope.langChanged = function(langKey) {
		langService(langKey);
		$scope.langKey = langKey;
	};
	//
	$scope.langKey = localStorageService.get('Language');
	$scope.logout = function() {

	};
	$scope.$on('menuService.update', function(event, status) {
		$scope.menuStatus = status;
	});
	$scope.menuTogle = function(event) {
		if (event.target.id !== 'triggerMenu') {
			return;
		}
		event.stopPropagation();
		menuService.setStatus(!menuService.status);
	};
})
/* Modalss */
.controller('ModalController', function($scope, $modalInstance) {
	$scope.ok = function() {
		$modalInstance.close('ok');
	};
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});
