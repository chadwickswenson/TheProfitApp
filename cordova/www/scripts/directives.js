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
components.directive('addClick', function(){
        return {
                restrict: 'A',
                link: function(scope, elem, attrs){
                        $(elem).click(function(){
                            $(this).animate({ width:70, height:70}, 500, 'easeOutElastic',
                                function(){
                                    $(this).animate({ width:50, height:50}, 200, 'easeOutElastic');
                                }
                            )
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

                }
        }
});

components.directive('tagItem', function($timeout) {
        return {
                restrict: 'E',
                scope:{
                        name: '@',
                        amount: '@',
                        color: '@'                    
                },
                templateUrl: 'views/partials/tagItem.html',
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
                        attachment: '@'                   
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
                        attachment: '@'                   
                },
                templateUrl: 'views/partials/detailPart.html',
                link: function(scope, elem, attrs) {

                }
        }
});

