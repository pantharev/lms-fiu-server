const sql = require("./db");

// constructor
const CourseAnnouncement = function(courseAnnouncement) {
    this.course_id = courseAnnouncement.course_id;
    this.announcement_id = courseAnnouncement.announcement_id; 
}

CourseAnnouncement.create = (newCourseAnnouncement, result) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO courses_announcements SET ?", newCourseAnnouncement, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, { id: res.insertId, ...newCourseAnnouncement });
            return resolve(res);
        });
    });
};

CourseAnnouncement.findAll = (result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM courses_announcements", (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
};

CourseAnnouncement.findById = (courseAnnouncementId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM courses_announcements WHERE id = ?", [courseAnnouncementId], (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res[0]);
            return resolve(res[0]);
        });
    });
};

CourseAnnouncement.updateById = (id, courseAnnouncement, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE courses_announcements SET course_id = ?, announcement_id = ? WHERE id = ?",
            [courseAnnouncement.course_id, courseAnnouncement.announcement_id, id], (err, res) => {
                if(err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { id: id, ...courseAnnouncement});
                return resolve(res[0]);
            });
    });
};

CourseAnnouncement.delete = (id, result) => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM courses_announcements WHERE id = ?", id, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res[0]);
            return resolve(res[0]);
        });
    });
};

module.exports = CourseAnnouncement;