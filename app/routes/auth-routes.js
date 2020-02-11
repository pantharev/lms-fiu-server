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
/*router.get('/login', (req, res, next) => {
    console.log("Does it work?");
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
    //res.send('login');
    //console.log("HELLO LOGIN");
});*/

// local auth
router.post('/signup', passport.authenticate('local-signup', {session: false}), (req, res, next) => {
    return res.json({status: 'success signup'});
});

router.post('/login', passport.authenticate('local-login', {session: false}), (req, res, next) => {
    const { email, password } = req.body;
    console.log("email: " + email + " password: " + password);
    let response;
    if( email && password ) {
        Student.findByEmail(email).then((value) => {
            if(value[0].password === password) {
                let payload = { id: value[0].id };
                let token = jwt.sign(payload, jwtOptions.secretOrKey);
                response = res.json({ msg: 'ok', token: token });
            } else {
                response = res.status(401).json({ msg: 'Password is incorrect'});
            }
        }).catch(() => {
            response = res.status(500).json({msg: 'Error with login from server'});
        });
    }
    return response;//res.json({status: 'success login'});
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
    const token = jwt.sign({ _id: req.user[0].user_id,
    email: req.user[0].email,
     exp: parseInt(expiry.getTime() / 1000)}, 'MY_SECRET');

    console.log("Login with JWT: " + token);
    console.log("Body: " + JSON.stringify(body));

    res.json({token});
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
