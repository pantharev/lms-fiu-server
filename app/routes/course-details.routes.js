module.exports = app => {
    const courseDetails = require("../controllers/course-details.controller");

    app.post("/courseDetails", courseDetails.create);
    
    app.get("/courseDetails/:courseId", courseDetails.findOne);

    app.put("/courseDetails/u/:courseDetailsId", courseDetails.update);

    app.put("/courseDetails/c/:courseDetailsId", courseDetails.clear);
};