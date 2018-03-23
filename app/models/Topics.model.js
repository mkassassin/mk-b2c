var mongoose = require('mongoose');

var TopicsTypeSchema = mongoose.Schema({
    UserId:{ type : String, required : true},
    TopicName: { type : String , unique : true, required : true },
    TopicDescription:{ type : String},
    TopicImage:String,
    Date: Date
    }, 
    { timestamps: true }
);


var varTopicsType = mongoose.model('TopicsType', TopicsTypeSchema, 'Topics');


module.exports = {
    TopicsType : varTopicsType
};