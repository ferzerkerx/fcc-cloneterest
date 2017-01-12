'use strict';

var path = process.cwd();
var UserPic = require(path + '/app/models/UserPic.js');
var OAuth = require('oauth');
var qs = require("qs");

function ApiService () {

    this.listAllPics = function (req, res) {

        //TOOD remove hardcoded values
        // var pic = new UserPic({
        //     creator: 'someUSer',
        //     title: 'someTitle',
        //     url: '/public/img/placeholder.png',
        //     description: 'someDescription'
        // });
        //
        //
        // pic.save(function(err, userPics) {
        // });


        UserPic.find({}, function(err, userPics){
            if (err) {
                console.log(err);
                return res.json(500, {});
            }
            return res.json(userPics);
        });
    };

    this.listMyPics = function (req, res) {

        UserPic.find({creator: req.session.userData.userName}, function(err, userPics){
            if (err) {
                console.log(err);
                return res.json(500, {});
            }
            return res.json(userPics);
        });
    };



    this.userDetails = function(req, res) {
        var session = req.session;
        var userDetails = {
            name: undefined,
            isLogged: false
        };
        if (session.hasOwnProperty('userData')) {
            userDetails.isLogged = true;
            userDetails.name = session.userData.name;
            userDetails.username = session.userData.userName;
        }
        return res.json(userDetails);

    };

    var twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
    var twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
    var oauth = new OAuth.OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        twitterConsumerKey,
        twitterConsumerSecret,
        '1.0A',
        process.env.APP_URL + '/api/twitter/callback',
        'HMAC-SHA1'
    );


    this.twitterRequestLogin = function (req, res) {
        oauth.getOAuthRequestToken(function(err, oauth_token, oauth_token_secret){
            req.session.oauth_token_secret = oauth_token_secret;
            res.json({'location': 'https://api.twitter.com/oauth/authenticate?oauth_token=' + oauth_token});
        });
    };

    this.twitterCallback = function(req, res) {
        var urlParams = req.url.substring(req.url.indexOf('?') + 1);
        var urlComponents = qs.parse(urlParams);
        var oauth_token = urlComponents.oauth_token;
        var oauth_verifier = urlComponents.oauth_verifier;

        var getOAuthRequestTokenCallback = function (err, oAuthAccessToken,
                                                     oAuthAccessTokenSecret) {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json',
                oAuthAccessToken,
                oAuthAccessTokenSecret,
                function (err, twitterResponseData) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json(err);
                    }

                    var parsedData = JSON.parse(twitterResponseData);
                    req.session.userData = {name: parsedData.name, userName: parsedData.screen_name};

                    return res.redirect('/');
                });
        };

        oauth.getOAuthAccessToken(oauth_token, req.session.oauth_token_secret, oauth_verifier,
            getOAuthRequestTokenCallback);

    };

    this.doLogout = function(req, res) {
        req.session.destroy();
        return res.json({status: 'ok'});
    };
}

module.exports = ApiService;