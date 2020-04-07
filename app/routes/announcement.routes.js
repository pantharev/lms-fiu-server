module.exports = app => {
    const announcement = require("../controllers/announcement.controller");

    app.post("/announcements", announcement.create);
    
    app.get("/announcements", announcement.findAll);

    app.get("/announcements/a/:announcementId", announcement.findById);

    app.get("/announcements/c/:courseId", announcement.findByCourseId);

    app.put("/announcements/:announcementId", announcement.update);

    app.delete("/announcements/:announcementId", announcement.delete);
};