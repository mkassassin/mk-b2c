var mongoose = require('mongoose');

var UserTypeSchema = mongoose.Schema({
    UserName: { type : String , required : true, },
    UserEmail:{ type : String , unique : true, required : true,  },
    UserPassword: { type : String },
    UserCategoryId:{ type : String , required : true},
    UserCategoryName:{ type : String , required : true},
    UserEmailVerifyToken: String,
    ProviderType: String,
    ProviderId:String,
    UserImage:String,
    UserCompany:String,
    UserProfession:String,
    UserDateOfBirth:String,
    UserGender:String,
    UserCountry:Array,
    UserState:Array,
    UserCity:Array,
    ShowEmail:String,
    ShowDOB:String,
    ShowLocation:String,
    Privacy_Update_Checked:String
    }, 
    { timestamps: true }
);

var ScheduleSchema = mongoose.Schema({
    DateTime: { type : String , required : true },
    ScheduleType: { type : String , required : true },
    Error: { type : Array },
    ErrorStage: { type : String },
    Success: { type : Array }
    }, 
    { timestamps: true }
);

var AndroidVersionSchema = mongoose.Schema({
    DateTime: { type : String , },
    Version: { type : Number , },
    }, 
    { timestamps: true }
);

var varUserType = mongoose.model('UserType', UserTypeSchema, 'Users');

var varScheduleHistory = mongoose.model('ScheduleHistory', ScheduleSchema, 'ScheduleHistory');

var varAndroidVersion = mongoose.model('AndroidVersion', AndroidVersionSchema, 'AndroidVersion');

module.exports = {
    UserType : varUserType,
    ScheduleHistory : varScheduleHistory,
    AndroidVersion : varAndroidVersion
};