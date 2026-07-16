const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rims_v1'
});

connection.query(
  'SELECT id, year, quarter, sub_no, formula, pembilang_value, penyebut_value, hasil, peringkat, weighted, mode FROM indikators_stratejik_holding WHERE sub_no = "6.5.1"',
  (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
    } else {
      console.log('Indicator 6.5.1 across all periods:');
      console.log(JSON.stringify(results, null, 2));
    }
    connection.end();
  }
);
