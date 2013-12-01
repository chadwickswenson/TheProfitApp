'use strict';

var components = angular.module('WellNestAdminConsoleApp.directives', [])

$.validator.addMethod("greaterThan", function(value, element, params) {
    if (!/Invalid|NaN/.test(new Date(value))) {
        return new Date(value) > new Date($(element).parents("form").find(params).val());
    }
    return isNaN(value) && isNaN($(elem).find(params).val())
        || (Number(value) > Number($(elem).find(params).val()));
},'Must be after the start date.');

$.validator.addMethod("clientselect", function(value, element, arg){
    return arg != value;
}, "Please select a client.");

$.validator.addMethod('customphone', function (value, element) {
    return this.optional(element) || normalizePhone(value).valid;
}, "Please enter a valid US phone number");

$.validator.addMethod("planselect", function(value, element, arg){
    return arg != value;
}, "Please select an insurance plan.");

$.validator.addMethod("categoryselect", function(value, element, arg){
    return arg != value;
}, "Please select a category.");

var arrowLeft = {banners:485, activities: 380, dashboard: 173, messages: 589, users: 280, plans:800, benefits:695};

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

components.directive('tooltipChart', function(){
        return {
                restrict: 'A',
                link: function(scope, elem, attrs){
                        $(elem).tooltip({
                            delay: { show: 10, hide: 50 }
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

var validator;


