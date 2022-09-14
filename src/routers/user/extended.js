const UserModel = require("../../models/User.js");
const jwt = require("../../jwt.js");
const md5 = require('md5');

function login(req, res, next) {
    try {
        const username = req.body.username;
        const password = md5(req.body.password);
        const remember = Boolean(req.query.remember);
        if (username && password) {
            UserModel.findOne({
                $or: [
                    {
                        username: username,
                        password: password
                    },
                    {
                        email: username,
                        password: password
                    }
                ]
            })
                .then(data => {
                    const token = jwt.genToken({
                        id: data._id,
                        remember
                    });
                    res.json({
                        success: true,
                        token: token
                    })
                })
                .catch(error => {
                    res.status(400).json({
                        success: false,
                        logs: "Password is incorrect!"
                    })
                })
        }
    }
    catch (error) {
        res.status(400).json({
            success: false,
            logs: 'Error when login'
        })
    }
}


function register(req, res, next) {
    const email = req.body.email.trim().toLowerCase();
    const username = req.body.username.trim().toLowerCase();
    const password = md5(req.body.password.trim());
    try {
        UserModel.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
            .then(data => {
                if (data) {
                    res.status(400).json({
                        success: false,
                        logs: 'Username or email exist. Please try again'
                    })
                } else {
                    UserModel.create({
                        username: username,
                        password: password,
                        email: email
                    });
                    res.json({
                        success: true,
                        logs: "OK"
                    })
                }
            })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            logs: 'Error when register'
        })
    }
}


function changePassword(req, res, next) {
    const oldPassword = req.body.oldPassword.trim();
    const newPassword = req.body.newPassword.trim();
    if (oldPassword && newPassword) {
        UserModel.findOneAndUpdate({
            _id: data._id,
            password: md5(oldPassword),
        }, {
            password: md5(newPassword)
        })
            .then(data => {
                if (data)
                    res.json({
                        success: true
                    });
                else
                    res.status(400).json({
                        success: false,
                        logs: 'Invalid old password'
                    });
            })
            .catch(error => {
                res.status(400).json({
                    success: false,
                    logs: 'Error when change password'
                });
            })
    }
}

function changeAvatar(req, res, next) {
    UserModel.findByIdAndUpdate(res.data._id, {
        avatar: req.body.avatar.trim()
    }).then(data => {
        if (data) {
            res.json({
                success: true
            });
        } else {
            res.status(400).json({
                success: false,
                logs: 'Cannot change avatar'
            })
        }
    })
        .catch(error => {
            res.status(400).json({
                success: false,
                logs: 'Error when change avatar'
            })
        })
}

function changeEmail(req, res, next) {
    UserModel.findByIdAndUpdate(res.data._id, {
        email: req.body.email.trim()
    }).then(data => {
        if (data) {
            res.json({
                success: true
            });
        } else {
            res.status(400).json({
                success: false,
                logs: 'Cannot change email'
            })
        }
    })
        .catch(error => {
            res.status(400).json({
                success: false,
                logs: 'Error when change email'
            })
        })
}

module.exports = {
    login, register,
    changePassword, changeAvatar, changeEmail
}