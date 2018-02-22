var QuestionsPostModel = require('../models/QuestionsPost.model.js');
var UserModel = require('../models/SignInSignUp.model.js');
var FollowModel = require('../models/Follow.model.js');
var NotificationModel = require('../models/Notificatio.model.js');
var RatingModel = require('../models/LikeAndRating.model.js');
var AnswerModel = require('../models/CommentAndAnswer.model.js');
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

exports.Submit = function(req, res) {
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " User Id can not be Empty! "});
    }
    if(!req.body.PostTopicName || !req.body.PostTopicId) {
        res.status(400).send({status:"False", message: " Post Topic can not be Empty! "});
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
        
        var QuestionsPostType = new QuestionsPostModel.QuestionsPostType({
                UserId: req.body.UserId,
                PostTopicId: req.body.PostTopicId,
                PostTopicName: req.body.PostTopicName,
                PostDate: req.body.PostDate,
                PostText: req.body.PostText || '',
                PostLink: req.body.PostLink || '',
                PostLinkInfo: LinkInfo,
                PostImage: req.body.PostImage || '',
                PostVideo: req.body.PostVideo || '',
                ActiveStates: 'Active'
        });

        
        QuestionsPostType.save(function(err, result) {
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
                                var images = [];
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
                                                PostTopicId: result.PostTopicId,
                                                PostTopicName: result.PostTopicName,
                                                PostDate: result.PostDate,
                                                PostText: result.PostText ,
                                                PostLink: result.PostLink,
                                                PostLinkInfo: result.PostLinkInfo || '',
                                                PostImage: result.PostImage,
                                                PostVideo: result.PostVideo,
                                                RatingCount: 0,
                                                userRated: false,
                                                UserRating: 0,
                                                Answers: [],
                                                AnswersCount: 0,
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
                                                        QuestionPostId: result._id,
                                                        ResponseUserId: info.UserId,
                                                        NotificationType: 9,
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
    if(!req.body.PostTopicName) {
        res.status(400).send({status:"False", message: " Post Topic Name can not be Empty! "});
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
        QuestionsPostModel.QuestionsPostType.findOne({'_id': req.body._id }, {},  function(err, data) {
            if(err) {
                res.send({status:"False", Error:err });
            } else {
                data.PostTopicId = req.body.PostTopicId;
                data.PostTopicName = req.body.PostTopicName;
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



exports.GetPostList = function (req, res) {
    var SkipCoun = 0;
    SkipCoun = parseInt(req.params.Limit) * 10;
    QuestionsPostModel.QuestionsPostType.find({'ActiveStates': 'Active'}, {}, { sort: { createdAt: -1 }, skip: SkipCoun, limit: 5 }, function (err, result) {
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
                    FollowModel.FollowUserType.count({ 'UserId': info.UserId }).exec(),
                    RatingModel.QuestionsRating.count({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                    RatingModel.QuestionsRating.find({ 'UserId': req.params.UserId, 'PostId': info._id, 'PostUserId': info.UserId, 'ActiveStates': 'Active' }).exec(),
                    AnswerModel.QuestionsAnswer.count({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                    AnswerModel.QuestionsAnswer.find({ 'PostId': info._id , 'ActiveStates': 'Active'}, 'AnswerText UserId Date', { limit: 2 }).exec(),
                    RatingModel.QuestionsRating.find({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                ]).then(data => {
                    let UserData = data[0];
                    let followCount = data[1];
                    let ratingCount = data[2];
                    let userRate = data[3];
                    let AnswerCount = data[4];
                    let Answerdata = data[5];
                    let RatingList = data[6];
                    

                    var AnswersArray= new Array();
                    var RatingCal = 0 ;

                   return GetAnsUserData();
                    async function GetAnsUserData(){
                        for (let ansInfo of Answerdata) {
                            await getAnswerInfo(ansInfo);
                        }
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
                                    let result = {
                                        _id: info._id,
                                        UserId: UserData._id,
                                        UserName: UserData.UserName,
                                        UserCategoryId: UserData.UserCategoryId,
                                        UserCategoryName: UserData.UserCategoryName,
                                        UserImage: UserData.UserImage,
                                        UserCompany: UserData.UserCompany,
                                        UserProfession: UserData.UserProfession,
                                        Followers:followCount,
                                        PostTopicId: info.PostTopicId,
                                        PostTopicName: info.PostTopicName,
                                        PostDate: info.PostDate,
                                        PostText: info.PostText ,
                                        PostLink: info.PostLink,
                                        PostLinkInfo: info.PostLinkInfo || '',
                                        PostImage: info.PostImage,
                                        PostVideo: info.PostVideo,
                                        RatingCount: JSON.parse(RatingCal) / JSON.parse(ratingCount),
                                        userRated: userRated,
                                        userRating: userRating,
                                        AnswersCount: AnswerCount,
                                        Answers: AnswersArray,
                                    };
                                return result;
                            }
                      }
                      

                      function getRatingInfo(rateInfo){
                        return new Promise(( resolve, reject )=>{
                            RatingModel.QuestionsRating.findOne({ '_id': rateInfo._id}, function(Rateerr, RateData) {
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


                      function getAnswerInfo(ansInfo){
                        return new Promise(( resolve, reject )=>{
                            UserModel.UserType.findOne({'_id': ansInfo.UserId }, usersProjection, function(err, AnsUserData) {
                                if(err) {
                                    res.send({status:"False", Error:err });
                                    reject(err);
                                } else {
                                    FollowModel.FollowUserType.count({'FollowingUserId': AnsUserData._id}, function(newerr, count) {
                                        if(newerr){
                                            res.send({status:"False", Error:newerr });
                                            reject(newerr);
                                        }else{
                                            FollowModel.FollowUserType.find({'UserId':req.params.UserId, 'FollowingUserId': AnsUserData._id}, function(nowerr, FollowesData) {
                                                if(nowerr){
                                                    res.send({status:"False", Error:nowerr });
                                                    reject(nowerr);
                                                }else{
                                                    var alreadyfollowuser = true;
                                                    if(FollowesData.length <= 0 && req.params.UserId != AnsUserData._id){
                                                        alreadyfollowuser = false;
                                                    }else{
                                                        alreadyfollowuser = true;
                                                    }
                                                    
                                                    var newArray = [];
                                                    newArray.push( {
                                                                    _id: ansInfo._id,
                                                                    UserId: AnsUserData._id,
                                                                    UserName: AnsUserData.UserName,
                                                                    UserCategoryId: AnsUserData.UserCategoryId,
                                                                    UserCategoryName: AnsUserData.UserCategoryName,
                                                                    UserImage: AnsUserData.UserImage,
                                                                    UserCompany: AnsUserData.UserCompany,
                                                                    UserProfession: AnsUserData.UserProfession,
                                                                    AlreadyFollow: alreadyfollowuser,
                                                                    Followers: count,
                                                                    Date: ansInfo.Date,
                                                                    PostId: ansInfo.PostId,
                                                                    PostUserId: ansInfo.PostUserId ,
                                                                    AnswerText: ansInfo.AnswerText
                                                                }
                                                    );
                                                    AnswersArray.push(newArray[0]);
                                                    resolve(newArray[0]);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    }


                }).catch(error => {
                    console.log(error)
                })

             GetUserData(result);

        }
    });
};



exports.ViewPost = function (req, res) {

    QuestionsPostModel.QuestionsPostType.find({'_id': req.params.PostId}, function (err, result) {
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
                    FollowModel.FollowUserType.count({ 'UserId': info.UserId }).exec(),
                    RatingModel.QuestionsRating.count({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                    RatingModel.QuestionsRating.find({ 'UserId': req.params.UserId, 'PostId': info._id, 'PostUserId': info.UserId, 'ActiveStates': 'Active' }).exec(),
                    AnswerModel.QuestionsAnswer.count({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                    AnswerModel.QuestionsAnswer.find({ 'PostId': info._id }, 'AnswerText UserId Date', {limit: 2 }).exec(),
                    RatingModel.QuestionsRating.find({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                ]).then(data => {
                    let UserData = data[0];
                    let followCount = data[1];
                    let ratingCount = data[2];
                    let userRate = data[3];
                    let AnswerCount = data[4];
                    let Answerdata = data[5];
                    let RatingList = data[6];
                    

                    var AnswersArray= new Array();
                    var RatingCal = 0 ;

                   return GetAnsUserData();
                    async function GetAnsUserData(){
                        for (let ansInfo of Answerdata) {
                            await getAnswerInfo(ansInfo);
                        }
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
                                    let result = {
                                        _id: info._id,
                                        UserId: UserData._id,
                                        UserName: UserData.UserName,
                                        UserCategoryId: UserData.UserCategoryId,
                                        UserCategoryName: UserData.UserCategoryName,
                                        UserImage: UserData.UserImage,
                                        UserCompany: UserData.UserCompany,
                                        UserProfession: UserData.UserProfession,
                                        Followers:followCount,
                                        PostTopicId: info.PostTopicId,
                                        PostTopicName: info.PostTopicName,
                                        PostDate: info.PostDate,
                                        PostText: info.PostText ,
                                        PostLink: info.PostLink,
                                        PostLinkInfo: info.PostLinkInfo || '',
                                        PostImage: info.PostImage,
                                        PostVideo: info.PostVideo,
                                        RatingCount: JSON.parse(RatingCal) / JSON.parse(ratingCount),
                                        userRated: userRated,
                                        userRating: userRating,
                                        AnswersCount: AnswerCount,
                                        Answers: AnswersArray,
                                    };
                                return result;
                            }
                      }
                      

                      function getRatingInfo(rateInfo){
                        return new Promise(( resolve, reject )=>{
                            RatingModel.QuestionsRating.findOne({ '_id': rateInfo._id}, function(Rateerr, RateData) {
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


                      function getAnswerInfo(ansInfo){
                        return new Promise(( resolve, reject )=>{
                            UserModel.UserType.findOne({'_id': ansInfo.UserId }, usersProjection, function(err, AnsUserData) {
                                if(err) {
                                    res.send({status:"False", Error:err });
                                    reject(err);
                                } else {
                                    FollowModel.FollowUserType.count({'UserId': AnsUserData._id}, function(newerr, count) {
                                        if(newerr){
                                            res.send({status:"False", Error:newerr });
                                            reject(newerr);
                                        }else{
                                            FollowModel.FollowUserType.find({'UserId':req.params.UserId, 'FollowingUserId': AnsUserData._id}, function(nowerr, FollowesData) {
                                                if(nowerr){
                                                    res.send({status:"False", Error:nowerr });
                                                    reject(nowerr);
                                                }else{
                                                    var alreadyfollowuser = true;
                                                    if(FollowesData.length <= 0 && req.params.UserId != AnsUserData._id){
                                                        alreadyfollowuser = false;
                                                    }else{
                                                        alreadyfollowuser = true;
                                                    }
                                                    var newArray = [];
                                                    newArray.push( {
                                                                    _id: ansInfo._id,
                                                                    UserId: AnsUserData._id,
                                                                    UserName: AnsUserData.UserName,
                                                                    UserCategoryId: AnsUserData.UserCategoryId,
                                                                    UserCategoryName: AnsUserData.UserCategoryName,
                                                                    UserImage: AnsUserData.UserImage,
                                                                    UserCompany: AnsUserData.UserCompany,
                                                                    UserProfession: AnsUserData.UserProfession,
                                                                    AlreadyFollow: alreadyfollowuser,
                                                                    Followers: count,
                                                                    Date: ansInfo.Date,
                                                                    PostId: ansInfo.PostId,
                                                                    PostUserId: ansInfo.PostUserId ,
                                                                    AnswerText: ansInfo.AnswerText
                                                                }
                                                    );
                                                    AnswersArray.push(newArray[0]);
                                                    resolve(newArray[0]);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    }


                }).catch(error => {
                    console.log(error)
                })

             GetUserData(result);

        }
    });
};