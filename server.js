const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// import anything
const db = require('./src/configs/db/db.js');

// init app
const app = express();
const PORT = 3000;

// enable cors
// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });
const whiteList = ["http://192.168.1.2:8080", '*']
app.use(cors({credentials: true, origin: whiteList}));


// setting app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
db.connect();

// import router
const routerUser = require('./src/routers/user/index.js');
const routerNote = require('./src/routers/note/index.js');

// setting router and path
app.get('/', (req, res, next) => {
    res.json({
        success: true,
        logs: 'ok'
    })
})

app.use('/user', routerUser);
app.use('/note', routerNote);

// default router
app.use((err, req, res, next) => {
    res.status(400).json({
        success: false,
        logs: err
    })
})


app.listen(process.env.PORT || PORT, () => {
    console.log(`Server run in port: ${process.env.PORT || PORT}`);
});
