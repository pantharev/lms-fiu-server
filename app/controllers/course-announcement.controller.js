const CourseAnnouncement = require("../models/course-announcement.model");

// Create and Save a new CourseAnnouncement
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    // Create a CourseAnnouncement
    const courseAnnouncement = new CourseAnnouncement({
        course_id: req.body.course_id,
        announcement_id: req.body.announcement_id
    });

    // Save CourseAnnouncement in the database
    CourseAnnouncement.create(courseAnnouncement, (err, data) => {
        if(err)
            res.status(500).send({
                message: err.message || "Some error occured while creating the CourseAnnouncement."
            });
        else res.send(data);
    }).then(() => {
        console.log('Created CourseAnnouncement successfully!');
    }).catch((err) => {
        console.log(`Error creating the CourseAnnouncement\n${err}`);
    });
};

// Find CourseAnnouncements in Module with a courseId
exports.findAll = (req, res) => {

    const className = "CourseAnnouncement";

    CourseAnnouncement.findAll((err, data) => {
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

// Find CourseAnnouncement by id
exports.findById = (req, res) => {

    const className = "CourseAnnouncement";
    const reqParamId = req.params.courseAnnouncementId;

    CourseAnnouncement.findById(reqParamId, (err, data) => {
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

// Update a CourseAnnouncement identified by the CourseAnnouncementId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body) {
        req.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    const className = "CourseAnnouncement";
    const reqParamID = req.params.courseAnnouncementId;

    CourseAnnouncement.updateById(reqParamID, new CourseAnnouncement(req.body), (err, data) => {
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

// Delete a CourseAnnouncement with the specified CourseAnnouncementId in the request
exports.delete = (req, res) => {
    const className = "CourseAnnouncement";
    const reqParamID = req.params.courseAnnouncementId;
    
    CourseAnnouncement.delete(reqParamID, (err, data) => {
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