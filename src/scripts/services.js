'use strict';

var services = angular.module('DatAppProfit.services', ['jmdobry.angular-cache'])


services.factory('appVersion', function($rootScope){
	var versionMgr = {};
	var version = "2.0 (WAC)";
	
	versionMgr.getVersion = function() {
		return version;
	}

	versionMgr.setVersion = function(version) {
		versionMgr.version = version;
	}

	return versionMgr;
});

services.factory('loadingService', function($rootScope){
	var loadingPanel = {};
	loadingPanel.show = function(){
		this.broadcastLoadingStart();
	}

	loadingPanel.hide = function() {
		this.broadcastLoadingStop();
	}

	loadingPanel.broadcastLoadingStart = function() {
		$rootScope.$broadcast('loadingStarted');
	}

	loadingPanel.broadcastLoadingStop = function() {
		$rootScope.$broadcast('loadingStopped');
	}

	return loadingPanel;
});

services.factory('headerService', function($rootScope){
	var header = {};
	header.title = "";

	header.prepForBroadcastHeaderChange = function(title) {
		this.title = title;
		this.broadcastTitleChange();
	}

	header.prepForBroadcastLoginChange = function(status) {
		this.loggedIn = status;
		this.broadcastLoginChange();
	}

	header.broadcastTitleChange = function() {
		$rootScope.$broadcast('handleTitleChange');
	}

	header.broadcastLoginChange = function() {
		$rootScope.$broadcast('handleLoginChange');
	}

	return header;
});

services.factory('profitAppService', ['$resource', '$http', '$angularCacheFactory', function($resource, $http, $angularCacheFactory){

	var profitCacheFactory = $angularCacheFactory('profitCache', {
        capacity: 1000,
        maxAge: 30000,
        aggressiveDelete: true,
        cacheFlushInterval: 60000
     });

	var profitAPI = {};
	profitAPI.url = "http://parse.com";
	profitAPI.actions = {
	};
	profitAPI.method = 'POST';

	profitAPI.getCache = function() {
        return profitCacheFactory;
    }

	profitAPI.authenticate = function(email, password, callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.email = email;
		jsonData.password = password;

		var innerAPI = $resource(profitAPI.url,
                         {action: profitAPI.actions["authenticate"]},
                         {
                                 authenticate: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.authenticate(jsonData, callbackSuccess, callbackError);
	}

	return profitAPI;
}]);
