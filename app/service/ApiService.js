'use strict';

var path = process.cwd();
var UserPic = require(path + '/app/models/UserPic.js');
var StarredPic = require(path + '/app/models/StarredPic.js');
var OAuth = require('oauth');
var qs = require("qs");

function ApiService () {

    var populateImages = function(filters, images, starredImagesIds) {

        return UserPic.find(filters).exec()
            .then(function calculateLinkedPictures(pics) {
                pics.forEach(function(elem) {

                    var picInfo = {creator: elem.creator,
                        title: elem.title,
                        url: elem.title,
                        description: elem.description,
                        _id: elem._id,
                        isLinked: starredImagesIds[elem._id.toString()]
                    };
                    images.push(picInfo);
                });
            })
            .catch(function (err) {
                throw err;
            });
    };

    var handlePicturesRequest = function(filters, req, res) {
        var userData = req.session.userData;
        var starredPicsIds = {};
        var pics = [];

        if (userData && userData.userName) {
            StarredPic.find({user_name: userData.userName}).exec().then(function mapStarredIds(starredPics) {
                starredPics.forEach(function(element) {
                    starredPicsIds[element.pic.toString()] = true;
                });
                populateImages({}, pics, starredPicsIds).then(function() {
                    return res.json(pics);
                });

            }).catch(function (err) {
                console.log(err);
                return res.json(500, {});
            });
        }
        else {
            populateImages({}, pics, starredPicsIds).then(function() {
                return res.json(pics);
            });
        }
    };

    this.listAllPics = function (req, res) {
        var filters = {};
        handlePicturesRequest(filters, req, res);
    };

    this.listMyPics = function (req, res) {
        var filters = {creator: req.session.userData.userName};
        handlePicturesRequest(filters, req, res);
    };

    this.listPicsForUser = function (req, res) {
        var filters = {creator: req.params.userName};
        handlePicturesRequest(filters, req, res);
    };

    this.deletePic = function(req, res) {
        var filters = {creator: req.session.userData.userName, _id: req.params.selectedPic};
        UserPic.findOneAndRemove(filters, function(err, pic) {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }
            return res.json(pic);
        });
    };

    this.linkPic = function(req, res) {
        var starredPic = new StarredPic({
            user_name: req.session.userData.userName,
            pic: req.params.selectedPic
        });

        starredPic.save(function(err, starred) {
            if (err) {
                console.log(err);
                return res.json(500, {});
            }
            return res.json(starred);
        });
    };

    this.unlinkPic = function(req, res) {
        var filters = {user_name: req.session.userData.userName, pic: req.params.selectedPic};
        StarredPic.findOneAndRemove(filters, function(err, pic) {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }
            return res.json(pic);
        });
    };

    this.savePic = function(req, res) {

        //TOOD remove hardcoded values
        var pic = new UserPic({
            creator: req.session.userData.userName,
            title: req.body.title,
            url: '/public/img/placeholder.png', //TODO
            description: 'someDescription' //TODO
        });


        pic.save(function(err, userPic) {
            if (err) {
                console.log(err);
                return res.json(500, {});
            }
            return res.json(userPic);
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