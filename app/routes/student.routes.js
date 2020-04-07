module.exports = app => {
    const students = require("../controllers/student.controller");

    app.post("/students", students.create);

    app.get("/students", students.findAll);

    app.get("/students/:studentId", students.findOne);

<<<<<<< Updated upstream
    app.put("/students/:studentId", students.update);
=======
    app.get("/students/email/:email", students.findOne2);

    app.get("/students/:id", students.findOne);

    app.put("/students", students.update);
>>>>>>> Stashed changes

    app.delete("/students/:studentId", students.delete);

    app.delete("/students", students.deleteAll);
};