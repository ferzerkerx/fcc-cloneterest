'use strict';


var cloneControllers = angular.module('cloneControllers', []);

cloneControllers.controller('allPicsController', ['$scope', '$route', '$window','$location', 'cloneService',
    function ($scope, $route, $window, $location, cloneService) {

        var listPolls = function() {
            cloneService.listPics().then(function(data) {
                $scope.pics = data;
            });
        };

        listPolls();

    }]);

cloneControllers.controller('myPicsController', ['$scope', '$route', '$window','$location', 'cloneService',
    function ($scope, $route, $window, $location, cloneService) {

        var listMyPolls = function() {
            cloneService.listMyPics().then(function(data) {
                $scope.polls = data;
            });
        };


        listMyPolls();
    }]);



cloneControllers.controller('barController', ['$scope', '$rootScope', '$route', '$routeParams' ,'$window','$location', 'cloneService',
    function ($scope, $rootScope, $route, $routeParams , $window, $location, cloneService) {

        $rootScope.userDetails = {};
        $scope.twitterLogin = function() {
            cloneService.doLogin().then(function(data) {
                window.open(data.location,  "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
            });
        };

        $scope.twitterLogout = function() {
            cloneService.doLogout().then(function() {
                $rootScope.userDetails = {};
                $location.path('/');
            });
        };

        cloneService.userDetails().then(function(data) {
            $rootScope.userDetails = data;
        });

    }]);