const Pdf = require("../models/pdf.model");

// Create and Save a new Pdf
exports.create = (req, res) => {
    // Validate request
    if(!req.files){
        res.status(400).send({
            message: "File not included!"
        })
        return;
    }

    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
    }


    const file = req.files[0].buffer;

    // Create a Pdf
    const pdf = new Pdf({
        pdf: file,
        module_id: req.body.fileKey
    });

    // Save pdf in the database
    pdf.create(pdf, (err, data) => {
        if(err)
            res.status(500).send({
                message: err.message || "Some error occured while creating the Pdf."
            });
        else res.send(data);
    }).then(() => {
        console.log('Created pdf successfully!');
    }).catch((err) => {
        console.log(`Error creating the pdf\n${err}`);
    });
};

// Find Pdfs in Module with a courseId
exports.findAll = (req, res) => {

    const className = "Pdf";
    const reqParamId = req.params.courseId;

    const pdf = new Pdf({});

    pdf.findByCourseId(reqParamId, (err, data) => {
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

// Update a Pdf identified by the pdfId in the request
exports.update = (req, res) => {
    // Validate request
    if(!req.files){
        res.status(400).send({
            message: "File not included!"
        })
        return;
    }

    if(!req.body) {
        req.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    const file = req.files[0].buffer;

    // Create a Pdf
    const pdf = new Pdf({
        pdf: file,
        module_id: req.body.fileKey
    });

    const className = "Pdf";
    const reqParamID = req.params.pdfId;

    pdf.updateById(reqParamID, pdf, (err, data) => {
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

// Delete a Pdf with the specified pdfId in the request
exports.delete = (req, res) => {
    const className = "Pdf";
    const reqParamID = req.params.pdfId;

    const pdf = new Pdf({});

    pdf.delete(reqParamID, (err, data) => {
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