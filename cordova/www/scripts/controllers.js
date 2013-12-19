var ctrls = angular.module('DatAppProfit.controllers', []);
var fadeTime = 200
ctrls.controller('AppCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {
	/* $scope.$on('loadingStarted', function(){
		$(".loading-panel").show();
	});
	$scope.$on('loadingStopped', function(){
		$(".loading-panel").hide();
	});*/

	var styles = {
	    // appear from right
	    forward: '.animate-enter {   position:absolute;   -webkit-transition: 0.5s ease-out all;   -webkit-transform:translate3d(100%,0,0)  }  .animate-enter.animate-enter-active {   position:absolute;  -webkit-transform:translate3d(0,0,0)}  .animate-leave {   position:absolute;   -webkit-transition: 0.5s ease-out all;   -webkit-transform:translate3d(0,0,0)} .animate-leave.animate-leave-active {   position:absolute;  -webkit-transform:translate3d(-100%,0,0) };',
	    // appear from left
	    back: '.animate-enter {   position:absolute;   -webkit-transition: 0.5s ease-out all; -webkit-transform:translate3d(-100%,0,0)}  .animate-enter.animate-enter-active {   position:absolute;   -webkit-transform:translate3d(0,0,0) }  .animate-leave {   position:absolute;   -webkit-transition: 0.5s ease-out all;  -webkit-transform:translate3d(0,0,0)} .animate-leave.animate-leave-active {   position:absolute;  -webkit-transform:translate3d(100%,0,0) };'
	};

	$scope.direction = function(dir) {
		// update the animations classes
		$rootScope.style = styles[dir];
	}

	$scope._go = function(path, direction) {
		if(direction){
			$scope.direction('forward');
		} else {
			$scope.direction('back');
		}
		$location.path(path);
	}
}]);

ctrls.controller('HeaderCtrl', ['$scope', '$location', '$rootScope', 'headerService', '$timeout', function($scope, $location, $rootScope, headerService, $timeout) {
	$scope.title = "Profit";
	var _getFutureRoute = function(route) {
		var _futureRoute = {};
		_futureRoute.back = null;
		_futureRoute.forward = null;

		switch(route) {
			case 'home':
				_futureRoute.forward = 'add';
			break;
			case 'add':
				_futureRoute.back = 'home';
				_futureRoute.forward = 'createtag';
			break;
			case 'createtag':
				_futureRoute.back = 'add';
			break;
			case 'list':
				_futureRoute.back = 'home';
				_futureRoute.forward = 'detail';
			break;
			case 'detail':
				_futureRoute.back = 'list';
			break;
			default:
				_futureRoute.back = null;
				_futureRoute.forward = null;
			break;
		}

		return _futureRoute;
	}

	$scope.goForward = function() {
		var route = $location.path().split("/")[1];
		var path = _getFutureRoute(route).forward;
		$scope.$parent._go(path, true);
	}

	$scope.goBack = function() {
		var route = $location.path().split("/")[1];
		var path = _getFutureRoute(route).back;
		$scope.$parent._go(path, false);
	}

	$scope.$on('handleTitleChange', function(){
		$scope.title = headerService.title;
		$timeout(function(){
			if($scope.title.toLowerCase() !== "profit") {
				$(".left-action").fadeIn(fadeTime);
				$(".right-action").fadeOut(fadeTime);
				$(".years-dropdown-icon").fadeOut(fadeTime);
			} else {
				$(".left-action").fadeOut(fadeTime);
				$(".right-action").fadeIn(fadeTime);
				$(".years-dropdown-icon").fadeIn(fadeTime);
			};
		}, 50);
	});
}]);

ctrls.controller('HomeCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);

ctrls.controller('AddCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);

ctrls.controller('TagCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);

ctrls.controller('ListCtrl', ['$scope', '$location', '$rootScope', 'loadingService', 'items', function($scope, $location, $rootScope, loadingService, items) {

	$scope.items = items;
}]);

ctrls.controller('DetailCtrl', ['$scope', '$location', '$rootScope', 'loadingService', 'item', function($scope, $location, $rootScope, loadingService, item) {
	$scope.item = item;
}]);
