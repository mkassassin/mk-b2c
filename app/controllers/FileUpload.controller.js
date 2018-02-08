var FileUploadModel = require('../models/FileUpload.model.js');
var multer = require('multer');
var UserModel = require('../models/SignInSignUp.model.js');

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






var ImageStore = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './view/src/assets/Uploads/Images');
    },
    filename:function(req, file, cb){
        cb(null, Date.now() +"-"+ file.originalname);
    }
})

var VideoStore = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './view/src/assets/Uploads/Videos');
    },
    filename:function(req, file, cb){
        cb(null, Date.now() +"-"+ file.originalname);
    }
})

var UserStore = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './view/src/assets/images/users');
    },
    filename:function(req, file, cb){
        cb(null, Date.now() +"-"+ file.originalname);
    }
})

var ImageUpload = multer({storage:ImageStore}).single('file');

var VideoUpload = multer({storage:VideoStore}).single('file');

var ProfileUpload = multer({storage:UserStore}).single('file');

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
        }
    })
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
        }
    })
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
        }
    });
};