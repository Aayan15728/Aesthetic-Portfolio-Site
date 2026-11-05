# Contributing

Thanks for helping improve this portfolio! Small fixes and big ideas are both welcome.

## Getting started

```bash
git clone <your-fork-url>
cd awesome-portfolio-site
npm install
cp .env.example .env.local   # optional, every variable is optional
npm run dev
```

Open <http://localhost:3000>.

## Before you open a PR

```bash
npm run lint
npx tsc --noEmit
npm run build
```

CI runs the same three checks. For UI changes, please also look at light mode, dark mode and a phone-sized screen, and follow [DESIGN.md](./DESIGN.md).

## Project layout

| Path                    | What lives there                                                  |
| ----------------------- | ----------------------------------------------------------------- |
| `src/app`               | Routes: `/`, `/projects`, `/writings`, `/collection`, `/goal`     |
| `src/components`        | Reusable UI (frame, command palette, project cards, etc.)         |
| `src/data`              | Your content: projects, experience and the collection             |
| `content/writings`      | Blog posts as `.mdx` files                                        |
| `src/lib/site.ts`       | Name, description, social links, SEO defaults                     |
| `src/lib/store.ts`      | Storage adapter (Supabase, or local JSON files as fallback)       |
| `supabase/schema.sql`   | Tables used by the visitor counter and `/goal`                    |

## Making it yours

1. Edit `src/lib/site.ts` and the copy in `src/app/page.tsx`.
2. Replace the entries in `src/data/projects.ts`, `src/data/experience.ts` and `src/data/collection.ts`.
3. Delete the sample post in `content/writings` and add your own.
4. Set the variables from `.env.example` in your hosting dashboard.

## Guidelines

- Keep changes focused; one idea per PR.
- Never commit secrets, `.env` files or personal data.
- Follow the existing style (Tailwind utility classes, the `.frame` / `.rule` layout helpers).
