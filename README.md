# Photo Gallery

Small Angular app — random photos from Picsum, favorites saved in localStorage.

## Run locally

```bash
npm ci
npm start
```

Open http://localhost:4200

Tests and build:

```bash
npm test
npm run build
```

## Routes

- **`/`** — photo feed with infinite scroll (custom `IntersectionObserver` directive), click to add to favorites
- **`/favorites`** — saved photos (persist after refresh), click to open detail
- **`/photos/:id`** — single photo + remove from favorites

Photos come from `picsum.photos`. Fetching is delayed by ~200–300 ms to mimic a slow API. Favorites are stored as full `Photo` objects in localStorage, not just ids.

## Project layout

- `core` — API, mapper, favorites store
- `shared` — grid, cards, infinite scroll, loader
- `features` — lazy-loaded pages

Angular 21, Angular Material, SCSS.
