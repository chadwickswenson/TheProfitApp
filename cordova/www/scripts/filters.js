'use strict';

var filters = angular.module('DatAppProfit.filters', []);

filters.filter('dbDateConvert', [function() {
	return function(date) {
		return moment(0).seconds(parseInt(date, 10)).format("MM/D/YYYY");
	}
}]);

filters.filter('truncateTitle', [function() {
	return function(title) {
		return title.sunstring(0, 18);
	}
}]);

