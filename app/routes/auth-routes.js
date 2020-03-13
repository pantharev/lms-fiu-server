const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const ExtractJwt = require('passport-jwt').ExtractJwt;

const Student = require('../models/student.model');

var clientURL = "https://localhost:4200";

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';


// auth facebook login
/*
router.get('/login', (req, res, next) => {
    console.log("Does it work?");
    /*
    passport.authenticate('facebook', (err, user, info) => {
        console.log("does auth fb work?");
        try {
            if(err || !user){
                const error = new Error('An Error occurred');
                return next(error);
            }
            req.logIn(user, { session: false }, (error) => {
                if(error) return next(error)

                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, 'top_secret');

                console.log("Login with JWT: " + token);

                return res.json({token});
            });
        } catch(error) {
            return next(error);
        }
    })(req, res, next);
    res.send('login');
    //console.log("HELLO LOGIN");
});
*/

// local auth
router.post('/signup', passport.authenticate('local-signup', {session: false}), (req, res, next) => {
    return res.json({status: 'success signup'});
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local-login', { session: false }, function(err, user, info) {

        if(err) { console.log(err.sqlMessage); return res.status(404).json({msg: 'invalid user' }); } //return next(err); }
        if(!user) { console.log("incorrect password"); return res.status(404).json({ msg: 'incorrect password'}); }

        let payload = { id: user[0].id,
            email: user[0].email,
            f_name: user[0].f_name,
            l_name: user[0].l_name,
            role: user[0].role
        };

        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        response = res.json({ f_name: payload.f_name,
                            l_name: payload.l_name,
                            token: token });
        return response; 
    })(req, res, next);
});

router.get('/protected', passport.authenticate('jwt', { session: false }), function(req, res) {
    return res.json('Success! You can now see this without a token.');
})

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    req.logout();
    return res.json({status: 'success logout'});
    res.redirect(clientURL);
});


// auth with facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

const options = {
    successRedirect: 'https://localhost:4200/',
    failureRedirect: 'https://localhost:4200/login'
}
router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {

    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    console.log("User email: " + req.user[0].email);
    const body = { _id: req.user[0].user_id, email: req.user[0].email };
    const token = jwt.sign({
        _id: req.user[0].user_id,
        email: req.user[0].email,
        exp: parseInt(expiry.getTime() / 1000)
    }, 'MY_SECRET');

    console.log("Login with JWT: " + token);
    console.log("Body: " + JSON.stringify(body));

    res.json({ token });
    //res.redirect('/profile/');
    //console.log("Req user: " + JSON.stringify(req.user));
    //res.cookie('user', req.user[0]);
    //res.redirect(clientURL);
});

/*router.get('/profile', (req, res) => {
    console.log("User is still: " + JSON.stringify(req.user));
    res.send(req.user[0]);
})*/


module.exports = router;
