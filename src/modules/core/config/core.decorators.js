'use strict';
/*jshint -W069 */
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
				if (state.includes.hasOwnProperty('main.auth') || state.includes.hasOwnProperty('main.private')) {
					controllerName = moduleToCtrl(moduleName[2]) + 'Controller';
					state.url = state.url || $urlMatcherFactoryProvider.compile('/' + moduleName[2]);
					titleName = moduleName[2].toUpperCase();
					templName = 'modules/' + moduleName[1] + '/views/' + moduleName[2] + '.html';
				} else
				if (state.includes.hasOwnProperty('main')) {
					controllerName = moduleToCtrl(moduleName[1]) + 'Controller';
					state.url = state.url || $urlMatcherFactoryProvider.compile('/' + moduleName[1]);
					titleName = moduleName[1].toUpperCase();
					templName = 'modules/' + moduleName[1] + '/views/' + moduleName[1] + '.html';
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
		$provide.decorator('uibTypeaheadDirective', function($delegate) { //https://gist.github.com/cakesmith/44d126c1ae0f4e9dc4b9
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
		$provide.decorator('uibPagerDirective', function($delegate) {
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
		$provide.decorator('uibPaginationDirective', function($delegate) {
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
;
