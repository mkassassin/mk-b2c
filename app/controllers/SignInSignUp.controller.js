var UserModel = require('../models/SignInSignUp.model.js');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kathiraashi@gmail.com',
      pass: 'kathiraashi123'
    }
  });
  


exports.Register = function(req, res) {
    if(!req.body.UserName) {
        res.status(400).send({status:"False", message: " Name can not be Empty! "});
    }
    if(!req.body.UserEmail){
        res.status(400).send({status:"False", message: " E-mail can not be Empty! "});
    }
    if(!req.body.UserPassword){
        res.status(400).send({status:"False", message: " Password can not be Empty! "});
    }
    if(!req.body.UserCategoryId || !req.body.UserCategoryName ){
        res.status(400).send({status:"False", message: " Select Any One Category "});
    }

    var varUserType = new UserModel.UserType({
            UserName:  req.body.UserName,
            UserEmail: req.body.UserEmail,
            UserPassword: req.body.UserPassword,
            UserCategoryId:req.body.UserCategoryId,
            UserCategoryName:req.body.UserCategoryName,
            UserImage:req.body.UserImage || "userImage.png",
            UserCompany:req.body.UserCompany || "",
            UserProfession:req.body.UserProfession || "",
            UserDateOfBirth:req.body.UserDateOfBirth || "",
            UserGender:req.body.UserGender || "",
            UserCountry:req.body.UserCountry || "",
            UserState:req.body.UserState || "",
            UserCity:req.body.UserCity || ""
    });

     
    varUserType.save(function(err, result) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while creating the Account."});            
        } else {
            res.send({status:"True", data: result });
        }
    });
};


exports.NameValidate = function(req, res) {
        UserModel.UserType.findOne({'UserName': req.params.name.toLowerCase()}, function(err, data) {
            if(err) {
                res.status(500).send({status:"False", message: "Some error occurred while Validate The Name."});
            } else {
                if(data === null){
                    res.send({ status:"True", available: "True", message: "( " + req.params.name + " ) This Name is Available." });
                }else{
                    res.send({ status:"True", available: "False", message: "( " + req.params.name + " ) This Name is Already Exist. " });
                } 
            }
        });
};


exports.EmailValidate = function(req, res) {
    UserModel.UserType.findOne({'UserEmail': req.params.email.toLowerCase()}, function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while Validate The E-mail."});
        } else {
            if(data === null){
                res.send({ status:"True", available: "True", message: "( " + req.params.email + " ) This E-mail is Available." });
            }else{
                res.send({ status:"True", available: "False", message: "( " + req.params.email + " ) This E-mail is Already Exist. " });
            } 
        }
    });
};


exports.UserValidate = function(req, res) {
    UserModel.UserType.findOne({'UserEmail': req.params.email.toLowerCase(), 'UserPassword': req.params.password}, "_id UserName UserEmail UserCategoryId UserCategoryName UserImage UserProfession UserCompany", function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while User Validate."});
        } else {
            if(data === null){
                UserModel.UserType.findOne({'UserEmail': req.params.email.toLowerCase()}, function(err, result) {
                    if(err) {
                        res.status(500).send({status:"False", message: "Some error occurred while Validate The E-mail."});
                    } else {
                        if(result !== null){
                            res.send({ status:"False", message: " Email and Password Not Match! " });
                        }else{
                            res.send({ status:"False", message: " Invalid Username and Password  " });
                        } 
                    }
                });
            }else{
                res.send({ status:"True", message: "Sign In Successfully", data:data });
            } 
        }
    });
};



exports.MobileUserValidate= function(req, res) {
    UserModel.UserType.findOne({'UserEmail': req.body.email.toLowerCase(), 'UserPassword': req.body.password}, "_id UserName UserEmail UserCategoryId UserCategoryName UserImage UserProfession UserCompany", function(err, data) {
        if(err) {
            res.status(500).send({status:"False", message: "Some error occurred while User Validate."});
        } else {
            if(data === null){
                UserModel.UserType.findOne({'UserEmail': req.body.email.toLowerCase()}, function(err, result) {
                    if(err) {
                        res.status(500).send({status:"False", message: "Some error occurred while Validate The E-mail."});
                    } else {
                        if(result !== null){
                            res.send({ status:"False", message: " Email and Password Not Match! " });
                        }else{
                            res.send({ status:"False", message: " Invalid Username and Password  " });
                        } 
                    }
                });
            }else{
                res.send({ status:"True", message: "Sign In Successfully", data:data });
            } 
        }
    });
};