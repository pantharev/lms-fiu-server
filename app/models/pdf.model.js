const sql = require('./db');

class Pdf {

    constructor(pdf) {
        this.pdf = pdf.pdf || "";
        this.module_id = pdf.module_id || "";
    }

    create(newPdf, result) {
        return new Promise((resolve, reject) => {
            sql.query("INSERT INTO pdfs SET ?", newPdf, (err, res) => {
                if(err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { id: res.insertId, ...newPdf });
                return resolve(res);
            })
        })
    }

    findByCourseId(courseId, result) {
        return new Promise((resolve, reject) => {
            sql.query("SELECT * FROM pdfsInCourseModules WHERE course_id = ?", [courseId], (err, res) => {
                if(err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, res);
                return resolve(res);
            })
        })
    }

    updateById(id, pdf, result) {
        return new Promise((resolve, reject) => {
            sql.query("UPDATE pdfs SET pdf = ? WHERE id = ?", [pdf.pdf, id], (err, res) => {
                if(err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { id: id, ...pdf});
                return resolve(res);
            })
        })
    }

    delete(id, result) {
        return new Promise((resolve, reject) => {
            sql.query("DELETE FROM pdfs WHERE id = ?", id, (err, res) => {
                if(err){
                    result(err, null);
                    return reject(err);
                }
                result(null, res);
                return resolve(res);
            })
        })
    }

}

module.exports = Pdf;