var mongoose = require('mongoose');

var TopicsTypeSchema = mongoose.Schema({
    TopicName: { type : String , unique : true, required : true, },
    TopicDescription:{ type : String},
    TopicImage:String,
    }, 
    { timestamps: true }
);


var varTopicsType = mongoose.model('TopicsType', TopicsTypeSchema, 'Topics');


module.exports = {
    TopicsType : varTopicsType
};