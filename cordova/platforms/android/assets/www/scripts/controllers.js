var ctrls = angular.module('DatAppProfit.controllers', []);
var fadeTime = 200
ctrls.controller('AppCtrl', ['$scope', '$location', '$rootScope', 'ngProgress', function($scope, $location, $rootScope, ngProgress) {
	ngProgress.color("#56c754");
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
		$(".main-container").css("padding", "5px");
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

ctrls.controller('HomeCtrl', ['$scope', '$location', '$rootScope', 'ngProgress', 'profitAppService', function($scope, $location, $rootScope, ngProgress, profitAppService) {
	$scope.getGroupsItems = function(groups) {
		profitAppService.listGroupsItems(function(data){
			ngProgress.complete();
			$scope.$apply(function() {
				$scope.income = data.income;
				$scope.expense = data.expense;
				$scope.totalIncome = data.totalIncome;
				$scope.totalExpense = data.totalExpense;
			});
		}, function(error){
			console.log(error);
		})
	}
	$scope.getGroups = function(){
		ngProgress.start();
 		profitAppService.listGroups(function(data){
 			//success
 			$scope.getGroupsItems();
 		}, function(error){
 			//error
 			console.log(error);
 		})
 	};
	$scope.getGroups();
}]);

ctrls.controller('AddCtrl', ['$scope', '$location', '$rootScope', 'ngProgress', 'profitAppService', '$timeout', function($scope, $location, $rootScope, ngProgress, profitAppService, $timeout) {
	var pictureSource = navigator.camera.PictureSourceType;
 	var destinationType = navigator.camera.DestinationType;

 	$scope.file = null;
 	$scope.picInProgress = false;

 	$scope.createEntry = function(){
 		ngProgress.start();
 		if($scope.picInProgress) return;
 		var newEntry = {};
 		newEntry.category = $scope.entry.type? "income" : "expense";
		newEntry.title = $scope.entry.title;
		newEntry.date = $scope.entry.date;
		newEntry.value = $scope.entry.value;
		newEntry.notes = $scope.entry.notes;
		newEntry.group = $scope.entry.group;
		newEntry.receiptFile = $scope.file;

		profitAppService.newEntry(newEntry, function(entry){
			console.log(entry);
			ngProgress.complete();
			$timeout(function(){
				$scope._go("home", false);
			}, 500);
		}, function(error){
			console.log(error);
		})
 	};

 	$scope.getGroups = function(){
 		profitAppService.listGroups(function(data){
 			//success
 			$scope.$apply(function() {
 				$scope.groups = data;
 			});
 		}, function(error){
 			//error
 			console.log(error);
 		})
 	};

 	var handlePhotoUpload = function(imgData) {
 		ngProgress.start();
 		$(".thumbnail").fadeIn();
  		$(".image-view img").remove();
  		var image = $("<img>").attr("src", "data:image/jpeg;base64," + imgData).css("display","none");
  		$(".image-view").append(image);
		var file = new Parse.File("receipt.png", {base64: imgData}, "image/png");
		file.save().then(function() {
			$scope.picInProgress = false;
			ngProgress.complete();
		}, function(error) {
			console.log(error)
		});
		$scope.file = file;
 	}

    $scope.capturePhoto = function() {
      	// Take picture using device camera and retrieve image as base64-encoded string
      	$scope.picInProgress = true;
      	navigator.camera.getPicture(
      	function(imgData){
      		handlePhotoUpload(imgData);
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
      	$scope.picInProgress = true;
      	navigator.camera.getPicture(
      	function(imgData){
      		handlePhotoUpload(imgData);
      	}, function(error) {
      		console.log(error);
      	},
      	{
      		quality: 50,
        	destinationType: destinationType.DATA_URL,
        	sourceType: pictureSource.PHOTOLIBRARY
    	});
    }

    $scope.getGroups();
}]);

ctrls.controller('GroupCtrl', ['$scope', '$location', '$timeout', 'loadingService', 'profitAppService', function($scope, $location, $timeout, loadingService, profitAppService) {

	$scope.createGroup = function() {
		var group = {};
		group.title = $scope.group.title;
		group.color = $(".color-selected").css("background");
		profitAppService.newGroup(group, function(result){
			//success
			console.log(result);
			$timeout(function(){
				$scope._go("add", false);
			}, 100);
		}, function(error){
			//error
			console.log(error);
		});
	}
}]);

ctrls.controller('LoginCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);

ctrls.controller('ListCtrl', ['$scope', '$location', '$rootScope', 'loadingService', 'items', function($scope, $location, $rootScope, loadingService, items) {

	$scope.items = items;
}]);

ctrls.controller('DetailCtrl', ['$scope', '$location', '$rootScope', 'loadingService', 'item', function($scope, $location, $rootScope, loadingService, item) {
	$scope.item = item;
}]);

ctrls.controller('SettingsCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);
ctrls.controller('ExportCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);
ctrls.controller('EditCtrl', ['$scope', '$location', '$rootScope', 'loadingService', 'item', 'profitAppService', function($scope, $location, $rootScope, loadingService, item, profitAppService) {
	var pictureSource = navigator.camera.PictureSourceType;
 	var destinationType = navigator.camera.DestinationType;

 	$scope.file = null;
 	$scope.picInProgress = false;
 	$scope.attachmentChanged = false;

	$scope.entry = item;
	$scope.hasAttachment = (item.attachment != null);

	$scope.updateEntry = function(){
 		ngProgress.start();
 		if($scope.picInProgress) return;
 	};

 	$scope.getGroups = function(){
 		profitAppService.listGroups(function(data){
 			//success
 			$scope.$apply(function() {
 				$scope.groups = data;
 			});
 		}, function(error){
 			//error
 			console.log(error);
 		})
 	};

 	var handlePhotoUpload = function(imgData) {
 		ngProgress.start();
 		$(".thumbnail").fadeIn();
  		$(".image-view img").remove();
  		var image = $("<img>").attr("src", "data:image/jpeg;base64," + imgData).css("display","none");
  		$(".image-view").append(image);
		var file = new Parse.File("receipt.png", {base64: imgData}, "image/png");
		file.save().then(function() {
			$scope.picInProgress = false;
			ngProgress.complete();
		}, function(error) {
			console.log(error)
		});
		$scope.file = file;
		$scope.attachmentChanged = true;
 	}

    $scope.capturePhoto = function() {
      	// Take picture using device camera and retrieve image as base64-encoded string
      	$scope.picInProgress = true;
      	navigator.camera.getPicture(
      	function(imgData){
      		handlePhotoUpload(imgData);
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
      	$scope.picInProgress = true;
      	navigator.camera.getPicture(
      	function(imgData){
      		handlePhotoUpload(imgData);
      	}, function(error) {
      		console.log(error);
      	},
      	{
      		quality: 50,
        	destinationType: destinationType.DATA_URL,
        	sourceType: pictureSource.PHOTOLIBRARY
    	});
    }

    $scope.getGroups();
}]);
