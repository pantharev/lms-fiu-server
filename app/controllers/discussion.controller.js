const Discussion = require("../models/discussion.model");

// Create and Save a new Discussion
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    // Create a Discussion
    const discussion = new Discussion({
        user: req.body.user,
        post: req.body.post,
        created: req.body.created,
        changed: req.body.changed,
        module_id: req.body.module_id,
        user_id: req.body.user_id
    });

    // Save Discussion in the database
    Discussion.create(discussion, (err, data) => {
        if(err)
            res.status(500).send({
                message: err.message || "Some error occured while creating the Discussion."
            });
        else res.send(data);
    }).then(() => {
        console.log('Created Discussion successfully!');
    }).catch((err) => {
        console.log(`Error creating the Discussion\n${err}`);
    });
};

// Find Discussions in Module with a courseId
exports.findAll = (req, res) => {

    const className = "Discussion";
    const reqParamId = req.params.courseId;

    Discussion.findByCourseId(reqParamId, (err, data) => {
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

// Find Discussions in Module with a moduleId
exports.findAllInModule = (req, res) => {

    const className = "Discussion";
    const reqParamId = req.params.moduleId;

    Discussion.findByModuleId(reqParamId, (err, data) => {
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

// Update a Discussion identified by the DiscussionId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body) {
        req.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    const className = "Discussion";
    const reqParamID = req.params.discussionId;

    Discussion.updateById(reqParamID, new Discussion(req.body), (err, data) => {
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

// Delete a Discussion with the specified DiscussionId in the request
exports.delete = (req, res) => {
    const className = "Discussion";
    const reqParamID = req.params.discussionId;
    
    Discussion.delete(reqParamID, (err, data) => {
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