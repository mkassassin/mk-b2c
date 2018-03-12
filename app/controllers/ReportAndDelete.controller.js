var ReportModel = require('../models/ReportAndDelete.model.js');
var HighlightsPostModel = require('../models/HighlightsPost.model.js');
var NotificationModel = require('../models/Notificatio.model.js');
var QuestionsPostModel = require('../models/QuestionsPost.model.js');
var CommentAndAnswerModel = require('../models/CommentAndAnswer.model.js');
var TrendsModel = require('../models/Trends.model.js');

exports.ReportUser = function(req, res) {
    if(!req.body.UserId) {  res.status(400).send({status:"False", message: " UserId can not be Empty! "}); }
    if(!req.body.ReportUserId) { res.status(400).send({status:"False", message: " Report UserId can not be Empty! "}); }
    if(!req.body.ReportCategory) { res.status(400).send({status:"False", message: " Report Category can not be Empty! "}); }
    if(!req.body.ReportText) { res.status(400).send({status:"False", message: " Report Explain can not be Empty! "});}

    var varReportUser = new ReportModel.ReportUser({
        UserId:  req.body.UserId,
        ReportUserId: req.body.ReportUserId,
        ReportCategory:req.body.ReportCategory,
        ReportText:req.body.ReportText,
        Date:req.body.Date || new Date(),
        ActiveStates: 'Active'
    });

    varReportUser.save(function(err, result) {
        if(err) { 
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Report User."});    
        } else { 
            res.send({status:"True", data: result }); 
        }
    });
};

exports.ReportUserValidate = function(req, res) {
    ReportModel.ReportUser.find({'UserId': req.body.UserId, 'ReportUserId': req.body.ReportUserId, 'ActiveStates': 'Active' }, {}, function(err, data) {
            if(err) {
                res.status(500).send({status:"False", Error:err,  message: "Some error occurred while Validate Report User."});
            } else {
                if(data.length > 0 ){
                    res.send({ status:"True", ValidReport: "False", data: data });
                }else{
                    res.send({ status:"True", ValidReport: "True"});
                } 
            }
        });
};







exports.ReportPost = function(req, res) {
    if(!req.body.UserId) {  res.status(400).send({status:"False", message: " UserId can not be Empty! "}); }
    if(!req.body.PostType) { res.status(400).send({status:"False", message: " Post Type can not be Empty! "}); }
    if(!req.body.PostId) { res.status(400).send({status:"False", message: " PostId can not be Empty! "}); }
    if(!req.body.PostUserId) { res.status(400).send({status:"False", message: " Post UserId can not be Empty! "});}
    if(!req.body.ReportCategory) { res.status(400).send({status:"False", message: " Report Category can not be Empty! "}); }
    if(!req.body.ReportText) { res.status(400).send({status:"False", message: " Report Explain can not be Empty! "});}

    var varReportPost = new ReportModel.ReportPost({
        UserId:  req.body.UserId,
        PostType: req.body.PostType,
        PostId: req.body.PostId,
        PostUserId: req.body.PostUserId,
        ReportCategory:req.body.ReportCategory,
        ReportText:req.body.ReportText,
        Date:req.body.Date || new Date(),
        ActiveStates: 'Active'
    });

    varReportPost.save(function(err, result) {
        if(err) { 
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Report Post."});    
        } else { 
            res.send({status:"True", data: result }); 
        }
    });
};

exports.ReportPostValidate = function(req, res) {
    ReportModel.ReportPost.find({'UserId': req.body.UserId, 'PostType': req.body.PostType, 'PostId': req.body.PostId, 'ActiveStates': 'Active' }, function(err, data) {
            if(err) {
                res.status(500).send({status:"False", Error:err,  message: "Some error occurred while Validate Report Post."});
            } else {
                if(data.length > 0 ){
                    res.send({ status:"True", ValidReport: "False", data: data });
                }else{
                    res.send({ status:"True", ValidReport: "True"});
                } 
            }
        });
};










