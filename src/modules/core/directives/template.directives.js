'use strict';
/**
 * @desc directives module
 **/
angular.module('com.module.core')
	// from rainbow
	.directive('goBack', [
		function() {
			return {
				restrict: 'A',
				controller: ['$scope', '$element', '$window',
					function($scope, $element, $window) {
						return $element.on('click', function() {
							return $window.history.back();
						});
					}
				]
			};
		}
	])
	/**
	 * @tutorial http://stackoverflow.com/questions/27197596/angular-ui-sref-href-resolve-completion-callback
	 * @example <a class="lock-before-resolved disabled" ui-sref="user.method({myparam:var.id})"></a>
	 */
	.directive('lockBeforeResolved', function() {
		return {
			restrict: 'C', // check as a class
			link: function(scope, element, attrs, controller) {
				attrs.$observe('href', function() {
					element.toggleClass('disabled');
				});
				element.on('click', function(e) {
					if (element.hasClass('disabled')) {
						e.stopPropagation();
						return false;
					}
				});
			}
		};
	})
	/** @descr для редактирования елементов на странице
	 * @tutorial http://gaboesquivel.com/blog/2014/in-place-editing-with-contenteditable-and-angularjs/
	 * @example <div class="editable" contenteditable="true"></div>
	 * */
	.directive('contenteditable', function() {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
				function read() {
					ngModel.$setViewValue(element.html());
				}

				ngModel.$render = function() {
					element.html(ngModel.$viewValue || '');
				};
				element.bind('blur keyup change', function() {
					scope.$apply(read);
				});
			}
		};
	})
	/**
	 * @ngdoc directive
	 * @name sectionOrderHeader
	 * @description Compile html for sections headers
	 * @example <section-order-title></section-order-title>
	 */
	.directive('sectionOrderTitle', function() {
		return {
			restrict: 'E',
			templateUrl: 'modules/core/views/boxtitle.order.tmpl.html',
			replace: true
		};
	})
	/**
	 * @ngdoc directive
	 * @name sectionLabprocessHeader
	 * @description Compile html for sections headers
	 * @example <section-labprocess-title></section-labprocess-title>
	 */
	.directive('sectionLabprocessTitle', function() {
		return {
			restrict: 'E',
			templateUrl: 'modules/core/views/boxtitle.labprocess.tmpl.html',
			replace: true
		};
	})
	/**
	 * @ngdoc directive
	 * @name sectionQcHeader
	 * @description Compile html for sections headers
	 * @example <section-qc-title></section-qc-title>
	 */
	.directive('sectionQcTitle', function() {
		return {
			restrict: 'E',
			templateUrl: 'modules/core/views/boxtitle.qc.tmpl.html',
			replace: true
		};
	})
	/**
	 * перша Вадікова нормальна директива. всьо просто. і майже ні в кого не спижжєно
	 * @ngdoc directive
	 * @name sectionBoxButtons
	 * @description Compile html for sections headers, set 'showfilter=' period|filter/none to insert icons or filter and  set 'rightbutton' and 'bcolor, bicon, btitle' to optionaly add right button
	 * @example <section-box-buttons showfilter="filter" rightbutton="true" bcolor="info" bicon="print" btitle="PRINT" ng-click="printselected()" ng-disabled="checkboxes.notchecked"></section-box-buttons>
	 */
	.directive('sectionBoxButtons', function(periodObj) { //periodObj=constant
		return {
			restrict: 'AE',
			replace: true,
			transclude: true,
			template: function(element, attrs) {
				var p = periodObj;
				var html = '';
				html += '<div class="row center-block">';
				html += '<div class="col-md-3 col-sm-3 col-xs-3">';
				// 1st button - commonly ADD
				if (attrs.leftbutton !== 'none') {
					html +=
						'<button class="btn btn-success btn-sm" ng-click="setAdd()"><i class="fa fa-fw fa-plus"></i>	<span class="hidden-xs"> {{\'ADD\'|translate}}</span></button>';
				}
				html += '</div>';
				// calendar icons OR filtering field with addons
				if (attrs.showfilter == 'period') { // show icons instead filter input
					html += '<div class="col-md-6 col-sm-7 col-xs-7 text-center"><div class="btn-group">';
					for (var i = 0; i < p.length; i++) {
						html += '<label class="btn btn-sm btn-link" ng-model="periodfilter" btn-radio="\'' + i + '\'" title="{{\'' + p[
								i].trans + '\'|translate}}" role="button"><i class="genericon genericon-' + p[i].icon +
							'"></i><span class="hidden-xs">{{\'' + p[i].trans + '\'|translate}}</span></label>';
					}
					html += '</div></div>';
				} else if (attrs.showfilter == 'filter') { // show filter input instead icons
					html +=
						'<div class="col-md-6 col-sm-7 col-xs-7"><div class="input-group input-group-sm"><span class="input-group-addon"><i class="fa fa-fw fa-search"></i></span>';
					html +=
						'<input id="filter" name="filter" type="text" class="form-control clear" ng-model="addfilter" placeholder="{{\'FILTER\'|translate}}"/>';
					html += '<span class="input-icon icon-right"><i class="fa fa-fw fa-close" ng-click="addfilter=\'\'"></i></span>';
					if (attrs.showfilterAddon == 'forindicators') {
						html +=
							'<mini-dropdown ng-model="item" options="grplist" callback="changeGroup(op)" 	divclass="input-group-btn" btnclass="btn-default btn-sm" btnicon="folder" optionicon="folder-open-o" placeholder="ALLGROUPS"></mini-dropdown>';
					} else if (attrs.showfilterAddon == 'forqc') {
						html +=
							'<span class="input-group-addon"><mini-checkbox chid="active_show" chtype="checkbox-o" ng-model="active.show"></mini-checkbox><span class="hidden-xs hidden-sm"> {{\'SHOWACTIVE\'|translate}}</span></span>';
					}
					html += '</div></div>'; //close input-group
				} else if (attrs.showfilter == 'none') {
					html += '';
				}
				// 2nd print or some button
				if (attrs.rightbutton == 'btn') {
					html += '<div class="col-md-3 col-sm-1 col-xs-1 rightbutton">';
					html += '<button class="btn btn-sm btn-' + attrs.bclass + '" ng-click="' + attrs.bclick + '" ng-disabled="' +
						attrs.bdisabled + '">';
					html += '<i class="fa fa-' + attrs.bicon + '"></i>';
					html += ' <span class="hidden-xs" translate=" ' + attrs.bname + '"></span>';
					html += '</button></div></div>';
				} else if (attrs.rightbutton == 'drop') {
					html += '<div class="col-md-3 col-sm-1 col-xs-1 rightbutton">';
					html += '<mini-dropdown ng-model="item.id" ng-hide="' + attrs.btnhide + '" options="' + attrs.options + '"callback="' + attrs.bclick +
						'(op)" 	divclass="btn-group" btnclass="' + attrs.bclass + '" btnicon="' + attrs.bicon + '" optionicon="' +
						attrs.bicon + '" placeholder="' + attrs.bname + '" ></mini-dropdown>';
				}
				html += '</div>';
				return html;
			}
		};
	})
	/**
	 * @ngdoc directive
	 * @name miniDropdown
	 * @description шоби не писать кучу текста для дродауна
	 */
	.directive('miniDropdown', function($state) {
		var stateName = $state.current.name.split('.');
		return {
			restrict: 'AE',
			require: '^ngModel',
			replace: true,
			scope: {
				ngModel: '=', // selection
				options: '=', // items to select from
				divclass: '@', //
				btnclass: '@', //
				btnicon: '@', //
				btndisabled: '@', //
				optionicon: '@', //
				placeholder: '@',
				callback: '&' // callback,
			},
			//controllerAs: $state.$current.views[stateName[2]+'@content'].controller,
			link: function(scope, element, attrs) {
				element.on('click', function(event) {
					event.preventDefault();
				});
				//scope.default = $translate.instant(placeholder);
				scope.select = function(op) { // selection changed handler
					scope.ngModel = op;
					if (scope.callback) {
						scope.callback({
							op: op
						});
					}
				};
			},
			templateUrl: 'modules/core/views/dropdown.tmpl.html'
		};
	})
	/**
	 * моя директива для чекбоксів і радіо цього чувака (без розмірів) http://maxweldsouza.github.io/font-awesome-controls/
	 * Usage
	 * Select a color using 'chclass': .fac-default .fac-primary .fac-success .fac-info .fac-warning .fac-danger
	 * Controls can be of type 'chtype': .fac-checkbox .fac-checkbox-round .fac-checkbox-o .fac-checkbox-round-o .fac-radio
	 * id placeholder - chid chplaceholder
	 */
	.directive('miniCheckbox', function() {
		return {
			restrict: 'E',
			replace: 'true',
			transclude: true,
			template: function(element, attrs) {
				var html = '';
				html += '<div class=\"fac fac-' + (attrs.chtype || 'checkbox') + ' fac-' + (attrs.chclass || 'default') + '\">';
				html += '<span></span>';
				html += '<input type=\"' + (attrs.chradio || 'checkbox') + '\" id=\"' + attrs.chid + '\" ng-model=\"' + attrs.ngModel +
					'\" ng-disabled=\"' + attrs.ngDisabled + '\"/>';
				//if (attrs.ngDisabled) html += ' disabled/>'; // + (attrs.ngDisabled ? ' disabled/>' : '/>';
				html += '<label for=\"' + attrs.chid + '\">' + (attrs.chplaceholder || '') + '</label></div>';
				return html;
			}
		};
	})
	//
	/**
	 * @ngdoc directive
	 * @name miniIcon
	 * @description Compile html for sections headers
	 * @example <mini-icon></mini-icon>
	 */
	.directive('miniIcon', function() {
		return {
			restrict: 'E',
			template: function(element, attrs) {
				var html = '';
				html += '<i class=\"fa fa-fw fa-' + attrs.ic + '\"></i>';
				return html;
			},
			replace: true
		};
	})
;
