import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
if (config.outputDirectory !== 'dist' || config.framework !== null) {
  throw new Error('Vercel must publish dist as a static site.');
}
const root = path.resolve(config.outputDirectory);
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const isLocal = url => !/^(?:https?:|data:|#|\/\/)/.test(url);
const references = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
  .map(match => match[1]).filter(isLocal);
for (const reference of references) {
  const resolved = path.resolve(root, reference.split(/[?#]/)[0]);
  if (!resolved.startsWith(root + path.sep) || !fs.existsSync(resolved)) {
    throw new Error('Missing or invalid local asset: ' + reference);
  }
}
const ids = [...html.matchAll(/id="([^"]+)"/g)].map(match => match[1]);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate element IDs.');
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.includes(match[1])) throw new Error('Missing anchor: ' + match[1]);
}
for (const file of fs.readdirSync(root)) {
  const filename = path.join(root, file);
  if (file.endsWith('.js')) new vm.Script(fs.readFileSync(filename, 'utf8'), { filename });
  if (file.endsWith('.css')) {
    for (const match of fs.readFileSync(filename, 'utf8').matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
      if (isLocal(match[1]) && !fs.existsSync(path.resolve(root, match[1].split(/[?#]/)[0]))) {
        throw new Error('Missing CSS asset: ' + match[1]);
      }
    }
  }
}
console.log(`Verified ${references.length} local references, navigation targets, JavaScript syntax, CSS assets, and Vercel configuration.`);
