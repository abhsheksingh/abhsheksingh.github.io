const fs = require('fs');
const path = require('path');

function getStructure(dirPath) {
  const name = path.basename(dirPath);
  const item = { name };

  if (fs.statSync(dirPath).isDirectory()) {
    item.children = fs.readdirSync(dirPath)
      .filter(child => !['.git', 'node_modules', '.github', 'output.html', 'structure.json', 'structure.png', 'package-lock.json', 'package.json'].includes(child))
      .map(child => getStructure(path.join(dirPath, child)));
  }

  return item;
}

const structure = getStructure('.');

const htmlTemplate = fs.readFileSync('.github/rgraph/structure.html', 'utf8');
const fullHtml = htmlTemplate.replace('__STRUCTURE__', JSON.stringify(structure, null, 2));

fs.writeFileSync('.github/rgraph/output.html', fullHtml);
fs.writeFileSync('.github/rgraph/structure.json', JSON.stringify(structure, null, 2)); // Optional debug
console.log('✅ Full folder structure saved to .github/rgraph/output.html and .github/rgraph/structure.json');
