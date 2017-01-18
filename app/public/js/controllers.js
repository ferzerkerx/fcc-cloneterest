'use strict';

function initializeMasonry() {
    var elem = document.querySelector('.grid');
    if (!elem) {
        return;
    }
    new Masonry( elem, {
        itemSelector: '.grid-item',
        columnWidth: 200
    });
}

var cloneControllers = angular.module('cloneControllers', []);

cloneControllers.controller('allPicsController', ['$scope', '$route', '$window','$location', 'cloneService',
    function ($scope, $route, $window, $location, cloneService) {

        var listPics = function() {
            cloneService.listPics().then(function(data) {
                $scope.pics = data;
            });
            $scope.shouldShowDeleteLink = false;
        };

        listPics();

    }]);


cloneControllers.controller('userPicsController', ['$scope', '$route', '$window','$location', '$routeParams' ,'cloneService',
    function ($scope, $route, $window, $location, $routeParams, cloneService) {

        var listPics = function(userName) {
            cloneService.listPicsForUser(userName).then(function(data) {
                $scope.pics = data;
            });
            $scope.shouldShowDeleteLink = false;
        };

        listPics($routeParams.userName);

    }]);

cloneControllers.controller('myPicsController', ['$scope', '$route', '$window','$location', 'cloneService',
    function ($scope, $route, $window, $location, cloneService) {

        var listMyPics = function() {
            cloneService.listMyPics().then(function(data) {
                $scope.pics = data;
            });
            $scope.shouldShowDeleteLink = true;
        };

        $scope.showPicDialog = function() {
            $('#picsModal').modal('show');
        };

        $scope.savePicture = function() {
            //TODO validate form data

            var data = {
                title : $scope.form.title,
                url : $scope.form.url
            };
            cloneService.savePicture(data).then(function(data) {
                $('#picsModal').modal('hide');
                location.reload();
            });
        };


        var resetForm = function() {
            $scope.form =  {
                title: '',
                url: ''
            }
        };

        $scope.deletePic = function(pic) {
            var shouldDeletePicture = $window.confirm("Are you sure you want to delete:"  + pic.title + "?");
            if (shouldDeletePicture === true) {
                cloneService.deletePicture(pic._id).then(function() {
                    $route.reload();
                });
            }
        };

        resetForm();
        listMyPics();
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


cloneControllers.controller('footerController', ['$rootScope','cloneService',
    function ($rootScope, cloneService) {
        $rootScope.postRender = (function(){
            initializeMasonry();
        });

        $rootScope.linkToPic = function(pic) {
            cloneService.linkToPicture(pic._id).then(function() {

            });
        };

        $rootScope.unlinkPic = function(pic) {
            cloneService.unlinkPic(pic._id).then(function() {

            });
        };

    }]);