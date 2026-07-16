const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
};

const srcDir = 'C:\\Project\\simari_app\\client\\src';
const allFiles = walk(srcDir);

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('isLoading')) continue;
  
  // Clean comments to avoid false positives
  const cleanContent = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
  
  const occurrences = (cleanContent.match(/\bisLoading\b/g) || []).length;
  if (occurrences === 0) continue;
  
  // Is it declared?
  const isDeclared = 
    cleanContent.includes('const isLoading') ||
    cleanContent.includes('let isLoading') ||
    cleanContent.includes('var isLoading') ||
    // Destructured directly as isLoading (not renamed)
    /\bisLoading\s*,/.test(cleanContent) || 
    // Destructured and explicitly assigned to itself (e.g. isLoading: isLoading)
    /\bisLoading\s*:\s*isLoading\b/.test(cleanContent) ||
    // Prop in a regular function parameter list
    /function\s+[a-zA-Z0-9_]+\s*\(\s*\{[^}]*\bisLoading\b/.test(cleanContent) ||
    // Prop in an arrow function parameter list
    /\(\s*\{[^}]*\bisLoading\b[^}]*\}\s*\)\s*=>/.test(cleanContent);
    
  if (!isDeclared) {
    console.log(`BUG DETECTED in: ${path.relative(srcDir, file)}`);
    console.log(`  Total occurrences of isLoading: ${occurrences}`);
    
    // Print lines containing isLoading
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('isLoading')) {
        console.log(`    L${index + 1}: ${line.trim()}`);
      }
    });
  }
}
