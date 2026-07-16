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
    console.log(`${path.basename(file)}: DOES NOT EXIST`);
    continue;
  }
  const content = fs.readFileSync(file, 'utf8');
  
  // Let's check for exact patterns
  const hasRenaming = content.includes('isLoading: loading');
  
  // Check if isLoading is used but not defined.
  // isLoading is defined if:
  // - "isLoading," in destructuring (not renamed)
  // - "const isLoading =" in local variables
  // Let's search for "isLoading" and count its occurrences that are not "isLoading:" or "isLoading," or "const isLoading ="
  const hasDirectIsLoading = content.match(/\bisLoading\b/g) || [];
  const definitions = content.match(/\bisLoading\s*,|\bconst\s+isLoading\b|\bisLoading\s*:\s*isLoading\b/g) || [];
  
  // A file is buggy if it references "isLoading" but has no local definition of it
  const isBuggy = hasDirectIsLoading.length > 0 && definitions.length === 0 && !content.includes('function ParameterPanel({') && !content.includes('function AspekPanel({');
  // Wait, let's just log the count of references vs definitions
  console.log(`${path.basename(file)}: references=${hasDirectIsLoading.length}, definitions=${definitions.length}, hasRenaming=${hasRenaming}`);
}
