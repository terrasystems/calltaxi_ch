'use strict';
/**
 * @ngdoc function
 * @name
 * @description
 *
 *
 */
var email = 'dfssf';
var email = email;
angular.module('com.module.core')
	//
	.constant('statesList', [
		// main
		{
			name: 'main',
			url: '',
			abstract: true,
			views: {
				'main': {
					templateUrl: 'modules/core/views/main.html',
					controller: 'MainController'
				},
				'footer@main': {
					templateUrl: 'modules/core/views/footer.html'
				}
			}
		},
		// public
		{
			name: 'main.public',
			url: '/',
			abstract: true
		}, {
			name: 'main.public.login',
			url: 'login'
		}, {
			name: 'main.public.error',
			url: 'error/:code',
			resolve: {
				code: ['$stateParams', function($stateParams) {
					return $stateParams.code;
				}]
			}
		},
		// private
		{
			name: 'main.private',
			url: '/',
			views: {
				'header@main': {
					templateUrl: 'modules/core/views/header.html',
					controller: 'HeaderController'
				},
				'leftnav@main': {
					templateUrl: 'modules/core/views/leftnav.html',
					controller: 'LeftnavController'
				},
				'footer@main': {
					templateUrl: 'modules/core/views/footer.html'
				}
			},
			abstract: true,
			parent: 'main'
		}, {
			name: 'main.private.main'
		},
	]);
