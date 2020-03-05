const fs = require('fs');
const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

/*const auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});*/

/*const authCheck = (req, res, next) => {
    if(!req.user){
        // if user is not logged in
        res.redirect('/auth/facebook');
    }
    else{
        // if logged in
        next();
    }
};*/

//Check to make sure header is not undefined, if so, return Forbidden (403)
const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];

    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        res.sendStatus(403)
    }
}

router.get('/', checkToken, (req, res) => {
    jwt.verify(req.token, 'wowwow', (err, authorizedData) => {
        if(err){
            // If error send Forbidden (403)
            console.log("Error: Could not connect to the protected route");
            res.sendStatus(403);
        } else {
            // If token is successfully verified, we can send the authorized data

            res.json({
                id: authorizedData.id,
                role: authorizedData.role,
                email: authorizedData.email,
                f_name: authorizedData.f_name,
                l_name: authorizedData.l_name
            });
            console.log("Success: Connected to the protected route");
        }
    })
    
    //console.log("Req user: " + JSON.stringify(req.user));
    //res.send(req.user[0]);
    //console.log("Session is: " + JSON.stringify(req.session));
    //res.send(req.user);
    //res.send(req.user);
    //return res.send('you are logged in, this is your profile - ');
});

router.get('/details', (req, res) => {
    let folders = fs.readdirSync('./test');
    let objArray = [];

    folders.forEach((folder) => {
        let obj = {};
        let files = fs.readdirSync('./test' + folder);
        obj.folder = folder;
        obj.files = files;
        objArray.push(obj);
    })

    res.json({ data: JSON.stringify(objArray) });
})

module.exports = router;