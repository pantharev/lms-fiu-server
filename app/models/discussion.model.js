const sql = require("./db");

// constructor
const Discussion = function(discussion) {
    this.user = discussion.user;
    this.post = discussion.post;
    this.created = discussion.created;
    this.changed = discussion.changed;
    this.module_id = discussion.module_id;
    this.user_id = discussion.user_id;
}

Discussion.create = (newDiscussion, result) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO discussions SET ?", newDiscussion, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, { id: res.insertId, ...newDiscussion });
            return resolve(res);
        });
    });
};

Discussion.findByCourseId = (courseId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM discussionsInCourseModules WHERE course_id = ?", [courseId], (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
};

Discussion.findByModuleId = (moduleId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM discussionsInCourseModules WHERE module_id = ?", [moduleId], (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
};

Discussion.updateById = (id, discussion, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE discussions SET post = ?, changed = ? WHERE id = ?",
            [discussion.post, discussion.changed, id], (err, res) => {
                if(err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { id: id, ...discussion});
                return resolve(res);
            });
    });
};

Discussion.delete = (id, result) => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM discussions WHERE id = ?", id, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
};

module.exports = Discussion;