var FollowModel = require('../models/Follow.model.js');
var UserModel = require('../models/SignInSignUp.model.js');
var TopicsModel = require('../models/Topics.model.js');

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

    FollowModel.FollowUserType.find({UserId: req.body.UserId, FollowingUserId:req.body.FollowingUserId }, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error:err,  message: "Some error occurred while Follow Details Add. "});
        } else {
            if(result.length > 0 ){
                res.send({ status:"True", message: "This User Already Followed By User."})
            }else{
                varFollowUserType.save(function(err, result) {
                    if(err) {
                        res.status(500).send({status:"False", message: "Some error occurred while creating the Account.", Error : err});
                        
                    } else {
                        res.send({status:"True", data: result });
                    }
                });
            }  
        }
    });


};

exports.UnFollowUser = function(req, res) {
    if(!req.params.FollowUserDBid){
        res.status(500).send({status:"False", message: "Follow User DB Id Is Missing!"});
    }
        FollowModel.FollowUserType.remove({_id: req.params.FollowUserDBid}, function(err, result) {
            if(err) {
                res.status(500).send({status:"False", Error:err, message: "Could not Delete UserFollow Info"});
            } else {
                res.send({ status:"True", data: result, message: "User Follow Info Deleted Successfully!"})
            }
        });
};

exports.FollowingUsers = function(req, res) {
    FollowModel.FollowUserType.find({'UserId': req.params.UserId , 'ActiveStates': 'Active' }, '_id FollowingUserId' , {sort:{createdAt : -1}, skip: 0 }, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Following Users ."});
        } else {
            if(result.length > 0){
                var FollowersArray = new Array();
                GetFollowesData();
                async function GetFollowesData(){
                    for (let info of result) {
                        await getfollowData(info);
                     }
                    res.send({status:"True", data: FollowersArray });
                  }
                  
                  function getfollowData(info){
                    return new Promise(( resolve, reject )=>{
                        UserModel.UserType.findOne({'_id': info.FollowingUserId }, usersProjection, function(err, FollowesData) {
                            if(err) {
                                res.send({status:"Fale", Error:err });
                                reject(err);
                            } else {
                                if(FollowesData.length !== null){
                                    FollowModel.FollowUserType.count({'UserId': FollowesData._id , 'ActiveStates': 'Active' }, function(newerr, count) {
                                        if(newerr){
                                            res.send({status:"Fale", Error:newerr });
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
                                }else{
                                    resolve(FollowesData);
                                }
                            }
                        });
                    });
                  };
        
            }else{
            res.send({status:"True", message:'No Followeing Users In This User', data: result });
            }
        }
    });
};

exports.UnFollowingUsers = function(req, res) {
    UserModel.UserType.find({'_id': { $ne: req.params.UserId }, 'UserCategoryId':req.params.UserCategoryId }, usersProjection, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Find Following Users."});
        } else {
            if(result.length > 0){
                var UnFollowersArray = new Array() ;
                GetUnFollowesData();
                async function GetUnFollowesData(){
                    for (let info of result) {
                        await getUnfollowData(info);
                     }
                    res.send({status:"True", data: UnFollowersArray });
                  }
                  
                  function getUnfollowData(info){
                    return new Promise(( resolve, reject )=>{
                        FollowModel.FollowUserType.find({'UserId': req.params.UserId, 'FollowingUserId': info._id }, function(err, FollowesData) {
                            if(err) {
                                res.send({status:"Fale", Error:err });
                                reject(err);
                            } else {
                                if(FollowesData.length > 0){
                                    resolve(FollowesData);
                                }
                                else{
                                    FollowModel.FollowUserType.count({'UserId': info._id , 'ActiveStates': 'Active' }, function(newerr, count) {
                                        if(newerr){
                                            res.send({status:"Fale", Error:newerr });
                                            reject(newerr);
                                        }else{
                                            var newArray = [];
                                            newArray.push( {
                                                            _id: info._id,
                                                            UserName: info.UserName,
                                                            UserCategoryId: info.UserCategoryId,
                                                            UserCategoryName: info.UserCategoryName,
                                                            UserImage: info.UserImage,
                                                            UserCompany: info.UserCompany,
                                                            UserProfession: info.UserProfession,
                                                            Followers:count
                                                        }
                                            );
                                            UnFollowersArray.push(newArray[0]);
                                            resolve(info);
                                        }
                                    });
                                }
                            }
                        });
                    });
                  };
        
            }else{
            res.send({status:"True", message:'No Un Followeing Users In This User', data: result });
            }
        }
    });
};

