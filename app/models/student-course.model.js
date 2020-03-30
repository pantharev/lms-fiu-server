const sql = require("./db");

// constructor
const StudentCourse = function (studentCourse) {
    this.student_email = studentCourse.student_email;
    this.course_id = studentCourse.course_id;
    this.enrollment_status = studentCourse.enrollment_status;
    this.points = studentCourse.points;
};

StudentCourse.create = (newStudentCourse, result) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO students_courses SET ?", newStudentCourse, (err, res) => {
            if (err) {
                result(err, null);
                return reject(err);
            }
            result(null, { email: res.email, ...newStudentCourse });
            return resolve(res[0]);
        });
    });
};

StudentCourse.findById = (studentCourseId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM StudentCourses WHERE id = ?", [studentCourseId], (err, res) => {
            if (err) {
                result(err, null);
                return reject(err);
            }
            result(null, res[0]);
            return resolve(res[0]);
        });
    });
};

// Display all courses the student is enrolled in
StudentCourse.findByStudentEmail = (studentEmail, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM studentsincourses WHERE student_email = ?", [studentEmail], (err, res) => {
            if (err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
}

// Display all students in the course
StudentCourse.findByCourseId = (courseId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM studentsincourses WHERE course_id = ?", [courseId], (err, res) => {
            if (err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
}

StudentCourse.getAll = result => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM studentsincourses", (err, res) => {
            if (err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
};

StudentCourse.getAvgPts = (courseId, studentEmail, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT AVG(points) as average FROM studentsincourses WHERE course_id = ? and student_email != ?", [courseId, studentEmail], (err, res) => {
            if (err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res[0]);
        })
    })
}

StudentCourse.updateByEmail = (studentEmail, studentCourse, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE students_courses SET enrollment_status = ? WHERE student_email = ? AND course_id = ?",
            [studentCourse.enrollment_status, studentEmail, studentCourse.course_id], (err, res) => {
                if (err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { student_email: student_email, ...StudentCourse });
                return resolve(res[0]);
            });
    });
};

StudentCourse.delete = (studentEmail, courseId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM students_courses WHERE student_email = ? AND course_id = ?", [studentEmail, courseId], (err, res) => {
            if (err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res[0]);
        });
    });
};

StudentCourse.deleteAll = result => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM student_courses", (err, res) => {
            if (err) {
                result(err, null);
                return reject(err);
            }
            console.log(`deleted ${res.affectedRows} StudentCourses`);
            result(null, res);
            return resolve(res);
        });
    });
};

module.exports = StudentCourse;