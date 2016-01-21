'use strict';
/*jshint -W116*/
angular.module('com.module.core')
// Сервис проверки аутентификации и получения из куков
.service('checkUserAuth', function ($location, localStorageService, $rootScope, $state, $base64) {
	var checkUserAuth = function () {
		/* Проверка авторизации из куков */
		var originalPath = $location.path();
		$location.path('/login');
		// Пытаемся достать токен из URL в адресной строке
		var authToken = $location.search().token;
		// Перекодиркем токен с base64
		if ((authToken !== undefined) && (authToken !== null)) try {
			authToken = $base64.decode(decodeURIComponent(authToken));
		} catch (e) {
			authToken = undefined;
		}
		// Если токен из URL нормальный то записываем в рутскоуп и в куки
		if ((authToken !== undefined) && (authToken !== null)) {
			$rootScope.authToken = authToken;
			$rootScope.isSuperUser = (authToken.split(':')[3] === '1');
			localStorageService.cookie.set('X-Auth-Token', authToken);
			$location.path(originalPath);
			return;
		}
		// Пытаемся достать из куков если не получилось из УРЛ
		authToken = localStorageService.cookie.get('X-Auth-Token');
		if ((authToken !== undefined) && (authToken !== null)) {
			$rootScope.authToken = authToken;
			$rootScope.isSuperUser = (authToken.split(':')[3] === '1');
			$location.path(originalPath);
			return;
		}
	};
	return checkUserAuth;
})
// Сервис отлогинивания
.service('logoutUser', function (localStorageService, $rootScope, blockUI) {
	var logoutUser = function () {
		blockUI.start();
		delete $rootScope.authToken;
		delete $rootScope.isSuperUser;
		localStorageService.cookie.remove('X-Auth-Token');
		window.location.reload(true);
	};
	return logoutUser;
})
// Интерцептор для перехвата ошибок
.service('responseErrorInterceptor', function ($rootScope, $q, $injector, logoutUser, blockUI) {
	return {
		'response': function (response) {
			// Сбиваем лок интерфейса
			if (response.data.alerts !== null)  $injector.get('alertService').addAlerts(response.data.alerts);
			switch (response.data.status) {
				// Не авторизирован
				case '401':
				{
					// Сбиваем лок интерфейса
					blockUI.reset();
					logoutUser();
					break;
				}
				// Ошибка со стороны клиента
				case '400':
				{
					// Сбиваем лок интерфейса
					blockUI.reset();
					return $q.reject(response);
				}
				// Все хорошо
				default:
					return response;
			}
			return response;
		},
		'responseError': function (rejection) {
			// Сбиваем лок интерфейса
			blockUI.reset();
			switch (rejection.status) {
				case 0:
				{
					var refr = $injector.get('$translate').instant('REFRESH');
					var opts = {
						timeOut: 150000
					};
					$injector.get('alertService').addFull(2, $injector.get('$translate').instant('ERRCONNECTIONREFUSED'),
					'<a href="." onclick="location.reload(true)">'+refr+'</a>', opts);
					break;
				}
				default:
				{
						$injector.get('$state').go('main.error', {code : rejection.status});

				}
			}

			return $q.reject(rejection);
		}
	};
})
//Сервис интерцептора запроса, вставляет токен в хедер
.service('requestInterceptor', function ($rootScope, $q) {
	return {
		'request': function (config) {
			var isRestCall = true;
			if (isRestCall && angular.isDefined($rootScope.authToken)) {
				var authToken = $rootScope.authToken;
				config.headers['X-Auth-Token'] = authToken;
				config.headers['Client-Offset'] = new Date().getTimezoneOffset();
				// config.url = config.url + "?token=" + authToken;
			}
			return config || $q.when(config);
		}
	};
})
//
.service('goStateBack', function ($rootScope, $state) {
	var goStateBack = function () {
		if (($rootScope.previousState === undefined) || ($rootScope.previousState === '') || ($rootScope.previousState ===
		$state.current.name)) {
			if ($rootScope.authToken === undefined) $state.go('main.public.login');

		} else $state.go($rootScope.previousState);
	};
	return goStateBack;
})
// Сервис записи авторизации в куки или в адресную строку с перекидкой
.service('tokenRelogin', function (localStorageService, $base64) {
	var tokenRelogin = function (result) {
		if (window.location.host === result.domain) {
			localStorageService.cookie.set('X-Auth-Token', result.token);
			window.location = window.location.protocol + '//' + result.domain;
		} else {
			window.location = window.location.protocol + '//' + result.domain + '/#/?token=' + encodeURIComponent($base64.encode(
			result.token)) + '&lang=' + localStorageService.get('Language');
		}
	};
	return tokenRelogin;
});
