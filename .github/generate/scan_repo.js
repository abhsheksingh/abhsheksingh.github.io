const fs = require('fs');
const path = require('path');

function scanDir(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  return entries.map(entry => {
    const fullPath = path.join(dirPath, entry.name);
    return {
      name: entry.name,
      path: fullPath.replace(process.cwd() + '/', ''),
      type: entry.isDirectory() ? 'folder' : 'file',
      children: entry.isDirectory() ? scanDir(fullPath) : []
    };
  });
}

const structure = scanDir('.').filter(e =>
  !['.git', 'node_modules', '.github'].includes(e.name)
);

fs.writeFileSync('.github/generate/workflow_graph.json', JSON.stringify(structure, null, 2));