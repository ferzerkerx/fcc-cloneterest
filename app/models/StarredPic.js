'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var StarredPic = new Schema({
    user_name: String,
    pic: ObjectId
});

module.exports = mongoose.model('StarredPic', StarredPic);

