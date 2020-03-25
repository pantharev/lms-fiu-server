const GlobalAnnouncement = require("../models/global-announcement.model");

// Create and Save a new GlobalAnnouncement
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    // Create a GlobalAnnouncement
    const globalAnnouncement = new GlobalAnnouncement({
        user: req.body.user,
        content: req.body.content,
        created: req.body.created,
        changed: req.body.changed,
        user_id: req.body.user_id
    });

    // Save GlobalAnnouncement in the database
    GlobalAnnouncement.create(globalAnnouncement, (err, data) => {
        if(err)
            res.status(500).send({
                message: err.message || "Some error occured while creating the GlobalAnnouncement."
            });
        else res.send(data);
    }).then(() => {
        console.log('Created GlobalAnnouncement successfully!');
    }).catch((err) => {
        console.log(`Error creating the GlobalAnnouncement\n${err}`);
    });
};

// Find GlobalAnnouncements in Module with a courseId
exports.findAll = (req, res) => {

    const className = "GlobalAnnouncement";

    GlobalAnnouncement.findAll((err, data) => {
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

// Find GlobalAnnouncement by id
exports.findById = (req, res) => {

    const className = "GlobalAnnouncement";
    const reqParamId = req.params.globalAnnouncementId;

    GlobalAnnouncement.findById(reqParamId, (err, data) => {
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

// Update a GlobalAnnouncement identified by the GlobalAnnouncementId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body) {
        req.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    const className = "GlobalAnnouncement";
    const reqParamID = req.params.globalAnnouncementId;

    GlobalAnnouncement.updateById(reqParamID, new GlobalAnnouncement(req.body), (err, data) => {
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

// Delete a GlobalAnnouncement with the specified GlobalAnnouncementId in the request
exports.delete = (req, res) => {
    const className = "GlobalAnnouncement";
    const reqParamID = req.params.globalAnnouncementId;
    
    GlobalAnnouncement.delete(reqParamID, (err, data) => {
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