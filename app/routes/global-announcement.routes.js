module.exports = app => {
    const globalAnnouncement = require("../controllers/global-announcement.controller");

    app.post("/globalAnnouncements", globalAnnouncement.create);
    
    app.get("/globalAnnouncements", globalAnnouncement.findAll);

    app.get("/globalAnnouncements/:globalAnnouncementId", globalAnnouncement.findById);

    app.put("/globalAnnouncements/:globalAnnouncementId", globalAnnouncement.update);

    app.delete("/globalAnnouncements/:globalAnnouncementId", globalAnnouncement.delete);
};