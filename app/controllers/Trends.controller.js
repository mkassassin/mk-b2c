var CoinsModel = require('../models/Coins.model.js');
var TrendsModel = require('../models/Trends.model.js');
var UserModel = require('../models/SignInSignUp.model.js');
var FollowModel = require('../models/Follow.model.js');
var PredictionModel = require('../models/Prediction.model.js')
var axios = require("axios");
var moment = require("moment");


var usersProjection = { 
    __v: false,
    UserEmail: false,
    UserPassword: false,
    UserCountry: false,
    UserState: false,
    UserCity: false,
    UserEmailVerifyToken: false,
    UserDateOfBirth: false,
    UserGender: false,
    createdAt: false,
    updatedAt: false,
};


exports.CoinsList = function(req, res) {
    CoinsModel.Coins.find({}, 'Name Symbol CoinName FullName SortOrder ImageUrl StartDate' , {skip: 0 , limit: 10}, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error:err,  message: "Some error occurred while Get The Coins."});
        } else {

            var CoinsArray = new Array();
            GetUserData();
            async function GetUserData(){
                for (let info of result) {
                    await getUserInfo(info);
                 }
                 res.send({ status:"True", data: CoinsArray });
              }
              
              function getUserInfo(info){
                return new Promise(( resolve, reject )=>{
                    axios.get('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + info.Name + '&tsyms=USD')
                        .then(response => {
                                var newArray = [];
                                    newArray.push( {
                                        CoinId: info._id,
                                        Name: info.Name,
                                        Code: info.Symbol,
                                        FullName: info.CoinName,
                                        SortOrder: info.SortOrder,
                                        ImageUrl: info.ImageUrl,
                                        Rate: response.data['DISPLAY'][info.Name]['USD'].PRICE,
                                        Open: response.data['DISPLAY'][info.Name]['USD'].OPEN24HOUR,
                                        High: response.data['DISPLAY'][info.Name]['USD'].HIGH24HOUR,
                                        Low: response.data['DISPLAY'][info.Name]['USD'].LOW24HOUR,
                                        TimeStamp: new Date()
                                        }
                                    );
                                    
                            CoinsArray.push(newArray[0]);
                            resolve(newArray[0]);

                        })
                        .catch(error => {
                            reject(error);
                        });
                });
              }
        }
    });
};


exports.ImpressionAdd = function(req, res) {
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " User Id can not be Empty! "});
    }
    if(!req.body.PostText) {
        res.status(400).send({status:"False", message: " Post Text can not be Empty! "});
    }
    if(!req.body.CoinId) {
        res.status(400).send({status:"False", message: " CoinId can not be Empty! "});
    }
    if(!req.body.PostDate) {
        res.status(400).send({status:"False", message: " PostDate can not be Empty! "});
    }

    var varImpressions = new TrendsModel.Impressions({
            UserId: req.body.UserId,
            PostDate: req.body.PostDate,
            PostText: req.body.PostText,
            CoinId: req.body.CoinId,
            ActiveStates: 'Active'
    });

     
    varImpressions.save(function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Submit The Impression Post."});    
        } else {
            UserModel.UserType.findOne({'_id': result.UserId }, usersProjection, function(err, UserData) {
                if(err) {
                    res.send({status:"False", Error:err });
                } else {
                    FollowModel.FollowUserType.count({'UserId': UserData._id}, function(newerr, count) {
                        if(newerr){
                            res.send({status:"False", Error:newerr });
                        }else{
                            var newArray = [];
                            newArray.push( {
                                            _id: result._id,
                                            UserId: UserData._id,
                                            UserName: UserData.UserName,
                                            UserCategoryId: UserData.UserCategoryId,
                                            UserCategoryName: UserData.UserCategoryName,
                                            UserImage: UserData.UserImage,
                                            UserCompany: UserData.UserCompany,
                                            UserProfession: UserData.UserProfession,
                                            AlreadyFollow: false,
                                            Followers: count,
                                            PostDate: result.PostDate,
                                            PostText: result.PostText
                                        }
                            );
                            res.send({status:"True", data: newArray[0] });
                        }
                    });
                 }
            });
        }
    });
};


