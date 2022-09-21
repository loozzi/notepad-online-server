const express = require('express');
const router = express.Router();
const md5 = require('md5');

// Init data

// Import
const middleware = require('../middleware.js');
const NoteModel = require('../../models/Note.js');
const UserModel = require('../../models/User.js');
const extended = require('./extended.js');

// Router
router.get('/', middleware.checkLogin, (req, res, next) => {
    const num = Number.parseInt(req.query.limit);

    NoteModel.find({ user_id: res.data._id })
        .then(data => {
            return data.sort((x, y) => y.time_create - x.time_create).splice(0, num);

        })
        .then(data => {
            res.json({
                success: true,
                data: data.map(e => {
                    return {
                  title: e.title,
                  body: e.body,
                  permalink: e.permalink,
                  tags: e.tags,
                  time_create: e.time_create,
                  view: e.view,
                  lock: (e.password.length != 0)
                  }
                })
            })
        })
        .catch(error => {
            res.status(400).json({
                success: false,
                logs: 'Error when get notes'
            })
        })
});

router.get('/all', middleware.checkLogin, (req, res, next) => {
    let page = Number.parseInt(req.query.page);
    if (page < 1)
        page = 1;
    const limit = Number.parseInt(req.query.limit);
    NoteModel.find({
        user_id: res.data._id
    })
        .skip((page - 1) * limit)
        .limit(limit)
        .then(data => {
            res.json({
                success: true,
                limit: limit * (page - 1) + data.length,
                data: data.map(e => {
                    return {
                  title: e.title,
                  body: e.body,
                  permalink: e.permalink,
                  tags: e.tags,
                  time_create: e.time_create,
                  view: e.view,
                  lock: (e.password.length != 0)
                  }
                })
            });
        })
        .catch(error => {
            res.status(400).json({
                success: false,
                logs: 'Error when get note'
            })
        })
})

router.get('/:permalink', (req, res, next) => {
    extended.getNoteWithPassword(req, res, next);
})

router.post('/', middleware.checkLogin, (req, res, next) => {
    let password = req.body.password;
    let permalink = extended.randomPermalink(10);
    if (password.length > 0)
        password = md5(password);
    else
        password = "";

    let data = {
        title: req.body.title.trim(),
        body: req.body.body,
        permalink: permalink,
        tags: req.body.tags.split(',').map(e => e.trim()),
        password: password,
        user_id: res.data._id,
        time_create: req.body.time_create
    }

    NoteModel.create(data);
    UserModel.findByIdAndUpdate(res.data._id,{$inc: {
        'note_count':  1
    }});
    res.json({
        success: true,
        data: {
            permalink: permalink
        }
    });

});

router.put('/:permalink', middleware.checkLogin, (req, res, next) => {
    let password = req.body.password;
    if (password.length > 0)
        password = md5(password);
    else
        password = "";
    NoteModel.findOneAndUpdate({
        permalink: req.params.permalink,
        user_id: res.data._id
    }, {
        title: req.body.title.trim(),
        body: req.body.body,
        tags: req.body.tags.split(',').map(e => e.trim()),
        password: password
    })
        .then(data => data)
    res.json({
        success: true
    })
});

router.delete('/:permalink', middleware.checkLogin, (req, res, next) => {
    if (res.data.role == 0) {
        NoteModel.findOneAndDelete({
            permalink: req.params.permalink
        });
        res.json({
            success: true
        });
    } else {
        let password = ""
        if(req.query.password.length > 0)
            password = md5(req.query.password);
        NoteModel.findOneAndDelete({
            permalink: req.params.permalink,
            user_id: res.data._id,
            password: password
        }).then(data => {
            data
        });
        setTimeout(() => {
            NoteModel.findOne({
                permalink: req.params.permalink
            })
            .then(data => {
                if(data == null){
                    res.json({
                        success: true,
                    });
                }
                else {
                    res.json({
                        success: false,
                        logs: 'Can not delete note.'
                    });
                }
            });
        }, 1000)
    }
});


module.exports = router;