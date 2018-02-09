var mongoose = require('mongoose');

var UserTypeSchema = mongoose.Schema({
    UserName: { type : String , required : true, },
    UserEmail:{ type : String , unique : true, required : true,  },
    UserPassword: { type : String },
    UserCategoryId:{ type : String , required : true},
    UserCategoryName:{ type : String , required : true},
    ProviderType: String,
    ProviderId:String,
    UserImage:String,
    UserCompany:String,
    UserProfession:String,
    UserDateOfBirth:String,
    UserGender:String,
    UserCountry:Array,
    UserState:Array,
    UserCity:Array
    }, 
    { timestamps: true }
);


var varUserType = mongoose.model('UserType', UserTypeSchema, 'Users');


module.exports = {
    UserType : varUserType
};