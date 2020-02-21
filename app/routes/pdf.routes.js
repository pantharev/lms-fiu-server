module.exports = (app, upload) => {
    const pdf = require("../controllers/pdf.controller");

    app.post("/pdfs", upload.any(), pdf.create);
    
    app.get("/pdfs/:courseId", pdf.findAll);

    app.put("/pdfs/:pdfId", pdf.update);

    app.delete("/pdfs/:pdfId", pdf.delete);
};