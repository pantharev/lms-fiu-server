module.exports = app => {
    const survey = require("../controllers/survey.controller");

    app.post("/surveys", survey.create);
    
    app.get("/surveys/:courseId", survey.findAll);

    app.put("/surveys/:surveyId", survey.update);

    app.delete("/surveys/:surveyId", survey.delete);
};