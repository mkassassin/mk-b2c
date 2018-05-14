var HighlightsPostModel = require('../models/HighlightsPost.model.js');
var UserModel = require('../models/SignInSignUp.model.js');
var FollowModel = require('../models/Follow.model.js');
var LikeAndRating = require('../models/LikeAndRating.model.js');
var CommentModel = require('../models/CommentAndAnswer.model.js');
var NotificationModel = require('../models/Notificatio.model.js');
var SharePosts = require('../models/SharePost.model.js');
var Category4Model = require('../models/Category4.model.js');
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


    var LinkInfo = '';
    if(req.body.PostLink && req.body.PostLink !== '') {
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
        var varHighlightsPostType = new HighlightsPostModel.HighlightsPostType({
            UserId: req.body.UserId,
            PostType: req.body.PostType,
            PostDate: req.body.PostDate,
            PostText: req.body.PostText || '',
            PostLink: req.body.PostLink || '',
            PostLinkInfo: LinkInfo,
            PostImage: req.body.PostImage || '',
            PostVideo: req.body.PostVideo || '',
            ActiveStates: 'Active'
        });

     
        varHighlightsPostType.save(function(err, result) {
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
                                                PostImage: result.PostImage,
                                                PostVideo: result.PostVideo,
                                                Shared: result.Shared || '',
                                                ShareUserName: result.ShareUserName || '',
                                                ShareUserId: result.ShareUserId || '',
                                                SharePostId: result.SharePostId || '',
                                                SharePostFrom: result.SharePostFrom || 'Highlights',
                                                LikesCount: 0,
                                                UserLiked: false,
                                                UserLikeId: '',
                                                ShareCount: 0,
                                                UserShared: false,
                                                comments: [],
                                                commentsCount: 0,
                                            }
                                );

                                if(count > 0){
                                    FollowModel.FollowUserType.find({'FollowingUserId': UserData._id},  function(someerr, followUsers) {
                                        if(someerr){
                                            res.send({status:"False", Error:someerr });
                                        }else{
                                            SetNofifiction();
                                            async function SetNofifiction(){
                                                for (let info of followUsers) {
                                                    await SetNotify(info);
                                                }
                                                res.send({status:"True", data:newArray[0] });
                                            }

                                            function SetNotify(info){
                                                return new Promise(( resolve, reject )=>{
                                                    var varNotification = new NotificationModel.Notification({
                                                        UserId:  req.body.UserId,
                                                        HighlightPostId: result._id,
                                                        HighlightPostType: result.PostType,
                                                        ResponseUserId: info.UserId,
                                                        NotificationType: 5,
                                                        Viewed: 0,
                                                        NotificationDate: new Date
                                                    });
                                                    varNotification.save(function(Nofifyerr, Notifydata) {
                                                        if(Nofifyerr) {
                                                            res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});
                                                            reject(Nofifyerr);
                                                        } else {
                                                        resolve(Notifydata);
                                                        }
                                                    });
                                                })
                                            }
                                        }
                                    });
                                    
                                }else{
                                    res.send({status:"True", data: newArray[0] });
                                }
                            }
                        });
                    }
                });
            }
        });
    }

};


