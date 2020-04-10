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
const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname);
    }
});
const upload = multer({ storage: storage });
const upload2 = multer({ storage: storage2 });

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

const AWS = require('aws-sdk');

AWS.config.getCredentials(function(err) {
    if(err) console.log(err.stack);
    //credentials not loaded
    else {
        console.log("Access key:", AWS.config.credentials.accessKeyId);
        console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
    }
});

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

const bucketName = "pdflmsfiu2";

app.get("/filesystem", (req, res) => {
    const getPdfs = new AWS.S3().listObjects({Bucket: bucketName, Prefix: 'pdfs/'}).promise();

    getPdfs.then((datas) => {
        //console.log(datas);
        let pdfsArr = new Map();
        datas.Contents.forEach((data, i, arr) => {
            //console.log(datas.Contents.length - 1);
            if(data.Key != datas.Prefix){
                const getPdf = new AWS.S3().getObject({Bucket: datas.Name, Key: data.Key}).promise();
    
                getPdf.then((pdf) => {
                    //console.log(pdf.Body);
                    pdfsArr.set(pdf.ETag, pdf.Body);
                    console.log("length: " + pdfsArr.size + " contents length: " + (datas.Contents.length - 1) + " i: " + i);
                    if(pdfsArr.size >= datas.Contents.length - 1){
                        console.log("too much data, or last data");
                        console.log(pdfsArr);
                        //console.log(Array.from(pdfsArr));
                        res.send(Array.from(pdfsArr));
                    }
                    if(i == datas.Contents.length - 1){
                        console.log("end in promise");
                        pdfsArr.set(pdf.ETag, pdf.Body);
                        console.log("length last: " + pdfsArr.size);
                        //res.send(Array.from(pdfsArr));
                    }
                })
            }
            if(i == datas.Contents.length - 1){
                console.log("end");
            }
        })
    })
})

app.post("/filesystem", upload.any(), (req, res) => {
    // Validate request
    if(!req.files){
        res.status(400).send({
            message: "File not included!"
        })
        return;
    }

    const file = req.files[0];
    console.log(file);

    const keyName = file.fieldname;
    const folderName = "pdfs/";

    const uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject({Bucket: bucketName, Key: folderName + keyName, Body: file.buffer}, (err, data) => {
        if(err) {
            console.log("error uploading");
        }
        console.log(data);
    }).promise();

    uploadPromise.then((data) => {
            console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
            res.json({uploadMsg: "Successfully uploaded data to " + bucketName + "/" + keyName});
        }
    );


})

app.delete("/filesystem/:fileName", (req, res) => {
    let fileName = req.params.fileName;
    const folderName = "pdfs/";

    console.log(folderName + fileName);
    const deletePromise = new AWS.S3().deleteObject({Bucket: bucketName, Key: folderName + fileName}, (err, data) => {
        if(err) {
            console.log("error: " + err);
        }
        if(_.isEmpty(data)){
            console.log("nothing to delete!" + JSON.stringify(data));
        }
    }).promise();

    deletePromise.then((data) => {
        if(_.isEmpty(data)){
            console.log("nothing to delete!");
            res.json({error: "nothing to delete!"});
            res.end();
        } else{
            console.log("Deleted file: " + bucketName + "/" + fileName);
            res.json({deletedMsg: "Deleted file: " + bucketName + "/" + fileName});
            res.end();
        }
    }).catch((err) => {
        console.log("error: " + err);
    });
})

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
