var FileUploadModel = require('../models/FileUpload.model.js');
var multer = require('multer');

var ImageStore = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './uploads/images');
    },
    filename:function(req, file, cb){
        cb(null, Date.now() +"-"+ file.originalname);
    }
})

var VideoStore = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './uploads/videos');
    },
    filename:function(req, file, cb){
        cb(null, Date.now() +"-"+ file.originalname);
    }
})

var ImageUpload = multer({storage:ImageStore}).single('file');

var VideoUpload = multer({storage:VideoStore}).single('file');

exports.UploadImageFile = function(req, res) {
    ImageUpload(req, res, function(err){
        if(err){
            res.status(500).send({status:"False", Error:err});
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


