'use strict';

var filters = angular.module('WellNestAdminConsoleApp.filters', []);

filters.filter('dbDateConvert', [function() {
	return function(date) {
		return moment(0).seconds(parseInt(date, 10)).format("MM/D/YYYY");
	}
}]);

filters.filter('longValTrim', [function() {
	return function(val) {
		if(val.length > 10)
			return val.substring(0, 10) + "...";
		return val;
	}
}]);

filters.filter('longValTrim2', [function() {
	return function(val) {
		if(val.length > 20)
			return val.substring(0, 20) + "...";
		return val;
	}
}]);

filters.filter('formatNames', [function() {
	return function(val) {
		var vals = val.split(" ");
		var res = "";

		for(var i = 0; i < vals.length; i++){
			var v = vals[i];
			res += v[0] + v.toLowerCase().substring(1, v.length) + " ";
		}

		return res.trim();
	}
}]);

filters.filter('groupBy', function(){
   	return function(items, by) {
	  	var groups = _.groupBy(items, by);
	  	return groups;
   }
});