exports.UserFollowingUsers = function(req, res) {
    FollowModel.FollowUserType.find({'FollowingUserId': req.params.UserId , 'ActiveStates': 'Active' }, '_id UserId FollowingUserId' , {sort:{createdAt : -1}, skip: 0 }, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Following Users ."});
        } else {
            if(result.length > 0){
                var FollowersArray = new Array();
                GetFollowingUserData();
                async function GetFollowingUserData(){
                    for (let info of result) {
                        await getfollowingData(info);
                     }
                    res.send({status:"True", data: FollowersArray });
                  }
                  
                  function getfollowingData(info){
                    return new Promise(( resolve, reject )=>{
                        UserModel.UserType.findOne({'_id': info.UserId }, usersProjection, function(err, FollowesData) {
                            if(err) {
                                res.send({status:"Fale", Error:err });
                                reject(err);
                            } else {
                                if(FollowesData.length !== null){
                                    FollowModel.FollowUserType.count({'UserId': FollowesData._id , 'ActiveStates': 'Active' }, function(newerr, count) {
                                        if(newerr){
                                            res.send({status:"Fale", Error:newerr });
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
                                }else{
                                    resolve(FollowesData); 
                                }
                                
                            }
                        });
                    });
                  };
        
            }else{
            res.send({status:"True", message:'No Followeing Users In This User', data: result });
            }
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

    FollowModel.FollowTopicType.find({UserId:req.body.UserId, FollowingTopicId:req.body.FollowingTopicId }, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error:err,  message: "Some error occurred while Follow The Topic "});
        } else {
            if(result.length > 0 ){
                res.send({ status:"False", message: "This Topic Already Followed By User."})
            }else{
                varFollowTopicType.save(function(err, data) {
                    if(err) {
                        res.status(500).send({status:"False", Error:err, message: "Some error occurred while creating the Account."});
                        
                    } else {
                        res.send({status:"True", data: data });
                    }
                });
            }
        }
    });

};

exports.UnFollowTopic = function(req, res) {
    if(!req.params.FollowTopicDBid){
        res.status(500).send({status:"False", message: "Follow Topic DB Id Is Missing!"});
    }
    FollowModel.FollowTopicType.remove({_id: req.params.FollowTopicDBid}, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error:err,  message: "Some error occurred while UnFollow The Topic "});
        } else {
            res.send({ status:"True", data: result, message: "Topic Follow Info Deleted Successfully!"})
        }
    });
};

exports.FollowingTopics = function(req, res) {
    FollowModel.FollowTopicType.find({'UserId': req.params.UserId , 'ActiveStates': 'Active' }, '_id UserId FollowingTopicId' , {sort:{createdAt : -1}, skip: 0 }, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Following Topics." , Error:err});
        } else {
            if(result.length > 0){
                var FollowingTopicsArray = new Array();
                GetFollowesData();
                async function GetFollowesData(){
                    for (let info of result) {
                        await getTopicData(info);
                     }
                    res.send({status:"True", data: FollowingTopicsArray });
                  }
                  
                  function getTopicData(info){
                    return new Promise((resolve, reject )=>{
                        TopicsModel.TopicsType.findOne({'_id': info.FollowingTopicId }, function(err, FollowesData) {
                            if(err) {
                                res.send({status:"Fale", Error:err });
                                reject(err);
                            } else {
                                if(FollowesData.length !== null){
                                    FollowModel.FollowTopicType.count({'FollowingTopicId': FollowesData._id }, function(newerr, count) {
                                        if(newerr){
                                            res.send({status:"Fale", Error:newerr });
                                            reject(newerr);
                                        }else{
                                            var newArray = [];
                                            newArray.push( {
                                                            _id: FollowesData._id,
                                                            TopicName: FollowesData.TopicName,
                                                            TopicImage: FollowesData.TopicImage,
                                                            Followers:count
                                                        }
                                            );
                                            FollowingTopicsArray.push(newArray[0]);
                                            resolve(FollowesData);
                                        }
                                    }); 
                                }else{
                                    resolve(FollowesData);
                                }
                                
                            }
                        });
                    });
                  };
        
            }else{
                res.send({status:"True", message:'No Followeing Topics In This User', data:result });
            }
        }
    });
};

exports.UnFollowingTopics = function(req, res) {
    TopicsModel.TopicsType.find({}, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Find Un Followed Topics."});
        } else { 
            if(result.length > 0){
                var UnFollowingArray = new Array();
                GetUnFollowesData();
                async function GetUnFollowesData(){
                    for (let info of result) {
                        await getData(info);
                     }
                    res.send({status:"True", data: UnFollowingArray });
                  }
                  
                  function getData(info, i){
                    return new Promise(( resolve, reject )=>{
                        FollowModel.FollowTopicType.find({'UserId': req.params.UserId, 'FollowingTopicId': info._id }, function(err, FollowesData) {
                            if(err) {
                                res.send({status:"Fale", Error:err });
                                reject(err);
                            } else {
                                if(FollowesData.length > 0){
                                    resolve(FollowesData);
                                }
                                else{
                                    FollowModel.FollowTopicType.count({'FollowingTopicId': info._id , 'ActiveStates': 'Active' }, function(newerr, count) {
                                        if(newerr){
                                            res.send({status:"Fale", Error:newerr });
                                            reject(newerr);
                                        }else{
                                            var newArray = [];
                                            newArray.push( {
                                                            _id: info._id,
                                                            TopicName: info.TopicName,
                                                            TopicImage: info.TopicImage,
                                                            Followers:count
                                                        }
                                            );
                                            UnFollowingArray.push(newArray[0]);
                                            resolve(FollowesData);
                                        }
                                    });
                                }
                            }
                        });
                    });
                  };
        
            }else{
            res.send({status:"True", message:'No Un Followeing Topics In This User', data:result});
            }
        }
    });
};