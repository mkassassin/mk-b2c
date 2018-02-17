var TopicsModel = require('../models/Topics.model.js');


exports.Register = function(req, res) {
    if(!req.body.TopicName) {
        res.status(400).send({status:"False", message: " Name can not be Empty! "});
    }

    var varTopicsType = new TopicsModel.TopicsType({
            TopicName:  req.body.TopicName,
            TopicDescription: req.body.TopicDescription || "",
            TopicImage:req.body.TopicImage || "topicImage.png"
    });

     
    varTopicsType.save(function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error: err, message: "Some error occurred while creating the Topic."});
            
        } else {
            res.send({status:"True", data: result });
        }
    });
};


exports.NameValidate = function(req, res) {
        TopicsModel.TopicsType.findOne({'TopicName': req.params.name}, function(err, data) {
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



// 5a883a1e4c1cd65a5a1d19ec7011bb4a8ee7426a5cdcb