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
    
    
    var varLoginInfo = mongoose.model('LoginInfo', LoginInfoSchema, 'LoginInfo');

    module.exports = {
        LoginInfo : varLoginInfo
    };