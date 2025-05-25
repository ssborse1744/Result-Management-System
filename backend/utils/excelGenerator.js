const ExcelJS = require('exceljs');

module.exports = async (data, type) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(type);

  if (!data.length) return Buffer.from('');

  worksheet.columns = Object.keys(data[0]._doc || data[0]).map(key => ({ header: key, key }));
  data.forEach(item => worksheet.addRow(item._doc || item));

  return await workbook.xlsx.writeBuffer();
};
