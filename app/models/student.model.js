const sql = require("./db");

// constructor
const Student = function (student) {
    this.email = student.email;
    this.f_name = student.f_name;
    this.l_name = student.l_name;
    this.active = student.active;
    this.user_id = student.user_id;
    this.password = student.password;
};

Student.create = (newStudent, result) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO students SET ?", newStudent, (err, res) => {
            if (err) {
                result(err, null);
                return reject(err);
            }
            result(null, { id: res.insertId, ...newStudent });
            return resolve(res[0]);
        });
    });
};
/*
Student.findById = (studentId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM students WHERE id = ?", [studentId], (err, res) => {
            if (err) {
                result(err, null);
                return reject(err);
            }
            result(null, res[0]);
            return resolve(res[0]);
        });
    });
};

Student.findById2 = (studentId) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM students WHERE id = ?", [studentId], (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res[0]);
        });
    });
};
*/
Student.findByEmail = (studentEmail, result) => {
    return new Promise((resolve, reject) => {
        //sql.query("CALL selectStudentByEmail(?)", [studentEmail], (err, res) => {
        sql.query("SELECT * FROM students WHERE email = ?", [studentEmail], (err, res) => {
            if (err) {
                return reject(err);
            }
            result(null, res[0]);
            return resolve(res[0]);
        });
    });
}

Student.findByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        sql.query("CALL selectStudentByUserId(?)", [userId], (err, res) => {
            if (err) {
                return reject(err);
            }
            result(null, res[0]);
            return resolve(res[0]);
        });
    });
}

Student.getAll = result => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM students", (err, res) => {
            if (err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
};

Student.getAllInstructors = result => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT id, email, f_name, l_name, role FROM students WHERE role = 'instructor'", (err, res) => {
            if (err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
}

Student.updateById = (id, student, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE students SET email = ?, f_name = ?, l_name = ?, active = ?, role = ? WHERE id = ?",
            [student.email, student.f_name, student.l_name, student.active, student.role, id], (err, res) => {
                if (err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { id: id, ...student });
                return resolve(res[0]);
            });
    });
};

Student.updateByUserId = (user_id, student, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE students SET email = ?, f_name = ?, l_name = ?, active = ?, role = ? WHERE user_id = ?",
            [student.email, student.f_name, student.l_name, student.active, user_id], (err, res) => {
                if (err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { user_id: user_id, ...student });
                return resolve(res[0]);
            });
    });
};

Student.updateByUserEmail = (email, student, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE students SET user_id = ?, f_name = ?, l_name = ?, role = ? WHERE email = ?",
            [student.user_id, student.f_name, student.l_name, student.role, email], (err, res) => {
                if (err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { email: email, ...student });
                return resolve(res[0]);
            });
    });
};

Student.delete = (id, result) => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM students WHERE id = ?", id, (err, res) => {
            if (err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res[0]);
        });
    });
};

Student.deleteAll = result => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM students", (err, res) => {
            if (err) {
                result(err, null);
                return reject(err);
            }
            console.log(`deleted ${res.affectedRows} students`);
            result(null, res);
            return resolve(res);
        });
    });
};

module.exports = Student;