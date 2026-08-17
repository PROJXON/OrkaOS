import fs from 'node:fs';
import path from 'node:path';
import ts from '/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js';

const root = process.cwd();
const srcDir = path.join(root, 'src');
const outDir = path.join(root, 'dist', 'src');
fs.mkdirSync(outDir, { recursive: true });

const modules = [
  'main.jsx', 'App.jsx', 'IntakeForm.jsx', 'Icon.jsx', 'LegacyWidgets.jsx',
  'OverviewStory.jsx', 'OverviewInteractions.jsx', 'products.js', 'timezones.js'
];

function preprocess(source) {
  // Vite normally replaces environment references during bundling. Static QA
  // uses empty placeholders instead of assuming a deployment secret exists.
  source = source.replace(/import\.meta\.env\.VITE_[A-Z0-9_]+/g, '""');

  // CSS is bundled into dist/assets/app.css below.
  source = source.replace(/^import\s+['"]\.\/[^'"]+\.css['"];?\s*$/gm, '');

  // Convert local asset imports to static URLs relative to dist/src/*.js.
  source = source.replace(/^import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]\.\/assets\/([^'"]+)['"];?\s*$/gm,
    (_m, name, assetPath) => `const ${name} = "../assets/${assetPath}";`);

  return source;
}

function rewriteImports(code) {
  code = code
    .replace(/from ["']react\/jsx-runtime["']/g, 'from "../vendor/react_jsx-runtime.js"')
    .replace(/from ["']react-dom\/client["']/g, 'from "../vendor/react-dom_client.js"')
    .replace(/from ["']react-hook-form["']/g, 'from "../vendor/react-hook-form.js"')
    .replace(/from ["']react["']/g, 'from "../vendor/react.js"');

  // Browser ESM requires explicit extensions for local modules.
  code = code.replace(/from ["']\.\/(App|IntakeForm|Icon|LegacyWidgets|OverviewStory|OverviewInteractions)["']/g,
    (_m, name) => `from "./${name}.js"`);
  code = code.replace(/from ["']\.\/(App|IntakeForm|Icon|LegacyWidgets|OverviewStory|OverviewInteractions)\.jsx["']/g,
    (_m, name) => `from "./${name}.js"`);
  return code;
}

for (const file of modules) {
  const inputPath = path.join(srcDir, file);
  let source = preprocess(fs.readFileSync(inputPath, 'utf8'));
  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      allowJs: true,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      removeComments: false
    },
    fileName: file,
    reportDiagnostics: true
  });
  const errors = (result.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
  if (errors.length) {
    console.error(`TypeScript errors in ${file}`);
    for (const d of errors) console.error(ts.flattenDiagnosticMessageText(d.messageText, '\n'));
    process.exitCode = 1;
  }
  const outName = file.replace(/\.(jsx|js)$/, '.js');
  fs.writeFileSync(path.join(outDir, outName), rewriteImports(result.outputText));
}

// Copy all source assets to the static preview, preserving paths.
fs.cpSync(path.join(srcDir, 'assets'), path.join(root, 'dist', 'assets'), { recursive: true, force: true });

// CSS imports are collapsed into one file. Because it lives in dist/assets,
// rewrite src-relative ./assets/... URLs to be relative to that directory.
const cssFiles = ['index.css', 'legacy-widgets.css', 'IntakeForm.css', 'OverviewStory.css'];
let css = cssFiles.map(name => `/* ===== ${name} ===== */\n${fs.readFileSync(path.join(srcDir, name), 'utf8')}`).join('\n\n');
css = css.replace(/url\((['"]?)\.\/assets\//g, 'url($1./');
fs.writeFileSync(path.join(root, 'dist', 'assets', 'app.css'), css);

console.log('Static dist refreshed.');
