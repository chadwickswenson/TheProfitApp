'use strict';

var components = angular.module('DatAppProfit.directives', [])

components.directive('loadingPanel', function(){	
	return {		
		restrict: 'E',		
		templateUrl: 'views/partials/loadingPanel.html',
		link: function(scope, elem, attrs) {			
		}		
	};
}); 

components.directive('tooltip', function(){
        return {
                restrict: 'A',
                link: function(scope, elem, attrs){
                        $(elem).tooltip({
                            template: '<div class="tooltip"><div class="tooltip-arrow tooltip-arrow-chad"></div><div class="tooltip-inner tooltip-inner-chad"></div></div>'
                        });
                }
        }

});

components.directive('timeAgo', function($timeout){
        return {
                restrict: 'A',
                link: function(scope, elem, attrs){
                    $timeout(function(){
                        $(elem).timeago();
                    });
                }
        }

});

components.directive('addClick', function(){
        return {
                restrict: 'A',
                link: function(scope, elem, attrs){
                       /* $(elem).click(function(){
                            $(this).animate({ width:50, height:50, top:-10}, 200,
                                function(){
                                    $(this).animate({ width:25, height:25, top:0}, 100);
                                }
                            )
                        });*/
                        
                }
        }

});

components.directive('leftMenuClick', function(){
        return {
                restrict: 'A',
                link: function(scope, elem, attrs){
                    $(".left-menu-bg").hide();
                    $(".menu-button").click(function(){
                        var w = $( window ).width();
                        if($(".left-menu").css('left') != '0px'){
                                $(".left-menu").animate({ left:'0px'}, 300, 'easeOutQuart');
                                $(".left-menu-bg").fadeIn(280);
                                //$(".left-menu").css('left', 0);
                                //$(".left-menu-bg").css('display', 'inline-block');
                        }
                    
                    });
                    $(".left-menu-bg").click(function(){
                        var w = $( window ).width();
                        $(".left-menu").animate({ left:'-'+w}, 300, 'easeInQuart');
                        $(".left-menu-bg").fadeOut(280);
                        // $(".left-menu").css('left', -800);
                        // $(".left-menu-bg").css('display', 'none');
                    });    
                }
        }

});

components.directive('sizeViews', function(){
        return {
                restrict: 'A',
                link: function(scope, elem, attrs){
                    
                    var is_safari = navigator.userAgent.indexOf("Safari") > -1;
                    var topPadding = 0px;

                    if(is_safari){
                        topPadding = 30px;
                    }
                    
                    var w = $(window).height();
                }
        }

});

components.directive('entryTypeToggle', function(){
        return {
                restrict: 'A',
                link: function(scope, elem, attrs){
                    $(elem).click(function(){
                        if($(elem).html() == 'expense'){
                           $(elem).html('income');    
                        }
                        else{
                           $(elem).html('expense');      
                        }
                    });
                        
                }
        }
});
function normalizePhone(phone) {
    phone = phone.replace(/[^\d]/g, "");
    if (phone.length == 10) {
        return {valid: true, phone: phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")};
    } else if(phone.length == 11) {
        return {valid: true, phone: phone.substring(1, 11).replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")};
    }

    return {valid: false, phone: ""};
}

components.directive('homeItem', function($timeout) {
        return {
                restrict: 'E',
                scope:{
                        name: '@',
                        amount: '@'                       
                },
                templateUrl: 'views/partials/homeItem.html',
                link: function(scope, elem, attrs) {
                    $(".left-menu").css({"left": 0 - $(window).width(), "display": "inline-block"});
                    $(".years-bg").hide();
                    $timeout(function(){
                        $(".nav-title").click(function(){
                            if($(".years-menu").css('top') != '72px'){
                                $(".years-bg").fadeIn(280);
                                $(".years-menu").animate({ top:'72px'}, 300, 'easeOutQuart');

                            }
                            else{
                                $(".years-menu").animate({ top:'-510px'}, 300, 'easeInQuart');
                                $(".years-bg").fadeOut(280);
                            }
                        });

                        //home view swipe
                        $(elem).swipe({
                            swipeRight: function(event, direction, distance, duration, fingerCount){
                                $(".left-menu").animate({ left:'0px'}, 300, 'easeOutQuart');
                                $(".left-menu-bg").fadeIn(280);
                            },
                            threshold: 50
                        });

                        $(".left-menu-bg").click(function(){
                            $(".left-menu").animate({ left:'-' + w + 'px'}, 300, 'easeOutQuart');
                            $(".left-menu-bg").fadeOut(280);
                        });

                        $.each([$(".left-menu-bg"), $(".left-menu")], function(i, e){
                            e.swipe({
                                swipeLeft: function(event, direction, distance, duration, fingerCount){
                                    var w = $(window).width();
                                    $(".left-menu").animate({ left:'-' + w + 'px'}, 300, 'easeOutQuart');
                                    $(".left-menu-bg").fadeOut(280);
                                },
                                threshold: 50
                            });
                        });

                        $(".years-bg").click(function(){
                            $(".years-menu").animate({ top:'-510px'}, 300, 'easeInQuart');
                            $(".years-bg").fadeOut(280);
                        });

                        $(".years-bg").swipe({
                            swipeUp: function(event, direction, distance, duration, fingerCount){
                                $(".years-menu").animate({ top:'-510px'}, 300, 'easeInQuart');
                                $(".years-bg").fadeOut(280);
                            },
                            threshold: 50
                        });
                    });
                }
        }
});

components.directive('tagItem', function($timeout) {
        return {
                restrict: 'E',
                scope:{
                        name: '@',
                        amount: '@',
                        color: '@',
                        click: '&'
                },
                templateUrl: 'views/partials/tagItem.html',
                link: function(scope, elem, attrs) {

                }
        }
});
components.directive('calcItem', function($timeout) {
        return {
                restrict: 'E',
                scope:{
                        name: '@',
                        amount: '@',
                        color: '@',
                        click: '&'
                },
                templateUrl: 'views/partials/calcItem.html',
                link: function(scope, elem, attrs) {

                }
        }
});
components.directive('listItem', function($timeout) {
        return {
                restrict: 'E',
                scope:{
                        name: '@',
                        value: '@',
                        tag: '@',
                        desc: '@',
                        date: '@',
                        attachment: '@',
                        id: '@',
                        click: '&'
                },
                templateUrl: 'views/partials/listItem.html',
                link: function(scope, elem, attrs) {

                }
        }
});

components.directive('detailPart', function($timeout) {
        return {
                restrict: 'E',
                scope:{
                        name: '@',
                        value: '@',
                        group: '@',
                        desc: '@',
                        date: '@',
                        attachment: '@'                   
                },
                templateUrl: 'views/partials/detailPart.html',
                link: function(scope, elem, attrs) {

                }
        }
});

