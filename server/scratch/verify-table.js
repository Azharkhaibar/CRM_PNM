const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rims_v1'
});

const sql = `
  SELECT id, portofolio, keterangan, sumber_risiko, dampak
  FROM operasional_nilai_ojk
  WHERE id = 4
`;

connection.query(sql, (err, results) => {
  if (err) {
    console.error('Error executing query:', err);
    process.exit(1);
  } else {
    console.log('Direct Table Results for ID 4:');
    console.log(JSON.stringify(results, null, 2));
  }
  connection.end();
});
