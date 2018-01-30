var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const path = require('path');

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
//set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors({
    origin: 'http://localhost:4200'
}));


app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

// app.use(express.static(__dirname + '/view/dist/'));


// app.get('/', (req, res) => {
//     res.send(path.join(__dirname + '/view/dist/index.html'));
// });

app.get('/', function(req, res){
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});


require('./app/routes/SignInSignUp.routes.js')(app);

require('./app/routes/Follow.routes.js')(app);

require('./app/routes/Topics.routes.js')(app);

require('./app/routes/HighlightsPost.routes.js')(app);
app.listen(3000, function(){
    console.log("Server is listening on port 3000");
});