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

console.log(`Scanning ${allFiles.length} files...`);

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Skip comment lines for check
  const lines = content.split('\n');
  let hasRenaming = false;
  let renameTarget = '';
  let hasIsLoadingUsage = false;
  
  // Quick checks first
  if (!content.includes('isLoading')) continue;
  
  const renameMatch = content.match(/\bisLoading\s*:\s*([a-zA-Z0-9_]+)/);
  if (renameMatch) {
    hasRenaming = true;
    renameTarget = renameMatch[1];
  }
  
  if (hasRenaming && renameTarget !== 'isLoading') {
    // If it is renamed, let's see if the file still uses the word "isLoading" as a variable/reference.
    // We check for references to isLoading that are NOT:
    // - "isLoading:" (renaming key)
    // - "isLoading: boolean" or type declarations
    // - "isLoading?" optional property
    // - comment lines
    
    const usageLines = [];
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
        return;
      }
      
      // Look for word isLoading but not as key in object declaration
      // e.g. not: isLoading:
      // not: type declarations
      const matches = trimmed.match(/\bisLoading\b/g) || [];
      if (matches.length > 0) {
        // Check if all matches are just "isLoading:"
        const isOnlyRenamingKey = !trimmed.match(/\bisLoading\b(?!\s*:)/);
        if (!isOnlyRenamingKey) {
          usageLines.push({ lineNum: index + 1, content: trimmed });
        }
      }
    });
    
    if (usageLines.length > 0) {
      console.log(`\nBug found in: ${path.relative(srcDir, file)}`);
      console.log(`  Renamed to: ${renameTarget}`);
      usageLines.forEach((u) => {
        console.log(`    L${u.lineNum}: ${u.content}`);
      });
    }
  }
}
