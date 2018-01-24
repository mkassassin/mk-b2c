var model = require('../models/SignInSignUp.model.js');

exports.create = function(req, res) {
    // Create and Save a new Note
        if(!req.body.content) {
            res.status(400).send({message: "Note can not be empty"});
        }
        var note = new model.NewNote({
            newtitle: req.body.title || "Untitled Note", 
            newcontent: req.body.content,
            newauthor: req.body.author || "Kathiravan"
        });

        note.save(function(err, data) {
            if(err) {
                console.log(err);
                res.status(500).send({message: "Some error occurred while creating the Note."});
            } else {
                res.send(data);
            }
        });

};

exports.findAll = function(req, res) {
    // Retrieve and return all notes from the database.
        model.NewNote.find(function(err, notes){
            if(err) {
                res.status(500).send({message: "Some error occurred while retrieving notes."});
            } else {
                res.send(notes);
            }
        });
};

exports.findOne = function(req, res) {
    // Find a single note with a noteId
        model.NewNote.findById(req.params.noteId, function(err, data) {
            if(err) {
                res.status(500).send({message: "Could not retrieve note with id " + req.params.noteId});
            } else {
                res.send(data);
            }
        });

};

exports.update = function(req, res) {
    // Update a note identified by the noteId in the request
        model.NewNote.findById(req.params.noteId, function(err, note) {
            if(err) {
                res.status(500).send({message: "Could not find a note with id " + req.params.noteId});
            }

            note.newtitle = req.body.title;
            note.newcontent = req.body.content;
            note.newauthor = req.body.author;

            note.save(function(err, data){
                if(err) {
                    res.status(500).send({message: "Could not update note with id " + req.params.noteId});
                } else {
                    res.send(data);
                }
            });
        });
};

exports.delete = function(req, res) {
    // Delete a note with the specified noteId in the request
        model.NewNote.remove({_id: req.params.noteId}, function(err, data) {
            if(err) {
                res.status(500).send({message: "Could not delete note with id " + req.params.id});
            } else {
                res.send({message: "Note deleted successfully!"})
            }
        });
};