exports.AndroidSubmit = function(req, res) {
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " User Id can not be Empty! "});
    }
    if(!req.body.PostType) {
        res.status(400).send({status:"False", message: " Post Type can not be Empty! "});
    }
    if(!req.body.PostDate) {
        res.status(400).send({status:"False", message: " Post Date can not be Empty! "});
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

        var Image = '';
        var Video = '';
        if( (req.body.PostImage).length > 0 && req.body.PostImage !== ''){
             Image = JSON.parse(req.body.PostImage);
        }else{
             Image = '';
        }
        if( (req.body.PostVideo).length > 0 && req.body.PostVideo !== '' ){
            Video = JSON.parse(req.body.PostVideo);
       }else{
            Video = '';
       }
        var varHighlightsPostType = new HighlightsPostModel.HighlightsPostType({
            UserId: req.body.UserId,
            PostType: req.body.PostType,
            PostDate: req.body.PostDate,
            PostText: req.body.PostText || '',
            PostLink: req.body.PostLink || '',
            PostLinkInfo: LinkInfo,
            PostImage: Image,
            PostVideo: Video,
            ActiveStates: 'Active'
        });

     
        varHighlightsPostType.save(function(err, result) {
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
                                                PostImage: result.PostImage,
                                                PostVideo: result.PostVideo,
                                                Shared: result.Shared || '',
                                                ShareUserName: result.ShareUserName || '',
                                                ShareUserId: result.ShareUserId || '',
                                                SharePostId: result.SharePostId || '',
                                                SharePostFrom:result.SharePostFrom || 'Highlights',
                                                LikesCount: 0,
                                                UserLiked: false,
                                                UserLikeId: '',
                                                ShareCount: 0,
                                                UserShared: false,
                                                comments: [],
                                                commentsCount: 0,
                                            }
                                );

                                if(count > 0){
                                    FollowModel.FollowUserType.find({'FollowingUserId': UserData._id},  function(someerr, followUsers) {
                                        if(someerr){
                                            res.send({status:"False", Error:someerr });
                                        }else{
                                            SetNofifiction();
                                            async function SetNofifiction(){
                                                for (let info of followUsers) {
                                                    await SetNotify(info);
                                                }
                                                res.send({status:"True", data:newArray[0] });
                                            }

                                            function SetNotify(info){
                                                return new Promise(( resolve, reject )=>{
                                                    var varNotification = new NotificationModel.Notification({
                                                        UserId:  req.body.UserId,
                                                        HighlightPostId: result._id,
                                                        HighlightPostType: result.PostType,
                                                        ResponseUserId: info.UserId,
                                                        NotificationType: 5,
                                                        Viewed: 0,
                                                        NotificationDate: new Date
                                                    });
                                                    varNotification.save(function(Nofifyerr, Notifydata) {
                                                        if(Nofifyerr) {
                                                            res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});
                                                            reject(Nofifyerr);
                                                        } else {
                                                        resolve(Notifydata);
                                                        }
                                                    });
                                                })
                                            }
                                        }
                                    });
                                    
                                }else{
                                    res.send({status:"True", data: newArray[0] });
                                }
                            }
                        });
                    }
                });
            }
        });
    }

};



