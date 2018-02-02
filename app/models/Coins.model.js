var mongoose = require('mongoose');

   var CoinSchema = mongoose.Schema({
        Name: { type : String },
        Symbol: { type : String },
        CoinName: { type : String },
        FullName: { type : String },
        Algorithm: { type : String },
        ProofType: { type : String },
        TotalCoinSupply: { type : String },
        SortOrder: { type : String },
        ImageUrl: { type : String },
        StartDate: { type : String },
        CryptocompareId: { type : String}
        }, 
        { timestamps: true }
    );
    
    
    var varCoins = mongoose.model('Coins', CoinSchema, 'Coins');

    module.exports = {
        Coins : varCoins
    };