const sql = require('./db');

// Constructor

const Module = function(modulep) {
    this.number = modulep.number;
    this.title = modulep.title;
    this.lockedUntil = modulep.lockedUntil;
};

Module.create = (newModule, result) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO modules SET ?", newModule, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, { id: res.insertId, ...newModule });
            return resolve(res[0]);
        });
    });
}

// Display modules in course
Module.findByCourseId = (courseId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM modulesincourse WHERE course_id = ?", [courseId], (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
}

module.exports = Module;