var Model = require('../models/LikeAndRating.model.js');
var NotificationModel = require('../models/Notificatio.model.js');
var HighlightsPostModel = require('../models/HighlightsPost.model.js');
var QuestionsPostModel = require('../models/QuestionsPost.model.js');
var CommentAndAnswer = require('../models/CommentAndAnswer.model.js');

exports.HighlightsLikeAdd = function(req, res) {
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " UserId can not be Empty! "});
    }
    if(!req.body.PostId) {
        res.status(400).send({status:"False", message: " PostId can not be Empty! "});
    }
    if(!req.body.PostUserId) {
        res.status(400).send({status:"False", message: " PostUserId can not be Empty! "});
    }
    if(!req.body.Date) {
        res.status(400).send({status:"False", message: " Date can not be Empty! "});
    }

    var varHighlightsLike = new Model.HighlightsLike({
            UserId: req.body.UserId,
            PostId: req.body.PostId,
            PostUserId: req.body.PostUserId,
            Date: req.body.Date,
            ActiveStates: 'Active'
    });

    Model.HighlightsLike.find({'UserId': req.body.UserId , 'PostId': req.body.PostId, 'PostUserId': req.body.PostUserId }, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err,  message: "Some error occurred while Find Following Users ."});
        } else {
            if(result.length > 0){
                if(result[0].ActiveStates == 'InActive'){
                    result[0].ActiveStates = 'Active';
                    result[0].save(function (newerr, newresult) {
                        if (newerr){
                            res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update UnLike ."});
                        }else{
                            if ( req.body.UserId !== req.body.PostUserId ) {
                                HighlightsPostModel.HighlightsPostType.findOne({'_id':  req.body.PostId},  function(Posterr, Postresult) {
                                    if(Posterr) {
                                        res.status(500).send({status:"False", message: "Some error occurred ."});
                                    } else {
                                        var varNotification = new NotificationModel.Notification({
                                            UserId:  req.body.UserId,
                                            HighlightPostId: req.body.PostId,
                                            HighlightPostType: Postresult.PostType,
                                            ResponseUserId: req.body.PostUserId,
                                            HighlightLikeId:newresult._id,
                                            NotificationType: 6,
                                            Viewed: 0,
                                            NotificationDate: new Date()
                                        });
                                        varNotification.save(function(Nofifyerr, Notifydata) {
                                            if(Nofifyerr) {
                                                res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});
                                                
                                            } else {
                                                res.send({status:"True", data: newresult });
                                            }
                                        });
                                    }
                                });
                            }else {
                                res.send({status:"True", data: newresult });
                            }
                        }
                    });
                }else{
                    res.send({status:"True", message:'Post Already Liked', data: result });
                }
            }else{
                varHighlightsLike.save(function(newerr, newresult) {
                    if(newerr) {
                        res.status(500).send({status:"False", Error: newerr, message: "Some error occurred while Like the Post."});    
                    } else {
                        if ( req.body.UserId !== req.body.PostUserId ) {
                            HighlightsPostModel.HighlightsPostType.findOne({'_id':  req.body.PostId},  function(Posterr, Postresult) {
                                if(Posterr) {
                                    res.status(500).send({status:"False", message: "Some error occurred ."});
                                } else {
                                    var varNotification = new NotificationModel.Notification({
                                        UserId:  req.body.UserId,
                                        ResponseUserId: req.body.PostUserId,
                                        HighlightPostType: Postresult.PostType,
                                        HighlightPostId: req.body.PostId,
                                        HighlightLikeId:newresult._id,
                                        NotificationType: 6,
                                        Viewed: 0,
                                        NotificationDate: new Date()
                                    });
                                    varNotification.save(function(Nofifyerr, Notifydata) {
                                        if(Nofifyerr) {
                                            res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});
                                            
                                        } else {
                                            res.send({status:"True", data: newresult });
                                        }
                                    });
                                }
                            });
                        }else {
                            res.send({status:"True", data: newresult });
                        }
                    }
                });
            }
        }
    });

     
};

exports.HighlightsUnLike = function(req, res) {
    if(!req.params.LikeId) {
        res.status(400).send({status:"False", message: " LikeId can not be Empty! "});
    }

    Model.HighlightsLike.findById(req.params.LikeId, function (err, result) {
        if(err){ 
            res.status(500).send({status:"False", Error: err,  message: "Some error occurred while  UnLike ."});
        }else{
            result.ActiveStates = 'InActive';
            result.save(function (newerr, newresult) {
                if (newerr){
                    res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update UnLike ."});
                }else{
                    res.send({status:"True", data: newresult });
                }
            });
        }   
    });  

};

