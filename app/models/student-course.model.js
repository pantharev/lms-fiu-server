const sql = require("./db");

// constructor
const StudentCourse = function (studentCourse) {
    this.student_id = studentCourse.student_id;
    this.course_id = studentCourse.course_id;
    this.enrollment_status = studentCourse.enrollment_status;
    this.points = studentCourse.points;
};

StudentCourse.create = (newStudentCourse, result) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO students_courses SET ?", newStudentCourse, (err, res) => {
            if (err) {
                result(err, null);
                reject(err);
            }
            result(null, { id: res.id, ...newStudentCourse });
            resolve(newStudentCourse);
        });
    });
};

StudentCourse.findByStudentCourseId = (studentId, courseId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM students_courses WHERE student_id = ? and course_id = ?", [studentId, courseId], (err, res) => {
            if (err) {
                result(err, null);
                reject(err);
            }
            if(!res[0]){
                reject(new Error("couldn't find a value"));
            }
            result(null, res[0]);
            resolve(res[0]);
        });
    });
};

// Display all courses the student is enrolled in
StudentCourse.findByStudentId = (studentId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM studentsincourses WHERE student_id = ?", [studentId], (err, res) => {
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

StudentCourse.findInstructorByCourseId = (courseId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM studentsincourses WHERE course_id = ? and role = 'instructor'", [courseId], (err, res) => {
            if (err) {
                result(err, null);
                return reject(err);
            }
            result(null, res[0]);
            return resolve(res[0]);
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

StudentCourse.getAvgPts = (courseId, studentId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT AVG(points) as average FROM studentsincourses WHERE course_id = ? and student_id != ?", [courseId, studentId], (err, res) => {
            if (err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res[0]);
        })
    })
}

StudentCourse.updateById = (studentId, studentCourse, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE students_courses SET enrollment_status = ? WHERE student_id = ? AND course_id = ?",
            [studentCourse.enrollment_status, studentId, studentCourse.course_id], (err, res) => {
                if (err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { studentId: studentId, ...studentCourse });
                return resolve(res[0]);
            });
    });
};

StudentCourse.updateScore = (studentCourse, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE students_courses SET points = points + ? WHERE student_id = ? AND course_id = ?",
            [studentCourse.points, studentCourse.student_id, studentCourse.course_id], (err, res) => {
                if (err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, studentCourse);
                return resolve(studentCourse);
            });
    });
};

StudentCourse.delete = (studentId, courseId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM students_courses WHERE student_id = ? AND course_id = ?", [studentId, courseId], (err, res) => {
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