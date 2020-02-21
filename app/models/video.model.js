const sql = require("./db");

const Video = function(video) {
    this.link = video.link;
    this.module_id = video.module_id
}

Video.create = (newVideo, result) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO videos SET ?", newVideo, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, { id: res.insertId, ...newVideo });
            return resolve(res);
        });
    });
};

Video.findByCourseId = (courseId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM contentInCourseModules WHERE course_id = ?", [courseId], (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
};

Video.updateById = (id, video, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE videos SET link = ? WHERE id = ?",
            [video.link, id], (err, res) => {
                if(err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { id: id, ...video});
                return resolve(res);
            });
    });
};

Video.delete = (id, result) => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM videos WHERE id = ?", id, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
};

module.exports = Video;