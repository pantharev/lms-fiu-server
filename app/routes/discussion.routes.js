module.exports = app => {
    const discussion = require("../controllers/discussion.controller");

    app.post("/discussions", discussion.create);
    
    app.get("/discussions/c/:courseId", discussion.findAll);

    app.get("/discussions/m/:moduleId", discussion.findAllInModule);

    app.put("/discussions/:discussionId", discussion.update);

    app.delete("/discussions/:discussionId", discussion.delete);
};