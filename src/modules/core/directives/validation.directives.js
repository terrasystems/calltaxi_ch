'use strict';
/*  */
angular.module('com.module.core')
	/*  */
.directive('uniqueRegValidator', function ($q, $http) {
	return {
		require: 'ngModel',
		link: function (scope, elem, attrs, ngModel) {
			ngModel.$asyncValidators.unique = function (value) {
				// apiUrl - server url
				var apiUrl = (attrs.name == 'domain') ? '/serv/public/getdomain' : '/serv/public/getemail';
				// don't send undefined to the server during dirty check
				// empty username is caught by required directive
				if (!value || value.length == 0) {
					return;
				}
				// Lookup domain or email
				return $http.post(apiUrl, {
					request: value
				}).then(function (msg) {
					// value exists, this means validation fails
					if ((msg.data.result) && (msg.data.result !== false)) {
						msg = null;
						return $q.reject('taken');
						// console.log('server says:', data);
					}
					return true; // validation is true
				});
			};
		}
	};
})
// password verification
.directive('matchPassValidator', function () {
	return {
		require: 'ngModel',
		link: function (scope, elem, attrs, ctrl) {
			// Следим за моделью элемента и за параметром директивы matchPassValidator
			scope.$watch('[' + attrs.ngModel + ', ' + attrs.matchPassValidator + ']', function (value) {
				if (!value || value.length == 0) {
					return;
				}
				ctrl.$setValidity('match', value[0] === value[1]);
			}, true);
		}
	};
})
	/* http://stackoverflow.com/questions/16388562/angularjs-force-uppercase-in-textbox */
.directive('lowercase', function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attrs, modelCtrl) {
			var lowercase = function (inputValue) {
				if (inputValue == undefined) inputValue = '';
				var lowercased = inputValue.toLowerCase();
				if (lowercased !== inputValue) {
					modelCtrl.$setViewValue(lowercased);
					modelCtrl.$render();
				}
				return lowercased;
			};
			modelCtrl.$parsers.push(lowercase);
			lowercase(scope[attrs.ngModel]); // lowercase initial value
		}
	};
})
	/*http://stackoverflow.com/questions/15242592/how-to-autocapitalize-an-input-field*/
.directive('capitalize', function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attrs, modelCtrl) {
			var capitalize = function (inputValue) {
				if (inputValue == undefined) inputValue = '';
				var capitalized = inputValue.charAt(0).toUpperCase() + inputValue.substring(1).toLowerCase();
				if (capitalized !== inputValue) {
					modelCtrl.$setViewValue(capitalized);
					modelCtrl.$render();
				}
				return capitalized;
			};
			modelCtrl.$parsers.push(capitalize);
			capitalize(scope[attrs.ngModel]); // capitalize initial value
		}
	};
})
//http://stackoverflow.com/questions/19036443/angularjs-how-to-allow-only-a-number-digits-and-decimal-point-to-be-typed-in
// http://codepen.io/anon/pen/KFsej
.directive('validNumber', function ($filter) {
	return {
		require: '?ngModel',
		link: function (scope, element, attrs, ngModelCtrl) {
			if (!ngModelCtrl) {
				return;
			}
			ngModelCtrl.$parsers.push(function (val) {
				var clean = val.replace(/[^\d\.]+/, '');
				if (val !== clean) {
					ngModelCtrl.$setViewValue($filter('limitTo')(clean, 14)); // added limit to 14
					ngModelCtrl.$render();
				}
				return clean;
			});
			element.bind('keypress', function (event) {
				if (event.keyCode === 32) {
					event.preventDefault();
				}
			});
		}
	};
})
//http://jsfiddle.net/thomporter/DwKZh/
.directive('numbersOnly', function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attrs, modelCtrl) {
			modelCtrl.$parsers.push(function (inputValue) {
				// this next if is necessary for when using ng-required on your input.
				// In such cases, when a letter is typed first, this parser will be called
				// again, and the 2nd time, the value will be undefined
				//if (inputValue == undefined) return '';
				if (inputValue == undefined) return '0';
				var transformedInput = inputValue.replace(/[^\d\.\,]/, '');
				// /^\d*[\.\,]?\d*$/.test(transformedInput)
				if (transformedInput != inputValue) {
					modelCtrl.$setViewValue(transformedInput);
					modelCtrl.$render();
				}
				return transformedInput;
			});
		}
	};
});