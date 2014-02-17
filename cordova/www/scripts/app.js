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

var app = angular.module('DatAppProfit', ['DatAppProfit.filters', 'DatAppProfit.services', 'DatAppProfit.directives', 'DatAppProfit.controllers', 'ngResource']).
            config(function($routeProvider, $locationProvider) {
				//$locationProvider.html5Mode(true);
				$routeProvider.
                    when('/home', {templateUrl: 'views/home.html', controller: 'HomeCtrl'}). //you need to create this one
                    when('/newgroup', {templateUrl: 'views/createGroup.html', controller: 'GroupCtrl'}).
                    when('/add', {templateUrl: 'views/add.html', controller: 'AddCtrl'}).
                    when('/edit/:id', {templateUrl: 'views/add.html', controller: 'EditCtrl'}).
                    when('/login', {templateUrl: 'views/login.html', controller: 'LoginCtrl'}).
                    when('/export', {templateUrl: 'views/export.html', controller: 'ExportCtrl'}).
                    when('/settings', {templateUrl: 'views/settings.html', controller: 'SettingsCtrl'}).
                    when('/list', {templateUrl: 'views/list.html', controller: 'ListCtrl', resolve:
                        {
                            items: ['$q', 'profitAppService', '$location', function($q, profitAppService, $location){
                                var deferred = $q.defer();

                                var data = profitAppService.getItemsList();
                                if(data) {
                                    deferred.resolve(data);
                                } else {
                                    deferred.reject;
                                }

                                return deferred.promise;
                            }]
                        }
                    }).
                    when('/detail/:id', {templateUrl: 'views/detail.html', controller: 'DetailCtrl', resolve:
                        {
                            item: ['$q', 'profitAppService', '$location', '$route', function($q, profitAppService, $location, $route){
                                var deferred = $q.defer();
                                var id = $route.current.params.id;

                                var data = profitAppService.getItemById(id);
                                if(data) {
                                    deferred.resolve(data);
                                } else {
                                    deferred.reject;
                                }

                                return deferred.promise;
                            }]
                        }
                    }).
                    otherwise({redirectTo:'/home'});
			});

app.run(['$location', '$rootScope', '$templateCache', "headerService", function($location, $rootScope, $templateCache, headerService) {
	var routesThatDontRequireAuth = ['/login'];	  
	  
	$rootScope.$on('$routeChangeStart', function (event, next, current) {					

	});

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        var route = ($location.path().indexOf("home") == -1) ? $location.path().split("/")[1] : "profit";

        headerService.prepForBroadcastHeaderChange(route.charAt(0).toUpperCase() + route.slice(1));
    });
}]);