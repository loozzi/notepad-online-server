const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://loozzi_myapp:pI5NCGIey19ga1nK@cluster0.hqs96.mongodb.net/notepad_online');
        console.log('Connect to database successfully');
    } catch (error) {
        console.log('Connect to database failed')
    }
}

module.exports = {
    connect
}