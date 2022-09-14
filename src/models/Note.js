const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Note = new Schema({
    user_id: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        default: ""
    },
    body: {
        type: String,
        default: ""
    },
    permalink: {
        type: String,
        default: ""
    },
    tags: {
        type: Array,
        default: []
    },
    password: {
        type: String,
        default: ""
    },
    time_create: {
        type: Date,
        default: Date.now()
    },
    view: {
        type: Number,
        default: 0
    }
});

const NoteModel = mongoose.model('Note', Note);
module.exports = NoteModel;

