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
                                                PostDocumnet: result.PostDocumnet || '',
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


exports.Category4TopicPostUpdate = function(req, res) {
    if(!req.body._id) {
        res.status(400).send({status:"False", message: " Id can not be Empty! "});
    }
    if(!req.body.PostType) {
        res.status(400).send({status:"False", message: " Post Type can not be Empty! "});
    }
    if(!req.body.PostDate) {
        res.status(400).send({status:"False", message: " Post Date can not be Empty! "});
    }

    if(req.body.PostLink !== '') {
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
        Category4Model.Category4TopicPost.findOne({'_id': req.body._id }, {},  function(err, data) {
            if(err) {
                res.send({status:"False", Error:err });
            } else {
                data.PostDate = req.body.PostDate;
                data.PostText = req.body.PostText || '';
                data.PostLink = req.body.PostLink || '';
                data.PostLinkInfo = LinkInfo;
                data.PostDocumnet = req.body.PostDocumnet || '',
                data.PostImage = req.body.PostImage || '';
                data.PostVideo = req.body.PostVideo || '';
                data.save(function (newerr, newresult) {
                    if (newerr){
                        res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update Post ."});
                    }else{
                        res.send({status:"True", data: newresult });
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
        if (err) {
            res.status(500).send({ status: "False", message: "Some error occurred while Find Following Users ." });
        } else {
            const GetUserData = (result) =>
                Promise.all(
                    result.map(info => getPostInfo(info) )
                ).then( result =>{ 
                    res.send({ status: "True", data: result }) 
                }
                ).catch(err => res.send({ status: "False", Error: err }));


            const getPostInfo = info =>
                Promise.all([
                    UserModel.UserType.findOne({ '_id': info.UserId }, usersProjection).exec(),
                    FollowModel.FollowUserType.count({ 'FollowingUserId': info.UserId }).exec(),
                    LikeAndRating.Category4TopicPostRating.count({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                    LikeAndRating.Category4TopicPostRating.find({ 'UserId': req.params.UserId, 'PostId': info._id, 'PostUserId': info.UserId, 'ActiveStates': 'Active' }).exec(),
                    CommentModel.Category4TopicComment.count({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                    CommentModel.Category4TopicComment.find({'UserId':req.params.UserId, 'PostId': info._id , 'ActiveStates':'Active' }).exec(),
                    LikeAndRating.Category4TopicPostRating.find({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                    SharePosts.SharePost.count({'PostType': 'Highlights', 'SharePostFrom': 'Categor4TopicPost', PostId: info._id }).exec(),
                    SharePosts.SharePost.find({'PostType': 'Highlights', 'SharePostFrom': 'Categor4TopicPost', PostId: info._id, UserId: req.params.UserId  }).exec(),
                ]).then(data => {
                    var UserData = data[0];
                    var followCount = data[1];
                    var ratingCount = data[2];
                    var userRate = data[3];
                    var CommentCount = data[4];
                    var CommantData = data[5];
                    var RatingList = data[6];
                    var ShareCount = data[7];
                    var UserShared = data[8];
                    

                    var RatingCal = 0 ;

                    if (UserData !== null ) {
                        return RatingCountFonction();
                            async function RatingCountFonction(){
                                for (let rateInfo of RatingList) {
                                    await getRatingInfo(rateInfo);
                                }
                                    var userRated = false;
                                    var userRating = 0 ;
                                        if(userRate.length > 0){
                                            userRated = true;
                                            userRating = userRate[0].Rating;
                                            
                                        }else{
                                            userRated = false;
                                            userRating = 0;
                                        }

                                    var alreadyCommentuser = true;
                                        if(CommantData.length <= 0 ){
                                            alreadyCommentuser = false;
                                        }else{
                                            alreadyCommentuser = true;
                                        }  

                                    var alreadyShared = true;
                                        if(UserShared.length <= 0 ){
                                            alreadyShared = false;
                                        }else{
                                            alreadyShared = true;
                                        } 

                                    var result = {
                                        _id: info._id,
                                        UserId: UserData._id,
                                        UserName: UserData.UserName,
                                        UserCategoryId: UserData.UserCategoryId,
                                        UserCategoryName: UserData.UserCategoryName,
                                        UserImage: UserData.UserImage,
                                        UserCompany: UserData.UserCompany,
                                        UserProfession: UserData.UserProfession,
                                        Followers:followCount,
                                        PostType: info.PostType,
                                        PostDate: info.PostDate,
                                        PostText: info.PostText ,
                                        PostLink: info.PostLink,
                                        PostDocumnet: info.PostDocumnet,
                                        PostLinkInfo: info.PostLinkInfo || '',
                                        PostImage: info.PostImage,
                                        PostVideo: info.PostVideo,
                                        Shared: info.Shared || '',
                                        ShareUserName: info.ShareUserName,
                                        ShareUserId: info.ShareUserId,
                                        SharePostId: info.SharePostId,
                                        RatingCount: JSON.parse(RatingCal),
                                        userRated: userRated,
                                        userRating: userRating,
                                        UserCommented: alreadyCommentuser,
                                        comments: [],
                                        commentsCount : CommentCount,
                                        ShareCount: ShareCount,
                                        UserShared: alreadyShared,
                                    };
                                return result;
                            }
                      }
                      

                      function getRatingInfo(rateInfo){
                        return new Promise(( resolve, reject ) => {
                            LikeAndRating.Category4TopicPostRating.findOne({ '_id': rateInfo._id}, function(Rateerr, RateData) {
                                if(Rateerr) {
                                    res.send({status:"False", Error:Rateerr });
                                    reject(Rateerr);
                                } else {
                                    RatingCal += JSON.parse(RateData.Rating);
                                    resolve(RateData);
                                }
                            });
                        });
                    }

                }).catch(error => {
                    console.log(error);
                });

             GetUserData(result);

        }
    });
};


