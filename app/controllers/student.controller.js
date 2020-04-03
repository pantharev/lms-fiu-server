const Student = require("../models/student.model");

// Create and Save a new Student
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    // Create a Student
    const student = new Student({
        email: req.body.email,
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        user_id: req.body.user_id,
        active: req.body.active,
        role: req.body.role
    });

    // Save student in the database
    Student.create(student, (err, data) => {
        
    }).then((data) => {
        console.log("Promise Resolved, student created!");
        console.log(data);
        res.send(data);
        res.end();
    }).catch((reason) => {
        console.log("Promise Rejected, student couldn't be created");
        console.log(reason);
        res.status(500).send({ message: reason });
        res.end();
    });
};

// Retrieve all Students from the database.
exports.findAll = (req, res) => {
    Student.getAll(req, (err, data) => {
        if(err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving students."
            });
        else res.send(data);
    }).then(() => {
        console.log('Found all students successfully');
    }).catch((err) => {
        console.log(`Error retrieving the students\n${err}`);
    })
};

// Retrieve all Students from the database.
exports.findAllInstructors = (req, res) => {
    Student.getAllInstructors((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Students."
            });
        else res.send(data);
    })
};

// Find a single Student with a studentId
exports.findOne = (req, res) => {
    Student.findByEmail(req.params.studentEmail, (err, data) => {

    }).then((data) => {
        console.log("Promise resolved! found student by email: ");
        console.log(data);
        res.send(data);
        res.end();
    }).catch((reason) => {
        console.log("Promise Rejected for find student by email: ");
        console.log(reason.sqlMessage);
        res.status(500).send({ message: reason.sqlMessage });
        res.end();
    })
};

// Update a Student identified by the studentId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        req.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    Student.updateById(req.params.id, new Student(req.body), (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(404).send({
                    message: `Not found Student with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error updating Student with id " + req.params.id
                });
            }
        } else {
            res.send(data);
        }
    });
};

// Update a Student identified by the userId in the request
exports.updateByUserId = (req, res) => {
    // Validate Request
    if (!req.body) {
        req.status(400).send({
            message: "Content cannot be empty!"
        });
    }
    Student.updateByUserId(req.params.userId, new Student(req.body), (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(404).send({
                    message: `Not found Student with id ${req.params.userId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error updating Student with id " + req.params.userId
                });
            }
        } else {
            res.send(data);
        }
    });
};


// Update a Student identified by the userId in the request
exports.updateByUserEmail = (req, res) => {
    // Validate Request
    console.log(req.body.email);
    if (!req.body) {
        req.status(400).send({
            message: "Content cannot be empty!"
        });
    }
    Student.updateByUserEmail(req.body.email, new Student(req.body), (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(404).send({
                    message: `No Student found with email ${req.body.email}.`
                });
            } else {
                res.status(500).send({
                    message: "Error updating Student with email " + req.body.email
                });
            }
        } else {
            res.send(data);
        }
    });
};
// Delete a Student with the specified studentId in the request
exports.delete = (req, res) => {
    Student.delete(req.params.studentId, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(404).send({
                    message: `Not found Student with id ${req.params.studentId}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Student with id " + req.params.studentId
                });
            }
        } else {
            res.send({ message: `Student was deleted successfully!` });
        }
    });
};

// Delete all Students from the database
exports.deleteAll = (req, res) => {
    Student.deleteAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Students."
            });
        else
            res.send({ message: "All Students were deleted successfully!" });
    });
};

