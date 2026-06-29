const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.jsx') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const initial = content;
  content = content.replace(/bg-stone\.png/g, 'bg-stone.webp');
  content = content.replace(/realistic_card_bg\.png/g, 'realistic_card_bg.webp');
  content = content.replace(/table_bg_cyan\.png/g, 'table_bg_cyan.webp');
  content = content.replace(/table_bg_red\.png/g, 'table_bg_red.webp');
  content = content.replace(/bg_magical_hall\.png/g, 'bg_magical_hall.webp');
  
  if (content !== initial) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
