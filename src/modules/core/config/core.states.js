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
			name: 'main.auth',
			url: '/',
			abstract: true
		},	{
			name: 'main.auth.login',
			url: 'login'
		}, {
			name: 'main.error',
			url: 'error/:code',
			resolve: {
				code: ['$stateParams', function($stateParams) {
					return $stateParams.code;
				}]
			}
		},
		{
			name: 'main.taxi',
			url:'/taxi',
			views:{
				'header@main': {
					templateUrl: 'modules/core/views/header.html',
					controller: 'HeaderController'
				}
			}
		},

		// private
		{
			name: 'main.private',
			url: '/',
			views: {
				'footer@main': {
					templateUrl: 'modules/core/views/footer.html'
				}
			},
			abstract: true,
			parent: 'main'
		}
	]);
