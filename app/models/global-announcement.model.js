const sql = require("./db");

// constructor
const GlobalAnnouncement = function(globalAnnouncement) {
    this.user = globalAnnouncement.user;
    this.content = globalAnnouncement.content;
    this.created = globalAnnouncement.created;
    this.changed = globalAnnouncement.changed;
    this.user_id = globalAnnouncement.user_id;
}

GlobalAnnouncement.create = (newGlobalAnnouncement, result) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO global_announcements SET ?", newGlobalAnnouncement, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, { id: res.insertId, ...newGlobalAnnouncement });
            return resolve(res);
        });
    });
};

GlobalAnnouncement.findAll = (result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM global_announcements", (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
};

GlobalAnnouncement.findById = (globalAnnouncementId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM global_announcements WHERE id = ?", [globalAnnouncementId], (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res[0]);
            return resolve(res[0]);
        });
    });
};

GlobalAnnouncement.updateById = (id, globalAnnouncement, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE global_announcements SET content = ?, changed = ? WHERE id = ?",
            [globalAnnouncement.content, globalAnnouncement.changed, id], (err, res) => {
                if(err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { id: id, ...globalAnnouncement});
                return resolve(res[0]);
            });
    });
};

GlobalAnnouncement.delete = (id, result) => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM global_announcements WHERE id = ?", id, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res[0]);
            return resolve(res[0]);
        });
    });
};

module.exports = GlobalAnnouncement;