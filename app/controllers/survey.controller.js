const Survey = require("../models/survey.model");

// Create and Save a new Survey
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    // Create a Survey
    const survey = new Survey({
        name: req.body.name,
        link: req.body.link,
        module_id: req.body.module_id
    });

    // Save survey in the database
    Survey.create(survey, (err, data) => {
        if(err)
            res.status(500).send({
                message: err.message || "Some error occured while creating the Survey."
            });
        else res.send(data);
    }).then(() => {
        console.log('Created survey successfully!');
    }).catch((err) => {
        console.log(`Error creating the survey\n${err}`);
    });
};

// Find Surveys in Module with a courseId
exports.findAll = (req, res) => {

    const className = "Survey";
    const reqParamId = req.params.courseId;

    Survey.findByCourseId(reqParamId, (err, data) => {
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

// Update a Survey identified by the surveyId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body) {
        req.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    const className = "Survey";
    const reqParamID = req.params.surveyId;

    Survey.updateById(reqParamID, new Survey(req.body), (err, data) => {
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

// Delete a Survey with the specified surveyId in the request
exports.delete = (req, res) => {
    const className = "Survey";
    const reqParamID = req.params.surveyId;
    
    Survey.delete(reqParamID, (err, data) => {
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
        console.log(`Resolved: ${className} ${reqParamID} was deleted successfully!`);
    }).catch((err) => {
        if(err.kind == "not_found")
            console.log(`Rejected: Couldn't find ${className} with id ${reqParamID}\n${err}`);
        else
            console.log(`Rejected: Could not delete ${className} with id ${reqParamID}\n${err}`);
    })
};