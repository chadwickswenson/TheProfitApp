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

var app = angular.module('WellNestAdminConsoleApp', ['WellNestAdminConsoleApp.filters', 'WellNestAdminConsoleApp.services', 'WellNestAdminConsoleApp.directives', 'WellNestAdminConsoleApp.controllers', 'ngResource', 'ngTable']).
            config(function($routeProvider, $locationProvider) {
				//$locationProvider.html5Mode(true);
				$routeProvider.
                    when('/', {templateUrl: 'views/dashboard.html'}). //you need to create this one
                    when('/banners', {templateUrl: 'views/banners.html', controller: 'BannerControl', resolve:
                        {
                            bannersList: ['$q', 'adherialAdminService', 'loadingService', function($q, adherialAdminService, loadingService){

                                var deferred = $q.defer();

                                adherialAdminService.getBannerList(function(data) {
                                    if(data.credentialAck == 1){

                                            deferred.resolve(data.wellnessBanners);
                                    }
                                    else {
                                            _noty('Your session has been expired. Please log in again!', 'error');

                                            deferred.reject;
                                    }
                                }, function() {

                                    deferred.reject;
                                });

                                return deferred.promise;
                            }]
                        }
                    }).
                    when('/messages', {templateUrl: 'views/messages.html'}).
                    when('/activities', {templateUrl: 'views/activities.html', controller: 'ActivitiesControl', resolve:
                        {
                            activitiesList: ['$q', 'adherialAdminService', 'loadingService', function($q, adherialAdminService, loadingService){
                                var deferred = $q.defer();
                                adherialAdminService.getActivityList(function(data) {
                                    if(data.credentialAck == 1){
                                            deferred.resolve(data.wellnessActivities);
                                    }
                                    else {
                                            _noty('Your session has been expired. Please log in again!', 'error');
                                            deferred.reject;
                                    }
                                }, function() {

                                    deferred.reject;
                                });

                                return deferred.promise;
                            }]
                        }
                    }).
                    when('/plans', {templateUrl: 'views/plans.html', controller: 'PlansControl', resolve:
                        {
                            plansList: ['$q', 'adherialAdminService', 'loadingService', function($q, adherialAdminService, loadingService){

                                var deferred = $q.defer();

                                adherialAdminService.getPlanList(function(data) {
                                    if(data.credentialAck == 1){

                                            deferred.resolve(data.insurancePlans);
                                    }
                                    else {
                                            _noty('Your session has been expired. Please log in again!', 'error');

                                            deferred.reject;
                                    }
                                }, function() {

                                    deferred.reject;
                                });

                                return deferred.promise;
                            }]
                        }
                    }).
                    when('/benefits', {templateUrl: 'views/benefits.html', controller: 'BenefitsControl', resolve:
                        {
                            benefitsList: ['$q', 'adherialAdminService', 'loadingService', function($q, adherialAdminService, loadingService){

                                var deferred = $q.defer();

                                adherialAdminService.getBenefitList(function(data) {
                                    if(data.credentialAck == 1){

                                            deferred.resolve(data.insuranceBenefits);
                                    }
                                    else {
                                            _noty('Your session has been expired. Please log in again!', 'error');

                                            deferred.reject;
                                    }
                                }, function() {

                                    deferred.reject;
                                });

                                return deferred.promise;
                            }]
                        }
                    }).
                    when('/users', {templateUrl: 'views/users.html', controller: 'UsersControl', resolve:
                        {
                            usersList: ['$q', 'adherialAdminService', 'loadingService', function($q, adherialAdminService, loadingService){

                                var deferred = $q.defer();

                                adherialAdminService.getUserList(function(data) {
                                    if(data.credentialAck == 1){

                                            deferred.resolve(data.users);
                                    }
                                    else {
                                            _noty('Your session has been expired. Please log in again!', 'error');

                                            deferred.reject;
                                    }
                                }, function() {

                                    deferred.reject;
                                });

                                return deferred.promise;
                            }]
                        }
                    }).
                    otherwise({redirectTo:'/'});
			});

app.run(['$location', '$rootScope', '$templateCache', "$http", function($location, $rootScope, $templateCache, $http) {	
	var routesThatDontRequireAuth = ['/login'];	  
	  
	$rootScope.$on('$routeChangeStart', function (event, next, current) {					

	});

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {    	
    	
    });
}]);
