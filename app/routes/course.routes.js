module.exports = app => {
    const courses = require("../controllers/course.controller");
    //const passport = require('passport');

    app.post("/courses", courses.create);

    app.get("/courses", courses.findAll);

    app.get("/courses/:courseId", courses.findOne);

    app.put("/courses/:courseId", courses.update);

    app.put("/courses/s/:courseId", courses.updateSeats);

    app.delete("/courses/:courseId", courses.delete);

    app.delete("/courses", courses.deleteAll); 
};