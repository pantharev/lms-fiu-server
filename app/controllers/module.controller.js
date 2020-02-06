const Module = require("../models/module.model");

exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
    }
    
    const moduleO = new Module({
        number: req.body.number,
        title: req.body.title,
        lockedUntil: req.body.lockedUntil
    });

    Module.create(moduleO, (err, data) => {
        if(err)
        res.status(500).send({
            message: err.message || "Some error occured while creating the Student."
        });
        else res.send(data);
    })
}

// Find all modules in a course
exports.findOneCourse = (req, res) => {
    Module.findByCourseId(req.params.courseId, (err, data) => {
        if(err) {
            if(err.kind == "not_found"){
                res.status(404).send({
                    message: `Not found course with id ${req.params.courseId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving course with id " + req.params.courseId
                });
            }
        } else {
            res.send(data);
        }
    })
};