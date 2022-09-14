const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, './configs/keys/privatekey.pem'));
const publicKey = fs.readFileSync(path.join(__dirname, './configs/keys/publickey.crt'));

const TIME_EXPIRIED = 24 * 3600;

function genToken(data, remember = false) {
    try {
        let time;
        if (remember)
            time = TIME_EXPIRIED * 14;
        else
            time = TIME_EXPIRIED;
        return jwt.sign(data, privateKey, {
            expiresIn: time,
            algorithm: 'RS256'
        })
    } catch (error) {
        return '';
    }
}

function decodeToken(token) {
    try {
        return jwt.verify(token, publicKey, {
            algorithms: ['RS256']
        })
    } catch (error) {
        return '';
    }
}

module.exports = {
    genToken,
    decodeToken,
    TIME_EXPIRIED
}