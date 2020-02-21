module.exports = app => {
    const video = require("../controllers/video.controller");

    app.post("/videos", video.create);
    
    app.get("/videos/:courseId", video.findAll);

    app.put("/videos/:videoId", video.update);

    app.delete("/videos/:videoId", video.delete);
};