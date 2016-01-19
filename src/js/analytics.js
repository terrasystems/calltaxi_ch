/**
 * Created by faust on 22.07.2015.
 */
(function(i, s, o, g, r, a, m) {
	i['GoogleAnalyticsObject'] = r;
	i[r] = i[r] || function() {
		(i[r].q = i[r].q || []).push(arguments)
	}, i[r].l = 1 * new Date();
	a = s.createElement(o), m = s.getElementsByTagName(o)[0];
	a.async = 1;
	a.src = g;
	m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-36466579-9', 'auto');

//  Так надо!
//
//  http://www.arnaldocapo.com/blog/post/google-analytics-and-angularjs-with-ui-router/72
//
//ga('send', 'pageview');