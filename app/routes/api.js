'use strict';

var path = process.cwd();
var ApiService = require(path + '/app/service/ApiService.js');

module.exports = function (app) {

    var apiService = new ApiService();

    app.route('/api/all-pics')
        .get(apiService.listAllPics);

    app.route('/api/my-pics')
        .get(apiService.listMyPics);

    app.route('/api/pic')
        .post(apiService.savePic);

    app.route('/api/pic/:selectedPic')
        .delete(apiService.deletePic);

    app.route('/api/link-pic/:selectedPic')
        .post(apiService.linkPic);

    app.route('/api/link-pic/:selectedPic')
        .delete(apiService.unlinkPic);

    app.route('/api/userDetails')
        .get(apiService.userDetails);

    app.route('/api/twitter/requestLogin')
        .post(apiService.twitterRequestLogin);

    app.route('/api/twitter/callback')
        .get(apiService.twitterCallback);

    app.route('/api/logout')
        .get(apiService.doLogout);

};