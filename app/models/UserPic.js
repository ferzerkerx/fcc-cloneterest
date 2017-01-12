'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserPic = new Schema({
    creator: String,
    title: String,
    url: String,
    description: String
});

module.exports = mongoose.model('UserPic', UserPic);