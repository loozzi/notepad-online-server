const NoteModel = require('../../models/Note.js');
const UserModel = require('../../models/User.js');
const md5 = require('md5');


function getNoteWithPassword(req, res, next) {
    const permalink = req.params.permalink;
    let password;
    try {
        password = req.query.password;
        if (password.length > 0)
            password = md5(password);
        else
            password = "";
    } catch (error) {
        password = "";
    }
    NoteModel.findOne({
        permalink: permalink,
        password: password
    })
        .then(dataNote => {
            if (dataNote) {
                UserModel.findById(dataNote.user_id)
                    .then(dataUser => {
                        res.json({
                            title: dataNote.title,
                            author: dataUser.username,
                            body: dataNote.body,
                            tags: dataNote.tags,
                            time_create: dataNote.time_create,
                            view: dataNote.view,
                            is_lock: false
                        });
                    })
                    .catch(error => {
                        res.json({
                            title: dataNote.title,
                            author: "********",
                            body: dataNote.body,
                            tags: dataNote.tags,
                            time_create: dataNote.time_create,
                            view: dataNote.view,
                            is_lock: false
                        });
                    })
            } else {
                res.status(400).json({
                    success: false,
                    logs: 'Note does not exist or password is wrong'
                });
            }
        })
        .catch(error => {
            res.status(400).json({
                success: false,
                logs: 'Error when find note'
            });
        })
}

// function getNoteWithPassword111(req, res, next) {
//     NoteModel.findOne({
//         permalink: req.params.permalink,
//         password: md5(req.query.password)
//     })
//         .then(dataNote => {
//             if (dataNote) {
//                 return {
//                     title: dataNote.title,
//                     user_id: dataNote.user_id,
//                     body: dataNote.body,
//                     tags: dataNote.tags,
//                     time_create: dataNote.time_create,
//                     view: dataNote.view,
//                     is_lock: false
//                 }
//             } else {
//                 res.status(400).json({
//                     success: false,
//                     logs: 'Note does not exist or password is wrong',
//                     data: {
//                         title: dataNote.title,
//                         time_create: dataNote.time_create,
//                         view: dataNote.view,
//                         is_lock: true
//                     }
//                 });
//             }
//         })
//         .then(dataNote => {
//             UserModel.findById(dataNote.user_id)
//                 .then(dataUser => {
//                     if (dataUser) {
//                         res.json({
//                             success: true,
//                             data: {
//                                 title: dataNote.title,
//                                 author: dataUser.username,
//                                 body: dataNote.body,
//                                 tags: dataNote.tags,
//                                 time_create: dataNote.time_create,
//                                 view: dataNote.view,
//                                 is_lock: false
//                             }
//                         });
//                     } else {
//                         res.json({
//                             success: true,
//                             data: {
//                                 title: dataNote.title,
//                                 author: "********",
//                                 body: dataNote.body,
//                                 tags: dataNote.tags,
//                                 time_create: dataNote.time_create,
//                                 view: dataNote.view,
//                                 is_lock: false
//                             }
//                         });
//                     }
//                 })
//                 .catch(error => {
//                     res.status(400).json({
//                         success: false,
//                         logs: 'Error when get note'
//                     })
//                 })
//         })
//         .catch(error => {
//             res.status(400).json({
//                 success: false,
//                 logs: 'Error when find note'
//             });
//         })
// }


function randomPermalink(length) {
    const s = "zxcvbnmasdfghjklqwertyuiop1234567890";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += s[Math.floor(Math.random() * s.length)];
    }
    return result;
}

module.exports = {
    getNoteWithPassword,
    randomPermalink
}