exports.ReportSecondLevelPost = function(req, res) {
    if(!req.body.UserId) {  res.status(400).send({status:"False", message: " UserId can not be Empty! "}); }
    if(!req.body.PostId) { res.status(400).send({status:"False", message: " PostId can not be Empty! "}); }
    if(!req.body.SecondLevelPostType) { res.status(400).send({status:"False", message: " Second Level Post Type can not be Empty! "}); }
    if(!req.body.SecondLevelPostId) { res.status(400).send({status:"False", message: " Second Level PostId can not be Empty! "}); }
    if(!req.body.SecondLevelPostUserId) { res.status(400).send({status:"False", message: " Second Level Post UserId can not be Empty! "});}
    if(!req.body.ReportCategory) { res.status(400).send({status:"False", message: " Report Category can not be Empty! "}); }
    if(!req.body.ReportText) { res.status(400).send({status:"False", message: " Report Explain can not be Empty! "});}

    var varReportSecondLevelPost = new ReportModel.ReportSecondLevelPost({
        UserId:  req.body.UserId,
        PostId: req.body.PostId,
        SecondLevelPostType: req.body.SecondLevelPostType,
        SecondLevelPostId: req.body.SecondLevelPostId,
        SecondLevelPostUserId: req.body.SecondLevelPostUserId,
        ReportCategory:req.body.ReportCategory,
        ReportText:req.body.ReportText,
        Date:req.body.Date || new Date(),
        ActiveStates: 'Active'
    });

    varReportSecondLevelPost.save(function(err, result) {
        if(err) { 
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Report Post."});    
        } else { 
            res.send({status:"True", data: result }); 
        }
    });
};

exports.ReportSecondLevelPostValidate = function(req, res) {
    ReportModel.ReportSecondLevelPost.find({'UserId': req.body.UserId, 'SecondLevelPostType': req.body.SecondLevelPostType, 'SecondLevelPostId': req.body.SecondLevelPostId, 'ActiveStates': 'Active' }, {}, function(err, data) {
            if(err) {
                res.status(500).send({status:"False", Error:err,  message: "Some error occurred while Validate Report SecondLevel Post."});
            } else {
                if(data.length > 0 ){
                    res.send({ status:"True", ValidReport: "False", data: data });
                }else{
                    res.send({ status:"True", ValidReport: "True"});
                } 
            }
        });
};












exports.DeleteHighlightPost = function(req, res) {
    HighlightsPostModel.HighlightsPostType.findOne({'_id': req.body.PostId, 'UserId': req.body.UserId}, function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Post Find."});
        } else {
            data.ActiveStates = 'Inactive';
            data.save(function (newerr, newresult) {
                if (newerr){
                    res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Delete Post."});
                }else{
                    NotificationModel.Notification.find({'HighlightPostId': req.body.PostId, 'Viewed': { $ne: 2 },}, function(Notifyerr, Notifydata) {
                        if(Notifyerr) {
                            res.status(500).send({status:"False", Error: Notifyerr,  message: "Some error occurred while Notification Find ."});
                        }else {
                            if (Notifydata.length > 0) {
                                UpdateNoftifyData();
                                async function UpdateNoftifyData(){
                                    for (let info of Notifydata) {
                                        await NoftifyInfo(info);
                                     }
                                     res.send({status:"True", message:'Post Successfully Deleted' });
                                  }
                                  
                                  function NoftifyInfo(info){
                                    return new Promise(( resolve, reject ) => {
                                        info.Viewed = 2;
                                        info.save(function (newerr, newresult) {
                                            if (newerr){
                                                reject(newerr);
                                                res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update Notify."});
                                            }else{
                                                resolve(newresult);
                                            }
                                        });
                                    });
                                  }
                        
                            }else {
                                res.send({status:"True", message:'Post Successfully Deleted' });
                            }
                        }
                    });
                }
            });
        }
    });
};




exports.DeleteQuestionPost = function(req, res) {
    QuestionsPostModel.QuestionsPostType.findOne({'_id': req.body.PostId, 'UserId': req.body.UserId}, function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Post Find."});
        } else {
            data.ActiveStates = 'Inactive';
            data.save(function (newerr, newresult) {
                if (newerr){
                    res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Delete Post."});
                }else{
                    NotificationModel.Notification.find({'QuestionPostId': req.body.PostId, 'Viewed': { $ne: 2 },}, function(Notifyerr, Notifydata) {
                        if(Notifyerr) {
                            res.status(500).send({status:"False", Error: Notifyerr,  message: "Some error occurred while Notification Find ."});
                        }else {
                            if (Notifydata.length > 0) {
                                UpdateNoftifyData();
                                async function UpdateNoftifyData(){
                                    for (let info of Notifydata) {
                                        await NoftifyInfo(info);
                                     }
                                     res.send({status:"True", message:'Post Successfully Deleted' });
                                  }
                                  
                                  function NoftifyInfo(info){
                                    return new Promise(( resolve, reject ) => {
                                        info.Viewed = 2;
                                        info.save(function (newerr, newresult) {
                                            if (newerr){
                                                reject(newerr);
                                                res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update Notify."});
                                            }else{
                                                resolve(newresult);
                                            }
                                        });
                                    });
                                  }
                        
                            }else {
                                res.send({status:"True", message:'Post Successfully Deleted' });
                            }
                        }
                    });
                }
            });
        }
    });
};



