const sql = require("./db");

// constructor
const Survey = function(survey) {
    this.name = survey.name;
    this.link = survey.link;
    this.module_id = survey.module_id;
}

Survey.create = (newSurvey, result) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO surveys SET ?", newSurvey, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, { id: res.insertId, ...newSurvey });
            return resolve(res);
        });
    });
};

Survey.findByCourseId = (courseId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM surveysInCourseModules WHERE course_id = ?", [courseId], (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
};

Survey.updateById = (id, survey, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE surveys SET name = ?, link = ? WHERE id = ?",
            [survey.name, survey.link, id], (err, res) => {
                if(err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { id: id, ...survey});
                return resolve(res);
            });
    });
};

Survey.delete = (id, result) => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM surveys WHERE id = ?", id, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res);
        });
    });
};

module.exports = Survey;