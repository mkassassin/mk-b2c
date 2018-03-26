var multer = require('multer');
var Category4Model = require('../models/Category4.model.js');
var UserModel = require('../models/SignInSignUp.model.js');
var FollowModel = require('../models/Follow.model.js');
var LikeAndRating = require('../models/LikeAndRating.model.js');
var CommentModel = require('../models/CommentAndAnswer.model.js');
var SharePosts = require('../models/SharePost.model.js');
var moment = require("moment");
var axios = require("axios");

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

exports.Category4TopicNameValidate = function(req, res) {
    Category4Model.Category4TopicsType.findOne({'TopicName': req.params.name}, function(err, data) {
        if(err) {
            res.status(500).send({status:"False", Error:err,  message: "Some error occurred while Validate The Name."});
        } else {
            if(data === null){
                res.send({ status:"True", available: "True", message: "( " + req.params.name + " ) This Name is Available." });
            }else{
                res.send({ status:"True", available: "False", message: "( " + req.params.name + " ) This Name is Already Exist. " });
            } 
        }
    });
};



var Ctegory4TopicsStore = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './uploads/category-4-topics');
    },
    filename:function(req, file, cb){
        var ext = file.originalname.substring(file.originalname.indexOf('.'));
        cb(null, Date.now() + ext);
    }
});

var Ctegory4CreateTopics = multer({storage:Ctegory4TopicsStore}).single('file');

exports.Ctegory4TopicCreate = function(req, res) {
    Ctegory4CreateTopics(req, res, function(uploaderr){

        if(uploaderr){
            res.status(500).send({status:"False", Error:uploaderr});
        }else{
            if(!req.body.TopicName) {
                res.status(400).send({status:"False", message: "Topic Name can not be Empty! "});
            }
            if(!req.body.UserId) {
                res.status(400).send({status:"False", message: " User Id can not be Empty! "});
            }
            if(!req.file.filename){
                res.status(400).send({status:"False", message: " File can not be Empty! "});
            }

            var varCategory4TopicsTopics = new Category4Model.Category4TopicsType({
                UserId: req.body.UserId,
                TopicName:  req.body.TopicName,
                TopicDescription: req.body.TopicDescription || "",
                TopicImage: req.file.filename,
                Date: new Date()
            });
            
            varCategory4TopicsTopics.save(function(err, result) {
                if(err) {
                    res.status(500).send({status:"False", Error: err, message: "Some error occurred while creating the Topic."}); 
                } else {
                     res.send({status:"True", data: result });
                }
            });
        }
    });   
};



exports.AllCategory4Topics = function(req, res) {
    Category4Model.Category4TopicsType.find({}, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Following Topics." , Error:err});
        } else {
            var PostsCount = (result) =>
                Promise.all(
                    result.map(info => PostsInfo(info))
                ).then( finalresult => { 
                    res.send({ status: "True", data: finalresult }); 
                }).catch(someerr => res.send({ status: "False", Error: someerr }));


            
            var PostsInfo = info =>
                Promise.all([
                    Category4Model.Category4TopicPost.count({ 'TopicId': info._id, 'PostType': 'Snippet', 'ActiveStates': 'Active' }).exec(),
                    Category4Model.Category4TopicPost.count({ 'TopicId': info._id, 'PostType': 'Video', 'ActiveStates': 'Active' }).exec(),
                    Category4Model.Category4TopicPost.count({ 'TopicId': info._id, 'PostType': 'Article', 'ActiveStates': 'Active' }).exec(),
                    Category4Model.Category4TopicPost.count({ 'TopicId': info._id, 'PostType': 'Document', 'ActiveStates': 'Active' }).exec(),
                ]).then(data => {
                    var SnippetCount = data[0];
                    var VideoCount = data[1];
                    var ArticleCount = data[2];
                    var DocumentCount = data[3];

                    var dataresult = {
                        _id: info._id,
                        UserId: info.UserId,
                        TopicName: info.TopicName,
                        TopicDescription: info.TopicDescription,
                        TopicImage: info.TopicImage,
                        Date: info.Date,
                        SnippetCount: SnippetCount,
                        VideoCount: VideoCount,
                        ArticleCount: ArticleCount,
                        DocumentCount: DocumentCount
                    };
                    return dataresult;

            }).catch(error => {
                console.log(error);
            });
            
            PostsCount(result);
        }
    });
};





