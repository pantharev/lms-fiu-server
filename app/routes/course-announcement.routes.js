module.exports = app => {
    const courseAnnouncement = require("../controllers/course-announcement.controller");

    app.post("/courseAnnouncements", courseAnnouncement.create);
    
    app.get("/courseAnnouncements", courseAnnouncement.findAll);

    app.get("/courseAnnouncements/:courseAnnouncementId", courseAnnouncement.findById);

    app.put("/courseAnnouncements/:courseAnnouncementId", courseAnnouncement.update);

    app.delete("/courseAnnouncements/:courseAnnouncementId", courseAnnouncement.delete);
};