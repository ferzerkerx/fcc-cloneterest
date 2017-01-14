'use strict';


var cloneControllers = angular.module('cloneControllers', []);

cloneControllers.controller('allPicsController', ['$scope', '$route', '$window','$location', 'cloneService',
    function ($scope, $route, $window, $location, cloneService) {

        var listPics = function() {
            cloneService.listPics().then(function(data) {
                $scope.pics = data;
            });
        };

        listPics();

    }]);

cloneControllers.controller('myPicsController', ['$scope', '$route', '$window','$location', 'cloneService',
    function ($scope, $route, $window, $location, cloneService) {

        var listMyPics = function() {
            cloneService.listMyPics().then(function(data) {
                $scope.pics = data;
            });
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
                // $('#picsModal').modal('hide');
                location.reload();
            });
        };


        var resetForm = function() {
            $scope.form =  {
                title: '',
                url: ''
            }
        };

        $scope.postRender = function() {
            initializeMasonry();
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

function initializeMasonry() {
    var elem = document.querySelector('.grid');
    var msnry = new Masonry( elem, {
        // options
        itemSelector: '.grid-item',
        columnWidth: 200
    });
}