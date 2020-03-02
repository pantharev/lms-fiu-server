const sql = require("./db");

// constructor
const Course = function(course) {
    this.name = course.name;
    this.description = course.description;
    this.seats = course.seats;
    this.start_date = course.start_date;
    this.end_date = course.end_date;
};

Course.create = (newCourse, result) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO courses SET ?", newCourse, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, { id: res.insertId, ...newCourse });
            return resolve(res[0]);
        });
    });
};

Course.findById = (courseId, result) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM courses WHERE id = ?", [courseId], (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res[0]);
            return resolve(res[0]);
        });
    });
};

Course.getAll = (req, result) => {
    return new Promise((resolve, reject) => {
        const conn = sql.getConnection((err, connection) => {
            let numRows;
            let queryPagination;
            let numPerPage = parseInt(req.query.npp, 10) || 1;
            let page = parseInt(req.query.page, 10) || 0;
            let numPages;
            let skip = page * numPerPage;
            let limit = skip + ', ' + numPerPage;
            connection.beginTransaction();
            connection.query("SELECT count(*) as numRows FROM courses", (err, res) => {
                numRows = res[0].numRows;
                numPages = Math.ceil(numRows / numPerPage);
                console.log('number of pages: ', numPages);
            });
            connection.query("SELECT * FROM courses ORDER BY name ASC LIMIT ? , ?", [skip, numPerPage], (err, res) => {
                if(err) {
                    result(err, null);
                    return reject(err);
                }
                let responsePayload = {
                    res: res
                };
                if (page < numPages){
                    responsePayload.pagination = {
                        current: page,
                        perPage: numPerPage,
                        maxPages: numPages,
                        previous: page > 0 ? page - 1 : undefined,
                        next: page < numPages - 1 ? page + 1 : undefined
                    }
                }
                else responsePayload.pagination = {
                    err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
                }
                result(null, responsePayload);
                return resolve(responsePayload);
            });
            connection.commit();
            connection.release();
        });
        /*sql.query("SELECT count(*) as numRows FROM courses", (err, res) => {
            numRows = res[0].numRows;
            numPages = Math.ceil(numRows / numPerPage);
            console.log('number of pages: ', numPages);
        });*/
    });
};

Course.updateById = (id, course, result) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE courses SET name = ?, description = ?, seats = ?, start_date = ?, end_date = ? WHERE id = ?",
            [course.name, course.description, course.seats, course.start_date, course.end_date, id], (err, res) => {
                if(err) {
                    result(err, null);
                    return reject(err);
                }
                result(null, { id: id, ...course});
                return resolve(res[0]);
            });
    });
};

Course.delete = (id, result) => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM courses WHERE id = ?", id, (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            result(null, res);
            return resolve(res[0]);
        });
    });
};

Course.deleteAll = result => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM courses", (err, res) => {
            if(err) {
                result(err, null);
                return reject(err);
            }
            console.log(`deleted ${res.affectedRows} courses`);
            result(null, res);
            return resolve(res);
        });
    });
};

module.exports = Course;