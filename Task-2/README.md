## Multi-Website React Generator

Generates multiple minimal React apps (two sections: Hero and Contact) from `website.csv` into `build/<domain>`.

### Usage

- Install Node.js 18+.
- From the repo root:

```bash
npm start
```

This reads `website.csv` and generates per-site folders in `build/`.

To serve locally:

```bash
npm run dev
```

Opens a simple server at `http://localhost:5173` with links to each site.

### CSV format

Headers required: `domain,title,description,phone,address`

See `Technical_Task_2_English.md` for full specification and example.