exports.Category4TopicPostSubmit = function(req, res) {
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " User Id can not be Empty! "});
    }
    if(!req.body.PostType) {
        res.status(400).send({status:"False", message: " Post Type can not be Empty! "});
    }
    if(!req.body.TopicId) {
        res.status(400).send({status:"False", message: "Topic Id can not be Empty! "});
    }



    if(req.body.PostLink && req.body.PostLink !== '') {
        var LinkInfo = '';
        var str = req.body.PostLink;
        var n = str.indexOf('http://www.youtube');
        var n1 = str.indexOf('https://www.youtube');
        var n2 = str.indexOf('https://youtu');

        if( n !== -1 || n1 !== -1 || n2 !== -1  ) {
            gotonext();
        }else{
            axios.get('http://api.linkpreview.net/?key=5a883a1e4c1cd65a5a1d19ec7011bb4a8ee7426a5cdcb&q='+ req.body.PostLink )
            .then(response => {
                 LinkInfo = response.data;
                gotonext();
            })
            .catch(error => {
                gotonext();
            });
        }

    }else{
        gotonext();
    }

    function gotonext() {
        var varCategory4TopicPost = new Category4Model.Category4TopicPost({
            UserId: req.body.UserId,
            TopicId: req.body.TopicId,
            PostType: req.body.PostType,
            PostDate: req.body.PostDate,
            PostText: req.body.PostText || '',
            PostLink: req.body.PostLink || '',
            PostLinkInfo: LinkInfo,
            PostDocumnet: req.body.PostDocumnet || '',
            PostImage: req.body.PostImage || '',
            PostVideo: req.body.PostVideo || '',
            ActiveStates: 'Active'
        });

     
        varCategory4TopicPost.save(function(err, result) {
            if(err) {
                res.status(500).send({status:"False", Error: err, message: "Some error occurred while Submit The Post."});    
            } else {
                UserModel.UserType.findOne({'_id': result.UserId }, usersProjection, function(err, UserData) {
                    if(err) {
                        res.send({status:"False", Error:err });
                    } else {
                        FollowModel.FollowUserType.count({'FollowingUserId': UserData._id}, function(newerr, count) {
                            if(newerr){
                                res.send({status:"False", Error:newerr });
                            }else{
                                var newArray = [];
                                newArray.push( {
                                                _id: result._id,
                                                UserId: UserData._id,
                                                TopicId: result.TopicId,
                                                UserName: UserData.UserName,
                                                UserCategoryId: UserData.UserCategoryId,
                                                UserCategoryName: UserData.UserCategoryName,
                                                UserImage: UserData.UserImage,
                                                UserCompany: UserData.UserCompany,
                                                UserProfession: UserData.UserProfession,
                                                Followers: count,
                                                PostType: result.PostType,
                                                PostDate: result.PostDate,
                                                timeAgo: moment(result.updatedAt).fromNow(),
                                                PostText: result.PostText ,
                                                PostLink: result.PostLink,
                                                PostLinkInfo: result.PostLinkInfo || '',
                                                PostDocumnet: result.PostDocumnet,
                                                PostImage: result.PostImage,
                                                PostVideo: result.PostVideo,
                                                Shared: result.Shared || '',
                                                ShareUserName: result.ShareUserName || '',
                                                ShareUserId: result.ShareUserId || '',
                                                SharePostId: result.SharePostId || '',
                                                RatingsCount: 0,
                                                UserRated: false,
                                                UserRatedId: '',
                                                ShareCount: 0,
                                                UserShared: false,
                                                comments: [],
                                                commentsCount: 0,
                                            });
                                    res.send({status:"True", data: newArray[0] });
                            }
                        });
                    }
                });
            }
        });
    }

};




