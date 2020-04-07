const Announcement = require("../models/announcement.model");

// Create and Save a new Announcement
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    // Create a Announcement
    const announcement = new Announcement({
        user: req.body.user,
        content: req.body.content,
        created: req.body.created,
        changed: req.body.changed,
        user_id: req.body.user_id
    });

    // Save Announcement in the database
    Announcement.create(announcement, (err, data) => {
        if(err)
            res.status(500).send({
                message: err.message || "Some error occured while creating the Announcement."
            });
        else res.send(data);
    }).then(() => {
        console.log('Created Announcement successfully!');
    }).catch((err) => {
        console.log(`Error creating the Announcement\n${err}`);
    });
};

// Find Announcements in Module with a courseId
exports.findAll = (req, res) => {

    const className = "Announcement";

    Announcement.findAll((err, data) => {
        if(err) {
            if(err.kind == "not_found"){
                res.status(404).send({
                    message: `Not found ${className}.`
                });
            } else {
                res.status(500).send({
                    message: `Error retrieving ${className}`
                });
            }
        } else {
            res.send(data);
        }
    }).then(() => {
        console.log(`${className}s were found`);
    }).catch((err) => {
        console.log(`Error, couldn't find/retrieve ${className}s\n${err}`);
    })
};

exports.findById = (req ,res) => {
    const className = "Announcement";
    const reqParamId = req.params.announcementId;

    Announcement.findById(reqParamId, (err, data) => {
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
}

// Find Announcement by courseId
exports.findByCourseId = (req, res) => {

    const className = "Announcement";
    const reqParamId = req.params.courseId;

    Announcement.findByCourseId(reqParamId, (err, data) => {
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

// Update a Announcement identified by the AnnouncementId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body) {
        req.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    const className = "Announcement";
    const reqParamID = req.params.announcementId;

    Announcement.updateById(reqParamID, new Announcement(req.body), (err, data) => {
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

// Delete a Announcement with the specified AnnouncementId in the request
exports.delete = (req, res) => {
    const className = "Announcement";
    const reqParamID = req.params.announcementId;
    
    Announcement.delete(reqParamID, (err, data) => {
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