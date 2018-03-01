var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var axios = require("axios");

var dbConfig = require('./app/config/database.config.js');
var mongoose = require('mongoose');

mongoose.connect(dbConfig.url);
mongoose.connection.on('error', function(err) { console.log(err);
    process.exit();
});
mongoose.connection.once('open', function() { console.log("Successfully connected to the database");
});


var app = express();

//create a cors middleware
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(cors());


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

require('./app/routes/Search.routes.js')(app);

require('./app/routes/SignInSignUp.routes.js')(app);

require('./app/routes/Follow.routes.js')(app);

require('./app/routes/Topics.routes.js')(app);

require('./app/routes/HighlightsPost.routes.js')(app);

require('./app/routes/QuestionsPost.routes.js')(app);

require('./app/routes/FileUpload.routes.js')(app);

require('./app/routes/LikeAndRating.routes.js')(app);

require('./app/routes/CommentAndAnswer.routes.js')(app);

require('./app/routes/Trends.routes.js')(app);

require('./app/routes/profile.routes.js')(app);

require('./app/routes/ReportAndDelete.routes.js')(app);

app.use('/static', express.static('uploads'))

app.use(express.static(__dirname + '/view/dist/'));


app.use(function(req, res) {
    res.sendFile(path.join(__dirname, '/view/dist', 'index.html'));
});


var port = process.env.PORT || 3000;

var server = app.listen(port, function(){
  console.log('Listening on port ' + port);
});
