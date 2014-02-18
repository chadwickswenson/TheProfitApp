'use strict';

var filters = angular.module('DatAppProfit.filters', []);

filters.filter('dbDateConvert', [function() {
	return function(date) {
		return moment(0).seconds(parseInt(date, 10)).format("MM/D/YYYY");
	}
}]);

filters.filter('truncateTitle', [function() {
	return function(title) {
		return title.substring(0, 15) + "...";
	}
}]);


filters.filter('calculateSum', [function() {
	return function(items) {
		var sum = 0;
		for(var i = 0; i<items.length; i++)
			sum += items[i].value;

		return sum;
	}
}]);


