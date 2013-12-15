var ctrls = angular.module('DatAppProfit.controllers', []);

ctrls.controller('AppCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {
	/* $scope.$on('loadingStarted', function(){
		$(".loading-panel").show();
	});
	$scope.$on('loadingStopped', function(){
		$(".loading-panel").hide();
	});*/
}]);

ctrls.controller('HeaderCtrl', ['$scope', '$location', '$rootScope', 'headerService', '$timeout', function($scope, $location, $rootScope, headerService, $timeout) {
	$scope.title = "Profit";
	$scope.next = "add";

	var styles = {
	    // appear from right
	    front: '.animate-enter {   position:absolute;   -webkit-transition: 0.5s ease-out all;   -webkit-transform:translate3d(100%,0,0)  }  .animate-enter.animate-enter-active {   position:absolute;  -webkit-transform:translate3d(0,0,0)}  .animate-leave {   position:absolute;   -webkit-transition: 0.5s ease-out all;   -webkit-transform:translate3d(0,0,0)} .animate-leave.animate-leave-active {   position:absolute;  -webkit-transform:translate3d(-100%,0,0) };',
	    // appear from left
	    back: '.animate-enter {   position:absolute;   -webkit-transition: 0.5s ease-out all; -webkit-transform:translate3d(-100%,0,0)}  .animate-enter.animate-enter-active {   position:absolute;   -webkit-transform:translate3d(0,0,0) }  .animate-leave {   position:absolute;   -webkit-transition: 0.5s ease-out all;  -webkit-transform:translate3d(0,0,0)} .animate-leave.animate-leave-active {   position:absolute;  -webkit-transform:translate3d(100%,0,0) };'
	};

	$scope.direction = function(dir) {
		// update the animations classes
		$rootScope.style = styles[dir];
	}

	$scope.direction('front');

	$scope.goForward = function(path) {
		$location.path(path);
	}

	$scope.$on('handleTitleChange', function(){
		$scope.title = headerService.title;
		$timeout(function(){
			if($scope.title.toLowerCase() !== "profit") {
				$(".left-action").fadeIn(300);
				$(".right-action").fadeOut(300);
			} else {
				$(".left-action").fadeOut(300);
				$(".right-action").fadeIn(300);
			};
		}, 300);
	});

	$scope.goBack = function() {
		window.history.back();
	}
}]);

ctrls.controller('HomeCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);

ctrls.controller('AddCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);

ctrls.controller('TagCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);

ctrls.controller('ListCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);

ctrls.controller('DetailCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);
