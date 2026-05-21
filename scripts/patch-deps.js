const fs = require('fs');
const path = require('path');

function patch(pkgPath, patchFn, label) {
  const fullPath = path.join(__dirname, '..', 'node_modules', pkgPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`[patch] Skipping ${label} — not found`);
    return;
  }
  const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  patchFn(pkg);
  fs.writeFileSync(fullPath, JSON.stringify(pkg, null, 2));
  console.log(`[patch] ${label} OK`);
}

// zod: fix ./v3 compat export path (3.25.x ships dist/cjs not lib/)
patch('zod/package.json', (p) => {
  p.exports = p.exports || {};
  const hasCjs = fs.existsSync(path.join(__dirname, '..', 'node_modules/zod/dist/cjs/index.js'));
  if (hasCjs) {
    p.exports['./v3'] = {
      require: './dist/cjs/index.js',
      import:  './dist/esm/index.js',
      default: './dist/cjs/index.js',
    };
  }
}, 'zod ./v3 export');

// @langchain/core: add missing ./language_models/stream export
patch('@langchain/core/package.json', (p) => {
  p.exports = p.exports || {};
  if (!p.exports['./language_models/stream']) {
    const hasCjs = fs.existsSync(
      path.join(__dirname, '..', 'node_modules/@langchain/core/dist/language_models/base.cjs')
    );
    p.exports['./language_models/stream'] = hasCjs
      ? { require: './dist/language_models/base.cjs', import: './dist/language_models/base.js', default: './dist/language_models/base.cjs' }
      : { require: './dist/language_models/base.js', default: './dist/language_models/base.js' };
  }
}, '@langchain/core stream export');
