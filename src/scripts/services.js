'use strict';

var services = angular.module('WellNestAdminConsoleApp.services', ['jmdobry.angular-cache'])


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

services.factory('adherialAdminService', ['$resource', '$http', '$angularCacheFactory', function($resource, $http, $angularCacheFactory){

	var acCacheFactory = $angularCacheFactory('acCache', {
        capacity: 1000,
        maxAge: 30000,
        aggressiveDelete: true,
        cacheFlushInterval: 60000
     });

	var adherialAdminAPI = {};
	adherialAdminAPI.GUID = "8a9183d6-6aa3-46f6-911e-187701263a7c";
	adherialAdminAPI.url = "http://dev.api.adherial.com/admin:action";
	adherialAdminAPI.actions = {
		authenticate: "/check/adminCredentials",
		users: {
			get: "/get/users",
			add: "/add/users",
			update: "/update/users",
			remove: "/remove/users",
			enable: "/enable/users",
			disable: "/disable/users"
		},
		themes: {
			get: "/get/wellnessThemes",
			add: "/add/wellnessThemes",
			update: "/update/wellnessThemes",
			remove: "/delete/wellnessThemes",
			enable: "/enable/wellnessThemes",
			disable: "/disable/wellnessThemes"
		},
		banners: {
			get: "/get/wellnessBanners",
			add: "/add/wellnessBanners",
			update: "/update/wellnessBanners",
			remove: "/delete/wellnessBanners",
			enable: "/enable/wellnessBanners",
			disable: "/disable/wellnessBanners"
		},
		plans :{
			get: "/get/insurancePlans",
			add: "/add/insurancePlans",
			update: "/update/insurancePlans",
			remove: "/delete/insurancePlans",
			enable: "/enable/insurancePlans",
			disable: "/disable/insurancePlans"
		},
		benefits: {
			get: "/get/insuranceBenefits",
			add: "/add/insuranceBenefits",
			update: "/update/insuranceBenefits",
			remove: "/delete/insuranceBenefits",
			enable: "/enable/insuranceBenefits",
			disable: "/disable/insuranceBenefits"
		},
		clients: {
			get: "/get/insuranceClients",
			add: "/add/insuranceClients",
			update: "/update/insuranceClients",
			remove: "/remove/insuranceClients",
			enable: "/enable/insuranceClients",
			disable: "/disable/insuranceClients"
		},
		activities: {
			get: "/get/wellnessActivities",
			add: "/add/wellnessActivities",
			update: "/update/wellnessActivities",
			remove: "/remove/wellnessActivities",
			enable: "/enable/wellnessActivities",
			disable: "/disable/wellnessActivities"
		},
		agencies: {
			get: "/get/insuranceAgencies",
			add: "/add/insuranceAgencies",
			update: "/update/insuranceAgencies",
			remove: "/remove/insuranceAgencies",
			enable: "/enable/insuranceAgencies",
			disable: "/disable/insuranceAgencies"
		}
	};
	adherialAdminAPI.method = 'POST';

	adherialAdminAPI.getCache = function() {
        return acCacheFactory;
    }

	adherialAdminAPI.setGUID = function(guid) {
        adherialAdminAPI.GUID = guid;
    }

    adherialAdminAPI.getGUID = function() {
        if(adherialAdminAPI.GUID) return adherialAdminAPI.GUID
        else if($.cookie("admin-guid")) return $.cookie("admin-guid");
        return null;
    }

	adherialAdminAPI.authenticateAdmin = function(email, password, callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.email = email;
		jsonData.password = password;

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions["authenticate"]},
                         {
                                 authenticate: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.authenticate(jsonData, callbackSuccess, callbackError);
	}
	//////////////////////Users//////////////////////
	/////////////////////////////////////////////////
	/////////////////////////////////////////////////

	adherialAdminAPI.getUserList = function(callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.guid = adherialAdminAPI.getGUID();

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.users["get"]},
                         {
                                 listUsers: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.listUsers(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.addUser = function(usr, callbackSuccess, callbackError) {
		//TODO: add userS
		var jsonData = new Object();
		jsonData.users = [];
		var user = new Object();

		user.insurancePlanId = usr.planId;
        user.employerId = "1234";
        user.altId = "1234";
        user.memberNumber = "TBD";
        user.nameFirst = usr.firstName;
        user.nameMiddle = usr.midName;
        user.nameLast = usr.lastName;
        user.email = usr.email;
        user.note = usr.note;

        jsonData.guid = adherialAdminAPI.getGUID();
		jsonData.users.push(user);

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.users["add"]},
                         {
                                 add: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.add(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.updateUser = function(usr, callbackSuccess, callbackError) {
		//TODO: add userS
		var jsonData = new Object();
		jsonData.users = [];
		var user = new Object();

		user.userId = usr.Id;
		user.insurancePlanId = usr.planId;
        user.employerId = "1234";
        user.altId = "1234";
        user.memberNumber = "TBD";
        user.nameFirst = usr.firstName;
        user.nameMiddle = usr.midName;
        user.nameLast = usr.lastName;
        user.email = usr.email;
        user.note = usr.note;
        user.enabled = usr.enabled;

        jsonData.guid = adherialAdminAPI.getGUID();
		jsonData.users.push(user);

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.users["update"]},
                         {
                                 update: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.update(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.toggleUser = function(usrIds, action, callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.userIds = usrIds;
        jsonData.guid = adherialAdminAPI.getGUID();

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.users[action]},
                         {
                                 toggle: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.toggle(jsonData, callbackSuccess, callbackError);
	}

	//////////////////////Themes//////////////////////
	//////////////////////////////////////////////////
	//////////////////////////////////////////////////

	adherialAdminAPI.getThemeList = function(callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.guid = adherialAdminAPI.getGUID();

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.themes["get"]},
                         {
                                 listThemes: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.listThemes(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.addTheme = function(thme, callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.guid = adherialAdminAPI.getGUID();

		jsonData.wellnessThemes = [];
		var theme = new Object();

		theme.name = thme.name;
		theme.url = thme.url;

		jsonData.wellnessThemes.push(theme);

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.themes["add"]},
                         {
                                 add: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.add(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.updateTheme = function(thme, callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.guid = adherialAdminAPI.getGUID();

		jsonData.wellnessThemes = [];
		var theme = new Object();

		theme.wellnessThemeId = thme.Id;
		theme.name = thme.name;
		theme.url = thme.url;
		theme.enable = thme.enable;

		jsonData.wellnessThemes.push(theme);

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.themes["update"]},
                         {
                                 update: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.update(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.toggleTheme = function(thmeIds, action, callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.guid = adherialAdminAPI.getGUID();
		jsonData.wellnessThemeIds = thmeIds;

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.themes[action]},
                         {
                                 toggle: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.toggle(jsonData, callbackSuccess, callbackError);
	}

	//////////////////////Banners//////////////////////
	///////////////////////////////////////////////////
	///////////////////////////////////////////////////

	adherialAdminAPI.getBannerList = function(callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.guid = adherialAdminAPI.getGUID();

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.banners["get"]},
                         {
                                 listBanners: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.listBanners(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.addBanner = function(bnr, callbackSuccess, callbackError) {
		//TODO: add bannerS
		var jsonData = new Object();
		jsonData.wellnessBanners = [];
		var banner = new Object();

		banner.title = bnr.title;
		banner.wellnessThemeId = bnr.theme;
		banner.startDate = bnr.startDate;
		banner.endDate = bnr.endDate;
		banner.messageBody = bnr.messageBody;
		banner.insurancePlanId = 1;
		banner.iconImageName = "none";

		jsonData.guid = adherialAdminAPI.getGUID();
		jsonData.wellnessBanners.push(banner);


		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.banners["add"]},
                         {
                                 add: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.add(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.updateBanner = function(bnr, callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.wellnessBanners = [];
		var banner = new Object();

		banner.title = bnr.title;
		banner.wellnessMessageId = bnr.Id;
		banner.wellnessThemeId = bnr.theme;
		banner.startDate = bnr.startDate;
		banner.endDate = bnr.endDate;
		banner.messageBody = bnr.messageBody;
		banner.insurancePlanId = 1;
		banner.iconImageName = "none";
		banner.enabled = bnr.enabled;

		jsonData.guid = adherialAdminAPI.getGUID();
		jsonData.wellnessBanners.push(banner);

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.banners["update"]},
                         {
                                 update: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.update(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.toggleBanner = function(bnrIds, action, callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.wellnessBannerIds = bnrIds;
		jsonData.guid = adherialAdminAPI.getGUID();

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.banners[action]},
                         {
                                 toggle: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.toggle(jsonData, callbackSuccess, callbackError);
	}

	//////////////////////Plans/////////////////////
	////////////////////////////////////////////////
	////////////////////////////////////////////////

	adherialAdminAPI.getPlanList = function(callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.guid = adherialAdminAPI.getGUID();

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.plans["get"]},
                         {
                                 listPlans: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.listPlans(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.addPlan = function(pln, callbackSuccess, callbackError) {
		//TODO: add userS
		var jsonData = new Object();
		jsonData.insurancePlans = [];
		var plan = new Object();

		plan.activeDate = pln.activeDate;
        plan.inactiveDate = pln.inactiveDate;
        plan.address = pln.address;
        plan.carrierName = pln.carrierName;
        plan.dentalCardEnabled = pln.dentalCardEnabled;
        plan.medicalCardEnabled = pln.medicalCardEnabled;
        plan.visionCardEnabled = pln.prescriptionCardEnabled;
        plan.prescriptionCardEnabled = pln.prescriptionCardEnabled;
        plan.wellnessTarget = pln.wellnessTarget;
        plan.url = pln.url;
        plan.groupNumber = pln.groupNumber;
        plan.insuranceClientId = pln.clientId;
        //plan.ediPayorId = pln.ediPayorId;

        jsonData.guid = adherialAdminAPI.getGUID();
		jsonData.insurancePlans.push(plan);

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.plans["add"]},
                         {
                                 add: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.add(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.updatePlan = function(pln, callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.insurancePlans = [];
		var plan = new Object();

		plan.insurancePlanId = pln.Id;
		plan.activeDate = pln.activeDate;
        plan.inactiveDate = pln.inactiveDate;
        plan.address = pln.address;
        plan.carrierName = pln.carrierName;
        plan.dentalCardEnabled = pln.dentalCardEnabled;
        plan.medicalCardEnabled = pln.medicalCardEnabled;
        plan.visionCardEnabled = pln.prescriptionCardEnabled;
        plan.prescriptionCardEnabled = pln.prescriptionCardEnabled;
        plan.wellnessTarget = pln.wellnessTarget;
        plan.url = pln.url;
        plan.groupNumber = pln.groupNumber;
        plan.insuranceClientId = pln.clientId;
        plan.enabled = pln.enabled;
        //plan.ediPayorId = pln.ediPayorId;

        jsonData.guid = adherialAdminAPI.getGUID();
		jsonData.insurancePlans.push(plan);

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.plans["update"]},
                         {
                                 update: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.update(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.togglePlan = function(plnIds, action, callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.insurancePlanIds = plnIds;
		jsonData.guid = adherialAdminAPI.getGUID();

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.plans[action]},
                         {
                                 toggle: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.toggle(jsonData, callbackSuccess, callbackError);
	}

	//////////////////////Clients///////////////////
	////////////////////////////////////////////////
	////////////////////////////////////////////////

	adherialAdminAPI.getClientList = function(callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.guid = adherialAdminAPI.getGUID();

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.clients["get"]},
                         {
                                 listClients: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.listClients(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.toggleClient = function(clntIds, action, callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.insuranceClientIds = clntIds;
		jsonData.guid = adherialAdminAPI.getGUID();

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.clients[action]},
                         {
                                 toggle: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.toggle(jsonData, callbackSuccess, callbackError);
	}

	//////////////////////Benefits//////////////////
	////////////////////////////////////////////////
	////////////////////////////////////////////////

	adherialAdminAPI.getBenefitList = function(callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.guid = adherialAdminAPI.getGUID();

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.benefits["get"]},
                         {
                                 listBenefits: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.listBenefits(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.addBenefit = function(bnft, callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.guid = adherialAdminAPI.getGUID();
		jsonData.insuranceBenefits = [];
		var benefit = new Object();

		benefit.benefitDescription = bnft.description;
      	benefit.benefitName = bnft.name;
      	benefit.benefitType = bnft.type;
      	benefit.benefitValue = bnft.value;
      	benefit.category = bnft.category;
      	benefit.displayInBenefits = bnft.benefitsVisible;
      	benefit.displayInCards = bnft.cardsVisible;
      	benefit.insurancePlanId = bnft.planId;
      	benefit.enabled = bnft.enabled;
      	benefit.sortOrder = 1;

      	jsonData.insuranceBenefits.push(benefit);

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.benefits["add"]},
                         {
                                 add: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.add(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.updateBenefit = function(bnft, callbackSuccess, callbackError) {
		//TODO:
		var jsonData = new Object();
		jsonData.guid = adherialAdminAPI.getGUID();
		jsonData.insuranceBenefits = [];
		var benefit = new Object();

		benefit.insuranceBenefitId = bnft.Id;
		benefit.benefitDescription = bnft.description;
      	benefit.benefitName = bnft.name;
      	benefit.benefitType = bnft.type;
      	benefit.benefitValue = bnft.value;
      	benefit.category = bnft.category;
      	benefit.displayInBenefits = bnft.benefitsVisible;
      	benefit.displayInCards = bnft.cardsVisible;
      	benefit.insurancePlanId = bnft.planId;
      	benefit.enabled = bnft.enabled;
      	benefit.sortOrder = 1;

      	jsonData.insuranceBenefits.push(benefit);

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.benefits["update"]},
                         {
                                 update: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.update(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.toggleBenefit = function(bnftIds, action, callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.insuranceBenefitIds = bnftIds;
		jsonData.guid = adherialAdminAPI.getGUID();

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.benefits[action]},
                         {
                                 toggle: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.toggle(jsonData, callbackSuccess, callbackError);
	}

	//////////////////Activities////////////////////
	////////////////////////////////////////////////
	////////////////////////////////////////////////
	adherialAdminAPI.getActivityList = function(callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.guid = adherialAdminAPI.getGUID();

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.activities["get"]},
                         {
                                 listActivities: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.listActivities(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.toggleActivity = function(actvtsIds, action, callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.wellnessActivityIds = actvtsIds;
		jsonData.guid = adherialAdminAPI.getGUID();

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.activities[action]},
                         {
                                 toggle: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.toggle(jsonData, callbackSuccess, callbackError);
	}

	adherialAdminAPI.addActivity = function(actvty, plnIds, callbackSuccess, callbackError) {
		var jsonData = new Object();
		jsonData.guid = adherialAdminAPI.getGUID();
		jsonData.wellnessActivities = [];
		var activity = new Object();

		activity.activityDescription = actvty.description;
      	activity.activityTitle = actvty.title;
      	activity.daysRepeating = actvty.days;
      	activity.stepsUntilComplete = actvty.steps;
      	activity.maxMinutesBetweenActivitySteps = 0;
      	activity.maxTimesRepeatable = 10;
      	activity.pointValue = actvty.pointVal;
      	activity.startDate = actvty.startDate;
      	activity.endDate = actvty.endDate;
      	activity.enabled = actvty.enabled;
      	activity.reportingMechanism = "pin";
      	activity.sortOrder = 1;


      	jsonData.insurancePlanIds = plnIds;
      	jsonData.wellnessActivities.push(activity);

		var innerAPI = $resource(adherialAdminAPI.url,
                         {action: adherialAdminAPI.actions.activities["add"]},
                         {
                                 add: {
                                         method: 'POST'
                                 }
                         });
        return innerAPI.add(jsonData, callbackSuccess, callbackError);
	}

	return adherialAdminAPI;
}]);
