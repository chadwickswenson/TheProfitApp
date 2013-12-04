var ctrls = angular.module('DatAppProfit.controllers', []);

ctrls.controller('AppCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {
	/* $scope.$on('loadingStarted', function(){
		$(".loading-panel").show();
	});
	$scope.$on('loadingStopped', function(){
		$(".loading-panel").hide();
	});*/
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
}]);

ctrls.controller('HomeCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);

ctrls.controller('AddCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);
