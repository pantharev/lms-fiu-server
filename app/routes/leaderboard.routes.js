module.exports = app => {
    const leaderboardC = require("../controllers/student-course.controller");

    app.get("leaderboard", console.log("hello"));
    app.get("/leaderboard/:courseId", leaderboardC.findOneCourse);
};