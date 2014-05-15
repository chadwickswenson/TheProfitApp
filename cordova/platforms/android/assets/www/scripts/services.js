'use strict';

var services = angular.module('DatAppProfit.services', [])

// window.fbAsyncInit = function() {
//     Parse.FacebookUtils.init({
//       appId      : '329527673839218',
//       channelUrl : 'channel.html',
//       cookie     : true,
//       xfbml      : true
//     });
// };

// (function(d){
//     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
//     if (d.getElementById(id)) {return;}
//     js = d.createElement('script'); js.id = id; js.async = true;
//     js.src = "http://connect.facebook.net/en_US/all.js";
//     ref.parentNode.insertBefore(js, ref);
// }(document));

services.factory('OpenFB', ['$rootScope', '$q', '$window', '$http', function ($rootScope, $q, $window, $http) {

        var FB_LOGIN_URL = 'https://www.facebook.com/dialog/oauth',

        // By default we store fbtoken in sessionStorage. This can be overriden in init()
            tokenStore = window.sessionStorage,

            fbAppId,
            oauthRedirectURL,

        // Because the OAuth login spans multiple processes, we need to keep the success/error handlers as variables
        // inside the module instead of keeping them local within the login function.
            deferredLogin,

        // Indicates if the app is running inside Cordova
            runningInCordova,

        // Used in the exit event handler to identify if the login has already been processed elsewhere (in the oauthCallback function)
            loginProcessed;

        document.addEventListener("deviceready", function () {
            runningInCordova = true;
        }, false);

        /**
         * Initialize the OpenFB module. You must use this function and initialize the module with an appId before you can
         * use any other function.
         * @param appId - The id of the Facebook app
         * @param redirectURL - The OAuth redirect URL. Optional. If not provided, we use sensible defaults.
         * @param store - The store used to save the Facebook token. Optional. If not provided, we use sessionStorage.
         */
        function init(appId, redirectURL, store) {
            fbAppId = appId;
            if (redirectURL) oauthRedirectURL = redirectURL;
            if (store) tokenStore = store;
        }

        /**
         * Login to Facebook using OAuth. If running in a Browser, the OAuth workflow happens in a a popup window.
         * If running in Cordova container, it happens using the In-App Browser. Don't forget to install the In-App Browser
         * plugin in your Cordova project: cordova plugins add org.apache.cordova.inappbrowser.
         * @param fbScope - The set of Facebook permissions requested
         */
        function login(fbScope) {

            if (!fbAppId) {
                return error({error: 'Facebook App Id not set.'});
            }

            var loginWindow;

            fbScope = fbScope || '';

            deferredLogin = $q.defer();

            loginProcessed = false;

            logout();

            // Check if an explicit oauthRedirectURL has been provided in init(). If not, infer the appropriate value
            if (!oauthRedirectURL) {
                if (runningInCordova) {
                    oauthRedirectURL = 'https://www.facebook.com/connect/login_success.html';
                } else {
                    // Trying to calculate oauthRedirectURL based on the current URL.
                    var index = document.location.href.indexOf('index.html');
                    if (index > 0) {
                        oauthRedirectURL = document.location.href.substring(0, index) + 'oauthcallback.html';
                    } else {
                        return alert("Can't reliably infer the OAuth redirect URI. Please specify it explicitly in openFB.init()");
                    }
                }
            }

            loginWindow = window.open(FB_LOGIN_URL + '?client_id=' + fbAppId + '&redirect_uri=' + oauthRedirectURL +
                '&response_type=token&display=popup&scope=' + fbScope, '_blank', 'location=no');

            // If the app is running in Cordova, listen to URL changes in the InAppBrowser until we get a URL with an access_token or an error
            if (runningInCordova) {
                loginWindow.addEventListener('loadstart', function (event) {
                    var url = event.url;
                    if (url.indexOf("access_token=") > 0 || url.indexOf("error=") > 0) {
                        loginWindow.close();
                        oauthCallback(url);
                    }
                });

                loginWindow.addEventListener('exit', function () {
                    // Handle the situation where the user closes the login window manually before completing the login process
                    deferredLogin.reject({error: 'user_cancelled', error_description: 'User cancelled login process', error_reason: "user_cancelled"});
                });
            }
            // Note: if the app is running in the browser the loginWindow dialog will call back by invoking the
            // oauthCallback() function. See oauthcallback.html for details.

            return deferredLogin.promise;

        }

        /**
         * Called either by oauthcallback.html (when the app is running the browser) or by the loginWindow loadstart event
         * handler defined in the login() function (when the app is running in the Cordova/PhoneGap container).
         * @param url - The oautchRedictURL called by Facebook with the access_token in the querystring at the ned of the
         * OAuth workflow.
         */
        function oauthCallback(url) {
            // Parse the OAuth data received from Facebook
            console.log(url);
            var queryString,
                obj;

            loginProcessed = true;
            if (url.indexOf("access_token=") > 0) {
                queryString = url.substr(url.indexOf('#') + 1);
                obj = parseQueryString(queryString);
                tokenStore['fbtoken'] = obj['access_token'];
                tokenStore['expiresin'] = obj['expires_in'];
                deferredLogin.resolve();
            } else if (url.indexOf("error=") > 0) {
                queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
                obj = parseQueryString(queryString);
                deferredLogin.reject(obj);
            } else {
                deferredLogin.reject();
            }
        }

        /**
         * Application-level logout: we simply discard the token.
         */
        function logout() {
            tokenStore['fbtoken'] = undefined;
        }

        /**
         * Helper function to de-authorize the app
         * @param success
         * @param error
         * @returns {*}
         */
        function revokePermissions() {
            return api({method: 'DELETE', path: '/me/permissions'})
                .success(function () {
                    console.log('Permissions revoked');
                });
        }

        /**
         * Lets you make any Facebook Graph API request.
         * @param obj - Request configuration object. Can include:
         *  method:  HTTP method: GET, POST, etc. Optional - Default is 'GET'
         *  path:    path in the Facebook graph: /me, /me.friends, etc. - Required
         *  params:  queryString parameters as a map - Optional
         */
        function api(obj) {

            var method = obj.method || 'GET',
                params = obj.params || {};

            params['access_token'] = tokenStore['fbtoken'];

            return $http({method: method, url: 'https://graph.facebook.com' + obj.path, params: params})
                .error(function(data, status, headers, config) {
                    if (data.error && data.error.type === 'OAuthException') {
                        $rootScope.$emit('OAuthException');
                    }
                });
        }

        /**
         * Helper function for a POST call into the Graph API
         * @param path
         * @param params
         * @returns {*}
         */
        function post(path, params) {
            return api({method: 'POST', path: path, params: params});
        }

        /**
         * Helper function for a GET call into the Graph API
         * @param path
         * @param params
         * @returns {*}
         */
        function get(path, params) {
            return api({method: 'GET', path: path, params: params});
        }

        function parseQueryString(queryString) {
            var qs = decodeURIComponent(queryString),
                obj = {},
                params = qs.split('&');
            params.forEach(function (param) {
                var splitter = param.split('=');
                obj[splitter[0]] = splitter[1];
            });
            return obj;
        }

        return {
            init: init,
            login: login,
            logout: logout,
            revokePermissions: revokePermissions,
            api: api,
            post: post,
            get: get,
            oauthCallback: oauthCallback
        }

    }]);

