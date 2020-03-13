const sql = require("./db");

// constructor
const CourseDetails = function(courseDetails) {
    this.content = courseDetails.content;
    this.course_id = courseDetails.course_id;
};

CourseDetails.create = (newCourseDetails, result) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO course_details SET ?", newCourseDetails, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, { id: res.insertId, ...newCourseDetails });
            return resolve(res[0]);
        });
    });
};

CourseDetails.findById = (courseId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM course_details WHERE course_id = ?", [courseId], (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res[0]);
            return resolve(res[0]);
        });
    });
};

CourseDetails.updateById = (id, courseDetails, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE course_details SET content = ? WHERE id = ?",
            [courseDetails.content, id], (err, res) => {
                if(err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { id: id, ...courseDetails});
                return resolve(res[0]);
            });
    });
};

CourseDetails.clear = (id, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE course_details SET content = '' WHERE id = ?", id, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res[0]);
        });
    });
};

module.exports = CourseDetails;