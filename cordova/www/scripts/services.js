'use strict';

var services = angular.module('DatAppProfit.services', ['jmdobry.angular-cache'])

window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({
      appId      : '329527673839218',
      channelUrl : 'channel.html',
      cookie     : true,
      xfbml      : true
    });
};

(function(d){
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "http://connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));

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
	profitAPI.items =[];
	profitAPI.groups = {};
	profitAPI.groupList = [];
	profitAPI.incomeGroup = {};
	profitAPI.expenseGroup = {};

	profitAPI.getCache = function() {
        return profitCacheFactory;
    }

	profitAPI.clearCache = function() {
		profitAPI.groupList = [];
		profitAPI.items = [];
	}

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
		if(profitAPI.groupList.length > 0){
			callbackSuccess(profitAPI.groupList);
		} else {
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
					if(entry.category == "income"){
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

				callbackSuccess(groupedData);
			},
			error: function(error){
				callbackError(error);
			}
		});
	}

	return profitAPI;
}]);
