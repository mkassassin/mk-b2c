var ReportModel = require('../models/ReportAndDelete.model.js');


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
    console.log(req.body);
    ReportModel.ReportPost.find({'UserId': req.body.UserId, 'PostType': req.body.PostType, 'PostId': req.body.PostId, 'ActiveStates': 'Active' }, function(err, data) {
            if(err) {
                res.status(500).send({status:"False", Error:err,  message: "Some error occurred while Validate Report Post."});
            } else {
                console.log(data);
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