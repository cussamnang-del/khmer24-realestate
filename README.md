# khmer24-realestate

A real-estate marketplace frontend inspired by [khmer24.com](https://www.khmer24.com/en), built with plain **HTML**, **Tailwind CSS 4**, and **vanilla JavaScript** — no framework required.

## Live preview

https://public-yxizhmsh.devinapps.com

## Features

- Sticky header with logo, multi-field search, language toggle (EN / ខ្មែរ), and "Post Ad" CTA
- Scrollable category strip (Apartments, Houses, Villas, Condos, Land, Commercial, Office, Shop, Warehouse, Hotel)
- Hero with For-Sale / For-Rent / All quick tabs and live counters
- Sidebar filters: location, property type chips, price (with $500/$1.5K/$5K presets), bedrooms, bathrooms, area, features (parking, pool, gym, furnished, balcony)
- Active filter pills (click any pill to remove it)
- Sort by featured / newest / price asc-desc / largest area
- Grid and list view toggle
- Featured listings section
- Property cards with image hover-zoom, photo count, badges (Featured / Urgent / Verified / For Sale / For Rent)
- Save-to-favorites with `localStorage` persistence
- Property detail modal with photo thumbnails, full specs, features, and call/message buttons
- Toast notifications for feedback
- Fully responsive (mobile → desktop)
- 60 mock listings with realistic Cambodian locations, agents, and Unsplash imagery

## Stack

- HTML5
- [Tailwind CSS 4](https://tailwindcss.com/) (built via `@tailwindcss/cli`)
- Vanilla JavaScript (no JS build step required)

## Project structure

```
khmer24-realestate/
├── src/
│   └── input.css         # Tailwind source with custom theme + utilities
├── public/
│   ├── index.html        # App shell
│   ├── output.css        # Built Tailwind output (generated)
│   └── js/
│       ├── data.js       # Mock listings, categories, agents
│       └── app.js        # State, rendering, filters, modal, favorites
├── package.json
└── README.md
```

## Local development

```bash
npm install
npm run build           # one-off CSS build
npm run dev             # watch & rebuild CSS on change
npm run serve           # serve ./public on http://localhost:8080
npm start               # build + serve in one command
```

Open http://localhost:8080 in your browser.

## Build output

Running `npm run build` produces `public/output.css`, which the HTML references directly. The `public/` folder is fully static and can be deployed to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3, etc.).

## Customization

- **Brand colors** — adjust the `--color-brand-*` tokens in `src/input.css` under the `@theme` block.
- **Listings** — edit `public/js/data.js` to add/remove categories or properties. The card layout adapts automatically.
- **Filters** — the filter sidebar reads `state` in `public/js/app.js`. Add new filters by extending `state` and `matchesFilters()`.

## License

MIT