exports.CommentsLikeAdd = function(req, res) {
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " UserId can not be Empty! "});
    }
    if(!req.body.PostId) {
        res.status(400).send({status:"False", message: " PostId can not be Empty! "});
    }
    if(!req.body.CommentId) {
        res.status(400).send({status:"False", message: " Comment Id can not be Empty! "});
    }
    if(!req.body.CommentUserId) {
        res.status(400).send({status:"False", message: " Comment UserId can not be Empty! "});
    }
    if(!req.body.Date) {
        res.status(400).send({status:"False", message: " Date can not be Empty! "});
    }

    var varCommentLike = new Model.CommentLike({
            UserId: req.body.UserId,
            PostId: req.body.PostId,
            CommentId: req.body.CommentId,
            CommentUserId: req.body.CommentUserId,
            Date: req.body.Date,
            ActiveStates: 'Active'
    });

    Model.CommentLike.find({'UserId': req.body.UserId, 'CommentId': req.body.CommentId, 'CommentUserId': req.body.CommentUserId }, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err,  message: "Some error occurred while Find Following Users ."});
        } else {
            if(result.length > 0){
                if(result[0].ActiveStates == 'InActive'){
                    result[0].ActiveStates = 'Active';
                    result[0].save(function (newerr, newresult) {
                        if (newerr){
                            res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update UnLike ."});
                        }else{
                            if (req.body.UserId !== req.body.CommentUserId ) {
                                CommentAndAnswer.HighlightsComment.findOne({'_id': req.body.CommentId},  function(Posterr, Postresult) {
                                    if(Posterr) {
                                        res.status(500).send({status:"False", message: "Some error occurred ."});
                                    } else {
                                        var varNotification = new NotificationModel.Notification({
                                            UserId:  req.body.UserId,
                                            HighlightPostId: req.body.PostId,
                                            CommentText: Postresult.CommentText,
                                            ResponseUserId: req.body.CommentUserId,
                                            HighlightCommentId: req.body.CommentId,
                                            CommentLikeId:newresult._id,
                                            NotificationType: 15,
                                            Viewed: 0,
                                            NotificationDate: new Date()
                                        });
                                        varNotification.save(function(Nofifyerr, Notifydata) {
                                            if(Nofifyerr) {
                                                res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});
                                                
                                            } else {
                                                res.send({status:"True", data: newresult });
                                            }
                                        });
                                    }
                                });
                            }else{
                                res.send({status:"True", data: newresult });
                            }
                        }
                    });
                }else{
                    res.send({status:"True", message:'Post Already Liked', data: result });
                }
            }else{
                varCommentLike.save(function(newerr, newresult) {
                    if(newerr) {
                        res.status(500).send({status:"False", Error: newerr, message: "Some error occurred while Like the Post."});    
                    } else {
                        if (req.body.UserId !== req.body.CommentUserId ) {
                            CommentAndAnswer.HighlightsComment.findOne({'_id':  req.body.CommentId},  function(Posterr, Postresult) {
                                if(Posterr) {
                                    res.status(500).send({status:"False", message: "Some error occurred ."});
                                } else {
                                    var varNotification = new NotificationModel.Notification({
                                        UserId:  req.body.UserId,
                                        HighlightPostId: req.body.PostId,
                                        CommentText: Postresult.CommentText,
                                        ResponseUserId: req.body.CommentUserId,
                                        HighlightCommentId: req.body.CommentId,
                                        CommentLikeId:newresult._id,
                                        NotificationType: 15,
                                        Viewed: 0,
                                        NotificationDate: new Date()
                                    });
                                    varNotification.save(function(Nofifyerr, Notifydata) {
                                        if(Nofifyerr) {
                                            res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});
                                            
                                        } else {
                                            res.send({status:"True", data: newresult });
                                        }
                                    });
                                }
                            });
                        }else {
                            res.send({status:"True", data: newresult });
                        }
                    }
                });
            }
        }
    });

     
};

exports.CommentsUnLike = function(req, res) {
    if(!req.params.LikeId) {
        res.status(400).send({status:"False", message: " LikeId can not be Empty! "});
    }

    Model.CommentLike.findById(req.params.LikeId, function (err, result) {
        if(err){ 
            res.status(500).send({status:"False", Error: err,  message: "Some error occurred while  UnLike ."});
        }else{
            result.ActiveStates = 'InActive';
            result.save(function (newerr, newresult) {
                if (newerr){
                    res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update UnLike ."});
                }else{
                    res.send({status:"True", data: newresult });
                }
            });
        }   
    });  

};