exports.ImpressionPosts = function(req, res) {
    TrendsModel.Impressions.find({'CoinId': req.params.CoinId, 'ActiveStates': 'Active' }, {} , {sort:{createdAt : -1}}, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Comments ."});
        } else {
            if(result.length > 0){
                var ImpressionsArray = new Array();
                GetUserData();
                async function GetUserData(){
                    for (let info of result) {
                        await getUserInfo(info);
                     }
                    res.send({status:"True", data: ImpressionsArray });
                  }
                  
                  function getUserInfo(info){
                    return new Promise(( resolve, reject )=>{
                        UserModel.UserType.findOne({'_id': info.UserId }, usersProjection, function(err, UserData) {
                            if(err) {
                                res.send({status:"False", Error:err });
                                reject(err);
                            } else {
                                if(UserData.length !== null){
                                    FollowModel.FollowUserType.count({'UserId': UserData._id}, function(newerr, count) {
                                        if(newerr){
                                            res.send({status:"False", Error:newerr });
                                            reject(err);
                                        }else{
                                            FollowModel.FollowUserType.find({'UserId': req.params.UserId, 'FollowingUserId': UserData._id }, function(dataerr, FollowesData) { 
                                                if(dataerr){
                                                    res.send({status:"False", Error:dataerr });
                                                    reject(err);
                                                }else{
                                                    var alreadyfollowuser = true;
                                                    if(FollowesData.length <= 0 && req.params.UserId != UserData._id){
                                                        alreadyfollowuser = false;
                                                    }else{
                                                        alreadyfollowuser = true;
                                                    }
                                                    var newArray = [];
                                                    newArray.push( {
                                                                    UserId: UserData._id,
                                                                    UserName: UserData.UserName,
                                                                    UserCategoryId: UserData.UserCategoryId,
                                                                    UserCategoryName: UserData.UserCategoryName,
                                                                    UserImage: UserData.UserImage,
                                                                    UserCompany: UserData.UserCompany,
                                                                    UserProfession: UserData.UserProfession,
                                                                    AlreadyFollow: alreadyfollowuser,
                                                                    Followers:count,
                                                                    _id: info._id,
                                                                    PostText: info.PostText,
                                                                    PostDate: info.PostDate,
                                                                    CoinId: req.params.CoinId,
                                                                }
                                                    );
                                                    ImpressionsArray.push(newArray[0]);
                                                    resolve(UserData);
                                                }
                                            });
                                        }
                                    });
                                }else{
                                    resolve(UserData);
                                }
                            }
                        });
                    });
                  };
            }else{
            res.send({status:"True", message:'No More Impressions' });
            }
        }
    });
};


exports.ChartInfo = function(req, res) {
    axios.get('https://min-api.cryptocompare.com/data/histominute?fsym='+ req.params.CoinCode +'&tsym=USD&limit=12&aggregate=60')
        .then(response => {
            const Result = response['data'].Data;

            var DateArray = new Array();
            var ValueArray = new Array();
            GetDateArray();
            async function GetDateArray(){
                for (let info of Result) {
                    await GetDateInfo(info);
                 }
                    var newArray = [];
                    newArray.push( {
                        Dates: DateArray,
                        Values: [{data: ValueArray, label: req.params.CoinCode}]
                        }
                    );
                res.send({status:"True", data:newArray[0]});
            }
              
            function GetDateInfo(info){
                return new Promise(( resolve, reject )=>{
                    var time = moment.unix(info.time).format("h:mm a");
                    DateArray.push(time);
                    ValueArray.push(info.close);
                    resolve(time);
                });
              }


        })
        .catch(error => {
            res.send({ status:"False", Error: error });
    });
};


exports.PredictionAdd = function(req, res) {
    if(!req.body.CoinId) {
        res.status(400).send({status:"False", message: " Coin Id can not be Empty! "});
    }
    if(!req.body.CoinCode) {
        res.status(400).send({status:"False", message: " CoinCode can not be Empty! "});
    }
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " User Id can not be Empty! "});
    }
    if(!req.body.Value) {
        res.status(400).send({status:"False", message: " Prediction Value can not be Empty! "});
    }

    console.log(new Date());

    var varPrediction = new PredictionModel.Prediction({
            CoinId: req.body.CoinId,
            CoinCode: req.body.CoinCode,
            CoinName: req.body.CoinName,
            UserId: req.body.UserId,
            Value: req.body.Value,
            Time: new Date()
    });

    varPrediction.save(function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Submit The Prediction Add ."});
            
        } else {
            res.send({status:"True", data: result });
        }
    });
};




exports.GetPrediction = function(req, res) {
    var NewDate = new Date();
    NewDate.setHours(NewDate.getHours() - 6);

    PredictionModel.Prediction.find({'CoinId': req.params.CoinId, 'createdAt': { $gt: NewDate } }, {} , {}, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error:err, message: "Some error occurred while Find Comments ."});
        } else {
            PredictionModel.Prediction.count({'CoinId': req.params.CoinId, 'createdAt': { $gt: NewDate }  }, function(newerr, count) {
                if(newerr) {
                    res.status(500).send({status:"False", Error:newerr, message: "Some error occurred while Find Comments ."});
                } else {
                    PredictionModel.Prediction.find({'CoinId': req.params.CoinId, 'createdAt': { $gt: NewDate }, 'UserId': req.params.UserId  }, function(FindErr, findUser) {
                        if(FindErr) {
                            res.status(500).send({status:"False", Error:FindErr, message: "Some error occurred while Find Comments."});
                        } else {
                            var UserValue = 0;
                            var UserRated = false;
                                if( findUser.length > 0){
                                    UserRated = true;
                                    UserValue = findUser[0].Value;
                                }else{
                                    UserRated = false;
                                    UserValue = 0;
                                }
                            var TotalValue = 0 ;
                                GetPredictionData();
                                async function GetPredictionData(){
                                    for (let info of result) {
                                        await getPredictionInfo(info);
                                    }
                                    var FinalResult = 0; 
                                    FinalResult = JSON.parse(TotalValue) / JSON.parse(count);
                                    var newArray = [];
                                        newArray.push( {
                                                        Prediction: FinalResult,
                                                        UsersCount: count,
                                                        UserDone: UserRated,
                                                        UserPrediction: UserValue,
                                                        Date: new Date
                                                    } );
                                    res.send({status:"True", data: newArray[0] });
                                }

                                function getPredictionInfo(info){
                                    return new Promise(( resolve, reject )=>{
                                        TotalValue += JSON.parse(info.Value);
                                        resolve(info);
                                    });
                                }
                        }
                    });
                }
            })
            
        }
    });
};