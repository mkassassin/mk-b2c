var mongoose = require('mongoose');

   var LoginInfoSchema = mongoose.Schema({
        UserId: { type : String },
        IpInfo: { type : Object },
        DeviceInfo: { type : Object },
        UtcTime: { type: Date },
        ActiveStates: String
        }, 
        { timestamps: true }
    );

    var AndroidAppInfoSchema = mongoose.Schema({
        UserId: { type : String },
        FirebaseToken: { type : Object },
        DeviceInfo: { type : Object },
        UtcTime: { type: Date },
        ActiveStates: String
        }, 
        { timestamps: true }
    );
    
    
    var varLoginInfo = mongoose.model('LoginInfo', LoginInfoSchema, 'LoginInfo');

    var varAndroidAppInfo = mongoose.model('AndroidAppInfo', AndroidAppInfoSchema, 'AndroidAppInfo');

    module.exports = {
        LoginInfo : varLoginInfo,
        AndroidAppInfo: varAndroidAppInfo
    };