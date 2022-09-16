const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// import anything
const db = require('./src/configs/db/db.js');

// init app
const app = express();
const PORT = 3000;

// enable cors
var allowlist = ['http://192.168.1.2:8080/', 'http://localhost:8080/']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}


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
    res.json({
        success: false,
        logs: err
    })
})


app.listen(process.env.PORT || PORT, () => {
    console.log(`Server run in port: ${process.env.PORT || PORT}`);
});
