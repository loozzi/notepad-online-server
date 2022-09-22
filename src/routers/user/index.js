const express = require('express');
const router = express.Router();
const UserModel = require('../../models/User.js');
const jwt = require('../../jwt.js');
const md5 = require('md5');

// Init value
const page_limit = 10;

// Import middleware
const middleware = require('../middleware.js');
const extended = require('./extended.js');

router.get('/', middleware.checkLogin, (req, res, next) => {
    res.json({
        success: true,
        data: {
            username: res.data.username,
            email: res.data.email,
            note_count: res.data.note_count,
            avatar: res.data.note_count
        }
    });
});

router.get('/all', middleware.checkLogin, middleware.checkAdmin, (req, res, next) => {
    const page = Number.parseInt(req.query.page);
    if (page < 1)
        page = 1;
    UserModel.count({})
        .then(c => c)
        .then(c => {
            UserModel.find({})
                .skip((page - 1) * page_limit)
                .limit(page_limit)
                .then(data => {
                    res.json({
                        success: true,
                        data: data
                    });
                })
        })
        .catch(error => {
            res.status(400).json({
                success: false,
                logs: 'Error'
            });
        })
});

router.get('/:id', middleware.checkLogin, (req, res, next) => {
    try {
        UserModel.findOne({
            username: req.params.id
        })
            .then(data => {
                res.json({
                    success: true,
                    data: {
                        username: data.username,
                        email: data.email,
                        note_count: data.note_count,
                        avatar: data.avatar
                    }
                });
            })
            .catch(error => {
                res.status(400).json({
                    success: false,
                    logs: 'ID not exist'
                })
            })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            logs: 'Error looking up id'
        })
    }
});


router.post('/:method', (req, res, next) => {
    if (req.params.method == 'login') {
        extended.login(req, res, next);
    } else if (req.params.method == "register") {
        extended.register(req, res, next);
    } else {
        res.status(400).json({
            success: false,
            logs: 'Cannot find method'
        })
    }
});

router.put('/', middleware.checkLogin, (req, res, next) => {
    UserModel.findOneAndUpdate({
        _id:res.data._id,
        password: md5(req.body.password)

    }, {
        password: md5(req.body.new_password.trim())
    }).then(data => {
        if (data) {
            res.json({
                success: true,
                data: {
                    username: data.username,
                    email: data.email,
                }
            });
        } else {
            res.status(400).json({
                success: false,
                logs: 'Wrong password'
            })
        }
    })
        .catch(error => {
            res.status(400).json({
                success: false,
                logs: 'Error when edit user'
            })
        })
});

router.delete('/:id', middleware.checkLogin, middleware.checkAdmin, (req, res, next) => {
    try {
        UserModel.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            logs: 'Error when delete user'
        })
    }
});


module.exports = router;