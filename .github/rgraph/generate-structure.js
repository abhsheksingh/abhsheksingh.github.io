const fs = require('fs');
const path = require('path');

const IGNORED_PATHS = [
  '.git',
  'node_modules',
  '.github',
  'package-lock.json',
  'package.json',
  'static/images',
  'static/pdf'
];

function getStructure(dirPath, basePath = '.') {
  const name = path.basename(dirPath);
  const relativePath = path.relative(basePath, dirPath) || '.';
  const item = { name };

  if (fs.statSync(dirPath).isDirectory()) {
    // If this directory itself is ignored, return null (skip)
    if (IGNORED_PATHS.some(ignored => {
      // Exact match or starts with ignored folder + path.sep
      return relativePath === ignored || relativePath.startsWith(ignored + path.sep);
    })) {
      return null;
    }

    const children = fs.readdirSync(dirPath)
      .map(child => getStructure(path.join(dirPath, child), basePath))
      .filter(Boolean); // remove nulls from ignored dirs

    if (children.length > 0) {
      item.children = children;
    }
  } else {
    // If a file is in ignored paths, skip it
    if (IGNORED_PATHS.some(ignored => relativePath === ignored)) {
      return null;
    }
  }

  return item;
}

const structure = getStructure('.', '.');

const htmlTemplate = fs.readFileSync('.github/rgraph/structure.html', 'utf8');
const fullHtml = htmlTemplate.replace('__STRUCTURE__', JSON.stringify(structure, null, 2));

fs.writeFileSync('.github/rgraph/output.html', fullHtml);
fs.writeFileSync('.github/rgraph/structure.json', JSON.stringify(structure, null, 2)); // Optional debug
console.log('✅ Full folder structure saved to .github/rgraph/output.html and .github/rgraph/structure.json');
