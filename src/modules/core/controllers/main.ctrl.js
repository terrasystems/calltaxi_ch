'use strict';
/*  */
angular.module('com.module.core')
/*  */
.controller('MainController', function($http, $scope, langService, menuService, logoutUser, localStorageService) {
	/* Translations */
	$scope.translations = ['en', 'ru', 'uk'];
	$scope.langChanged = function(langKey) {
		langService(langKey);
		$scope.langKey = langKey;
		// Перегрузка формы после изменения языка, так как динамические формы не хавают фильтром транслейт
		// пока отключим перегрузку window.location.reload(true);
	};
	//
	$scope.langKey = localStorageService.get('Language');
	/* Отлогиневание пользователя */
	$scope.logout = function() {
		$http.post('/serv/private/logout').then(function() {
			logoutUser();
		});
	};
	$scope.$on('menuService.update', function(event, status) {
		$scope.menuStatus = status;
	});
	/* Переключатель вида меню */
	$scope.menuTogle = function(event) {
		if (event.target.id !== 'triggerMenu') {
			return;
		}
		event.stopPropagation();
		menuService.setStatus(!menuService.status);
	};
	$http.get('i18n/version.json').success(function(data) {
		$scope.buildInfo = data.buildInfo;
	});
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