var mongoose = require('mongoose');


var ReportUserSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    ReportUserId: { type : String , required : true },
    ReportCategory: { type : String , required : true },
    ReportText: { type : String , required : true },
    Date: { type : String , required : true },
    ActiveStates : String
    }, 
    { timestamps: true }
);

var ReportPostSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostType: { type : String , required : true },
    PostId: { type : String , required : true },
    PostUserId: { type : String , required : true },
    ReportCategory: { type : String , required : true },
    ReportText: { type : String , required : true },
    Date: { type : String , required : true },
    ActiveStates : String
    }, 
    { timestamps: true }
);


var ReportSecondLevelPostSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostId: { type : String , required : true },
    SecondLevelPostType:{ type : String , required : true },
    SecondLevelPostId:{ type : String , required : true },
    SecondLevelPostUserId:{ type : String , required : true },
    ReportCategory: { type : String , required : true },
    ReportText: { type : String , required : true },
    Date: { type : String , required : true },
    ActiveStates : String
    }, 
    { timestamps: true }
);


var varReportUser = mongoose.model('ReportUser', ReportUserSchema, 'ReportUser');

var varReportPost = mongoose.model('ReportPost', ReportPostSchema, 'ReportPost');

var varReportSecondLevelPost = mongoose.model('ReportSecondLevelPost', ReportSecondLevelPostSchema, 'ReportSecondLevelPost');


module.exports = {
    ReportUser : varReportUser,
    ReportPost : varReportPost,
    ReportSecondLevelPost : varReportSecondLevelPost
};