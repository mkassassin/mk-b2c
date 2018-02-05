var Model = require('../models/LikeAndRating.model.js');
var NotificationModel = require('../models/Notificatio.model.js');

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
                            var varNotification = new NotificationModel.Notification({
                                UserId:  req.body.UserId,
                                HighlightPostId: req.body.PostId,
                                ResponseUserId: req.body.PostUserId,
                                HighlightLikeId:newresult._id,
                                NotificationType: 6,
                                Viewed: 0,
                                NotificationDate: new Date
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
                    res.send({status:"True", message:'Post Already Liked', data: result });
                }
            }else{
                varHighlightsLike.save(function(newerr, newresult) {
                    if(newerr) {
                        res.status(500).send({status:"False", Error: newerr, message: "Some error occurred while Like the Post."});    
                    } else {
                        var varNotification = new NotificationModel.Notification({
                            UserId:  req.body.UserId,
                            ResponseUserId: req.body.PostUserId,
                            HighlightPostId: req.body.PostId,
                            HighlightLikeId:newresult._id,
                            NotificationType: 6,
                            Viewed: 0,
                            NotificationDate: new Date
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
                        var varNotification = new NotificationModel.Notification({
                            UserId:  req.body.UserId,
                            ResponseUserId: req.body.PostUserId,
                            QuestionPostId: req.body.PostId,
                            QuestionRatingId:newresult._id,
                            NotificationType: 10,
                            Viewed: 0,
                            NotificationDate: new Date
                        });
                        varNotification.save(function(Nofifyerr, Notifydata) {
                            if(Nofifyerr) {
                                res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});
                                
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
                                                                console.log(error)
                                                            })                                                                    

                                                GetAnsData(FindRates);

                                            }
                                        });
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
