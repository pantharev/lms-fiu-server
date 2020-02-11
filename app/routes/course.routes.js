module.exports = app => {
    const courses = require("../controllers/course.controller");
    const passport = require('passport');

    app.post("/courses", passport.authenticate('jwt', { session: false }), courses.create);

    app.get("/courses", courses.findAll);

    app.get("/courses/:courseId", courses.findOne);

    app.put("/courses/:courseId", passport.authenticate('jwt', { session: false }), courses.update);

    app.delete("/courses/:courseId", passport.authenticate('jwt', { session: false }), courses.delete);

    app.delete("/courses", passport.authenticate('jwt', { session: false }), courses.deleteAll); 
};