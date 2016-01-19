'use strict';
/*  */
angular.module('com.module.core')
	/* http://www.andrewboni.com/2014/09/03/a-countupjs-angularjs-directive/ */
.directive('countUp', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		scope: true,
		translcude: true,
		link: function (scope, element, attrs) {
			var animationLength, numDecimals, options;
			options = {};
			numDecimals = 0;
			animationLength = 4;
			if ((attrs.numDecimals !== null) && attrs.numDecimals >= 0) {
				numDecimals = attrs.numDecimals;
			}
			if ((attrs.animationLength !== null) && attrs.animationLength > 0) {
				animationLength = attrs.animationLength;
			}
			if (attrs.suffix !== null) { // voznik added suffix option to original directive, use data-suffix="%"
				options = {
					suffix : attrs.suffix
				};
			}
			return scope.$watch(attrs.ngModel, function (newVal, oldVal) {
				if (oldVal == null) {
					oldVal = 0;
				}
				if ((newVal !== null) && newVal !== oldVal) {
					return new countUp(attrs.id, Math.abs(oldVal), Math.abs(newVal), numDecimals, animationLength, options).start();
				}
			});
		}
	};
})
	/* директива для автофокуса https://gist.github.com/mlynch/dd407b93ed288d499778 */
// http://stackoverflow.com/questions/14859266/input-autofocus-attribute/14859639#14859639
.directive('autoFocus', ['$timeout',
	function ($timeout) {
		return {
			restrict: 'A',
			link: function ($scope, $element) {
				$timeout(function () {
					$element[0].focus();
				});
			}
		};
	}])
// https://coderwall.com/p/a41lwa/angularjs-auto-focus-into-input-field-when-ng-show-event-is-triggered
.directive('showFocus', function ($timeout) {
	return function (scope, element, attrs) {
		scope.$watch(attrs.showFocus, function (newValue) {
			$timeout(function () {
				newValue && element[0].focus();
			});
		}, true);
	};
})
// http://stackoverflow.com/questions/21196541/delete-row-from-x-editable-with-confirmation-angularjs
// http://jsfiddle.net/voznik/ryeb50z9/2/
.directive('ngConfirmClick', [
	function () {
		return {
			link: function (scope, element, attr) {
				var msg = attr.ngConfirmClick || "Are you sure?";
				var clickAction = attr.confirmedClick;
				element.bind('click', function (event) {
					if (window.confirm(msg)) {
						scope.$eval(clickAction);
					}
				});
			}
		};
	}])
// чтобы не прятать дроп https://github.com/angular-ui/bootstrap/issues/1427
.directive('stopEvent', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			element.bind(attr.stopEvent, function (e) {
				e.stopPropagation();
			});
		}
	};
})
// чтобы растягивалась область текста2 https://gist.github.com/enapupe/2a59589168f33ca405d0#comment-1389191
.directive('autoGrow', function () {
	return {
		restrict: 'A',
		link: function postLink(scope, element, attrs) {
			// hidding the scroll of textarea
			element.css('overflow', 'hidden');
			var update = function () {
				element.css("height", "auto");
				var height = element[0].scrollHeight;
				if (height > 0) {
					element.css("height", height + "px");
				}
			};
			scope.$watch(attrs.ngModel, function () {
				update();
			});
			attrs.$set("ngTrim", "false");
		}
	};
})
/**
 * https://github.com/twygmbh/angular-auto-height
 *
 * @desc - An AngularJS directive to automatically adjust the height of an element corresponding to the parent and
 *       siblings.
 * @example <div auto-height additional-height="100">
 */
.directive('autoHeight', function ($window, $timeout) {
	return {
		link: function($scope, $element, $attrs) {
			var combineHeights, siblings;
			combineHeights = function(collection) {
				var heights, i, len, node;
				heights = 0;
				for (i = 0, len = collection.length; i < len; i++) {
					node = collection[i];
					heights += node.offsetHeight;
				}
				return heights;
			};
			siblings = function($elm) {
				var elm, i, len, ref, results;
				ref = $elm.parent().children();
				results = [];
				for (i = 0, len = ref.length; i < len; i++) {
					elm = ref[i];
					if (elm !== $elm[0]) {
							results.push(elm);
					}
				}
				return results;
			};
			angular.element($window).bind('resize', function() {
				var additionalHeight, parentHeight;
				additionalHeight = $attrs.additionalHeight || 0;
				if ($window.innerHeight >=120) {
					parentHeight = $window.innerHeight - $element.parent()[0].getBoundingClientRect().top;
				}
				return $element.css('min-height', (parentHeight - combineHeights(siblings($element)) - additionalHeight) + "px");
			});
			return $timeout(function() {
				return angular.element($window).triggerHandler('resize');
			}, 1000);
		}
	};
})
// limit multiselect - https://github.com/angular-ui/ui-select/pull/348#issuecomment-63736469
.directive('uiSelect', function (alertService) {
	return {
		restrict: 'EA',
		require: 'uiSelect',
		link: function ($scope, $element, $attributes, ctrl) {
			$scope.$select.limit = (angular.isDefined($attributes.limit)) ? parseInt($attributes.limit, 10) : undefined;
			var superSelect = ctrl.select;
			ctrl.select = function () {
				if (ctrl.multiple && ctrl.limit !== undefined && ctrl.selected.length >= ctrl.limit) {
					// console.log("booooo");
					alertService.add(1, 'TOMANYOPTIONS', {});
				} else {

					superSelect.apply(ctrl, arguments);
				}
			};
		}
	};
})

// our changes to https://github.com/Dashue/angular-rome
.directive('romeDirective', function ($timeout) {
	return {
		require: '^ngModel',
		restrict: 'EA',
		scope: {
			options: '=',
			ngModel: '='
		},

		link: function (scope, iElement, iAttrs, ngModel, $parse) {
			function formatter(value) {
				if (angular.isString(value)) value = +value;
				if (angular.isDefined(value)&& value) return value = moment(value).format(scope.options.inputFormat); //cal.getDateString('L');
				else return value = '';
			}
			ngModel.$formatters.push(formatter);
			$timeout(function () {
				var cal = rome(iElement[0], scope.options);
				// cal.on('show', function () {
				// 	if (iElement[0].value !== ngModel.$viewValue) cal.setValue(moment(scope.ngModel).format(scope.options.inputFormat));
				// 	return;
				// });
				cal.on('data', function (value) {
					//if (ngModel.$viewValue !== moment(ngModel.$modelValue).format(scope.options.inputFormat))
					formatter(value);
					scope.$apply(function () {
						if (iAttrs.offset) scope.ngModel = moment.utc(cal.getDateString('YYYY-MM-DD[T00:00:00.000]')).format('x'); // //cal.getDate(value).toGMTString(); //unset offset like http://stackoverflow.com/a/26454317/4115894 //http://stackoverflow.com/a/21336352/4115894
						else scope.ngModel = +cal.getDateString('x');
					});
				});
			}, 0);
		}
	};
});