exports.Update = function(req, res) {
    if(!req.body._id) {
        res.status(400).send({status:"False", message: " Post can not be Empty! "});
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
        HighlightsPostModel.HighlightsPostType.findOne({'_id': req.body._id }, {},  function(err, data) {
            if(err) {
                res.send({status:"False", Error:err });
            } else {
                data.PostType = req.body.PostType;
                data.PostDate = req.body.PostDate;
                data.PostText = req.body.PostText || '';
                data.PostLink = req.body.PostLink || '';
                data.PostLinkInfo = LinkInfo;
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

exports.AndroidUpdate = function(req, res) {
    if(!req.body._id) {
        res.status(400).send({status:"False", message: " Post can not be Empty! "});
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
        var Image = '';
        var Video = '';
        if( (req.body.PostImage).length > 0 && req.body.PostImage !== ''){
             Image = JSON.parse(req.body.PostImage);
        }else{
             Image = '';
        }
        if( (req.body.PostVideo).length > 0 && req.body.PostVideo !== '' ){
            Video = JSON.parse(req.body.PostVideo);
       }else{
            Video = '';
       }

        HighlightsPostModel.HighlightsPostType.findOne({'_id': req.body._id }, {},  function(err, data) {
            if(err) {
                res.send({status:"False", Error:err });
            } else {
                data.PostType = req.body.PostType;
                data.PostDate = req.body.PostDate;
                data.PostText = req.body.PostText || '';
                data.PostLink = req.body.PostLink || '';
                data.PostLinkInfo = LinkInfo;
                data.PostImage = Image;
                data.PostVideo = Video;
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


exports.FacebookSharePost = function(req, res) {
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " User Id can not be Empty! "});
    }
    if(!req.body.PostId) {
        res.status(400).send({status:"False", message: " Post Id can not be Empty! "});
    }
    if(!req.body.PostUserId) {
        res.status(400).send({status:"False", message: " Post Id can not be Empty! "});
    }
        var varSharePost = new SharePosts.SharePost({
            ShareType: 'FaceBook',
            UserId: req.body.UserId,
            PostType: 'Highlights',
            PostId: req.body.PostId,
            PostUserId: req.body.UserId,
            SharePostFrom: 'Highlights',
            Date: new Date(),
            ActiveStates: 'Active'
        });
        varSharePost.save(function(Shareerr, Shareresult) {
            if(Shareerr) {
                res.status(500).send({status:"False", Error: Shareerr, message: "Some error occurred while Share The Post."});    
            } else {
                res.send({status:"True", data:Shareresult });
            }
        });

};


exports.SharePost = function(req, res) {
    if(!req.body.ShareUserName) {
        res.status(400).send({status:"False", message: " User Name can not be Empty! "});
    }
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " User Id can not be Empty! "});
    }
    if(!req.body.PostId) {
        res.status(400).send({status:"False", message: " Post Id can not be Empty! "});
    }
    if(!req.body.PostDate) {
        res.status(400).send({status:"False", message: " PostDate can not be Empty! "});
    }

    HighlightsPostModel.HighlightsPostType.findOne({'_id': req.body.PostId},  function(Posterr, Postresult) {
        if(Posterr) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Following Users ."});
        } else {
            var varHighlightsPostType = new HighlightsPostModel.HighlightsPostType({
                UserId: req.body.UserId,
                PostType: Postresult.PostType,
                PostDate: req.body.PostDate,
                PostText: Postresult.PostText,
                PostLink: Postresult.PostLink,
                PostLinkInfo: Postresult.PostLinkInfo,
                PostImage: Postresult.PostImage,
                PostVideo: Postresult.PostVideo,
                Shared: 'True',
                ShareUserName: req.body.ShareUserName,
                ShareUserId: Postresult.UserId,
                SharePostId: req.body.PostId,
                SharePostFrom: req.body.PostFrom || 'Highlights',
                ActiveStates: 'Active'
            });

        
            varHighlightsPostType.save(function(err, result) {
                if(err) {
                    res.status(500).send({status:"False", Error: err, message: "Some error occurred while Submit The Post."});    
                } else {
                    
                    var varSharePost = new SharePosts.SharePost({
                        ShareType: 'B2C',
                        UserId: req.body.UserId,
                        NewPostId: result._id,
                        PostType: 'Highlights',
                        PostId: req.body.PostId,
                        PostUserId: Postresult.UserId,
                        SharePostFrom: 'Highlights',
                        Date: new Date(),
                        ActiveStates: 'Active'
                    });
                    varSharePost.save(function(Shareerr, Shareresult) {
                        if(Shareerr) {
                            res.status(500).send({status:"False", Error: Shareerr, message: "Some error occurred while Submit The Post."});    
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
                                                            PostImage: result.PostImage,
                                                            PostVideo: result.PostVideo,
                                                            Shared: result.Shared || '',
                                                            ShareUserName: result.ShareUserName || '',
                                                            ShareUserId: result.ShareUserId || '',
                                                            SharePostId: result.SharePostId || '',
                                                            SharePostFrom:result.SharePostFrom || 'Highlights',
                                                            LikesCount: 0,
                                                            UserLiked: false,
                                                            UserLikeId: '',
                                                            ShareCount: 0,
                                                            UserShared: false,
                                                            comments: [],
                                                            commentsCount: 0,
                                                        }
                                            );

                                            if (req.body.UserId !==  Postresult.UserId) {
                                                ShareNotify();
                                            }else {
                                                res.send({status:"True", data: newArray[0] });
                                            }
                                            function ShareNotify() {
                                                var varNotification = new NotificationModel.Notification({
                                                    UserId:  req.body.UserId,
                                                    HighlightPostId: result._id,
                                                    HighlightPostType: result.PostType,
                                                    ResponseUserId: Postresult.UserId,
                                                    NotificationType: 8,
                                                    Viewed: 0,
                                                    NotificationDate: new Date()
                                                });
                                                varNotification.save(function(ShareNofifyerr, ShareNotify) {
                                                    if(ShareNofifyerr) {
                                                        res.status(500).send({status:"False", Error:ShareNofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});
                                                        reject(ShareNofifyerr);
                                                    } else {
                                                        if(count > 0){
                                                            FollwersNotify();
                                                        }else{
                                                            res.send({status:"True", data: newArray[0] });
                                                        }
                                                    }
                                                });
                                            }
                                            function FollwersNotify() {
                                                FollowModel.FollowUserType.find({'FollowingUserId': UserData._id},  function(someerr, followUsers) {
                                                    if(someerr){
                                                        res.send({status:"False", Error:someerr });
                                                    }else{
                                                        SetNofifiction();
                                                        async function SetNofifiction(){
                                                            for (let info of followUsers) {
                                                                await SetNotify(info);
                                                            }
                                                            res.send({status:"True", data:newArray[0] });
                                                        }

                                                        function SetNotify(info){
                                                            return new Promise(( resolve, reject ) => {
                                                                if (Postresult.UserId !== info.UserId ) { 
                                                                var varNotification = new NotificationModel.Notification({
                                                                    UserId:  req.body.UserId,
                                                                    HighlightPostId: result._id,
                                                                    HighlightPostType: result.PostType,
                                                                    SharedUserId: Postresult.UserId,
                                                                    SharedUserName: req.body.ShareUserName,
                                                                    ResponseUserId: info.UserId,
                                                                    NotificationType: 17,
                                                                    Viewed: 0,
                                                                    NotificationDate: new Date()
                                                                });
                                                                varNotification.save(function(Nofifyerr, Notifydata) {
                                                                    if(Nofifyerr) {
                                                                        res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});
                                                                        reject(Nofifyerr);
                                                                    } else {
                                                                    resolve(Notifydata);
                                                                    }
                                                                });
                                                             }else{
                                                                resolve(info);
                                                             }
                                                            });
                                                        }
                                                    }
                                                });
                                            }
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
};



exports.Category4TopicPostShare = function(req, res) {
    if(!req.body.ShareUserName) {
        res.status(400).send({status:"False", message: " User Name can not be Empty! "});
    }
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " User Id can not be Empty! "});
    }
    if(!req.body.PostId) {
        res.status(400).send({status:"False", message: " Post Id can not be Empty! "});
    }
    if(!req.body.PostDate) {
        res.status(400).send({status:"False", message: " PostDate can not be Empty! "});
    }

    Category4Model.Category4TopicPost.findOne({'_id': req.body.PostId},  function(Posterr, Postresult) {
        if(Posterr) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Following Users ."});
        } else {
            var varHighlightsPostType = new HighlightsPostModel.HighlightsPostType({
                UserId: req.body.UserId,
                PostType: Postresult.PostType,
                PostDate: req.body.PostDate,
                PostText: Postresult.PostText,
                PostLink: Postresult.PostLink,
                PostLinkInfo: Postresult.PostLinkInfo,
                PostImage: Postresult.PostImage,
                PostVideo: Postresult.PostVideo,
                Shared: 'True',
                ShareUserName: req.body.ShareUserName,
                ShareUserId: Postresult.UserId,
                SharePostId: req.body.PostId,
                SharePostFrom: 'Categor4TopicPost',
                ActiveStates: 'Active'
            });

        
            varHighlightsPostType.save(function(err, result) {
                if(err) {
                    res.status(500).send({status:"False", Error: err, message: "Some error occurred while Submit The Post."});    
                } else {
                    
                    var varSharePost = new SharePosts.SharePost({
                        ShareType: 'B2C',
                        UserId: req.body.UserId,
                        NewPostId: result._id,
                        PostType: 'Highlights',
                        PostId: req.body.PostId,
                        PostUserId: Postresult.UserId,
                        SharePostFrom: 'Categor4TopicPost',
                        Date: new Date(),
                        ActiveStates: 'Active'
                    });
                    varSharePost.save(function(Shareerr, Shareresult) {
                        if(Shareerr) {
                            res.status(500).send({status:"False", Error: Shareerr, message: "Some error occurred while Submit The Post."});    
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
                                                            PostImage: result.PostImage,
                                                            PostVideo: result.PostVideo,
                                                            Shared: result.Shared || '',
                                                            ShareUserName: result.ShareUserName || '',
                                                            ShareUserId: result.ShareUserId || '',
                                                            SharePostId: result.SharePostId || '',
                                                            SharePostFrom: result.SharePostFrom || 'Highlights',
                                                            LikesCount: 0,
                                                            UserLiked: false,
                                                            UserLikeId: '',
                                                            ShareCount: 0,
                                                            UserShared: false,
                                                            comments: [],
                                                            commentsCount: 0,
                                                        }
                                            );

                                            if (req.body.UserId !==  Postresult.UserId) {
                                                ShareNotify();
                                            }else {
                                                res.send({status:"True", data: newArray[0] });
                                            }
                                            function ShareNotify() {
                                                var varNotification = new NotificationModel.Notification({
                                                    UserId:  req.body.UserId,
                                                    HighlightPostId: result._id,
                                                    HighlightPostType: result.PostType,
                                                    ResponseUserId: Postresult.UserId,
                                                    NotificationType: 8,
                                                    Viewed: 0,
                                                    NotificationDate: new Date()
                                                });
                                                varNotification.save(function(ShareNofifyerr, ShareNotify) {
                                                    if(ShareNofifyerr) {
                                                        res.status(500).send({status:"False", Error:ShareNofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});
                                                        reject(ShareNofifyerr);
                                                    } else {
                                                        if(count > 0){
                                                            FollwersNotify();
                                                        }else{
                                                            res.send({status:"True", data: newArray[0] });
                                                        }
                                                    }
                                                });
                                            }
                                            function FollwersNotify() {
                                                FollowModel.FollowUserType.find({'FollowingUserId': UserData._id},  function(someerr, followUsers) {
                                                    if(someerr){
                                                        res.send({status:"False", Error:someerr });
                                                    }else{
                                                        SetNofifiction();
                                                        async function SetNofifiction(){
                                                            for (let info of followUsers) {
                                                                await SetNotify(info);
                                                            }
                                                            res.send({status:"True", data:newArray[0] });
                                                        }

                                                        function SetNotify(info){
                                                            return new Promise(( resolve, reject ) => {
                                                                if (Postresult.UserId !== info.UserId ) { 
                                                                var varNotification = new NotificationModel.Notification({
                                                                    UserId:  req.body.UserId,
                                                                    HighlightPostId: result._id,
                                                                    HighlightPostType: result.PostType,
                                                                    SharedUserId: Postresult.UserId,
                                                                    SharedUserName: req.body.ShareUserName,
                                                                    ResponseUserId: info.UserId,
                                                                    NotificationType: 17,
                                                                    Viewed: 0,
                                                                    NotificationDate: new Date()
                                                                });
                                                                varNotification.save(function(Nofifyerr, Notifydata) {
                                                                    if(Nofifyerr) {
                                                                        res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});
                                                                        reject(Nofifyerr);
                                                                    } else {
                                                                    resolve(Notifydata);
                                                                    }
                                                                });
                                                             }else{
                                                                resolve(info);
                                                             }
                                                            });
                                                        }
                                                    }
                                                });
                                            }
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
};








exports.GetPostList = function(req, res) {
    var SkipCount = 0;
    SkipCount = parseInt(req.params.Limit);
    HighlightsPostModel.HighlightsPostType.find({'ActiveStates': 'Active' }, {} , {sort:{createdAt : -1}, skip: SkipCount, limit: 15  }, function(err, result) {
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
                                                                                                            SharePostFrom:result.SharePostFrom || 'Highlights',
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



exports.ViewPost = function(req, res) {
    HighlightsPostModel.HighlightsPostType.findOne({'_id': req.params.PostId},  function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Following Users ."});
        } else {
            UserModel.UserType.findOne({'_id': result.UserId }, usersProjection, function(err, UserData) {
                if(err) {
                    res.send({status:"False", Error:err });
                } else {
                    FollowModel.FollowUserType.count({'FollowingUserId': UserData._id}, function(newerr, count) {
                        if(newerr){
                        }else{
                            LikeAndRating.HighlightsLike.count({'PostId': result._id , 'ActiveStates':'Active' }, function(NewErr, NewCount) {
                                if(NewErr){
                                    res.send({status:"False", Error:NewErr });
                                }else{
                                    LikeAndRating.HighlightsLike.find({'UserId': req.params.UserId, 'PostId': result._id, 'PostUserId': UserData._id, 'ActiveStates':'Active' }, {}, function(someerr, newResult) {
                                        if(someerr){
                                            res.send({status:"False", Error:someerr });
                                        }else{

                                            if(newResult.length > 0){
                                                var UserLiked = true;
                                                var UserLikedId = newResult[0]._id;
                                            }else{
                                                var UserLiked = false;
                                                var UserLikedId = '';
                                            }

                                            CommentModel.HighlightsComment.count({'PostId': result._id , 'ActiveStates':'Active' }, function(commentErr, commentCount) {
                                                if(commentErr){
                                                    res.send({status:"False", Error:commentErr });
                                                }else{
                                                    CommentModel.HighlightsComment.find({'UserId':req.params.UserId, 'PostId': result._id}, function(nowerr, CommantData) {
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
                                                            SharePosts.SharePost.count({'PostType': 'Highlights', PostId: result._id }, function(Shareerr, Sharecount) {
                                                                if(Shareerr){
                                                                    res.send({status:"False", Error:Shareerr });
                                                                    reject(Shareerr);
                                                                }else{
                                                                    SharePosts.SharePost.find({'PostType': 'Highlights', PostId: result._id, UserId: req.params.UserId }, function(Sharederr, Sharedcount) {
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
                                                                                            UserCommented: alreadyCommentuser,
                                                                                            Followers:count,
                                                                                            _id: result._id,
                                                                                            PostType: result.PostType,
                                                                                            PostDate: result.PostDate,
                                                                                            timeAgo: moment(result.updatedAt).fromNow(),
                                                                                            PostText: result.PostText ,
                                                                                            PostLink: result.PostLink,
                                                                                            PostLinkInfo: result.PostLinkInfo || '',
                                                                                            PostImage: result.PostImage,
                                                                                            PostVideo: result.PostVideo,
                                                                                            Shared: result.Shared || '',
                                                                                            ShareUserName: result.ShareUserName || '',
                                                                                            ShareUserId: result.ShareUserId || '',
                                                                                            SharePostId: result.SharePostId || '',
                                                                                            SharePostFrom: result.SharePostFrom || 'Highlights',
                                                                                            LikesCount: NewCount,
                                                                                            UserLiked: UserLiked,
                                                                                            UserLikeId: UserLikedId,
                                                                                            ShareCount: Sharecount,
                                                                                            UserShared: alreadyShared,
                                                                                            comments: [],
                                                                                            commentsCount : commentCount
                                                                                        }
                                                                            );
                                                                            res.send({status:"True", data: newArray });
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
                }
            });
        }
    });
                    
};



exports.ViewSharePost = function(req, res) {
    HighlightsPostModel.HighlightsPostType.findOne({'_id': req.params.PostId},  function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Find Following Users ."});
        } else {
            UserModel.UserType.findOne({'_id': result.UserId }, usersProjection, function(err, UserData) {
                if(err) {
                    res.send({status:"False", Error:err });
                } else {
                    FollowModel.FollowUserType.count({'FollowingUserId': UserData._id}, function(newerr, count) {
                        if(newerr){
                        }else{
                            LikeAndRating.HighlightsLike.count({'PostId': result._id , 'ActiveStates':'Active' }, function(NewErr, NewCount) {
                                if(NewErr){
                                    res.send({status:"False", Error:NewErr });
                                }else{
                                    CommentModel.HighlightsComment.count({'PostId': result._id , 'ActiveStates':'Active' }, function(commentErr, commentCount) {
                                        if(commentErr){
                                            res.send({status:"False", Error:commentErr });
                                        }else{
                                            SharePosts.SharePost.count({'PostType': 'Highlights', PostId: result._id }, function(Shareerr, Sharecount) {
                                                if(Shareerr){
                                                    res.send({status:"False", Error:Shareerr });
                                                    reject(Shareerr);
                                                }else{
                                                    var newArray = [];
                                                    newArray.push( {
                                                                UserId: UserData._id,
                                                                UserName: UserData.UserName,
                                                                UserCategoryId: UserData.UserCategoryId,
                                                                UserCategoryName: UserData.UserCategoryName,
                                                                UserImage: UserData.UserImage,
                                                                UserCompany: UserData.UserCompany,
                                                                UserProfession: UserData.UserProfession,
                                                                UserCommented: false,
                                                                Followers:count,
                                                                _id: result._id,
                                                                PostType: result.PostType,
                                                                PostDate: result.PostDate,
                                                                timeAgo: moment(result.updatedAt).fromNow(),
                                                                PostText: result.PostText ,
                                                                PostLink: result.PostLink,
                                                                PostLinkInfo: result.PostLinkInfo || '',
                                                                PostImage: result.PostImage,
                                                                PostVideo: result.PostVideo,
                                                                Shared: result.Shared || '',
                                                                ShareUserName: result.ShareUserName || '',
                                                                ShareUserId: result.ShareUserId || '',
                                                                SharePostId: result.SharePostId || '',
                                                                SharePostFrom: result.SharePostFrom || 'Highlights',
                                                                LikesCount: NewCount,
                                                                UserLiked: false,
                                                                UserLikeId: '',
                                                                ShareCount: Sharecount,
                                                                UserShared: false,
                                                                comments: [],
                                                                commentsCount : commentCount
                                                            }
                                                    );
                                                    res.send({status:"True", data: newArray });
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
                    
};