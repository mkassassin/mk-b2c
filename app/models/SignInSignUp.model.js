var mongoose = require('mongoose');

var NoteSchema = mongoose.Schema({
    title: String,
    content: String,
    author: String
    }, 
    { timestamps: true }
);

var NewNoteSchema = mongoose.Schema({
    newtitle: String,
    newcontent: String,
    newauthor: String
    }, 
    { timestamps: true }
);

var varNote = mongoose.model('Note', NoteSchema, 'user');

var varNewNote = mongoose.model('NewNote', NewNoteSchema, 'newuser');

module.exports = {
    Note : varNote,
    NewNote : varNewNote
};