exports.QuestionsRatingAdd = function(req, res) {
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " UserId can not be Empty! "});
    }
    if(!req.body.PostId) {
        res.status(400).send({status:"False", message: " PostId can not be Empty! "});
    }
    if(!req.body.PostUserId) {
        res.status(400).send({status:"False", message: " PostUserId can not be Empty! "});
    }
    if(!req.body.Date) {
        res.status(400).send({status:"False", message: " Date can not be Empty! "});
    }
    if(!req.body.Rating) {
        res.status(400).send({status:"False", message: " Rating can not be Empty! "});
    }

    var varQuestionsRating = new Model.QuestionsRating({
            UserId: req.body.UserId,
            PostId: req.body.PostId,
            PostUserId: req.body.PostUserId,
            Rating:req.body.Rating,
            Date: req.body.Date,
            ActiveStates: 'Active'
    });

    Model.QuestionsRating.find({'UserId': req.body.UserId , 'PostId': req.body.PostId, 'PostUserId': req.body.PostUserId }, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error:err, message: "Some error occurred while Find Following Users ."});
        } else {
            if(result.length > 0){
                res.send({status:"True", message:'Post Already Rated', data: result });
            }else{
                varQuestionsRating.save(function(newerr, newresult) {
                    if(newerr) {
                        res.status(500).send({status:"False", Error: newerr, message: "Some error occurred while Rate the Post."});
                    } else {
                        Model.QuestionsRating.count({ 'PostId': req.body.PostId, 'ActiveStates': 'Active' }, function(counterr, count){
                            if(counterr) {
                                res.status(500).send({status:"False", Error: counterr, message: "Some error occurred while Rate the Post."});
                                
                            } else {
                                var RatingCount = count;
                                Model.QuestionsRating.find({ 'PostId': req.body.PostId, 'ActiveStates': 'Active' }, function(FindErr, FindRates){   
                                    if(FindErr) {
                                        res.status(500).send({status:"False", Error: FindErr, message: "Some error occurred while Rate the Post."});
                                    } else {
                                        var RatingCal = 0 ;

                                        const GetAnsData = (FindRates) => 
                                            Promise.all( FindRates.map(rateinfo => getPostInfo(rateinfo) ) )
                                                .then( RatingResult => {
                                                    var returnRating = JSON.parse(RatingCal) / JSON.parse(RatingCount);
                                                    var newArray = [];
                                                        newArray.push( {
                                                                        PostId: newresult.PostId,
                                                                        PostUserId: newresult.PostUserId,
                                                                        Rating:newresult.Rating,
                                                                        UserId:newresult.UserId,
                                                                        _id:newresult._id,
                                                                        OverallRating:returnRating
                                                                    }
                                                        );
                                                        res.send({status:"True", data: newArray[0]});
                                                })
                                                .catch(someerr => res.send({ status: "False", Error: someerr }));

                                                const getPostInfo = rateinfo =>
                                                    Promise.all([
                                                        Model.QuestionsRating.findOne({ '_id': rateinfo._id}).exec(),
                                                    ]).then(data => {
                                                        RatingCal += JSON.parse(data[0].Rating);
                                                        return data;
                                                    }).catch(error => {
                                                        console.log(error);
                                                    });
                                                    
                                        if ( req.body.UserId !== req.body.PostUserId ) {
                                            QuestionsPostModel.QuestionsPostType.findOne({'_id': req.body.PostId}, function (Quserr, Qusresult) {
                                                if (Quserr) {
                                                    res.status(500).send({ status: "False", Error: Quserr, message: "Some error occurred ." });
                                                } else {
                                                    var varNotification = new NotificationModel.Notification({
                                                        UserId:  req.body.UserId,
                                                        QuestionTopic: Qusresult.PostTopicName,
                                                        QuestionTopicId: Qusresult.PostTopicId,
                                                        ResponseUserId: req.body.PostUserId,
                                                        QuestionPostId: req.body.PostId,
                                                        QuestionRating: req.body.Rating,
                                                        QuestionRatingId:newresult._id,
                                                        NotificationType: 10,
                                                        Viewed: 0,
                                                        NotificationDate: new Date()
                                                    });
                                                    varNotification.save(function(Nofifyerr, Notifydata) {
                                                        if(Nofifyerr) {
                                                            res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});   
                                                        } else {
                                                            GetAnsData(FindRates);
                                                        }
                                                    });
                                                }
                                            });
                                        }else {
                                            GetAnsData(FindRates);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
     
};

exports.AnswerRatingAdd = function(req, res) {
    console.log(req.body);
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " UserId can not be Empty! "});
    }
    if(!req.body.PostId) {
        res.status(400).send({status:"False", message: " PostId can not be Empty! "});
    }
    if(!req.body.AnswerId) {
        res.status(400).send({status:"False", message: " AnswerId can not be Empty! "});
    }
    if(!req.body.AnswerUserId) {
        res.status(400).send({status:"False", message: " AnswerUserId can not be Empty! "});
    }
    if(!req.body.Date) {
        res.status(400).send({status:"False", message: " Date can not be Empty! "});
    }
    if(!req.body.Rating) {
        res.status(400).send({status:"False", message: " Rating can not be Empty! "});
    }

    var varAnswerRating = new Model.AnswerRating({
            UserId: req.body.UserId,
            PostId: req.body.PostId,
            AnswerId: req.body.AnswerId,
            AnswerUserId: req.body.AnswerUserId,
            Rating:req.body.Rating,
            Date: req.body.Date,
            ActiveStates: 'Active'
    });

    Model.AnswerRating.find({'UserId': req.body.UserId , 'AnswerId': req.body.AnswerId, 'AnswerUserId': req.body.AnswerUserId }, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error:err, message: "Some error occurred while Find AnswerRating ."});
        } else {
            if(result.length > 0){
                res.send({status:"True", message:'Answer Already Rated', data: result });
            }else{
                varAnswerRating.save(function(newerr, newresult) {
                    if(newerr) {
                        res.status(500).send({status:"False", Error: newerr, message: "Some error occurred while Rate the Answer."});
                    } else {
                        Model.AnswerRating.count({ 'AnswerId': req.body.AnswerId, 'ActiveStates': 'Active' }, function(counterr, count){
                            if(counterr) {
                                res.status(500).send({status:"False", Error: counterr, message: "Some error occurred while Rate the Answer."});
                                
                            } else {
                                var RatingCount = count;
                                Model.AnswerRating.find({ 'AnswerId': req.body.AnswerId, 'ActiveStates': 'Active' }, function(FindErr, FindRates){   
                                    if(FindErr) {
                                        res.status(500).send({status:"False", Error: FindErr, message: "Some error occurred while Rate the Answer."});
                                    } else {
                                        var RatingCal = 0 ;

                                        const GetAnsData = (FindRates) => 
                                            Promise.all( FindRates.map(rateinfo => getPostInfo(rateinfo) ) )
                                                .then( RatingResult => {
                                                    var returnRating = JSON.parse(RatingCal) / JSON.parse(RatingCount);
                                                    var newArray = [];
                                                        newArray.push( {
                                                                        PostId: newresult.PostId,
                                                                        AnswerId: newresult.AnswerId,
                                                                        AnswerUserId: newresult.AnswerUserId,
                                                                        Rating: newresult.Rating,
                                                                        UserId: newresult.UserId,
                                                                        _id:newresult._id,
                                                                        OverallRating:returnRating
                                                                    }
                                                        );
                                                        res.send({status:"True", data: newArray[0]});
                                                })
                                                .catch(someerr => res.send({ status: "False", Error: someerr }));

                                                const getPostInfo = rateinfo =>
                                                    Promise.all([
                                                        Model.AnswerRating.findOne({ '_id': rateinfo._id}).exec(),
                                                    ]).then(data => {
                                                        RatingCal += JSON.parse(data[0].Rating);
                                                        return data;
                                                    }).catch(error => {
                                                        console.log(error);
                                                    });
                                                    
                                        if ( req.body.UserId !== req.body.AnswerUserId ) {
                                            CommentAndAnswer.QuestionsAnswer.findOne({'_id': req.body.AnswerId}, function (Quserr, Qusresult) {
                                                if (Quserr) {
                                                    res.status(500).send({ status: "False", Error: Quserr, message: "Some error occurred ." });
                                                } else {
                                                    var anstext = Qusresult.AnswerText;
                                                    var varNotification = new NotificationModel.Notification({
                                                        UserId:  req.body.UserId,
                                                        AnswerText: anstext,
                                                        ResponseUserId: req.body.AnswerUserId,
                                                        QuestionPostId: req.body.PostId,
                                                        QuestionAnswerId: req.body.AnswerId,
                                                        AnswerRating: req.body.Rating,
                                                        AnswerRatingId:newresult._id,
                                                        NotificationType: 16,
                                                        Viewed: 0,
                                                        NotificationDate: new Date()
                                                    });
                                                    varNotification.save(function(Nofifyerr, Notifydata) {
                                                        if(Nofifyerr) {
                                                            res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});   
                                                        } else {
                                                            GetAnsData(FindRates);
                                                        }
                                                    });
                                                }
                                            });
                                        }else {
                                            GetAnsData(FindRates);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
     
};