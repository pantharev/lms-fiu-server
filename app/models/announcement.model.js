const sql = require("./db");

// constructor
const Announcement = function(announcement) {
    this.user = announcement.user;
    this.content = announcement.content;
    this.created = announcement.created;
    this.changed = announcement.changed;
    this.user_id = announcement.user_id;
}

Announcement.create = (newAnnouncement, result) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO announcements SET ?", newAnnouncement, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, { id: res.insertId, ...newAnnouncement });
            return resolve(res);
        });
    });
};

Announcement.findAll = (result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM announcementsInCourses", (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
};

Announcement.findById = (announcementId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM announcements WHERE id = ?", announcementId, (err, res) => {
            if(err){
                result(err, null);
                return reject(err);
            }
            result(null, res[0]);
            return resolve(res[0]);
        })
    })
}

Announcement.findByCourseId = (courseId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM announcementsInCourses WHERE course_id = ?", [courseId], (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
};

Announcement.updateById = (id, announcement, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE announcements SET content = ?, changed = ? WHERE id = ?",
            [announcement.content, announcement.changed, id], (err, res) => {
                if(err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { id: id, ...announcement});
                return resolve(res[0]);
            });
    });
};

Announcement.delete = (id, result) => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM announcements WHERE id = ?", id, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res[0]);
            return resolve(res[0]);
        });
    });
};

module.exports = Announcement;