var HighlightsPostModel = require('../models/HighlightsPost.model.js');
var UserModel = require('../models/SignInSignUp.model.js');
var FollowModel = require('../models/Follow.model.js');

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

exports.Submit = function(req, res) {
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " User Id can not be Empty! "});
    }
    if(!req.body.PostType) {
        res.status(400).send({status:"False", message: " Post Type can not be Empty! "});
    }
    if(!req.body.PostDate) {
        res.status(400).send({status:"False", message: " Post Date can not be Empty! "});
    }

    var varHighlightsPostType = new HighlightsPostModel.HighlightsPostType({
            UserId: req.body.UserId,
            PostType: req.body.PostType,
            PostDate: req.body.PostDate,
            PostText: req.body.PostText || '',
            PostLink: req.body.PostLink || '',
            PostImage: req.body.PostImage || '',
            PostVideo: req.body.PostVideo || '',
            ActiveStates: 'Active'
    });

     
    varHighlightsPostType.save(function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Submit The Post."});
            
        } else {
            res.send({status:"True", data: result });
        }
    });
};



exports.GetPostList = function(req, res) {
    var SkipCoun = 0;
    SkipCoun = parseInt(req.params.Limit) * 10;
    console.log(SkipCoun);
    HighlightsPostModel.HighlightsPostType.find({}, {} , {sort:{createdAt : -1}, skip: SkipCoun, limit: 10  }, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Following Users ."});
        } else {
            if(result.length > 0){
                var PostsArray = new Array();
                GetUserData();
                async function GetUserData(){
                    for (let info of result) {
                        await getUserInfo(info);
                     }
                    res.send({status:"True", data: PostsArray });
                  }
                  
                  function getUserInfo(info){
                    return new Promise(( resolve, reject )=>{
                        UserModel.UserType.findOne({'_id': info.UserId }, usersProjection, function(err, UserData) {
                            if(err) {
                                res.send({status:"Fale", Error:err });
                                reject(err);
                            } else {
                                if(UserData.length !== null){
                                    FollowModel.FollowUserType.count({'UserId': UserData._id}, function(newerr, count) {
                                        if(newerr){
                                            res.send({status:"Fale", Error:newerr });
                                            reject(err);
                                        }else{
                                            var newArray = [];
                                            newArray.push( {
                                                            _id: UserData._id,
                                                            UserName: UserData.UserName,
                                                            UserCategoryId: UserData.UserCategoryId,
                                                            UserCategoryName: UserData.UserCategoryName,
                                                            UserImage: UserData.UserImage,
                                                            UserCompany: UserData.UserCompany,
                                                            UserProfession: UserData.UserProfession,
                                                            Followers:count,
                                                            PostType: info.PostType,
                                                            PostDate: info.PostDate,
                                                            PostText: info.PostText ,
                                                            PostLink: info.PostLink,
                                                            PostImage: info.PostImage,
                                                            PostVideo: info.PostVideo
                                                        }
                                            );
                                            PostsArray.push(newArray[0]);
                                            resolve(UserData);
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
            res.send({status:"True", message:'No More Posts' });
            }
        }
    });
};