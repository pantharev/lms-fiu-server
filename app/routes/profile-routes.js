const router = require('express').Router();
const passport = require('passport');
const jwt = require('express-jwt');

const auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

const authCheck = (req, res, next) => {
    if(!req.user){
        // if user is not logged in
        res.redirect('/auth/facebook');
    }
    else{
        // if logged in
        next();
    }
};

router.get('/', auth, (req, res) => {

    if(!req.payload._id) {
        res.status(401).json({"message" : "UnauthorizedError: private profile"});
    } else {
        console.log(req.payload._id);
    }
    //console.log("Req user: " + JSON.stringify(req.user));
    //res.send(req.user[0]);
    //console.log("Session is: " + JSON.stringify(req.session));
    //res.send(req.user);
    //res.send(req.user);
    res.send('you are logged in, this is your profile - ');
});

router.get('/details', (req, res) => {
    res.send('details');
})

module.exports = router;