const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rims_v1',
    port: 3306
  });

  try {
    console.log('--- ALL HUKUM HEADERS ---');
    const [headers] = await connection.query(`SELECT * FROM kpmr_hukum_ojk`);
    console.log(headers);

    console.log('\n--- HUKUM QUESTIONS WITH NON-EMPTY SKOR ---');
    const [questions] = await connection.query(`SELECT * FROM kpmr_pertanyaan_hukum`);
    const withSkor = questions.filter(q => {
      if (!q.skor) return false;
      const parsed = typeof q.skor === 'string' ? JSON.parse(q.skor) : q.skor;
      return Object.values(parsed).some(v => v !== null && v !== undefined && v !== '');
    });
    console.log(`Found ${withSkor.length} questions with scores out of ${questions.length}`);
    for (const q of withSkor) {
      console.log(`ID: ${q.id}, Nomor: ${q.nomor}, Skor: ${JSON.stringify(q.skor)}, Aspek ID: ${q.aspek_id}`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

run();
