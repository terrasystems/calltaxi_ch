'use strict';
/*  */
angular.module('com.module.core')
	/*  */
	.filter('propsFilter', function() {
		return function(items, props) {
			var out = [];
			if (angular.isArray(items)) {
				items.forEach(function(item) {
					var itemMatches = false;
					var keys = Object.keys(props);
					for (var i = 0; i < keys.length; i++) {
						var prop = keys[i];
						var text = props[prop].toLowerCase();
						if ((item[prop] !== null) && (item[prop].toString().toLowerCase().indexOf(text) !== -1)) {
							itemMatches = true;
							break;
						}
					}
					if (itemMatches) {
						out.push(item);
					}
				});
			} else {
				// Let the output be the input untouched
				out = items;
			}
			return out;
		};
	})
	/* */
	.filter('range', function() {
		return function(input, total) {
			total = parseInt(total);
			for (var i = 0; i < total; i++) input.push(i);
			return input;
		};
	})
	/* */
	.filter('capitalize', function() {
		return function(input, all) {
			return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			}) : '';
		}
	})
	/**
	 * @ngdoc filter
	 * @name truncate
	 * @kind function
	 *
	 * @description
	 * truncates a string given a specified length, providing a custom string to denote an omission.
	 */
	.filter('truncate', function() {
		return function(input, length, suffix, preserve) {
			length = angular.isUndefined(length) ? input.length : length;
			preserve = preserve || false;
			suffix = suffix || '';
			if (!angular.isString(input) || (input.length <= length)) return input;
			return input.substring(0, (preserve) ? ((input.indexOf(' ', length) === -1) ? input.length : input.indexOf(' ',
				length)) : length) + suffix;
		};
	})
	/**
	 * @ngdoc filter
	 * @name ltrim
	 * @kind function
	 *
	 * @description
	 * Left trim. Similar to trimFilter, but only for left side.
	 */
	.
filter('ltrim', function() {
	return function(input, chars, side) {
		var trim = chars || '\\s';
		if (side == 'r')
			return angular.isString(input) ? input.replace(new RegExp(trim + '+$'), '') : input;
		else if (side == 'l')
			return angular.isString(input) ? input.replace(new RegExp('^' + trim + '+'), '') : input;
		else
			return angular.isString(input) ? input.replace(new RegExp('^' + trim + '+'), '') : input;

	}
});
