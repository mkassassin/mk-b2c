var mongoose = require('mongoose');

var VideoFileUploadSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    FileName: { type : String , required : true },
    ActiveStates :String
    }, 
    { timestamps: true }
);

var ImageFileUploadSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    FileName: { type : String , required : true },
    ActiveStates :String
    }, 
    { timestamps: true }
);

var varVideoFile = mongoose.model('VideoFile', VideoFileUploadSchema, 'Videos');
var varImageFile = mongoose.model('ImageFile', ImageFileUploadSchema, 'Images');

module.exports = {
    VideoFile : varVideoFile,
    ImageFile : varImageFile
};