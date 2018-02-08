var mongoose = require('mongoose');

   var PredictionSchema = mongoose.Schema({
        CoinId: { type : String },
        CoinCode: { type : String },
        CoinName: { type : String },
        UserId: { type : String },
        Value: { type : String },
        Time: { type : String }
        }, 
        { timestamps: true }
    );
    
    
    var varPrediction = mongoose.model('Prediction', PredictionSchema, 'Prediction');

    module.exports = {
        Prediction : varPrediction
    };