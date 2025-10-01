# Multi-Site React Generator

A Node.js application that generates multiple React websites from a CSV file. Each row in the CSV corresponds to a single website with its own data.

## Features

- ✅ Reads website data from `website.csv`
- ✅ Generates standalone React apps for each CSV row
- ✅ Each app includes Hero and Contact sections
- ✅ Dynamic word selection for headlines (Quick/Fast/Speedy)
- ✅ Automatic data injection from CSV
- ✅ Simple, minimal CSS styling
- ✅ Built-in development server

## Quick Start

1. **Install dependencies** (if any):
   ```bash
   npm install
   ```

2. **Generate websites**:
   ```bash
   npm start
   ```

3. **View websites**:
   ```bash
   npm run dev
   ```
   Then open http://localhost:5173

## CSV Format

The `website.csv` file should have the following columns:
- `domain` - Website domain (used as folder name)
- `title` - Website title
- `description` - Website description
- `phone` - Contact phone number
- `address` - Contact address

Example:
```csv
domain,title,description,phone,address
foodexpress.com,Food Express,Delicious meals delivered fast,01712345678,"House 12, Road 5, Banani, Dhaka"
techhubbd.com,Tech Hub BD,Your trusted tech partner,01898765432,"Level 4, Block B, Dhanmondi, Dhaka"
```

## Generated Structure

After running `npm start`, the `build/` folder will contain:

```
build/
├── foodexpress.com/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       ├── siteData.json
│       └── components/
│           ├── Heading.jsx
│           └── Contact.jsx
└── techhubbd.com/
    └── ...
```

## Adding New Websites

1. Add a new row to `website.csv`
2. Run `npm start` to regenerate all websites
3. The new website will be automatically created in `build/`

## Development

Each generated website is a standalone React app that can be developed independently:

```bash
cd build/your-domain.com
npm install
npm run dev
```

## Requirements Met

- ✅ Takes input from CSV file
- ✅ Generates multiple React apps based on CSV data
- ✅ Each CSV row = one website
- ✅ `npm start` generates separate React apps in `build/` folder
- ✅ Each app uses CSV data
- ✅ New CSV rows automatically generate new websites
- ✅ Simple React template with Hero and Contact sections
- ✅ Minimal CSS (alignment only)
- ✅ Dynamic word replacement in headlines
- ✅ Template placeholder replacement for contact info