exports.DeleteComment = function(req, res) {
    CommentAndAnswerModel.HighlightsComment.findOne({'_id': req.body.CommentId, 'UserId': req.body.UserId}, function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Comment Find."});
        } else {
            data.ActiveStates = 'Inactive';
            data.save(function (newerr, newresult) {
                if (newerr){
                    res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Delete Comment."});
                }else{
                    NotificationModel.Notification.find({'HighlightCommentId': req.body.CommentId, 'Viewed': { $ne: 2 },}, function(Notifyerr, Notifydata) {
                        if(Notifyerr) {
                            res.status(500).send({status:"False", Error: Notifyerr,  message: "Some error occurred while Notification Find ."});
                        }else {
                            if (Notifydata.length > 0) {
                                UpdateNoftifyData();
                                async function UpdateNoftifyData(){
                                    for (let info of Notifydata) {
                                        await NoftifyInfo(info);
                                     }
                                     res.send({status:"True", message:'Comment Successfully Deleted' });
                                  }
                                  
                                  function NoftifyInfo(info){
                                    return new Promise(( resolve, reject ) => {
                                        info.Viewed = 2;
                                        info.save(function (newerr, newresult) {
                                            if (newerr){
                                                reject(newerr);
                                                res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update Notify."});
                                            }else{
                                                resolve(newresult);
                                            }
                                        });
                                    });
                                  }
                        
                            }else {
                                res.send({status:"True", message:'Comment Successfully Deleted' });
                            }
                        }
                    });
                }
            });
        }
    });
};



exports.DeleteAnswer = function(req, res) {
    CommentAndAnswerModel.QuestionsAnswer.findOne({'_id': req.body.AnswerId, 'UserId': req.body.UserId}, function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Answer Find."});
        } else {
            data.ActiveStates = 'Inactive';
            data.save(function (newerr, newresult) {
                if (newerr){
                    res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Delete Answer."});
                }else{
                    NotificationModel.Notification.find({'QuestionAnswerId': req.body.AnswerId, 'Viewed': { $ne: 2 },}, function(Notifyerr, Notifydata) {
                        if(Notifyerr) {
                            res.status(500).send({status:"False", Error: Notifyerr,  message: "Some error occurred while Notification Find ."});
                        }else {
                            if (Notifydata.length > 0) {
                                UpdateNoftifyData();
                                async function UpdateNoftifyData(){
                                    for (let info of Notifydata) {
                                        await NoftifyInfo(info);
                                     }
                                     res.send({status:"True", message:'Answer Successfully Deleted' });
                                  }
                                  
                                  function NoftifyInfo(info){
                                    return new Promise(( resolve, reject ) => {
                                        info.Viewed = 2;
                                        info.save(function (newerr, newresult) {
                                            if (newerr){
                                                reject(newerr);
                                                res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update Notify."});
                                            }else{
                                                resolve(newresult);
                                            }
                                        });
                                    });
                                  }
                        
                            }else {
                                res.send({status:"True", message:'Answer Successfully Deleted' });
                            }
                        }
                    });
                }
            });
        }
    });
};



exports.DeleteImpression = function(req, res) {
    TrendsModel.Impressions.findOne({'_id': req.body.ImpressionId, 'UserId': req.body.UserId}, function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Impression Find."});
        } else {
            data.ActiveStates = 'Inactive';
            data.save(function (newerr, newresult) {
                if (newerr){
                    res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Delete Post."});
                }else {
                    res.send({status:"True", message:'Impression Successfully Deleted' });
                }
            });
        }
    });
};