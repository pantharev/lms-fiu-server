module.exports = app => {
    const leaderboardC = require("../controllers/student-course.controller");
    
    app.get("/leaderboard/:courseId", leaderboardC.findOneCourse);
};