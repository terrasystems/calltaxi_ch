'use strict';
/**
 * @ngdoc overview
 * @name core.decorators
 * @module com.module.core
 * @description stack of decorators for modifying default providers or directives
 * @requires .config, $provider
 *
 * The `com.module.core` module provides core view
 *
 */
angular.module('com.module.core')
	/**
	 * @ngdoc function
	 * @name $stateProvider.decorator
	 * @description Override the internal 'views' builder with a function that takes the state definition, and a reference to the internal function being overridden:
	 * @example https://github.com/angular-ui/ui-router/wiki/Quick-Reference#decorator
	 *
	 */
	.config(function($stateProvider, statesList, $urlMatcherFactoryProvider) {
		// decorate all states
		$stateProvider.decorator('state', function(state) {
			var moduleName = state.name.split('.'), 				//moduleName = ["main", "private", "indicators", "list"]
				moduleNameStripped = state.name.split('.'),		//moduleNameStripped = ["main", "private", "indicators"]
				controllerName = '',
				titleName = '',
				templName = '',
				viewName = 'content@main';
			moduleNameStripped.pop(); //name - 1
			function moduleToCtrl(name) {
				return name.charAt(0).toUpperCase() + name.substr(1).toLowerCase(); // Capitalize Name
			}
			//rule for error
			if (state.name.indexOf('error')>-1)
			{
				state.views['content@main'] = {
					templateUrl: 'modules/core/views/error.html',
					parent: moduleNameStripped.join('.')
				};
				state.views.data = {
					pageTitle: 'ERROR'
				};
				return state;
			}
			//check state rules
			if (!state.abstract) {
				if (!state.abstract && state.includes.hasOwnProperty('main.public')) {
					controllerName = moduleToCtrl(moduleName[2]) + 'Controller';
					state.url = state.url || $urlMatcherFactoryProvider.compile('/' + moduleName[2]);
					titleName = moduleName[2].toUpperCase();
					templName = 'modules/' + moduleName[1] + '/views/' + moduleName[2] + '.html';
				} else if (!state.abstract && state.includes.hasOwnProperty('main.private')) {
					controllerName = moduleToCtrl(moduleName[2]) + 'Controller';
					state.url = state.url || $urlMatcherFactoryProvider.compile('/' + moduleName[2]);
					titleName = moduleName[2].toUpperCase();
					templName = 'modules/' + moduleName[2] + '/views/' + moduleName[2] + '.html';
				}
				// pack state
				state.views[viewName] = {
						templateUrl: templName,
						controller: controllerName,
						parent: moduleNameStripped.join('.')
					};
				state.views.data = {
						pageTitle: titleName
				};
				if (!state.self.url) {
					state.self['url'] = state.url.source;
					state.navigable = state;
				}
			}
			//console.log(state.views||'none');
			return state;
		});
		// get state names and send thrue stateProvider
		angular.forEach(statesList, function(state) {
			$stateProvider.state(state.name, state);
		});
	})
	/**
	 * @ngdoc function
	 * @description fixes ui-router+typeahead directive
	 * @example http://angular-tips.com/blog/2013/09/experiment-decorating-directives/ //// http://blog.xebia.com/2014/08/08/extending-angularjs-services-with-the-decorate-method/
	 */
	//
	.config(function($provide) {
		$provide.decorator('typeaheadDirective', function($delegate) { //https://gist.github.com/cakesmith/44d126c1ae0f4e9dc4b9
			var directive = $delegate[0];
			var compile = directive.compile;
			directive.compile = function(tElement, tAttrs) {
				var link = compile.apply(this, arguments);
				return function(elem, attrs) {
					link.apply(this, arguments);
					var atrib = attrs[0].attributes;
					if (tAttrs.typeaheadAppendToBody) {
						//if ('aria-owns' in atrib) { //if (attrs[0].attributes.hasOwnProperty('aria-owns')) { }//
						var wrapper = angular.element(document.getElementById('wrapper'));
						wrapper.append(angular.element(document.getElementById(atrib.getNamedItem('aria-owns').value)));
					}
				};
			};
			return $delegate;
		});
	})
	//
	.config(function($provide) {
		$provide.decorator('pagerDirective', function($delegate) {
			var directive = $delegate[0];
			angular.extend(directive, { transclude:true });
			// directive.$$isolateBindings.addon = { // http://stackoverflow.com/a/27738755/4115894
			// 	attrName: 'addon',
			// 	mode: '=?',
			// 	optional: true
			// };
			return $delegate;
		});
	})
	//
	.config(function($provide) {
		$provide.decorator('paginationDirective', function($delegate) {
			var directive = $delegate[0];
			angular.extend(directive, { transclude:true });
			// directive.$$isolateBindings.addon = { // http://stackoverflow.com/a/27738755/4115894
			// 	attrName: 'addon',
			// 	mode: '=?',
			// 	optional: true
			// };
			return $delegate;
		});
	})
	// TODO: декоратор щоб переробити нгМесаги на тултіпи
	/*.config(function($provide) {
		$provide.decorator('ngMessagesDirective', function($delegate) {
			var directive = $delegate[0];
			var compile = directive.compile;
			console.log('flag');
			// directive.compile = function(tElement, tAttrs) {
			function setupTooltipElement() {
				if (element[0].nodeName.toUpperCase() === 'SELECT' && !attrs.placement) {
						attrs.placement = 'top';
						element.attr('placement', attrs.placement);
				}

				element.tooltip({
						animation: false,
						html: true,
						placement: attrs.placement || 'bottom',
						trigger: xtForm.tooltipTrigger || 'manual',
						container: attrs.container || 'body'
				});
			}
			//////////////////////////////////////////////////////////////////
			this.renderMessages = function(values, multiple) {
				values = values || {};

				var found;
				angular.forEach(messages, function(message) {
					if ((!found || multiple) && truthyVal(values[message.type])) {
						message.attach();
						found = true;
					} else {
						message.detach();
					}
				});
	// };
			return $delegate;
		});
	})*/
	// TODO: декоратор щоб дізейблити текстовий редактор
	/*$provide.decorator('ngWigDirective', function($delegate) {
			var directive = $delegate[0];
			var compile = directive.compile;
			directive.compile = function(tElement, tAttrs, tAtrib) {
				var link = compile.apply(this, arguments);
				return function(elem, atrib) {
					link.apply(this, arguments);
					//var atrib = attrs[0].attributes;
					if (atrib[0].attributes.getNamedItem('ng-disabled')) {
						elem.toggleEditMode = function() {
							elem.editMode = false;
						};
					}
				};
			};
			return $delegate;
		})*/
	//TODO: декоратор щоб переробити нгМесаги на тултіпи
	// $provide.decorator('ngWigEditableDirective', function($delegate) {
	// 		var directive = $delegate[0];
	// 		var compile = directive.compile;
	// 		directive.compile = function(tElement, tAttrs) {
	// 				if (tElement[0].parentElement.parentElement.parentElement.attributes[6].value) {
	// 					tElement.toggleEditMode = function() {
	// 						tElement.editMode = false;
	// 					};
	// 				}
	// 			};
	// 		return $delegate;
	// 	});
	// })
	//
;