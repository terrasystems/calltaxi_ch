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
				'header@main': {
					templateUrl: 'modules/core/views/header.html',
					controller: 'HeaderController'
				},

				'footer@main': {
					templateUrl: 'modules/core/views/footer.html'
				}
			}
		},
		// public
		//auth
		{
			name: 'main.auth',
			url: '',
			abstract: true
		},
		//login
		{
			name: 'main.auth.login'
		},
		//Registration
		{
			name: 'main.auth.registration'
		},
		//error
		{
			name: 'main.error',
			url: 'error/:code',
			resolve: {
				code: ['$stateParams', function($stateParams) {
					return $stateParams.code;
				}]
			}
		},
		//main page
		{
			name: 'main.taxi',
			abstract: 'true'
		},
		//main page
		{
			name: 'main.taxi.start',
		},
		//main page
		{
			name: 'main.taxi.list'
		},
		//main page
		{
			name: 'main.taxi.detail',
			url: '/taxi/detail/:id'
		},
		//add taxi
		{
			name: 'main.addtaxi',
			url:'/addtaxi'
		},
		//articles with contact us
		{
			name:'main.articles',
			url:'',
			abstract:true
		},
		//articles terms
		{
			name:'main.articles.terms'
		},
		//articles privacy_notice
		{
			name:'main.articles.privacy_notice'
		},
		//articles contactus
		{
			name:'main.articles.contactus'
		},
		//articles about
		{
			name:'main.articles.about'
		},
		//articles help
		{
			name:'main.articles.help'
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
