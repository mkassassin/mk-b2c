var QuestionsPostModel = require('../models/QuestionsPost.model.js');
var UserModel = require('../models/SignInSignUp.model.js');
var FollowModel = require('../models/Follow.model.js');
var NotificationModel = require('../models/Notificatio.model.js');
var RatingModel = require('../models/LikeAndRating.model.js');
var AnswerModel = require('../models/CommentAndAnswer.model.js');

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
    if(!req.body.PostTopicName || !req.body.PostTopicId) {
        res.status(400).send({status:"False", message: " Post Topic can not be Empty! "});
    }
    if(!req.body.PostDate) {
        res.status(400).send({status:"False", message: " Post Date can not be Empty! "});
    }

    var QuestionsPostType = new QuestionsPostModel.QuestionsPostType({
            UserId: req.body.UserId,
            PostTopicId: req.body.PostTopicId,
            PostTopicName: req.body.PostTopicName,
            PostDate: req.body.PostDate,
            PostText: req.body.PostText || '',
            PostLink: req.body.PostLink || '',
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
                    res.send({status:"Fale", Error:err });
                } else {
                    FollowModel.FollowUserType.count({'FollowingUserId': UserData._id}, function(newerr, count) {
                        if(newerr){
                            res.send({status:"Fale", Error:newerr });
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
                                            PostImage: images,
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
                                        res.send({status:"Fale", Error:someerr });
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
};





exports.GetPostList = function (req, res) {
    var SkipCoun = 0;
    SkipCoun = parseInt(req.params.Limit) * 10;
    QuestionsPostModel.QuestionsPostType.find({}, {}, { sort: { createdAt: -1 }, skip: SkipCoun, limit: 10 }, function (err, result) {
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
                    AnswerModel.QuestionsAnwer.count({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                    AnswerModel.QuestionsAnwer.find({ 'PostId': info._id }, 'AnswerText UserId Date').exec(),
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
                                    var images = [];
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
                                        PostImage: images,
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
                                    res.send({status:"Fale", Error:Rateerr });
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
                                    res.send({status:"Fale", Error:err });
                                    reject(err);
                                } else {
                                    FollowModel.FollowUserType.count({'UserId': AnsUserData._id}, function(newerr, count) {
                                        if(newerr){
                                            res.send({status:"Fale", Error:newerr });
                                            reject(newerr);
                                        }else{
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
                    AnswerModel.QuestionsAnwer.count({ 'PostId': info._id, 'ActiveStates': 'Active' }).exec(),
                    AnswerModel.QuestionsAnwer.find({ 'PostId': info._id }, 'AnswerText UserId Date').exec(),
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
                                    var images = [];
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
                                        PostImage: images,
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
                                    res.send({status:"Fale", Error:Rateerr });
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
                                    res.send({status:"Fale", Error:err });
                                    reject(err);
                                } else {
                                    FollowModel.FollowUserType.count({'UserId': AnsUserData._id}, function(newerr, count) {
                                        if(newerr){
                                            res.send({status:"Fale", Error:newerr });
                                            reject(newerr);
                                        }else{
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
                        });
                    }


                }).catch(error => {
                    console.log(error)
                })

             GetUserData(result);

        }
    });
};