module.exports = app => {
    const studentcourse = require("../controllers/student-course.controller");

    app.post("/student-courses", studentcourse.create);

    app.get("/student-courses", studentcourse.findAll);

    app.get("/student-courses/i/:courseId", studentcourse.findInstructor);

    app.get("/student-courses/sc/:studentId/:courseId", studentcourse.findByStudentCourseId);

    app.get("/student-courses/s/:studentId", studentcourse.findOneStudent);

    app.get("/student-courses/c/:courseId", studentcourse.findOneCourse);

    app.get("/student-courses/p/:courseId/:studentId", studentcourse.getAvgPts);

    app.put("/student-courses/up/score", studentcourse.updateScore);

    app.put("/student-courses/:studentId", studentcourse.update); // Only updates enrollment status

    app.delete("/student-courses/:studentId/:courseId", studentcourse.delete);

    app.delete("/student-courses", studentcourse.deleteAll);
};