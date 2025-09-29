'use strict';

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CSV_PATH = path.join(ROOT_DIR, 'website.csv');
const BUILD_DIR = path.join(ROOT_DIR, 'build');

/**
 * Minimal CSV parser that supports quoted fields with commas and newlines.
 * Returns an array of row objects keyed by header.
 */
function parseCsv(content) {
  const rows = [];
  const headers = [];

  let i = 0;
  const len = content.length;
  let cell = '';
  let row = [];
  let inQuotes = false;

  function endCell() {
    row.push(cell);
    cell = '';
  }

  function endRow() {
    if (row.length === 1 && row[0] === '' && rows.length > 0) {
      row = [];
      return;
    }
    rows.push(row);
    row = [];
  }

  while (i < len) {
    const ch = content[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < len && content[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        cell += ch;
        i++;
        continue;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
        continue;
      }
      if (ch === ',') {
        endCell();
        i++;
        continue;
      }
      if (ch === '\n') {
        endCell();
        endRow();
        i++;
        continue;
      }
      if (ch === '\r') {
        // Normalize CRLF -> treat as newline; skip if followed by \n
        if (i + 1 < len && content[i + 1] === '\n') {
          i += 2;
        } else {
          i++;
        }
        endCell();
        endRow();
        continue;
      }
      cell += ch;
      i++;
    }
  }
  // Flush last cell/row
  endCell();
  endRow();

  if (rows.length === 0) return [];
  const headerRow = rows[0].map(h => h.trim());
  for (const h of headerRow) headers.push(h);

  const dataRows = rows.slice(1).filter(r => r.some(v => (v || '').trim() !== ''));
  return dataRows.map(r => {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = (r[idx] || '').trim();
    });
    return obj;
  });
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function sanitizeDomain(input) {
  return input.replace(/[^a-zA-Z0-9.-]/g, '-');
}

function generateViteIndexHtml(title) {
  const safeTitle = title || 'Website';
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(safeTitle)}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
  </html>`;
}

function generateSitePackageJson() {
  return {
    name: 'generated-site',
    private: true,
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    dependencies: {
      react: '^18.3.1',
      'react-dom': '^18.3.1'
    },
    devDependencies: {
      vite: '^5.4.0',
      '@vitejs/plugin-react': '^4.3.1'
    }
  };
}

function generateViteConfig() {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`;
}

function generateStylesCss() {
  return `body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; }
.container { max-width: 760px; margin: 0 auto; padding: 24px; }
.hero { padding: 40px 0; text-align: center; }
.contact { padding: 24px 0; }
h1 { margin: 0 0 12px; font-size: 28px; font-weight: 600; }
p { margin: 6px 0; }
.muted { color: #555; }
.card { border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; }
`;
}

function generateMainJsx() {
  return `import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)
`;
}

function generateAppJsx() {
  return `import React from 'react'
import Heading from './components/Heading.jsx'
import Contact from './components/Contact.jsx'
import siteData from './siteData.json'

export default function App() {
  return (
    <div className="container">
      <section className="hero">
        <div className="card">
          <Heading />
          {siteData.description ? <p className="muted">{siteData.description}</p> : null}
        </div>
      </section>
      <section className="contact">
        <div className="card">
          <Contact phone={siteData.phone} address={siteData.address} />
        </div>
      </section>
    </div>
  )
}
`;
}

function generateHeadingComponent() {
  return `import React from 'react'

const words = ['Quick', 'Fast', 'Speedy']
const chosen = words[Math.floor(Math.random() * words.length)]

export default function Heading() {
  return <h1>{chosen} delivery service in dhaka.</h1>
}
`;
}

function generateContactComponent() {
  return `import React from 'react'

export default function Contact({ phone, address }) {
  return (
    <>
      <p>Phone: {phone}</p>
      <p>Address: {address}</p>
    </>
  )
}
`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error('CSV file not found at', CSV_PATH);
    process.exit(1);
  }

  const csv = fs.readFileSync(CSV_PATH, 'utf8');
  const rows = parseCsv(csv);
  if (!rows.length) {
    console.log('No data rows found in CSV. Nothing to generate.');
    return;
  }

  ensureDir(BUILD_DIR);

  for (const r of rows) {
    const domain = sanitizeDomain(r.domain || 'site');
    const siteDir = path.join(BUILD_DIR, domain);
    ensureDir(siteDir);

    // Prepare Vite React app structure
    const pkg = generateSitePackageJson();
    writeFile(path.join(siteDir, 'package.json'), JSON.stringify(pkg, null, 2));
    writeFile(path.join(siteDir, 'vite.config.js'), generateViteConfig());
    writeFile(path.join(siteDir, 'index.html'), generateViteIndexHtml(r.title));

    const srcDir = path.join(siteDir, 'src');
    ensureDir(srcDir);
    ensureDir(path.join(srcDir, 'components'));

    writeFile(path.join(srcDir, 'styles.css'), generateStylesCss());
    writeFile(path.join(srcDir, 'main.jsx'), generateMainJsx());
    writeFile(path.join(srcDir, 'App.jsx'), generateAppJsx());
    writeFile(path.join(srcDir, 'components', 'Heading.jsx'), generateHeadingComponent());
    writeFile(path.join(srcDir, 'components', 'Contact.jsx'), generateContactComponent());
    writeFile(path.join(srcDir, 'siteData.json'), JSON.stringify({
      title: r.title || 'Website',
      description: r.description || '',
      phone: r.phone || '',
      address: r.address || ''
    }, null, 2));
  }

  console.log(`Generated ${rows.length} site(s) in ${BUILD_DIR}`);
}

main();


