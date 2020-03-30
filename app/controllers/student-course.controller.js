const StudentCourse = require("../models/student-course.model");
const _ = require('lodash');

// Create and Save a new StudentCourse
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    // Create a StudentCourse
    const studentCourse = new StudentCourse({
        student_email: req.body.student_email,
        course_id: req.body.course_id,
        enrollment_status: req.body.enrollment_status
    });

    // Save StudentCourse in the database
    StudentCourse.create(new StudentCourse(req.body), (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occured while creating the StudentCourse."
            });
        else res.send(data);
    }).then((value) => {
        console.log("Created new student: " + value);
    }).catch((reason) => {
        console.log("Couldn't create new student: " + reason);
    });
};

// Retrieve all StudentCourses from the database.
exports.findAll = (req, res) => {
    StudentCourse.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving StudentCourses."
            });
        else res.send(data);
    })
};

// Find a single StudentCourse with a StudentCourseId
exports.findOne = (req, res) => {
    StudentCourse.findById(req.params.StudentCourseId, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(404).send({
                    message: `Not found StudentCourse with id ${req.params.StudentCourseId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving StudentCourse with id " + req.params.StudentCourseId
                });
            }
        } else {
            res.send(data);
        }
    })
};

exports.getAvgPts = (req, res) => {
    StudentCourse.getAvgPts(req.params.courseId, req.params.studentId, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(404).send({
                    message: `Not found StudentCourse with id ${req.params.studentId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving StudentCourse with id " + req.params.studentId
                });
            }
        } else {
            //res.send(data);
        }
    }).then((data) => {
        if (_.isEmpty(data)) {
            console.log("data is empty");
            res.status(404).json({ msg: "Student has no courses" })
        }
        else {
            //console.log("data: " + data);
            res.send(data);
        }
    }).catch((reason) => {
        console.log("err: " + reason);
        res.status(500).json({ msg: "Error retrieving studentcourses " });
    })
}

// Find courses the student is enrolled in
exports.findOneStudent = (req, res) => {
    StudentCourse.findByStudentEmail(req.params.studentEmail, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(404).send({
                    message: `Not found StudentCourse with email ${req.params.studentEmail}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving StudentCourse with email " + req.params.studentEmail
                });
            }
        } else {
            //res.send(data);
        }
    }).then((data) => {
        if (_.isEmpty(data)) {
            console.log("data is empty");
            res.status(404).json({ msg: "Student has no courses" })
        }
        else {
            //console.log("data: " + data);
            res.send(data);
        }
    }).catch((reason) => {
        console.log("err: " + reason);
        res.status(500).json({ msg: "Error retrieving studentcourses " });
    })
};

// Find all students in a course
exports.findOneCourse = (req, res) => {
    StudentCourse.findByCourseId(req.params.courseId, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(404).send({
                    message: `Not found StudentCourse with id ${req.params.courseId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving StudentCourse with id " + req.params.courseId
                });
            }
        } else {
            res.send(data);
        }
    })
};

// Update a StudentCourse identified by the StudentCourseEmail in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        req.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    StudentCourse.updateByEmail(req.params.studentEmail, new StudentCourse(req.body), (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(404).send({
                    message: `Not found StudentCourse with email ${req.params.studentEmail}.`
                });
            } else {
                res.status(500).send({
                    message: "Error updating StudentCourse with email " + req.params.studentEmail
                });
            }
        } else {
            res.send(data);
        }
    });
};

// Delete a StudentCourse with the specified StudentCourseEmail in the request
exports.delete = (req, res) => {
    StudentCourse.delete(req.params.studentEmail, req.params.courseId, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(404).send({
                    message: `Not found StudentCourse with email ${req.params.studentId}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete StudentCourse with studentEmail " + req.params.studentEmail + " courseId " + req.params.courseId
                });
            }
        } else {
            res.send({ message: `StudentCourse was deleted successfully!` });
        }
    }).then(() => {
        console.log(`students_courses delete(${req.params.studentEmail}, ${req.params.courseId}) Promise resolved`);
    }).catch((err) => {
        console.log(`students_courses delete(${req.params.studentEmail}, ${req.params.courseId}) Promise Rejected \n${err}`);
    });
};

// Delete all StudentCourses from the database
exports.deleteAll = (req, res) => {
    StudentCourse.deleteAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while removing all StudentCourses."
            });
        else
            res.send({ message: "All StudentCourses were deleted successfully!" });
    });
};

