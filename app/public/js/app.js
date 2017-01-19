'use strict';

 if (window.opener)  {
     setTimeout(function(){
         window.opener.location.reload();
     },100);
     window.close();
 }

var cloneterestApp = angular.module('cloneterestApp', [
    'ngRoute',
    'cloneControllers',
    'cloneServices'
]);

cloneterestApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/my-pics', {
            templateUrl: 'public/partials/my-pics.html',
            controller: 'myPicsController'
        }).
        when('/all-pics', {
            templateUrl: 'public/partials/all-pics.html',
            controller: 'allPicsController'
        }).
        when('/pics/:userName', {
            templateUrl: 'public/partials/user-pics.html',
            controller: 'userPicsController'
        }).
        otherwise({
            redirectTo: '/all-pics'
        });
    }]);
