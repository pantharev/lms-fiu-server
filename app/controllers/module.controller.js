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

    Module.create(req.params.courseId, moduleO, (err, data) => {
        if(err)
        res.status(500).send({
            message: err.message || "Some error occured while creating the Student."
        });
        else res.send(data);
    })
}

// Find a single Module with a moduleId
exports.findOne = (req, res) => {

    const className = "Module";
    const reqParamId = req.params.moduleId;

    Module.findById(reqParamId, (err, data) => {
        if(err) {
            if(err.kind == "not_found"){
                res.status(404).send({
                    message: `Not found ${className} with id ${reqParamId}.`
                });
            } else {
                res.status(500).send({
                    message: `Error retrieving ${className} with id ${reqParamId}`
                });
            }
        } else {
            res.send(data);
        }
    }).then(() => {
        console.log(`${className} findById(${reqParamId}) was found`);
    }).catch((err) => {
        console.log(`Error findById(${reqParamId}), couldn't find/retrieve course\n${err}`);
    })
};

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

// Update a Module identified by the moduleId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body) {
        req.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    const className = "Module";
    const reqParamID = req.params.moduleId;

    Module.updateById(reqParamID, new Module(req.body), (err, data) => {
        if(err) {
            if(err.kind == "not_found") {
                res.status(404).send({
                    message: `Not found ${className} with id ${reqParamID}.`
                });
            } else {
                res.status(500).send({
                    message: err.message || `Error updating ${className} with id ${reqParamID}`
                });
            }
        } else {
            res.send(data);
        }
    }).then(() => {
        console.log(`${className} UpdateByID(${reqParamID}) Promise resolved`);
    }).catch((err) => {
        console.log(`${className} UpdateById(${reqParamID}) Promise Rejected \n${err}`);
    });
};

// Delete a Module with the specified moduleId in the request
exports.delete = (req, res) => {
    const className = "Module";
    const reqParamID = req.params.moduleId;
    Module.delete(reqParamID, (err, data) => {
        if(err) {
            if(err.kind == "not_found") {
                res.status(404).send({
                    message: `Not found ${className} with id ${reqParamID}.`
                });
            } else {
                res.status(500).send({
                    message: `Could not delete ${className} with id ${reqParamID}`
                });
            }
        } else {
            res.send({ message: `${className} was deleted successfully!`});
        }
    }).then(() => {
        console.log(`Resolved: Course ${reqParamID} was deleted successfully!`);
    }).catch((err) => {
        if(err.kind == "not_found")
            console.log(`Rejected: Couldn't find ${className} with id ${reqParamID}\n${err}`);
        else
            console.log(`Rejected: Could not delete ${className} with id ${reqParamID}\n${err}`);
    })
};