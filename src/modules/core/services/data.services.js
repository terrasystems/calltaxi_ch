'use strict';
/*  */
angular.module('com.module.core')
// insert
.service('alertService', function ($rootScope, $timeout, toastr, $translate) {
	var alertService = {};
	// TODO: добавить параметром заголовок title
	alertService.add = function (type, msg, msgParam) {
		this.addFull(type,'', $translate.instant(msg), msgParam);
	};
	alertService.addFull = function (type, titleText, msg, msgParam) {
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

	alertService.check = function (data) {
		if ((data) && (data.alerts))
			alertService.addAlerts(data.alerts);
	};
	alertService.addAlerts = function (alerts, msgParam) {
		/*
		 * $rootScope.alerts = []; $rootScope.alertsParams = [];
		 */
		if (alerts)
			for (var i in alerts) {
				var alert = alerts[i];
				this.add(alert.type, alert.msg, msgParam);
			}
	}
	return alertService;
})
// Копирование свойств обьекта, кроме тех которые начинаются на $, если обьект новый то создать
.service('copyObj', function () {
	return function (oldObj, newObj) {
		//var newObj;
		if (newObj === undefined) newObj = {};
		for (var key in oldObj) {
			if (key.indexOf('$') != 0) newObj[key] = oldObj[key];
		}
		return newObj;
	};
})
// Копирование массива по определенных полях
.service('copyArray', function () {
	var copyArray = function (oldArray, newArray, fields) {
		if (newArray === undefined) newArray = [];
		angular.forEach(oldArray, function (obj) {
			var tmp = {};
			angular.forEach(fields, function (value) {
				if (obj.hasOwnProperty(value)) {
					tmp[value] = obj[value];
				}
			});
			// delete tmp;
			newArray.push(tmp);
			tmp = undefined;
		});
		return newArray;
	};
	return copyArray;
})
//
.service('syncArray', function (copyObj) {
	return function (fromArr, toArr, id, isAdd) {
		if (!toArr) toArr = [];
		var isExists;
		angular.forEach(fromArr, function (itemFrom) {
			isExists = false;
			angular.forEach(toArr, function (itemTo) {
				if (itemFrom[id] == itemTo[id]) {
					isExists = true;
					copyObj(itemFrom, itemTo);
				}
			});
			if (!isExists && isAdd) {
				toArr.push(itemFrom);
			}
		});
		return toArr;
	};
})
//
.service('responseService', function (alertService) {
	var responseService = function (msg) {
		//
		if (msg.data.responce != null) {
			if (msg.data.alertsData != null) alertService.addAlerts(msg.data.alertsData);
			if (msg.data.stacktrace != null) alertService.add(2, 'EXCEPTION');
			return msg.data.responce;
		} else {
			alertService.add(2, 'NOTDEFERROR');
			return false;
		}
	};
	return responseService;
})
//
.service('langService', function ($translate, localStorageService, amMoment, $location) {
	var translations = ['en', 'ru', 'uk'];
	var langService = function (langKey) {
		if (langKey == null) {
			// Пытаемся достать из УРЛ
			langKey = $location.search().lang;
			if ((langKey == undefined) || (!langKey))
			// Загружаем с локал стореджа
				langKey = localStorageService.get('Language');
		}
		if (langKey == null) langKey = navigator.browserLanguage || navigator.language || navigator.userLanguage;
		langKey = langKey.slice(0, 2);
		if (translations.indexOf(langKey.toLowerCase()) == -1) langKey = 'en';
		$translate.use(langKey.toLowerCase());
		amMoment.changeLocale(langKey.toLowerCase());
		// Сохраняем в локал сторедж
		localStorageService.set('Language', langKey.toLowerCase());
		localStorageService.cookie.set('Language', langKey.toLowerCase());
	};
	return langService;
})
//MENU
.service('menuService', function ($rootScope, $http) {
	return {
		// json menu itemsMenu : function(callback) { $http.get('/scripts/common/menu.json').success(callback); },
		status: false,
		setStatus: function (val) {
			this.status = val;
			// $rootScope.menuStatus = val;
			$rootScope.$broadcast('menuService.update', this.status);
		}
	};
})
// Универсальный сервис получения разных типов данных через XMLHttpRequest
// url: адрес для get
// datatype: 0 - Uint8Array, 1 - raw, или любой тип в base64 типа
// 'data:image/jpeg;base64,'+.....данные
.service('downloadService', function ($rootScope, $q, blockUI) {
	var downloadService = function (url, datatype, params) {
		switch (datatype) {
			case '0':
				datatype = 'Uint8Array';
				break;
			case '1':
				datatype = 'raw';
				break;
			case undefined:
				datatype = 'data:image/jpeg;base64,';
				break;
			default:
				datatype = datatype;
				break;
		}
		// Блокируем интерфейс
		// blockUI.start();
		var deferred = $q.defer();
		var xmlHTTP = new XMLHttpRequest();
		if (params != null) {
			xmlHTTP.open('POST', url, true);
			xmlHTTP.setRequestHeader('Accept', 'application/json');
			xmlHTTP.setRequestHeader('Content-Type', 'application/json');
			// xmlHTTP.setRequestHeader("Content-length", params.length);
		} else xmlHTTP.open('GET', url, true);
		xmlHTTP.setRequestHeader('X-Auth-Token', $rootScope.authToken);
		// Пересылка офсета
		xmlHTTP.setRequestHeader('Client-Offset', new Date().getTimezoneOffset());
		// Must include this line - specifies the response type we want
		xmlHTTP.responseType = 'arraybuffer';
		xmlHTTP.onload = function (e) {
			var arr = new Uint8Array(this.response);
			// Разблокируем интерфейс
			switch (datatype) {
				case 'Uint8Array':
					// blockUI.stop();
					deferred.resolve(arr);
					break;
				case 'raw':
					var raw = '';
					for (var i = 0, l = arr.length; i < l; i++) raw += String.fromCharCode(arr[i]);
					// blockUI.stop();
					deferred.resolve(raw);
					break;
				default:
					// перевірка чи тип данних base64
					if (datatype.indexOf(';base64,') != -1) {
						var raw = '';
						for (var i = 0, l = arr.length; i < l; i++) raw += String.fromCharCode(arr[i]);
						var b64 = btoa(raw);
						// blockUI.stop();
						deferred.resolve(datatype + b64);
					} else {
						// повертаєм саме сирі дані які прийшли з сервера
						// blockUI.stop();
						deferred.resolve(this.response);
					}
					break;
			}
		};
		xmlHTTP.send(JSON.stringify(params));
		return deferred.promise;
	};
	return downloadService;
})
//
.service('checkBoxesService', function ($translate) {
	var checkBoxesService = function (scope) {
		//if (scope.$data == undefined) scope.$data = [];
		scope.checkboxes = {
			'allchecked': false,
			'notchecked': true,
			items: {}
		};
		/*
		 * // watch for check eny checkbox scope.$watch('checkboxes.notchecked', function(value) { if (!value) { var chLen =
		 * Object.keys(scope.checkboxes.items).length; var datLen = scope.$data.length; if (chLen == datLen)
		 * scope.checkboxes.items = {}; }; });
		 */
		// watch for check all checkbox
		scope.$watch('checkboxes.allchecked', function (value) {
			var datLen = scope.$data == undefined ? 0 : scope.$data.length;
			if (value && (datLen > 0)) {
				scope.checkboxes.items = {};
				angular.forEach(scope.$data, function (item) {
					if (angular.isDefined(item.id)) scope.checkboxes.items[item.id] = value;
				});
				scope.checkboxes.notchecked = false;
			} else if (!value) {
				var chLen = Object.keys(scope.checkboxes.items).length;
				if (chLen == datLen) scope.checkboxes.items = {};
				scope.checkboxes.notchecked = true;
			}
		});
		// watch for data checkboxes
		scope.$watch('checkboxes.items', function (values) {
			if ((scope.$data == undefined) || (scope.$data.length == 0)) {
				scope.checkboxes.items = {};
				return;
			}
			angular.forEach(scope.checkboxes.items, function (value, key) {
				if (!value) {
					delete scope.checkboxes.items[key];
					scope.checkboxes.notchecked = true;
				} else scope.checkboxes.notchecked = false;
			});
			scope.chLen = Object.keys(scope.checkboxes.items).length;
			var chLen = Object.keys(scope.checkboxes.items).length;
			var datLen = scope.$data.length;
			scope.checkboxes.allchecked = (chLen == datLen) && (chLen > 0);
			// grayed checkbox
			angular.element(document.getElementById('select_all')).prop('indeterminate', ((chLen > 0) && (datLen > 0) && (
			chLen != datLen)));
		}, true);
	};
	return checkBoxesService;
})
// фабрика для работы с массивом сум локалсторедж
// http://stackoverflow.com/questions/26284479/storing-elements-in-an-array-in-local-storage-using-angular-local-storage-module
// // sumService.addSum({iid : item.id, isum: item.sum});
// http://vaughnroyko.com/saving-and-loading-objects-or-arrays-in-localstorage/
.service('sumService', function (localStorageService) {
	var sums = localStorageService.get('IndicatorSum') || [];
	var factory = {};
	factory.addSum = function (query) {
		sums.push(query);
		localStorageService.set('IndicatorSum', sums);
		return localStorageService.get('IndicatorSum');
	};
	return factory;
})
//
.service('localStorageArrayService', function (localStorageService) {
	var localStorageArrayService = {};
	// Сохранялка данных
	localStorageArrayService.SaveData = function (keyName, dataValue) {
		// получаем данные из локалстореджа
		var data = localStorageService.get(keyName) || [];
		var isExists = false;
		// проверяем или уже есть такие
		for (var i = 0; i < data.length; i++) {
			if ((dataValue === data[i]) && (dataValue !== null)) isExists = true;
		}
		// если нет - то сохраняем
		if ((!isExists) && (dataValue !== null)) {
			data.push(dataValue);
			localStorageService.set(keyName, data);
		}
	};
	// Поднималка данных
	localStorageArrayService.GetData = function (keyName) {
		// получаем данные из локалстореджа
		return localStorageService.get(keyName) || [];
	};
	return localStorageArrayService;
})
//
.service('assignDeepProperty', function () {
	return function assign(obj, prop, value) {
		if (typeof prop === 'string') prop = prop.split('.');
		if (prop.length > 1) {
			var e = prop.shift();
			assign(obj[e] = Object.prototype.toString.call(obj[e]) === "[object Object]" ? obj[e] : {}, prop, value);
		} else obj[prop[0]] = value;
	};
})
/**
 * @name bfBuilder
 * @ngdoc service
 * @param {string}
 * @description creates backfilter object for REST request
 */
.service('bfBuilder', function () {
	return {
		all: function (prms, needCover) {
			var backfilter = {filtering: {}};
			if (prms.filtering)
				backfilter.filtering = prms.filtering;
			if (prms.pagination)
				backfilter.pagination = prms.pagination;
			if (prms.sorting)
				backfilter.sorting = prms.sorting;
			if (prms.multi)
				backfilter.filtering.multi = prms.multi;
			if (prms.hint)
				backfilter.filtering.name = prms.hint;
			if (needCover)
				return {backfilter: backfilter};
			else
				return backfilter;
		},
		hint: function (prms, needCover) {
			return this.all({hint: prms}, needCover);
		},
		filtering: function (prms, needCover) {
			return this.all({filtering: prms}, needCover);
		},
		multi: function (prms, needCover) {
			return this.all({multi: prms}, needCover);
		},
		pagination: function (prms, needCover) {
			return this.all({pagination: prms}, needCover)
		},
		sorting: function (prms, needCover) {
			return this.all({sorting: prms}, needCover);
		}
	}
})
//
.service('confirmService', function($q, $confirm, $translate){
	return function(text, detail){
		var deferred = $q.defer();
		$confirm({
			text: $translate.instant(text, detail)
		}, {
			templateUrl: 'modules/core/views/modalconfirm.tmpl.html'
		}).then(function () {
			deferred.resolve(true);
		}, function(){
			deferred.reject(false);
		});
		return deferred.promise;
	}
})
// https://css-tricks.com/snippets/javascript/remove-inline-styles/
.service('removeInStyle', function () {
	return function (all) { // var all = document.getElementsByTagName('*');remove_style(all);
		var i = all.length;
		var j, is_hidden;
		// Presentational attributes.
		var attr = [
			//'text-align',
			//'background-color',
			//'font-weight',
			'font-family',
			//'cellpadding',
			//'cellspacing',
			//'color',
		];
		var attr_len = attr.length;
		while (i--) {
			is_hidden = (all[i].style.display === 'none');
			j = attr_len;
			while (j--) {
				all[i].style.removeProperty(attr[j]);
			}
			// Re-hide display:none elements, so they can be toggled via JS.
			if (is_hidden) {
				all[i].style.display = 'none';
				is_hidden = false;
			}
		}
	}
})

//
/**
 * @ngdoc overview
 * @name taxiRequest
 * @module com.module.core
 * @description for app reuquest
 * @requires taxiApp
 */
	.factory('taxiRequest', function ($resource) {
		return $resource('app/:url/:action', {url: '@url', action: '@action'}, {
			post: {method: 'POST'},
			get: {method: 'GET'},
			query: {method: 'GET', isArray: true}
		});
	})
//
;
