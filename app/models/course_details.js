const sql = require("./db");

// constructor
const CourseDetails = function(courseDetails) {
    this.course_name = courseDetails.course_name;
    this.instructor_name = courseDetails.instructor_name;
    this.office = courseDetails.office;
    this.phone = courseDetails.phone;
    this.email = courseDetails.email;
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

CourseDetails.updateById = (id, course, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE course_details SET name = ?, description = ?, seats = ?, start_date = ?, end_date = ? WHERE id = ?",
            [course.name, course.description, course.seats, course.start_date, course.end_date, id], (err, res) => {
                if(err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { id: id, ...course});
                return resolve(res[0]);
            });
    });
};