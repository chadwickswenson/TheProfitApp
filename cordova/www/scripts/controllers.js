var ctrls = angular.module('DatAppProfit.controllers', []);
var fadeTime = 200;
var notifications = [];

ctrls.controller('AppCtrl', ['$scope', '$location', '$rootScope', 'ngProgress', '$timeout', function($scope, $location, $rootScope, ngProgress, $timeout) {
	ngProgress.color("rgba(255,255,255,0.8)");
	$rootScope.currentUser = Parse.User.current();
	$scope.direction = function(dir) {
		$rootScope.style = dir;
	}

	function alertDismissed() {
        // do something
    }

    $scope.$on('loadingStarted', function(){
    	$(".profit-loading").css("display", "inline-block");
		$(".profit-loading").addClass("active");
	});

	$scope.$on('loadingStopped', function(){
		$(".profit-loading").removeClass("active");
		$timeout(function(){
			$(".profit-loading").css("display", "none");
		}, 300);

	});

	$scope._go = function(path, direction, $event) {
		if($event)
			$event.stopPropagation();
		if(direction){
			$scope.direction('slide-left');
		} else {
			$scope.direction('slide-right');
		}
		// window.plugin.notification.local.onclick = function (id, state, json) {
		// 	console.log(id);
		// 	console.log(state);
		// 	console.log(json);
	 //    }
		// setTimeout(function(){
		// 	var notif = {
		// 			id: Math.floor(Math.random() * 111 % 13),
		// 			sound: "/www/audio/Titan.mp3",
		// 			title: 'DatApp - The Profit',
		// 			message: 'Soroush is the best!',
		// 			icon: 'icon'
		// 		};
		// 	notifications.push(notif);
		// 	window.plugin.notification.local.add(notif);
		// }, 5000);
		$timeout(function(){
			$location.path(path);
		})
	}
}]);

ctrls.controller('HomeCtrl', ['$scope', '$location', '$rootScope', 'ngProgress', 'profitAppService', '$timeout', 'tabService', 'loadingService', 'coverPhoto', function($scope, $location, $rootScope, ngProgress, profitAppService, $timeout, tabService, loadingService, coverPhoto) {
	$scope.currentIndex = tabService.cIndex;
	$scope.cover = coverPhoto;

	$scope.switchGroup = function(group) {
		$scope.currentIndex = $(".profit-items-feed[data-target='" + group + "']").index() - 1;
		tabService.prepForBroadcastTabChange($scope.currentIndex);
	}

	$rootScope.$on('handleTabChange', function() {
		var oldVal = $scope.currentIndex;
		$scope.currentIndex = tabService.cIndex, newVal = tabService.cIndex;

		var target = $($(".profit-group-tab")[newVal]).attr("data-target");
        var color = $($(".profit-group-tab")[newVal]).attr("data-color").split("none")[0].trim();
		$(".profit-add").removeClass("invis");
		$(".profit-group-tab").removeClass("active");
		$($(".profit-group-tab")[newVal]).css({"border-color": color}).addClass("active");

		if(!$($(".profit-group-tab")[newVal]).visible(false, false, 'horizontal')){
			if(newVal > oldVal){
				var scrollLeft = $(".profit-group-tab")[newVal].offsetLeft + $($(".profit-group-tab")[newVal]).width();
				$(".profit-group-navbar").scrollLeft(scrollLeft);
			} else {
				var scrollRight = $(".profit-group-tab")[newVal].offsetLeft - $($(".profit-group-tab")[newVal]).width();
				$(".profit-group-navbar").scrollLeft(scrollRight);
			}
		}

		$(".profit-items-feed").removeClass("active");
		$($(".profit-items-feed")[newVal]).addClass("active");

        $(".profit-color").css("background", color);
        $("body").scrollTop(0);
        $(".profit-item.active").removeClass('active');
	});

	$scope.goNext = function() {
		if($scope.currentIndex == $scope.groups.length) return;
		$scope.currentIndex++;
		tabService.prepForBroadcastTabChange($scope.currentIndex);
	}

	$scope.goPrevious = function() {
		$scope.currentIndex--;
		tabService.prepForBroadcastTabChange($scope.currentIndex);
	}

	$scope.getGroupsItems = function(groups) {
		ngProgress.start();
		loadingService.show();
		profitAppService.listGroupsItems(function(data){
			$scope.$apply(function() {
				$scope.income = data.income;
				$scope.expense = data.expense;
				$timeout(function(){
					$scope.totalIncome = data.totalIncome;
					$scope.totalExpense = data.totalExpense;
					$scope.total = data.totalIncome - data.totalExpense;
					$scope.totalClass = ($scope.total >= 0) ? "text-success" : "text-danger";
				});
			});
			ngProgress.complete();
			loadingService.hide();
		}, function(error){
			console.log(error);
		});
	}

	$scope.getGroups = function(){
 		profitAppService.listGroups(function(data){
 			$scope.groups = data;
 			$timeout(function(){
 				$scope.getGroupsItems();
 			}, 500);
 		}, function(error){
 			//error
 			console.log(error);
 		})
 	};

 	$scope.isEmpty = function(list) {
 		return list.length == 0;
 	}
	$scope.getGroups();
}]);

