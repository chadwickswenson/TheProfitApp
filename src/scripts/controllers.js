var ctrls = angular.module('WellNestAdminConsoleApp.controllers', []);

ctrls.controller('AppCtrl', ['$scope', '$location', 'loadingService', function($scope, $location, loadingService) {
     /* $scope.$on('loadingStarted', function(){
          $(".loading-panel").show();
      });

      $scope.$on('loadingStopped', function(){
          $(".loading-panel").hide();
      });*/
}]);

ctrls.controller('BannerControl', ['$scope', '$location', 'loadingService', 'ngTableParams', '$filter', 'adherialAdminService', '$timeout', "bannersList", "$q", function($scope, $location, loadingService, ngTableParams, $filter, adherialAdminService, $timeout, bannersList, $q) {
    var data = bannersList;

    $scope.toggleBanner = function(banner) {
        //Prompt
        var bnrIds = [];
        var action = banner.enabled ? "disable" : "enable";
        var notyClass = banner.enabled ? "warning" : "success";
        bnrIds.push(banner.wellnessMessageId);
        adherialAdminService.toggleBanner(bnrIds, action, function(retVal){
            if(retVal.credentialAck == 1 && retVal.databaseAck == 1){
                _noty("This banner is now " + action + "d!", notyClass);
                $timeout(function(){
                    for(var i=0;i<data.length;i++){
                        if(data[i].wellnessMessageId == banner.wellnessMessageId){
                            data[i].enabled = !data[i].enabled;
                            break;
                        }
                    }
                    $scope.tableParams.reload();
                });
            } else {
                _noty("Something went wrong, please try again!", "error");
            }
        }, function(err){
            _noty("Something went wrong, please try again!", "error");
            console.log(err);
        });
    };

    var getBanners = function(){
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
    }

      $scope.$watch("filter.$", function () {
        $scope.tableParams.reload();
      });

      $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,           // count per page
        sorting: {
            creationDate: 'desc'     // initial sorting
        }
    }, {
        total: data.length, // length of data
        getData: function($defer, params) {
            var orderedData = params.sorting() ?
                        $filter('orderBy')(data, params.orderBy()) :
                        data;
            var filteredData = $filter('filter')(orderedData, $scope.filter);
            params.total(filteredData.length);
            $defer.resolve(filteredData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: $scope
    });
}]);

ctrls.controller('UsersControl', ['$scope', '$location', 'loadingService', 'ngTableParams', '$filter', 'usersList', 'adherialAdminService', '$timeout', function($scope, $location, loadingService, ngTableParams, $filter, usersList, adherialAdminService, $timeout) {
      var data = usersList;

      $scope.toggleUser = function(user) {
        //Prompt
        var usrIds = [];
        var action = user.enabled ? "disable" : "enable";
        var notyClass = user.enabled ? "warning" : "success";
        usrIds.push(user.userId);
        adherialAdminService.toggleUser(usrIds, action, function(retVal){
            if(retVal.credentialAck == 1 && retVal.databaseAck == 1){
                _noty("This user is now " + action + "d!", notyClass);
                $timeout(function(){
                    for(var i=0;i<data.length;i++){
                        if(data[i].userId == user.userId){
                            data[i].enabled = !data[i].enabled;
                            break;
                        }
                    }
                    $scope.tableParams.reload();
                });
            } else {
                _noty("Something went wrong, please try again!", "error");
            }
        }, function(err){
            _noty("Something went wrong, please try again!", "error");
            console.log(err);
        });
    };

      $scope.$watch("filter.$", function () {
            $scope.tableParams.reload();
      });

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,           // count per page
        sorting: {
            nameLast: 'asc'
        }
    }, {
        total: data.length, // length of data
        getData: function($defer, params) {

            var orderedData = params.sorting() ?
                                $filter('orderBy')(data, params.orderBy()) :
                                data;
            var filteredData = $filter('filter')(orderedData, $scope.filter);
            params.total(filteredData.length);
            $defer.resolve(filteredData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: $scope
    });
}]);

