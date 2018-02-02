var mongoose = require('mongoose');

var ImpressionsSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    CoinId: { type : String , required : true },
    PostText: { type : String , required : true },
    PostDate: { type : String , required : true },
    ActiveStates : String
    }, 
    { timestamps: true }
);


var varImpressions = mongoose.model('Impressions', ImpressionsSchema, 'Impressions');


module.exports = {
    Impressions : varImpressions
};