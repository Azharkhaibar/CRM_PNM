const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rims_v1'
});

const sql = `
  SELECT moduleType, id, sumberRisiko, dampak, keterangan
  FROM risk_profile_repository_ojk_view
  LIMIT 5
`;

connection.query(sql, (err, results) => {
  if (err) {
    console.error('Error executing query:', err);
    process.exit(1);
  } else {
    console.log('Verification Results (Top 5 rows):');
    console.log(JSON.stringify(results, null, 2));
  }
  connection.end();
});
