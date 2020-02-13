const sql = require('./db');

// Constructor

const Module = function(modulep) {
    this.number = modulep.number;
    this.title = modulep.title;
    this.lockedUntil = modulep.lockedUntil;
};

Module.create = (courseId, newModule, result) => {
    return new Promise((resolve, reject) => {
        sql.getConnection((err, connection) => {
            let moduleId;
            new Promise((resolve, reject) => {
                connection.beginTransaction();
                connection.query("INSERT INTO modules SET ?", newModule, (err, res) => {
                if(err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { id: res.insertId, ...newModule });
                console.log("ResId: " + res.insertId);
                return resolve(res.insertId);
            });
            }).then((value) => {
                moduleId = value;
                console.log("Module id: " + moduleId);
                console.log("course_id: " + courseId);
                connection.query("INSERT INTO courses_modules(course_id, module_id) VALUES(?, ?)", [courseId, moduleId], (err, res) => {
                    if(err) return reject(err);
                    return resolve(res);
                })
            }).then(() => {
                connection.commit();
                connection.release();
            });
        });
    });
}

Module.findById = (moduleId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM modules WHERE id = ?", moduleId, (err, res) => {
            if(err) { 
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        })
    })
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

Module.updateById = (id, moduleO, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE modules SET number = ?, title = ?, lockedUntil = ? WHERE id = ?",
            [moduleO.number, moduleO.title, moduleO.lockedUntil, id], (err, res) => {
                if(err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { id: id, ...moduleO});
                return resolve(res);
            });
    });
};

Module.delete = (id, result) => {
    return new Promise((resolve, reject) => {
        sql.getConnection((err, connection) => {
            new Promise((resolve, reject) => {
                connection.beginTransaction();
                connection.query("DELETE FROM courses_modules WHERE module_id = ?", id, (err, res) => {
                    if(err) return reject(err);
                    return resolve(res);
                })
            }).then((value) => {
                connection.query("DELETE FROM modules WHERE id = ?", id, (err, res) => {
                    if(err) return reject(err);
                    return resolve(res);
                })
            }).then(() => {
                connection.commit();
                connection.release();
            });
        });
    });
};

module.exports = Module;