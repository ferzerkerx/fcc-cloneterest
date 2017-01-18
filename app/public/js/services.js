
'use strict';

var cloneServices = angular.module('cloneServices', ['ngResource']);

cloneServices.factory('cloneService', ['$http', '$location',
    function($http, $location) {

        var appContext = $location.absUrl();
        if (appContext.indexOf("#")) {
            appContext =  appContext.substring(0, appContext.indexOf("#") - 1);
        }

        var listPics = function() {
            var url = appContext + '/api/all-pics';
            return $http.get(url).then(function (response) {
                return response.data;
            });
        };

        var listPicsForUser = function(userName) {
            var url = appContext + '/api/pics/' + userName;
            return $http.get(url).then(function (response) {
                return response.data;
            });
        };

        var savePicture = function(data) {
            var url = appContext + '/api/pic';
            return $http.post(url, data).then(function (response) {
                return response.data;
            });
        };

        var listMyPics = function() {
            var url = appContext + '/api/my-pics';
            return $http.get(url).then(function (response) {
                return response.data;
            });
        };

        var doLogin = function() {
            var url = appContext + '/api/twitter/requestLogin';
            return $http.post(url).then(function (response) {
                return response.data;
            });
        };

        var doLogout = function() {
            var url = appContext + '/api/logout';
            return $http.get(url).then(function (response) {
                return response.data;
            });
        };

        var userDetails = function() {
            var url = appContext + '/api/userDetails';
            return $http.get(url).then(function (response) {
                return response.data;
            });
        };

        var deletePicture = function(picId) {
            var url = appContext + '/api/pic/' + picId;
            return $http.delete(url).then(function (response) {
                return response.data;
            });
        };

        var linkToPicture =  function(picId) {
            var url = appContext + '/api/link-pic/' + picId;
            return $http.post(url).then(function (response) {
                return response.data;
            });
        };

        var unlinkPic = function(picId) {
            var url = appContext + '/api/link-pic/' + picId;
            return $http.delete(url).then(function (response) {
                return response.data;
            });
        };

        return {
            listPics: listPics,
            listPicsForUser: listPicsForUser,
            savePicture: savePicture,
            listMyPics: listMyPics,
            doLogin: doLogin,
            doLogout: doLogout,
            userDetails: userDetails,
            deletePicture: deletePicture,
            linkToPicture: linkToPicture,
            unlinkPic: unlinkPic
        };
    }]);

