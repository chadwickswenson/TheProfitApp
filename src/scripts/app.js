'use strict';

$.fn.usedWidth = function() {
    return $(this).width() + parseInt($(this).css("margin-left"), 10) + parseInt($(this).css("margin-right"), 10);
};

$.fn.usedHeight = function() {
    return $(this).height() + parseInt($(this).css("margin-top"), 10) + parseInt($(this).css("margin-bottom"), 10);
};	

var _noty = function(message, type) {
	var options = {
        text : message,
        template : '<div class="noty_message"><span class="noty_text" style="font-weight:200"></span><div class="noty_close"></div></div>',
        type : type,
        dismissQueue : true,
        layout : 'bottomLeft',
        timeout : 1500,
        closeWith : ['button'],
        buttons : false
    };
    var ntfcn = noty(options);
};

var _deviceInfo = function() {
	var information = {};
	var parser = UAParser();		

	information.device = $.ua.device;
	information.isPhone = ($.ua.device.model != undefined);
	information.browser = $.ua.browser;
	information.os = $.ua.os;

	return information;
}

var app = angular.module('DatAppProfit', ['DatAppProfit.filters', 'DatAppProfit.services', 'DatAppProfit.directives', 'DatAppProfit.controllers', 'ngResource', 'ngTable']).
            config(function($routeProvider, $locationProvider) {
				//$locationProvider.html5Mode(true);
				$routeProvider.
                    when('/home', {templateUrl: 'views/home.html'}). //you need to create this one
                    when('/add', {templateUrl: 'views/add.html'}). 
                    otherwise({redirectTo:'/home.html'});
			});

app.run(['$location', '$rootScope', '$templateCache', "$http", function($location, $rootScope, $templateCache, $http) {	
	var routesThatDontRequireAuth = ['/login'];	  
	  
	$rootScope.$on('$routeChangeStart', function (event, next, current) {					

	});

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {    	
    	
    });
}]);

app.controller('MainCtrl', function($scope, $rootScope, $location) {

  var styles = {
    // appear from right
    front: '.enter-setup {   position:absolute;   -webkit-transition: 0.5s ease-out all;   -webkit-transform:translate3d(100%,0,0)  }  .enter-setup.enter-start {   position:absolute;  -webkit-transform:translate3d(0,0,0)}  .leave-setup {   position:absolute;   -webkit-transition: 0.5s ease-out all;   -webkit-transform:translate3d(0,0,0)} .leave-setup.leave-start {   position:absolute;  -webkit-transform:translate3d(-100%,0,0) };',
    // appear from left
    back: '.enter-setup {   position:absolute;   -webkit-transition: 0.5s ease-out all; -webkit-transform:translate3d(-100%,0,0)}  .enter-setup.enter-start {   position:absolute;   -webkit-transform:translate3d(0,0,0) }  .leave-setup {   position:absolute;   -webkit-transition: 0.5s ease-out all;  -webkit-transform:translate3d(0,0,0)} .leave-setup.leave-start {   position:absolute;  -webkit-transform:translate3d(100%,0,0) };'
  };
  
  $scope.direction = function(dir) {
    // update the animations classes
    $rootScope.style = styles[dir];
  }

  $scope.go = function(path) {
    $location.path(path);
  }
  $scope.direction('front');
});