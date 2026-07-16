const fs = require('fs');
const path = require('path');

const files = [
  'C:\\Project\\simari_app\\client\\src\\features\\Dashboard\\pages\\OJK\\pages\\produk\\konsentrasi-produk\\tabs\\konsentrasi-produk-inherent.jsx',
  'C:\\Project\\simari_app\\client\\src\\features\\Dashboard\\pages\\OJK\\pages\\produk\\kredit-produk\\tabs\\kredit-produk-inherent.jsx',
  'C:\\Project\\simari_app\\client\\src\\features\\Dashboard\\pages\\OJK\\pages\\produk\\likuiditas-produk\\tabs\\likuiditas-produk-inherent.jsx',
  'C:\\Project\\simari_app\\client\\src\\features\\Dashboard\\pages\\OJK\\pages\\produk\\pasar-produk\\tabs\\pasar-produk-inherent.jsx',
  'C:\\Project\\simari_app\\client\\src\\features\\Dashboard\\pages\\OJK\\pages\\regulatory\\hukum\\tabs\\hukum-inherent.jsx',
  'C:\\Project\\simari_app\\client\\src\\features\\Dashboard\\pages\\OJK\\pages\\regulatory\\investasi\\tabs\\investasi-inherent.jsx',
  'C:\\Project\\simari_app\\client\\src\\features\\Dashboard\\pages\\OJK\\pages\\regulatory\\kepatuhan\\tabs\\kepatuhan-inherent.jsx',
  'C:\\Project\\simari_app\\client\\src\\features\\Dashboard\\pages\\OJK\\pages\\regulatory\\operasional\\tabs\\operasional-inherent.jsx',
  'C:\\Project\\simari_app\\client\\src\\features\\Dashboard\\pages\\OJK\\pages\\regulatory\\permodalan\\tabs\\permodalan-inherent.jsx',
  'C:\\Project\\simari_app\\client\\src\\features\\Dashboard\\pages\\OJK\\pages\\regulatory\\rentabilitas\\tabs\\rentabilitas-inherent.jsx',
  'C:\\Project\\simari_app\\client\\src\\features\\Dashboard\\pages\\OJK\\pages\\regulatory\\reputasi\\tabs\\reputasi-inherent.jsx',
  'C:\\Project\\simari_app\\client\\src\\features\\Dashboard\\pages\\OJK\\pages\\regulatory\\strategis\\tabs\\strategis-inherent.jsx',
  'C:\\Project\\simari_app\\client\\src\\features\\Dashboard\\pages\\OJK\\pages\\regulatory\\tatakelola\\tabs\\tatakelola-inherent.jsx',
  'C:\\Project\\simari_app\\client\\src\\features\\Dashboard\\pages\\RiskProfile\\pages\\pasar\\pasar-inherent.jsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`Skipping non-existent file: ${file}`);
    continue;
  }
  let content = fs.readFileSync(file, 'utf8');
  console.log(`=== ${path.basename(file)} ===`);

  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('isLoading')) {
      console.log(`  L${index + 1}: ${line.trim()}`);
    }
  });
}
