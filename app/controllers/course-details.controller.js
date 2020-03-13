const CourseDetails = require("../models/course-details.model");

exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
    }
    
    const courseDetails = new CourseDetails({
        content: req.body.content,
        course_id: req.body.course_id
    });
    
    CourseDetails.create(courseDetails, (err, data) => {
        if(err)
        res.status(500).send({
            message: err.message || "Some error occured while creating the Student."
        });
        else res.send(data);
    })
}

// Find a single CourseDetails with a courseId
exports.findOne = (req, res) => {

    const className = "CourseDetails";
    const reqParamId = req.params.courseId;

    CourseDetails.findById(reqParamId, (err, data) => {
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
        console.log(`Error findById(${reqParamId}), couldn't find/retrieve ${className}\n${err}`);
    })
};

// Update a CourseDetails identified by the CourseDetailsId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body) {
        req.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    const className = "CourseDetails";
    const reqParamID = req.params.courseDetailsId;

    CourseDetails.updateById(reqParamID, new CourseDetails(req.body), (err, data) => {
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

// Delete a CourseDetails with the specified CourseDetailsId in the request
exports.clear = (req, res) => {
    const className = "CourseDetails";
    const reqParamID = req.params.courseDetailsId;

    CourseDetails.clear(reqParamID, (err, data) => {
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
            res.send({ message: `${className} was cleared successfully!`});
        }
    }).then(() => {
        console.log(`Resolved: ${className} ${reqParamID} was cleared successfully!`);
    }).catch((err) => {
        if(err.kind == "not_found")
            console.log(`Rejected: Couldn't find ${className} with id ${reqParamID}\n${err}`);
        else
            console.log(`Rejected: Could not delete ${className} with id ${reqParamID}\n${err}`);
    })
};