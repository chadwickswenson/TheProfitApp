'use strict';

var filters = angular.module('DatAppProfit.filters', []);

filters.filter('dbDateConvert', [function() {
	return function(date) {
		return moment(0).seconds(parseInt(date, 10)).format("MM/D/YYYY");
	}
}]);

filters.filter('truncateTitle', [function() {
	return function(title) {
		if(title.length > 15)
			return title.substring(0, 15) + "...";
		return title;
	}
}]);

filters.filter('truncateNotes', [function() {
	return function(title) {
		if(title.length > 60)
			return title.substring(0, 60) + "...";
		return title;
	}
}]);

filters.filter('calculateSum', ["$filter", function($filter) {
	return function(items) {
		if(!items) return 0;
		var sum = 0;
		for(var i = 0; i<items.length; i++)
			sum += items[i].value;

		return $filter('currency')(sum, '$');
	}
}]);


