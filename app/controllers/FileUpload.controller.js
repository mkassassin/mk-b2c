var FileUploadModel = require('../models/FileUpload.model.js');
var multer = require('multer');
var UserModel = require('../models/SignInSignUp.model.js');
var TopicsModel = require('../models/Topics.model.js');
var NotificationModel = require('../models/Notificatio.model.js');
var FollowModel = require('../models/Follow.model.js');

var usersProjection = { 
    __v: false,
    UserEmail: false,
    UserPassword: false,
    UserCountry: false,
    UserState: false,
    UserCity: false,
    UserDateOfBirth: false,
    UserEmailVerifyToken: false,
    UserGender: false,
    createdAt: false,
    updatedAt: false,
};






var ImageStore = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './uploads/images');
    },
    filename:function(req, file, cb){
        var ext = file.originalname.substring(file.originalname.indexOf('.'));
        cb(null, Date.now() + ext);
    }
});

var VideoStore = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './uploads/videos');
    },
    filename:function(req, file, cb){
        var ext = file.originalname.substring(file.originalname.indexOf('.'));
        cb(null, Date.now() + ext);
    }
});

var UserStore = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './uploads/users');
    },
    filename:function(req, file, cb){
        var ext = file.originalname.substring(file.originalname.indexOf('.'));
        cb(null, Date.now() + ext);
    }
});


var TopicsStore = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './uploads/topics');
    },
    filename:function(req, file, cb){
        var ext = file.originalname.substring(file.originalname.indexOf('.'));
        cb(null, Date.now() + ext);
    }
});



var ImageUpload = multer({storage:ImageStore}).single('file');

var VideoUpload = multer({storage:VideoStore}).single('file');

var ProfileUpload = multer({storage:UserStore}).single('file');

var CreateTopic = multer({storage:TopicsStore}).single('file');


exports.UploadImageFile = function(req, res) {
    ImageUpload(req, res, function(uploaderr){
        if(uploaderr){
            res.status(500).send({status:"False", Error:uploaderr});
        }else{
            if(!req.body.UserId) {
                res.status(400).send({status:"False", message: " User Id can not be Empty! "});
            }
            if(!req.file.filename){
                res.status(400).send({status:"False", message: " File can not be Empty! "});
            }

            if ( req.body.UserId && req.file.filename ) {
            
                var varImageFile = new FileUploadModel.ImageFile({
                        UserId:  req.body.UserId,
                        FileName: req.file.filename,
                        ActiveStates: 'Active',
                });
            
                varImageFile.save(function(err, result) {
                    if(err) {
                        res.status(500).send({status:"False", message: "Some error occurred while Upload The File.", Error : err});
                        
                    } else {
                        res.send({status:"True", data: result });
                    }
                });
            }else{
                res.status(400).send({status:"False", message: " Some Error Occurred "});
            }
        }
    });
};




exports.UploadVideoFile = function(req, res) {
    VideoUpload(req, res, function(err){
        if(err){
            res.status(500).send({status:"False", Error:err});
        }else{
            if(!req.body.UserId) {
                res.status(400).send({status:"False", message: " User Id can not be Empty! "});
            }
            if(!req.file.filename){
                res.status(400).send({status:"False", message: " File can not be Empty! "});
            }
            
            if ( req.body.UserId && req.file.filename ) {
                var varVideoFile = new FileUploadModel.VideoFile({
                        UserId:  req.body.UserId,
                        FileName: req.file.filename,
                        ActiveStates: 'Active',
                });
            
                varVideoFile.save(function(err, result) {
                    if(err) {
                        res.status(500).send({status:"False", message: "Some error occurred while Upload The File.", Error : err});
                        
                    } else {
                        res.send({status:"True", data: result });
                    }
                });
            }else{
                res.status(400).send({status:"False", message: " Some Error Occurred "});
            }
        }
    });
};





exports.ProfileUpdate = function(req, res) {
    ProfileUpload(req, res, function(uploaderr){
      
        if(uploaderr){
            res.status(500).send({status:"False", Error:uploaderr});
        }else{
            if(!req.body.UserId) {
                res.status(400).send({status:"False", message: " User Id can not be Empty! "});
            }
            if(!req.file.filename){
                res.status(400).send({status:"False", message: " File can not be Empty! "});
            }

            if ( req.body.UserId && req.file.filename ) {
                UserModel.UserType.findOne({'_id': req.body.UserId}, "_id UserName UserEmail UserCategoryId UserCategoryName UserImage UserProfession UserCompany", function(err, data) {
                    if(err) {
                        res.status(500).send({status:"False", message: "Some error occurred while User Find."});
                    } else {
                        data.UserImage = req.file.filename;
                        data.save(function (newerr, newresult) {
                            if (newerr){
                                res.status(500).send({status:"False", Error: newerr,  message: "Some error occurred while Update Image ."});
                            }else{
                                res.send({status:"True", data: newresult });
                            }
                        });
                    }
                });
            }else{
                res.status(400).send({status:"False", message: " Some Error Occurred "});
            }
        }
    });
};










exports.CreateTopic = function(req, res) {
    CreateTopic(req, res, function(uploaderr){
        if(uploaderr){
            res.status(500).send({status:"False", Error:uploaderr});
        }else{
            if(!req.body.TopicName) {
                res.status(400).send({status:"False", message: "Topic Name can not be Empty! "});
            }
            if(!req.body.UserId) {
                res.status(400).send({status:"False", message: " User Id can not be Empty! "});
            }
            if(!req.file.filename){
                res.status(400).send({status:"False", message: " File can not be Empty! "});
            }

            var varTopicsType = new TopicsModel.TopicsType({
                UserId: req.body.UserId,
                TopicName:  req.body.TopicName,
                TopicDescription: req.body.TopicDescription || "",
                TopicImage: req.file.filename,
                Date: new Date()
            });
            
            varTopicsType.save(function(err, result) {
                if(err) {
                    res.status(500).send({status:"False", Error: err, message: "Some error occurred while creating the Topic."}); 
                } else {

                    var varNotification = new NotificationModel.Notification({
                        UserId:  req.body.UserId,
                        FollowTopicId: result._id,
                        NotificationType: 3,
                        Viewed: 0,
                        NotificationDate: new Date()
                });

                    var varFollowTopicType = new FollowModel.FollowTopicType({
                        UserId:  req.body.UserId,
                        FollowingTopicId: result._id,
                        ActiveStates: 'Active',
                });

                FollowModel.FollowTopicType.find({UserId:req.body.UserId, FollowingTopicId:req.body.FollowingTopicId }, function(errnew, resultnew) {
                    if(errnew) {
                        res.status(500).send({status:"False", Error:errnew,  message: "Some error occurred while Follow The Topic "});
                    } else {
                            varFollowTopicType.save(function(Newerr, data) {
                                if(Newerr) {
                                    res.status(500).send({status:"False", Error:Newerr, message: "Some error occurred while Follow The Topic."});
                                    
                                } else {
                                    varNotification.save(function(Nofifyerr, Notifydata) {
                                        if(Nofifyerr) {
                                            res.status(500).send({status:"False", Error:Nofifyerr, message: "Some error occurred while Topic Follow Notification Add ."});   
                                        } else {
                                            res.send({status:"True", data: result });
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