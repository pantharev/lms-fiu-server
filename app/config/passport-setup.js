const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const keys = require('./keys');
const Student = require("../models/student.model");
const jwt = require('jsonwebtoken');

passport.serializeUser((user, done) => {
  //console.log("Successfully serialized user");
  console.log("The user is: " + JSON.stringify(user));
  console.log("id: " + user[0].id);
  done(null, user[0].id);
});

passport.deserializeUser((id, done) => {
  Student.findById2(id).then((user) => {
    console.log("student deserialized: " + JSON.stringify(student));
    done(null, user);
  }).catch(() => {
    console.log("Couldn't find by id");
  });
  //console.log("Successfully deserialized user");
  //done(null, user);
});

/*passport.deserializeUser((email, done) => {
  Student.findByEmail(email).then((student) => {
    done(null, student);
  });
})*/

function generateJwt(id, email, first_name, last_name) {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  jwt.sign({
    _id: id,
    email: email,
    f_name: first_name,
    l_name: last_name,
    exp: parseInt(expiry.getTime() / 1000),
  }, keys.session.cookieKey)
}

/*passport.use(new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: keys.facebook.callbackURL,
    profileFields: ['email', 'name'],
    enableProof: true
},
    (accessToken, refreshToken, profile, done) => {
        //console.log('passport callback function fired');
        console.log(profile._json);
        const { email, first_name, last_name, id } = profile._json;

        const userData = {
          email: email,
          f_name: first_name,
          l_name: last_name,
          active: 1,
          user_id: id
        };

        //console.log("AccessToken= " +accessToken);

        const student = new Student(userData);

        Student.findByUserId(id).then((value) => {
          console.log("Successfully found student by id: " + id);
          //console.log(value);

          //generateJwt(id, email, first_name, last_name);
          return done(null, value);
        }).catch((reason) => {
          console.error("Couldn't find student with id: " + id);
          console.error(reason);
            Student.create(student, (err, data) => {
              if(err){
                  console.error("student already exists");
              }
              console.log(data);
              //done(null, data);
            }).then((value) => {
              console.log("Successfully added student to students table");

              //generateJwt(id, email, first_name, last_name);
              return done(null, value);
            }).catch((reason) => {
              console.error("Error adding student to students table\n" + reason);
            });
        });

        //console.log('email: ' + email + '\n' + 'first_name: ' + first_name + '\nlast_name: ' + last_name);
        //console.log(profile);
        //console.log(profile._json.email); 
        //done();
    }
));*/

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';

passport.use(new JwtStrategy(jwtOptions, function(jwt_payload, done) {
  console.log('payload received', jwt_payload);
  Student.findById2(jwt_payload.id).then((value) => {
    return done(null, value);
  }).catch(() => {
    return done(null, false);
  })
}));

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
  function(req, email, password, done) {

    const userData = {
      email: email,
      f_name: '',
      l_name: '',
      active: 1,
      user_id: 0,
      password: password
    };

    const student = new Student(userData);

    Student.findByEmail(email).then(() => {
      console.log("Email already taken");
      return done(null, false);
    }).catch(() => {
      Student.create(student, (err, data) => {
        if(err) return;
        return done(null, data);
      })
    })
  }
));

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  function(req, email, password, done) {
    //console.log("email: " + email + " password: " + password);
    //console.log(req.body);
    Student.findByEmail(email).then((value) => {
      console.log(value[0].password);
      if(value[0].password != password) {
        //console.log("Wrong password");
        return done(null, false, { message: 'incorrect password'} );
      }
      return done(null, value);
    }).catch((reason) => {
      //console.log("error");
      return done(reason, false, { message: 'invalid user' });
    })
  }
));
