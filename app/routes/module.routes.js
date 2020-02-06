module.exports = app => {
    const moduleC = require("../controllers/module.controller");

    app.post("/modules", moduleC.create);
    
    app.get("/modules/:courseId", moduleC.findOneCourse);
};