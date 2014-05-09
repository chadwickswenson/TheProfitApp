'use strict';

Parse.initialize("c6qu6vYBQBR8FMLKKxx8H6aR2I17562koAEQUgXY", "0YRo0iYzzupFk46JcQYWgMNjInQdHKG0bhLXxjDi");

if(Parse.User.current())
        $.cookie("current", true, { expires: 14});
    else
        $.cookie("current", false, { expires: 14});

var parseBoolean = function(val) {
    return val == "true";
}

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

var app = angular.module('DatAppProfit', ['DatAppProfit.filters', 'DatAppProfit.services', 'DatAppProfit.directives', 'DatAppProfit.controllers', 'ngResource', 'ngProgress', 'ngRoute', 'ngTouch', 'ngAnimate'],
    function($routeProvider, $locationProvider) {
        $routeProvider.when('/home', {templateUrl: 'views/home.html', controller: 'HomeCtrl', resolve:
            {
                session: ['$q', '$location', function($q, $location){
                    var _user = parseBoolean($.cookie("current"));
                    var deferred = $q.defer();

                    if(_user)
                        deferred.resolve();
                    else {
                        deferred.reject();
                        $location.path("/login");
                    }

                    return deferred.promise;
                }],
                coverPhoto: ['$q', '$location', 'profitAppService', function($q, $location, profitAppService){
                    var deferred = $q.defer();
                    var fid = Parse.User.current().get("fid");

                    profitAppService.getCoverPhoto(fid, function(data){
                        deferred.resolve(data.cover.source);
                    }, function(err){
                        deferred.resolve("file://android_asset/www/img/bg.jpg");
                        console.log(err);
                    });

                    return deferred.promise;
                }]
            }
        });
        $routeProvider.when('/newgroup', {templateUrl: 'views/createGroup.html', controller: 'GroupCtrl'});
        $routeProvider.when('/add', {templateUrl: 'views/add.html', controller: 'AddCtrl', resolve:
            {
                groups: ['$q', 'profitAppService', '$location', '$route', function($q, profitAppService, $location, $route){
                    var deferred = $q.defer();
                    var data = profitAppService.listGroups(function(data){
                        deferred.resolve(data);
                    }, function(error){
                        console.log(error);
                        deferred.reject;
                    });

                    return deferred.promise;
                }]
            }
        });
        $routeProvider.when('/edit/:id', {templateUrl: 'views/edit.html', controller: 'EditCtrl', resolve:
            {
                item: ['$q', 'profitAppService', '$location', '$route', function($q, profitAppService, $location, $route){
                    var deferred = $q.defer();
                    var id = $route.current.params.id;

                    var data = profitAppService.getItemById(id, function(data){
                        deferred.resolve(data);
                    }, function(error){
                        console.log(error);
                        deferred.reject;
                    });

                    return deferred.promise;
                }],
                groups: ['$q', 'profitAppService', '$location', '$route', function($q, profitAppService, $location, $route){
                    var deferred = $q.defer();
                    var data = profitAppService.listGroups(function(data){
                        deferred.resolve(data);
                    }, function(error){
                        console.log(error);
                        deferred.reject;
                    });

                    return deferred.promise;
                }]
            }
        });
        $routeProvider.when('/login', {templateUrl: 'views/login.html', controller: 'LoginCtrl', resolve:
            {
                session: ['$q', '$location', function($q, $location){
                    var _user = parseBoolean($.cookie("current"));
                    var deferred = $q.defer();

                    if(_user) {
                        deferred.reject();
                        $location.path("/home");
                    }
                    else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                }]
            }
        });
        $routeProvider.when('/signup', {templateUrl: 'views/signup.html', controller: 'SignUpCtrl', resolve:
            {
                futureUser: ['$q', '$location', function($q, $location){
                    var _user = parseBoolean($.cookie("current"));
                    var deferred = $q.defer();
                    var futureUser;
                    try {
                        futureUser = JSON.parse(sessionStorage.getItem("user"));
                    } catch(err) {
                        futureUser = new Object();
                    }


                    if(_user) {
                        deferred.reject();
                        $location.path("/home");
                    }
                    else {
                        deferred.resolve(futureUser);
                    }

                    return deferred.promise;
                }]
            }
        });
        $routeProvider.when('/export', {templateUrl: 'views/export.html', controller: 'ExportCtrl'});
        $routeProvider.when('/settings', {templateUrl: 'views/settings.html', controller: 'SettingsCtrl'});
                    // when('/list/:type/:group', {templateUrl: 'views/list.html', controller: 'ListCtrl', resolve:
                    //     {
                    //         items: ['$q', 'profitAppService', '$location', '$route', function($q, profitAppService, $location, $route){
                    //             var deferred = $q.defer();

                    //             var data = profitAppService.listItemsByGroup($route.current.params.type, $route.current.params.group, function(data){
                    //                 deferred.resolve(data);
                    //             }, function(error){
                    //                 console.log(error);
                    //                 deferred.reject;
                    //             });

                    //             return deferred.promise;
                    //         }]
                    //     }
                    // }).
        $routeProvider.when('/detail/:id', {templateUrl: 'views/detail.html', controller: 'DetailCtrl', resolve:
            {
                item: ['$q', 'profitAppService', '$location', '$route', function($q, profitAppService, $location, $route){
                    var deferred = $q.defer();
                    var id = $route.current.params.id;

                    var data = profitAppService.getItemById(id, function(data){
                        deferred.resolve(data);
                    }, function(error){
                        console.log(error);
                        deferred.reject;
                    });

                    return deferred.promise;
                }]
            }
        });
        $routeProvider.otherwise({redirectTo:'/login'});
    });

app.run(['$location', '$rootScope', '$templateCache', "headerService", "OpenFB", function($location, $rootScope, $templateCache, headerService, OpenFB) {
    OpenFB.init("329527673839218", "https://www.facebook.com/connect/login_success.html", localStorage);

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
	});

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        var route = ($location.path().indexOf("home") == -1) ? $location.path().split("/")[1] : "profit";

        headerService.prepForBroadcastHeaderChange(route.charAt(0).toUpperCase() + route.slice(1));
    });
}]);