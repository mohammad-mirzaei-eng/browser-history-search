const fs = require('node:fs');
const path = require('node:path');

const sourceRoot = path.resolve(__dirname, '..');
const projectRoot = path.resolve(sourceRoot, '..');
const packageFiles = [
  'browser-polyfill.js',
  'chart.min.js',
  'config.js',
  'main.js',
  'popup.html',
  'state.js',
  'ui.js',
  'utils.js'
];

const profiles = [
  {
    output: 'desktop/chrome',
    css: `html { width: 780px; height: 600px; }\n`,
    manifest(manifest) {
      delete manifest.browser_specific_settings;
      return manifest;
    }
  },
  {
    output: 'desktop/firefox',
    css: `html { width: 780px; height: 600px; }\n`,
    manifest(manifest) {
      manifest.browser_specific_settings = {
        gecko: {
          id: 'browser-history-search@mohammad-mirzaei-eng',
          strict_min_version: '109.0'
        }
      };
      delete manifest.minimum_chrome_version;
      return manifest;
    }
  },
  {
    output: 'mobile/firefox',
    css: `
html {
  width: 100vw;
  height: 100vh;
  min-width: 320px;
}

@supports (height: 100dvh) {
  html { height: 100dvh; }
}

body, .browser-window, .app-container {
  width: 100%;
  height: 100%;
  min-height: 0;
}

.app-container {
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto minmax(0, 1fr) minmax(0, 1fr);
}

.app-header {
  align-items: flex-start;
  flex-direction: column;
}

.settings-section {
  width: 100%;
  justify-content: space-between;
}

.sidebar {
  max-height: 48vh;
  border-inline-end: 0;
  border-bottom: 1px solid var(--border);
}

@supports (height: 100dvh) {
  .sidebar { max-height: 48dvh; }
}

.filter-section {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.main-content {
  overflow: auto;
}

@media (max-width: 420px) {
  .filter-section { grid-template-columns: minmax(0, 1fr); }
  .main-content { padding: 14px; }
}
`,
    manifest(manifest) {
      manifest.browser_specific_settings = {
        gecko: {
          id: 'browser-history-search-mobile@mohammad-mirzaei-eng',
          strict_min_version: '128.0'
        }
      };
      delete manifest.minimum_chrome_version;
      return manifest;
    }
  }
];

const baseStyles = fs.readFileSync(path.join(sourceRoot, 'styles.css'), 'utf8');
const baseManifest = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'manifest.json'), 'utf8'));

for (const profile of profiles) {
  const packageRoot = path.join(projectRoot, profile.output);
  fs.mkdirSync(packageRoot, { recursive: true });

  for (const file of packageFiles) {
    fs.copyFileSync(path.join(sourceRoot, file), path.join(packageRoot, file));
  }

  for (const directory of ['fonts', 'icons']) {
    fs.cpSync(path.join(sourceRoot, directory), path.join(packageRoot, directory), { recursive: true });
  }

  fs.writeFileSync(path.join(packageRoot, 'styles.css'), `${baseStyles}\n${profile.css}`);
  fs.writeFileSync(
    path.join(packageRoot, 'manifest.json'),
    `${JSON.stringify(profile.manifest({ ...baseManifest }), null, 2)}\n`
  );
}

console.log('Built desktop/chrome, desktop/firefox, and mobile/firefox packages.');