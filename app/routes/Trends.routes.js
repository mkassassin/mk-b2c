module.exports = function(app) {

    var Trends = require('../controllers/Trends.controller.js');

    app.get('/API/Trends/CoinsList', Trends.CoinsList);

    app.post('/API/Trends/ImpressionAdd', Trends.ImpressionAdd);

    app.get('/API/Trends/ImpressionPosts/:CoinId', Trends.ImpressionPosts);

    app.get('/API/Trends/ChartInfo/:CoinCode', Trends.ChartInfo);

    app.post('/API/Trends/PredictionAdd', Trends.PredictionAdd);

    app.get('/API/Trends/GetPrediction/:CoinId/:UserId', Trends.GetPrediction);

}