ctrls.controller('AddCtrl', ['$scope', '$location', '$rootScope', 'ngProgress', 'profitAppService', '$timeout', 'groups', 'tabService', function($scope, $location, $rootScope, ngProgress, profitAppService, $timeout, groups, tabService) {
	var pictureSource = navigator.camera.PictureSourceType;
 	var destinationType = navigator.camera.DestinationType;

 	$scope.file = null;
 	$scope.picInProgress = false;
 	$scope.groups = groups;
 	$scope.selected = tabService.cIndex - 1;

 	$scope.createEntry = function(){
 		if($scope.picInProgress) return;
 		var newEntry = {};
 		newEntry.category = (!$scope.entry.type || $scope.entry.type == undefined)? "income" : "expense";
		newEntry.title = $scope.entry.title;
		newEntry.date = $scope.entry.date;
		newEntry.value = $scope.entry.value;
		newEntry.notes = $scope.entry.notes;
		newEntry.group = $scope.entry.group;
		newEntry.receiptFile = $scope.file;

		profitAppService.newEntry(newEntry, function(entry){
			console.log(entry);
			$timeout(function(){
				$scope._go("home", false);
			}, 500);
		}, function(error){
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
		}, function(error) {
			console.log(error)
		});
		$scope.file = file;
		ngProgress.complete();
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
}]);

ctrls.controller('GroupCtrl', ['$scope', '$location', '$timeout', 'loadingService', 'profitAppService', 'ngProgress', function($scope, $location, $timeout, loadingService, profitAppService, ngProgress) {

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

ctrls.controller('LoginCtrl', ['$scope', '$location', '$rootScope', 'loadingService', 'profitAppService', '$timeout', function($scope, $location, $rootScope, loadingService, profitAppService, $timeout) {
	$scope.user = {username:"", password:""};

	var signUp = function() {
	}

	$scope.loginOrSignup = function() {
		profitAppService.authenticate($scope.user, function(user){
			$.cookie("current", true, { expires: 14});
			$rootScope.currentUser = user;
			$timeout(function(){
				$location.path("/home");
			}, 10);
		}, function(user, error){
			$.cookie("current", false, { expires: 14});
			sessionStorage.setItem("user", JSON.stringify($scope.user));
			$timeout(function(){
				$location.path("/signup")
			}, 10);
		});
	}

	$scope.connectFacebook = function() {
		if (Parse.User.current() == null) {
			Parse.FacebookUtils.logIn("basic_info, email", {
				success: function(user) {
				    FB.api("/me",
				    function (response) {
				      	if (response && !response.error) {
				      		console.log(response)				      		;
					        user.set("email", response.email);
					        user.set("firstName", response.first_name);
					        user.set("lastName", response.last_name);
					        user.set("fid", response.id);
					        user.save(null, {
				        		success: function(user){
					        		$rootScope.currentUser = user;
									$.cookie("current", true, { expires: 14});
					        		$timeout(function(){
					        			$location.path("/home");
					        		}, 500);
				        		},
				        		error: function(user, error){
				        			console.log(error);
				        		}
				        	});
				    	}
				    });
				},
				error: function(user, error) {

				}
			});
		}
	}

	$scope.connectTwitter = function() {

	}
}]);

ctrls.controller('SignUpCtrl', ['$scope', '$location', '$rootScope', 'loadingService', 'profitAppService', 'futureUser', '$timeout', function($scope, $location, $rootScope, loadingService, profitAppService, futureUser, $timeout) {
	$scope.user = futureUser;

	var signUp = function() {
	}

	$scope.createAccount = function() {
		profitAppService.signUp($scope.user, function(user){
			$rootScope.currentUser = user;
			$.cookie("current", true, { expires: 14});
			sessionStorage.removeItem("user");
			$timeout(function(){
				$location.path("/home");
			}, 10);
		}, function(user, error){
			console.log("Error: " + error.code + " " + error.message);
		})
	}
}]);

// ctrls.controller('ListCtrl', ['$scope', '$location', '$rootScope', 'loadingService', 'items', function($scope, $location, $rootScope, loadingService, items) {

// 	$scope.items = items;
// }]);

ctrls.controller('DetailCtrl', ['$scope', '$location', '$rootScope', 'loadingService', 'item', function($scope, $location, $rootScope, loadingService, item) {
	console.log(item);
	$scope.item = item;
}]);

ctrls.controller('SettingsCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);
ctrls.controller('ExportCtrl', ['$scope', '$location', '$rootScope', 'loadingService', function($scope, $location, $rootScope, loadingService) {

}]);
ctrls.controller('EditCtrl', ['$scope', '$location', '$rootScope', 'ngProgress', 'item', 'profitAppService', 'groups', function($scope, $location, $rootScope, ngProgress, item, profitAppService, groups) {
	var pictureSource = navigator.camera.PictureSourceType;
 	var destinationType = navigator.camera.DestinationType;

 	$scope.file = null;
 	$scope.picInProgress = false;
 	$scope.attachmentChanged = false;

	$scope.entry = item;
	$scope.groups = groups;

	$scope.updateEntry = function(){
 		if($scope.picInProgress) return;
 		if($scope.attachmentChanged){
 			$scope.entry.attachment = $scope.file;
 		}
		profitAppService.updateEntry($scope.entry, $scope.attachmentChanged, function(data){
			$scope._go("home", false);
		}, function(error){
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
		}, function(error) {
			console.log(error)
		});
		$scope.file = file;
		$scope.attachmentChanged = true;
		ngProgress.complete();
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
}]);
