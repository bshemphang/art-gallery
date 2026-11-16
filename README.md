# Art Gallery

Online art gallery and storefront for artists. Browse paintings in a masonry gallery, open any piece for details, and manage the collection from an admin section.

## Tech stack

- Next.js, React
- Tailwind CSS
- Supabase (database and storage)
- Headless UI, Heroicons, react-masonry-css

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

Connect your Supabase project first by creating a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Scripts

- `npm run dev` - start the development server
- `npm run build` - production build
- `npm run start` - serve the production build
- `npm run lint` - run ESLint
