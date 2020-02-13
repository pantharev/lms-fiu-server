module.exports = app => {
    const moduleC = require("../controllers/module.controller");

    app.post("/modules/:courseId", moduleC.create);
    
    app.get("/modules/m/:moduleId", moduleC.findOne);

    app.get("/modules/c/:courseId", moduleC.findOneCourse);

    app.put("/modules/:moduleId", moduleC.update);

    app.delete("/modules/:moduleId", moduleC.delete);
};