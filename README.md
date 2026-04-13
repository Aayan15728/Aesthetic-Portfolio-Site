# Aayan Sharma Portfolio

A modern, animated, and SEO-focused developer portfolio built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

This project is open source and intended as both:
- a personal portfolio website
- a starter reference for building clean, fast, aesthetic portfolio sites

## Live Demo

- [aayan-sharma.vercel.app](https://aayan-sharma.vercel.app)

## Tech Stack

- Next.js `16.2.2` (App Router)
- React `19.2.4`
- TypeScript `^5`
- Tailwind CSS `^4`
- Framer Motion
- next-themes
- ESLint (`eslint-config-next`)

## Features

- Responsive portfolio layout
- Light/dark theme toggle
- Animated reveal transitions
- Featured project cards
- GitHub activity/contribution components
- Visitor count widget
- SEO setup:
  - metadata
  - Open Graph + Twitter cards
  - `robots.txt`
  - `sitemap.xml`
  - JSON-LD structured data

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd portfoilio2.0
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

If you deploy on Vercel, you can set this in Project Settings -> Environment Variables.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - start local dev server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run ESLint checks

## Project Structure

```text
src/
  app/          # App Router pages, layout, metadata routes
  components/   # Reusable UI/components
  lib/          # Utilities + shared config
public/
  assets/       # Portfolio images/screenshots
```

## Contributing

Contributions are welcome and appreciated.

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push your branch: `git push origin feat/your-feature`
5. Open a Pull Request

Please keep PRs focused, well-described, and lint-clean.

## Code Style

- TypeScript-first
- Functional React components
- Keep components small and reusable
- Prefer clear naming over clever abstractions

## Known Notes

- There is currently one existing lint rule violation in `src/components/github-activity.tsx` related to synchronous state updates inside an effect. This is unrelated to the core site setup and can be fixed in a separate PR.

## License

This project is licensed under the [MIT License](./LICENSE).

## Author

**Aayan Sharma**

- GitHub: [@Aayan15728](https://github.com/Aayan15728)
- X: [@aayanships](https://x.com/aayanships)
- LinkedIn: [aayan-sharma91](https://www.linkedin.com/in/aayan-sharma91/)
