const UserModel = require('../models/User.js');
const jwt = require('../jwt.js');

function checkLogin(req, res, next) {
    const token = req.query.token;
    try {
        const dataToken = jwt.decodeToken(token);
        UserModel.findById(dataToken.id)
            .then(data => {
                if (data) {
                    res.data = data;
                    next();
                } else {
                    res.status(400).json({
                        success: false,
                        logs: 'Token expiried'
                    });
                }
            })
            .catch(error => {
                res.status(400).json({
                    success: false,
                    logs: 'Token expiried'
                });
            })
    } catch (error) {
        res.status(400).json({
            success: false,
            logs: 'Error'
        });
    }
}

function checkAdmin(req, res, next) {
    if (res.data.role == 0) {
        next();
    } else {
        res.status(400).json({
            success: false,
            logs: 'You not have permission'
        })
    }
}


module.exports = {
    checkAdmin,
    checkLogin
}