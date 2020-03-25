module.exports = app => {
    const students = require("../controllers/student.controller");

    app.post("/students", students.create);

    app.get("/students", students.findAll);

    //app.get("/students/:studentId", students.findOne);

    app.get("/students/:user_id", students.findOne2);

    app.put("/students/:user_id", students.updateByUserId);

    app.delete("/students/:studentId", students.delete);

    app.delete("/students", students.deleteAll);
};