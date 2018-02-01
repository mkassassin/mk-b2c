var Model = require('../models/CommentAndAnswer.model.js');


exports.HighlightsCommentAdd = function(req, res) {
    if(!req.body.UserId) {
        res.status(400).send({status:"False", message: " UserId can not be Empty! "});
    }
    if(!req.body.PostId) {
        res.status(400).send({status:"False", message: " PostId can not be Empty! "});
    }
    if(!req.body.PostUserId) {
        res.status(400).send({status:"False", message: " PostUserId can not be Empty! "});
    }
    if(!req.body.CommentText) {
        res.status(400).send({status:"False", message: " Comment can not be Empty! "});
    }
    if(!req.body.Date) {
        res.status(400).send({status:"False", message: " Date can not be Empty! "});
    }


    var varHighlightsComment = new Model.HighlightsComment({
            UserId: req.body.UserId,
            PostId: req.body.PostId,
            PostUserId: req.body.PostUserId,
            Date: req.body.Date,
            ActiveStates: 'Active'
    });

    varHighlightsComment.save(function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Like the Post."});
            
        } else {
            res.send({status:"True", data: result });
        }
    });


     
};



exports.QuestionsAnwerAdd = function(req, res) {
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
    if(!req.body.AnswerText) {
        res.status(400).send({status:"False", message: " Answer can not be Empty! "});
    }

    var varQuestionsAnwer = new Model.QuestionsAnwer({
            UserId: req.body.UserId,
            PostId: req.body.PostId,
            PostUserId: req.body.PostUserId,
            AnswerText:req.body.AnswerText,
            Date: req.body.Date,
            ActiveStates: 'Active'
    });

    varQuestionsAnwer.save(function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while Like the Post."});
            
        } else {
            res.send({status:"True", data: result });
        }
    });

     
};
