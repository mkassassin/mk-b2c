var FollowModel = require('../models/Follow.model.js');
var UserModel = require('../models/SignInSignUp.model.js');

var usersProjection = { 
    __v: false,
    UserEmail: false,
    UserPassword: false,
    UserCountry: false,
    UserState: false,
    UserCity: false,
    UserDateOfBirth: false,
    UserGender: false,
    createdAt: false,
    updatedAt: false,
};

exports.FollowUser = function(req, res) {
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " User Id can not be Empty! "});
    }
    if(!req.body.FollowingUserId){
        res.status(400).send({status:"False", message: " Following UserId can not be Empty! "});
    }

    var varFollowUserType = new FollowModel.FollowUserType({
            UserId:  req.body.UserId,
            FollowingUserId: req.body.FollowingUserId,
            ActiveStates: 'Active',
    });

    varFollowUserType.save(function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while creating the Account.", Error : err});
            
        } else {
            res.send({status:"True", data: result });
        }
    });
};



exports.UnFollowUser = function(req, res) {
        FollowModel.FollowUserType.remove({_id: req.params.FollowUserDBid}, function(err, result) {
            if(err) {
                res.status(500).send({status:"False", message: "Could not Delete UserFollow Info with id " + req.params.FollowUserDBid});
            } else {
                res.send({ status:"True", data: result, message: "User Follow Info Deleted Successfully!"})
            }
        });
};


exports.FollowTopic = function(req, res) {
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " User Id can not be Empty! "});
    }
    if(!req.body.FollowingTopicId){
        res.status(400).send({status:"False", message: " Following TopicId can not be Empty! "});
    }

    var varFollowTopicType = new FollowModel.FollowTopicType({
            UserId:  req.body.UserId,
            FollowingTopicId: req.body.FollowingTopicId,
            ActiveStates: 'Active',
    });

    varFollowTopicType.save(function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while creating the Account."});
            
        } else {
            res.send({status:"True", data: result });
        }
    });
};


exports.UnFollowTopic = function(req, res) {
    FollowModel.FollowTopicType.remove({_id: req.params.FollowTopicDBid}, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Could not Delete Topic Follow Info with id " + req.params.FollowTopicDBid});
        } else {
            res.send({ status:"True", data: result, message: "Topic Follow Info Deleted Successfully!"})
        }
    });
};


exports.FollowingUsers = function(req, res) {
    FollowModel.FollowUserType.find({'UserId': req.params.UserId , 'ActiveStates': 'Active' }, '_id FollowingUserId' , {sort:{createdAt : -1}, skip: 0, limit: 10 }, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Following Users ."});
        } else {
            if(result.length > 0){
                var FollowersArray = new Array();
                GetFollowesData();
                async function GetFollowesData(){
                    for (let info of result) {
                        await getData(info);
                     }
                    res.send({status:"True", data: FollowersArray });
                  }
                  
                  function getData(info){
                    return new Promise(( resolve, reject )=>{
                        UserModel.UserType.findOne({'_id': info.FollowingUserId }, usersProjection, function(err, FollowesData) {
                            if(err) {
                                reject(err);
                            } else {
                                FollowModel.FollowUserType.count({'UserId': FollowesData._id , 'ActiveStates': 'Active' }, function(newerr, count) {
                                    if(newerr){
                                        reject(err);
                                    }else{
                                        var newArray = [];
                                        newArray.push( {
                                                        _id: FollowesData._id,
                                                        UserName: FollowesData.UserName,
                                                        UserCategoryId: FollowesData.UserCategoryId,
                                                        UserCategoryName: FollowesData.UserCategoryName,
                                                        UserImage: FollowesData.UserImage,
                                                        UserCompany: FollowesData.UserCompany,
                                                        UserProfession: FollowesData.UserProfession,
                                                        Followers:count
                                                    }
                                        );
                                        FollowersArray.push(newArray[0]);
                                        resolve(FollowesData);
                                    }
                                });
                                
                                
                            }
                        });
                    });
                  };
        
            }else{
            res.send({status:"False", message:'No Followeing Users In This User', data: result });
            }
        }
    });
};





exports.UnFollowingUsers = function(req, res) {
    UserModel.UserType.find({'_id': { $ne: req.params.UserId } }, usersProjection, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Find Following Users."});
        } else { 
            if(result.length > 0){
                var UnFollowersArray = result;
                GetUnFollowesData();
                async function GetUnFollowesData(){
                    for (i=0; i < result.length; ++i) {
                        var rowIndex = i;
                        await getData(result[i], i);
                    }
                    res.send({status:"True", data: UnFollowersArray });
                  }
                  
                  function getData(info, i){
                    return new Promise(( resolve, reject )=>{
                        FollowModel.FollowUserType.findOne({'UserId': req.params.UserId, 'FollowingUserId': info._id }, function(err, FollowesData) {
                            if(err) {
                                reject(err);
                            } else {
                                if(FollowesData !== null){
                                    UnFollowersArray.splice(i, 1); 
                                    resolve(FollowesData);
                                }
                                else{
                                    resolve('');
                                }
                            }
                        });
                    });
                  };
        
            }else{
            res.send({status:"False", message:'No Un Followeing Users In This User', data: result });
            }
        }
    });
};