const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    note_count: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: 'https://64.media.tumblr.com/b21486111f59fc337d5aacffb69fd3ad/3e4b9bffcc0b93d5-2b/s640x960/287eadc3a74b892b1d438253fa2a8188e6d6ee49.jpg'
    },
    role: {
        type: Number,
        default: 1
    }
});

const UserModel = mongoose.model('User', User);
module.exports = UserModel;