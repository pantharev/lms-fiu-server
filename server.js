require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash');
const cors = require("cors");
const passport = require('passport');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
//const fileupload = require("express-fileupload");
const keys = require('./app/config/keys');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
const http = require('http').createServer(app);
const https = require('https');

const fs = require('fs');
const privateKey = fs.readFileSync('ssl/server.key', 'utf8');
const certificate = fs.readFileSync('ssl/server.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

const allowUrl = ['courses', 'modules'];

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
/*const corsOptions = {
    origin: '*',
    methods: ["POST", "GET"],
    credentials: true,
    maxAge: 3600
};*/
app.use(cors());

// Auth 
app.use(cookieSession({
    name: 'LMS-FIU-session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

app.use(cookieParser());
//app.use(fileupload());

app.use(passport.initialize());
app.use(passport.session());

const passportSetup = require('./app/config/passport-setup');
const authRoutes = require('./app/routes/auth-routes');
const profileRoutes = require('./app/routes/profile-routes');

/*const authenticationMiddleware = (req, res, next) => {

    if (passport.authenticate('facebook')) {
        console.log("Authorized access");
        return next()
    }
    res.redirect('/');
}*/

//app.use(authenticationMiddleware);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get("/", (req, res) => {
    res.send('Hello World4');
});

const sql = require("./app/models/db");

io.on('connection', function (socket) {
    console.log('a user connected: ' + socket.id);
    socket.on('search', (data) => {
        console.log(data);
        sql.query(`SELECT * FROM courses WHERE name LIKE '${data}%'`, (err, res) => {
            if (err)
                return
            io.to(socket.id).emit('search-data', res);
        });
    })

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected.`);
    });
})

require("./app/routes/student.routes.js")(app);
require("./app/routes/course.routes.js")(app);
require("./app/routes/student-course.routes.js")(app);
require("./app/routes/module.routes.js")(app);
require("./app/routes/video.routes.js")(app);
require("./app/routes/pdf.routes.js")(app, upload);
require("./app/routes/survey.routes.js")(app);
require("./app/routes/course-details.routes.js")(app);
require("./app/routes/discussion.routes.js")(app);
require("./app/routes/global-announcement.routes.js")(app);
require("./app/routes/course-announcement.routes.js")(app);
require("./app/routes/announcement.routes.js")(app);

// [SH] Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({ "message": err.name + ": " + err.message });
    }
});

/* Facebook tab request handling */


app.post('/', function (req, res) {
    res.send("Post request sent to backend");
});

app.post('/userdata', function (req, res) {
    res.send(req.body);
});


http.listen(port, () => {
    console.log("http Server is running on port: " + port);
})
/*httpsServer.listen(port, () => {
    console.log("https Server is running on port: " + port);
})*/
