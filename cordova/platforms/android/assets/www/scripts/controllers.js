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

var fadeAllOut = function(){
	$(".left-action").fadeOut(fadeTime);
	$(".add-action").fadeOut(fadeTime);
	$(".years-dropdown-icon").fadeOut(fadeTime);
	$(".enter-action").fadeOut(fadeTime);
	$(".edit-action").fadeOut(fadeTime);
	$(".menu-button").fadeOut(fadeTime);
	$(".search-action").fadeOut(fadeTime);
	$(".back-action").fadeOut(fadeTime);
}

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

			fadeAllOut();

			if($scope.title.toLowerCase() == "add"){
				$(".cancel-action").fadeIn(fadeTime);
				$(".enter-action").fadeIn(fadeTime);
			}
			else if($scope.title.toLowerCase() == "list"){
				$(".back-action").fadeIn(fadeTime);
				$(".search-action").fadeIn(fadeTime);
			} 
			else if($scope.title.toLowerCase() !== "profit") {
				$(".cancel-action").fadeIn(fadeTime);
				$(".enter-action").fadeIn(fadeTime);
			}
			else if($scope.title.toLowerCase() == "profit"){
				$(".add-action").fadeIn(fadeTime);
				$(".years-dropdown-icon").fadeIn(fadeTime);
				$(".menu-button").fadeIn(fadeTime);
			}
			else {
				$(".enter-action").fadeIn(fadeTime);
				$(".years-dropdown-icon").fadeIn(fadeTime);
			}
		}, 50);
	});
}]);

ctrls.controller('HomeCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);

ctrls.controller('AddCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {
	var pictureSource = navigator.camera.PictureSourceType;
    var destinationType = navigator.camera.DestinationType;

    $scope.capturePhoto = function() {
      	// Take picture using device camera and retrieve image as base64-encoded string
      	navigator.camera.getPicture(
      	function(img){
      		console.log(img);
      	}, function(error) {
      		console.log(error);
      	},
      	{
      		quality: 50,
        	destinationType: destinationType.DATA_URL
    	});
    }

    $scope.getLibrary = function() {
      	// Take picture using device camera and retrieve image as base64-encoded string
      	navigator.camera.getPicture(
      	function(uri){
      		console.log(uri);
      	}, function(error) {
      		console.log(error);
      	},
      	{
      		quality: 50,
        	destinationType: destinationType.FILE_URI,
        	sourceType: pictureSource.PHOTOLIBRARY
    	});
    }
}]);

ctrls.controller('TagCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);

ctrls.controller('loginCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);

ctrls.controller('ListCtrl', ['$scope', '$location', '$rootScope', 'loadingService', 'items', function($scope, $location, $rootScope, loadingService, items) {

	$scope.items = items;
}]);

ctrls.controller('DetailCtrl', ['$scope', '$location', '$rootScope', 'loadingService', 'item', function($scope, $location, $rootScope, loadingService, item) {
	$scope.item = item;
}]);

ctrls.controller('calcCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);
ctrls.controller('settingsCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);
ctrls.controller('exportCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);
ctrls.controller('editCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);
