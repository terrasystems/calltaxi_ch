'use strict';
/**
 * @ngdoc overview
 * @name taxiApp
 * @description
 * # taxiApp
 *
 * Main module of the application.
 */
angular.module('taxiApp', [
/* Angular modules */
'ngMessages', 'ngAnimate', 'ngResource', 'ngCookies', 'ngSanitize',
/* # 3rd Party Modules */
'ui.bootstrap', 'ui.router', 'pascalprecht.translate', 'base64',
	'blockUI', 'ui.select', 'angular-confirm', 'toastr', 'angularMoment', 'sticky',
	'toggle-switch', 'LocalStorageModule', 'ui.router.tabs',
/* miniApp modules */
	'com.module.core',
	'com.module.auth',
	'com.module.taxi'
])
/* config */
.config(function($httpProvider, $stateProvider, $urlRouterProvider, $translateProvider, statesList, $provide,
	blockUIConfig, uiSelectConfig, toastrConfig, localStorageServiceProvider, $compileProvider) {
	// http://blog.thoughtram.io/angularjs/2015/01/14/exploring-angular-1.3-speed-up-with-applyAsync.html
	$httpProvider.useApplyAsync(true);
	// you can disable this in production for a significant performance boost
	//$compileProvider.debugInfoEnabled(false);
	// states
	// angular.forEach(statesList, function(state) {
	// 	$stateProvider.state(state.name, state);
	// });
	// send users to the form page
	$urlRouterProvider.otherwise('/taxi');
	// Toaster config
	angular.extend(toastrConfig, {
		allowHtml: true,
		closeButton: false,
		extendedTimeOut: 1000,
		iconClasses: {
			error: 'toast-error',
			info: 'toast-info',
			success: 'toast-success',
			warning: 'toast-warning'
		},
		// maxOpened: 0,
		messageClass: 'toast-message',
		newestOnTop: true,
		// onHidden: null,
		// onShown: null,
		positionClass: 'toast-top-right',
		tapToDismiss: true,
		target: 'body',
		timeOut: 5000,
		// titleClass: 'toast-title',
		toastClass: 'toast'
	});
	// Translations
	$translateProvider.useStaticFilesLoader({
		prefix: 'i18n/translation_',
		suffix: '.json'
	});
	//$translateProvider.useLocalStorage();// saves selected language to localStorage
	// Local storage Prefix
	localStorageServiceProvider.setPrefix('taxi');
	// Interceptors
	$httpProvider.interceptors.push('responseErrorInterceptor');
	$httpProvider.interceptors.push('requestInterceptor');
	// BlockUI
	blockUIConfig.delay = 100;
	blockUIConfig.autoInjectBodyBlock = false;
	blockUIConfig.autoBlock = false;
	blockUIConfig.resetOnException = true;
	blockUIConfig.template = '<div class="block-ui-overlay"></div><div class="block-ui-message-container" aria-live="assertive" aria-atomic="true"><div class="block-ui-message" ng-class="$_blockUiMessageClass"><div class="loader"><div class="loader-inner ball-grid-pulse"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div></div>';
	// Provide a custom template to use
	uiSelectConfig.theme = '/modules/core/views/select.tmpl.html';
	uiSelectConfig.appendToBody = true;
})
/* run */
.run(function($state, $stateParams, $rootScope, $location, alertService, $http, langService, menuService, checkUserAuth,
	$templateCache, $confirmModalDefaults, blockUIConfig, $translate, blockUI, $window) {
	// Начальный язык
	langService(null);
	// confirm
	$confirmModalDefaults.templateUrl = 'modules/core/views/modalconfirm.tmpl.html';
	// биндинг стейтов в рутскоуп
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	$rootScope.changeView = function(view) {
		$location.path(view);
	};
	$rootScope.$on('$stateChangeStart', function(event, toState, fromState) { //toParams, fromParams
		$rootScope.previousState = fromState.name;
	});
	$rootScope.$on('$stateChangeSuccess', function(event) {
		// Свёртывалка меню, если развёрнуто
		if (menuService.status) menuService.setStatus(!menuService.status);
		// Отправка данных на гугл аналитик
		if ($window.ga) $window.ga('send', 'pageview', {
			page: $location.path()
		});
	});
	$rootScope.$on('$translateChangeSuccess', function(event, a) {
		// Переопределяем сообщение для загрузки
		blockUIConfig.message = $translate.instant('LOADING');
	});
	// Проверка авторизации из куков
	//checkUserAuth();
	// На случай лока ранее
	blockUI.reset();
});
