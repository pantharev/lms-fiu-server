module.exports = app => {
    const students = require("../controllers/student.controller");

    app.post("/students", students.create);

    app.get("/students", students.findAll);

    app.get("/students/:studentEmail", students.findOne);

    //app.get("/students/:userId", students.findOne2);

    app.put("/students", students.updateByUserEmail);

    app.delete("/students/:studentId", students.delete);

    app.delete("/students", students.deleteAll);
};