ctrls.controller('PlansControl', ['$scope', '$location', 'loadingService', 'ngTableParams', '$filter', 'plansList', 'adherialAdminService', '$timeout', function($scope, $location, loadingService, ngTableParams, $filter, plansList, adherialAdminService, $timeout) {
      var data = plansList;

    $scope.$watch("filter.$", function () {
        $scope.tableParams.reload();
    });

    $scope.togglePlan = function(plan) {
        //Prompt
        var plnIds = [];
        var action = plan.enabled ? "disable" : "enable";
        var notyClass = plan.enabled ? "warning" : "success";
        plnIds.push(plan.insurancePlanId);
        adherialAdminService.togglePlan(plnIds, action, function(retVal){
            if(retVal.credentialAck == 1 && retVal.databaseAck == 1){
                _noty("This insurance plan is now " + action + "d!", notyClass);
                $timeout(function(){
                    for(var i=0;i<data.length;i++){
                        if(data[i].insurancePlanId == plan.insurancePlanId){
                            data[i].enabled = !data[i].enabled;
                            break;
                        }
                    }
                    $scope.tableParams.reload();
                });
            } else {
                _noty("Something went wrong, please try again!", "error");
            }
        }, function(err){
            _noty("Something went wrong, please try again!", "error");
            console.log(err);
        });
    };

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,           // count per page
        sorting: {
            creationDate: 'desc'
        }
    }, {
        total: data.length, // length of data
        getData: function($defer, params) {
            var orderedData = params.sorting() ?
                        $filter('orderBy')(data, params.orderBy()) :
                        data;
            var filteredData = $filter('filter')(orderedData, $scope.filter);
            params.total(filteredData.length);
            $defer.resolve(filteredData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: $scope
    });
}]);

ctrls.controller('BenefitsControl', ['$scope', '$location', 'loadingService', 'ngTableParams', '$filter', 'benefitsList', 'adherialAdminService', '$q', '$timeout', function($scope, $location, loadingService, ngTableParams, $filter, benefitsList, adherialAdminService, $q, $timeout) {
    var data = benefitsList;

    var getBenefits = function(){
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
            loadingService.hide();
            deferred.reject;
        });

        return deferred.promise;
    }

    $scope.toggleBenefit = function(benefit) {
        //Prompt
        var bnftIds = [];
        var action = benefit.enabled ? "disable" : "enable";
        var notyClass = benefit.enabled ? "warning" : "success";
        bnftIds.push(benefit.insuranceBenefitId);
        adherialAdminService.toggleBenefit(bnftIds, action,function(retVal){
            if(retVal.credentialAck == 1 && retVal.databaseAck == 1){
                _noty("This insurance benefit is now " + action + "d!", notyClass);
                $timeout(function(){
                    for(var i=0;i<data.length;i++){
                        if(data[i].insuranceBenefitId == benefit.insuranceBenefitId){
                            data[i].enabled = !data[i].enabled;
                            break;
                        }
                    }
                    $scope.tableParams.reload();
                });
            } else {
                _noty("Something went wrong, please try again!", "error");
            }
        }, function(err){
            _noty("Something went wrong, please try again!", "error");
            console.log(err);
        });
    };

    $scope.$watch("filter.$", function () {
        $scope.tableParams.reload();
    });

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,
        sorting: {
            creationDate: 'desc',
            insurancePlanId: 'asc'
        }
    }, {
        total: data.length, // length of data
        getData: function($defer, params) {
            var orderedData = params.sorting() ?
                        $filter('orderBy')(data, params.orderBy()) :
                        data;
            var filteredData = $filter('filter')(orderedData, $scope.filter);
            params.total(filteredData.length);
            $defer.resolve(filteredData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: $scope
    });
}]);

ctrls.controller('ActivitiesControl', ['$scope', '$location', 'loadingService', 'ngTableParams', '$filter', 'activitiesList', 'adherialAdminService', '$timeout', function($scope, $location, loadingService, ngTableParams, $filter, activitiesList, adherialAdminService, $timeout) {
    var data = activitiesList;

    $scope.$watch("filter.$", function () {
        $scope.tableParams.reload();
    });

    $scope.toggleActivity = function(activity) {
        //Prompt
        var actvtsIds = [];
        var action = activity.enabled ? "disable" : "enable";
        var notyClass = activity.enabled ? "warning" : "success";
        actvtsIds.push(activity.wellnessActivityId);
        adherialAdminService.toggleActivity(actvtsIds, action, function(retVal){
            if(retVal.credentialAck == 1 && retVal.databaseAck == 1){
                _noty("This wellness activity is now " + action + "d!", notyClass);
                $timeout(function(){
                    for(var i=0;i<data.length;i++){
                        if(data[i].wellnessActivityId == activity.wellnessActivityId){
                            data[i].enabled = !data[i].enabled;
                            break;
                        }
                    }
                    $scope.tableParams.reload();
                });
            } else {
                _noty("Something went wrong, please try again!", "error");
            }
        }, function(err){
            _noty("Something went wrong, please try again!", "error");
            console.log(err);
        });
    };

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,           // count per page
        sorting: {
            insurancePlanId: 'asc',
            creationDate: 'desc'
        }
    }, {
        total: data.length, // length of data
        getData: function($defer, params) {
            var orderedData = params.sorting() ?
                        $filter('orderBy')(data, params.orderBy()) :
                        data;
            var filteredData = $filter('filter')(orderedData, $scope.filter);
            params.total(filteredData.length);
            $defer.resolve(filteredData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: $scope
    });
}]);