'use strict';


if (window.opener)  {
    window.opener.location.reload();
    window.close();
}

var votingApp = angular.module('cloneterestApp', [
    'ngRoute',
    'cloneControllers',
    'cloneServices'
]);

votingApp.config(['$routeProvider',
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
        otherwise({
            redirectTo: '/all-pics'
        });
    }]);