exports.Category4TopicPostList = function(req, res) {
    var SkipCount = 0;
    SkipCount = parseInt(req.params.Limit);
    Category4Model.Category4TopicPost.find({'TopicId': req.params.TopicId, 'PostType': req.params.PostType, 'ActiveStates': 'Active' }, {} , {sort:{createdAt : -1}, skip: SkipCount, limit: 15  }, function(err, result) {
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
                    return new Promise(( resolve, reject ) => {
                        UserModel.UserType.findOne({'_id': info.UserId }, usersProjection, function(inerr, UserData) {
                            if(inerr) {
                                res.send({status:"False", Error:inerr });
                                reject(inerr);
                            } else {
                                if (UserData !== null ) {
                                    FollowModel.FollowUserType.count({'FollowingUserId': info.UserId }, function(newerr, count) {
                                        if(newerr){
                                            res.send({status:"False", Error:newerr });
                                            reject(newerr);
                                        }else{
                                            LikeAndRating.HighlightsLike.count({'PostId': info._id , 'ActiveStates':'Active' }, function(NewErr, NewCount) {
                                                if(NewErr){
                                                    res.send({status:"False", Error:NewErr });
                                                    reject(err);
                                                }else{
                                                    LikeAndRating.HighlightsLike.find({'UserId': req.params.UserId, 'PostId': info._id, 'PostUserId': info.UserId, 'ActiveStates':'Active' }, {}, function(someerr, newResult) {
                                                        if(someerr){
                                                            res.send({status:"False", Error:someerr });
                                                            reject(err);
                                                        }else{
                                                            var UserLiked = false;
                                                            var UserLikedId = '';
                                                            if(newResult.length > 0){
                                                                    UserLiked = true;
                                                                    UserLikedId = newResult[0]._id;
                                                            }else{
                                                                    UserLiked = false;
                                                                    UserLikedId = '';
                                                            }

                                                            CommentModel.HighlightsComment.count({'PostId': info._id , 'ActiveStates':'Active' }, function(commentErr, commentCount) {
                                                                if(commentErr){
                                                                    res.send({status:"False", Error:commentErr });
                                                                    reject(err);
                                                                }else{ 

                                                                    CommentModel.HighlightsComment.find({'UserId':req.params.UserId, 'PostId': info._id, 'ActiveStates':'Active'}, function(nowerr, CommantData) {
                                                                        if(nowerr){
                                                                            res.send({status:"False", Error:nowerr });
                                                                            reject(nowerr);
                                                                        }else{
                                                                            var alreadyCommentuser = true;
                                                                            if(CommantData.length <= 0 ){
                                                                                alreadyCommentuser = false;
                                                                            }else{
                                                                                alreadyCommentuser = true;
                                                                            }                                       
                                                                            SharePosts.SharePost.count({'PostType': 'Highlights', PostId: info._id }, function(Shareerr, Sharecount) {
                                                                                if(Shareerr){
                                                                                    res.send({status:"False", Error:Shareerr });
                                                                                    reject(Shareerr);
                                                                                }else{
                                                                                    SharePosts.SharePost.find({'PostType': 'Highlights', PostId: info._id, UserId: req.params.UserId }, function(Sharederr, Sharedcount) {
                                                                                        if(Sharederr){
                                                                                            res.send({status:"False", Error:Sharederr });
                                                                                            reject(Sharederr);
                                                                                        }else{
                                                                                            var alreadyShared = true;
                                                                                                if(Sharedcount.length <= 0 ){
                                                                                                    alreadyShared = false;
                                                                                                }else{
                                                                                                    alreadyShared = true;
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
                                                                                                            Followers:count,
                                                                                                            UserCommented: alreadyCommentuser,
                                                                                                            _id: info._id,
                                                                                                            PostType: info.PostType,
                                                                                                            PostDate: info.PostDate,
                                                                                                            timeAgo: moment(info.updatedAt).fromNow(),
                                                                                                            PostText: info.PostText ,
                                                                                                            PostLink: info.PostLink,
                                                                                                            PostLinkInfo: info.PostLinkInfo || '',
                                                                                                            PostImage: info.PostImage,
                                                                                                            PostVideo: info.PostVideo,
                                                                                                            Shared: info.Shared || '',
                                                                                                            ShareUserName: info.ShareUserName || '',
                                                                                                            ShareUserId: info.ShareUserId || '',
                                                                                                            SharePostId: info.SharePostId || '',
                                                                                                            LikesCount: NewCount,
                                                                                                            UserLiked: UserLiked,
                                                                                                            UserLikeId: UserLikedId,
                                                                                                            ShareCount: Sharecount,
                                                                                                            UserShared: alreadyShared,
                                                                                                            comments: [],
                                                                                                            commentsCount : commentCount
                                                                                                        }
                                                                                            );
                                                                                            PostsArray.push(newArray[0]);
                                                                                            resolve(UserData);
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });

                                                                }
                                                            });
                                                        }
                                                    });

                                                }
                                            });
                                        }
                                    });
                                } else { 
                                    resolve(info);
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
