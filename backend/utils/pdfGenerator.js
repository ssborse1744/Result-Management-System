const PDFDocument = require('pdfkit');

module.exports = async (result) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
    doc.on('error', reject);

    doc.fontSize(20).text('Student Result Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${result.student.name}`);
    doc.text(`Roll Number: ${result.student.rollNumber}`);
    doc.text(`Class: ${result.student.class}`);
    doc.text(`Institute ID: ${result.student.instituteId}`);
    doc.moveDown();
    doc.text('Subjects:', { underline: true });
    result.student.subjects.forEach(subj => {
      doc.text(`${subj.name}: Grade ${subj.grade}, Marks ${subj.marks}`);
    });
    doc.moveDown();
    doc.text(`Published: ${result.published ? 'Yes' : 'No'}`);
    doc.text(`Created At: ${result.createdAt}`);

    doc.end();
  });
};
