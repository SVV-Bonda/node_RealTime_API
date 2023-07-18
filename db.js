const sql = require('mssql');

const config = {
  user: 'sai_vijju',
  password: '*************',
  database: 'vijjuDB',
  server: '1.2.3.4.5',
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    encrypt: true,
    trustedConnection: true,
  },
};

sql.connect(config, (err) => {
  if (err) {
    throw err;
  }
  console.log('SQL DATABASE CONNECTED...!');
});

module.exports = { config, sql };