// // Global function called back by the OAuth login dialog
// function oauthCallback(url) {
//     var injector = angular.element(document.getElementById('main')).injector();
//     injector.invoke(function (OpenFB) {
//         OpenFB.oauthCallback(url);
//     });
// }

services.factory('appVersion', function($rootScope){
	var versionMgr = {};
	var version = "1.0 (DATAPP)";

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

services.factory('tabService', function($rootScope){
	var tabs = {};
	tabs.cIndex = 0;

	tabs.prepForBroadcastTabChange = function(index) {
		this.cIndex = index;
		this.broadcastTabChange();
	}

	tabs.broadcastTabChange = function() {
		$rootScope.$broadcast('handleTabChange');
	}

	return tabs;
});

services.factory('profitAppService', ['$resource', '$http', function($resource, $http){
	var profitAPI = {};
	profitAPI.items =[];
	profitAPI.groups = {};
	profitAPI.groupList = [];
	profitAPI.incomeGroup = {};
	profitAPI.expenseGroup = {};


	profitAPI.getItemById = function(id, callbackSuccess, callbackError) {
		if(profitAPI.items.length > 0){
			for(var i = 0; i< profitAPI.items.length; i++)
				if(id == profitAPI.items[i].id){
					callbackSuccess(profitAPI.items[i]);
					return;
				}
			callbackError("invalid id");
		}
		else {
			//query server
			callbackError("empty array");
		}
	}

	profitAPI.getCoverPhoto = function(fid, callbackSuccess, callbackError) {
		var fb = $resource("https://graph.facebook.com/:id?fields=cover"
			,{
				id:fid
			}
			,{
				fetch: {method: "GET"}
			}
		);

		fb.fetch(callbackSuccess, callbackError);
	}

	profitAPI.newEntry = function(newEntry, callbackSuccess, callbackError) {
		var Entry = Parse.Object.extend("Entry");
		var entry = new Entry();

		entry.set("category", newEntry.category);
		entry.set("title", newEntry.title);
		entry.set("date", newEntry.date);
		entry.set("value", newEntry.value);
		entry.set("notes", newEntry.notes);
		entry.set("group", newEntry.group);
		entry.set("attachment", newEntry.receiptFile);
		entry.setACL(new Parse.ACL(Parse.User.current()));

		entry.save(null, {
			success: function(result){
				callbackSuccess(result);
			},
			error: function(error){
				callbackError(error);
			}
		});
	}

	profitAPI.updateEntry = function(updatedEntry, hasAttachmentChanged, callbackSuccess, callbackError) {
		var Entry = Parse.Object.extend("Entry");
		var query = new Parse.Query(Entry);

		query.get(updatedEntry.id, {
		  	success: function(data) {
		  		data.set("category", updatedEntry.category);
				data.set("title", updatedEntry.title);
				data.set("date", updatedEntry.date);
				data.set("value", updatedEntry.value);
				data.set("notes", updatedEntry.notes);
				data.set("group", updatedEntry.group);
				if(hasAttachmentChanged)
					data.set("attachment", updatedEntry.attachment);
				data.save();
				profitAPI.listGroupsItems();
		    	callbackSuccess(data);
		  	},
		  	error: function(object, error) {
		  		callbackError(error);
		  	}
		});
	}

	profitAPI.newGroup = function(g, callbackSuccess, callbackError) {
		var Group = Parse.Object.extend("Group");
		var group = new Group();

		group.set("title", g.title);
		group.set("color", g.color);
		group.setACL(new Parse.ACL(Parse.User.current()));

		group.save(null, {
			success: function(result){
				callbackSuccess(result);
			},
			error: function(error){
				callbackError(error);
			}
		});
	}

	profitAPI.listGroups = function(callbackSuccess, callbackError) {
		var Group = Parse.Object.extend("Group");
		var query = new Parse.Query(Group);
		query.ascending("title");

		query.find({
			success: function(results){
	 			for(var i=0; i < results.length; i++){
	 				profitAPI.groups[results[i].get("title")] = results[i].get("color").split("none")[0].trim();
	 			}
	 			profitAPI.groupList = results;
				callbackSuccess(results);
			},
			error: function(error){
				callbackError(error);
			}
		});
	}

	profitAPI.listItemsByGroup = function(type, group, callbackSuccess, callbackError) {
		if(profitAPI[type + "Group"] != undefined){
			callbackSuccess(profitAPI[type + "Group"][group]);
		} else {
			//query server
			callbackError("No data");
		}
	}

	profitAPI.authenticate = function(userObj, callbackSuccess, callbackError) {
		Parse.User.logIn(userObj.username, userObj.password, {
			success: function(user) {
				//LoginSuccess
				callbackSuccess(user);
		  	},
		  	error: function(user, error) {
		  		//LoginFailed
		  		callbackError(user, error);
		  	}
		});
	}

	profitAPI.signUp = function(userObj, callbackSuccess, callbackError) {
		var user = new Parse.User();
		user.set("username", userObj.username);
		user.set("password", userObj.password);
		user.set("email", userObj.email);

		user.set("firstName", userObj.firstname);
		user.set("lastName", userObj.lastname);

		user.signUp(null, {
		  success: function(user) {
		    callbackSuccess(user);
		  },
		  error: function(user, error) {
		    callbackError(user, error);
		  }
		});
	}

	profitAPI.listGroupsItems = function(callbackSuccess, callbackError) {
		var Entry = Parse.Object.extend("Entry");
		var query = new Parse.Query(Entry);
		query.ascending("date");

		query.find({
			success: function(results){
				var groupedData = {};
				var income = [];
				var expense = [];
				groupedData.totalIncome = 0;
				groupedData.totalExpense = 0;
				for(var i=0;i<results.length;i++){
					var entry = {};
					entry.title = results[i].get("title");
					entry.date = results[i].get("date");
					entry.value = results[i].get("value");
					entry.notes = results[i].get("notes");
					entry.category = results[i].get("category");
					entry.group = results[i].get("group");
					entry.color = profitAPI.groups[results[i].get("group")];
					entry.createdAt = results[i].createdAt;
					entry.updatedAt = results[i].updatedAt;
					entry.id = results[i].id;
					entry.attachment = results[i].get("attachment");
					profitAPI.items.push(entry);
					if(!entry.category){
						groupedData.totalIncome += entry.value;
						income.push(entry);
					}
					else{
						groupedData.totalExpense += entry.value;
						expense.push(entry);
					}
				}

				groupedData.income = _.groupBy(income, "group");
				profitAPI.incomeGroup = groupedData.income;
				groupedData.expense = _.groupBy(expense, "group");
				profitAPI.expenseGroup = groupedData.expense;

				if(callbackSuccess)
					callbackSuccess(groupedData);
			},
			error: function(error){
				callbackError(error);
			}
		});
	}

	return profitAPI;
}]);
