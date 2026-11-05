# Design

How this site looks and moves, and the rules that keep it consistent. When you change the UI, match this file. If you change a rule on purpose, update it here too.

The tokens live in [`src/app/globals.css`](./src/app/globals.css). The fonts load in [`src/app/layout.tsx`](./src/app/layout.tsx).

## The idea

An editorial page on graph paper. A single narrow column sits between dotted lines, with quiet greys and serif headings. Colour is rare, so it means something when it appears: a tech logo, a project's gradient, a green dot for something live. Most of the personality comes from small interactions.

## Colour

Light is the default theme. Dark mode is a toggle and does not follow the system setting.

| Token          | Light                | Dark                    | Used for                         |
| -------------- | -------------------- | ----------------------- | -------------------------------- |
| `--background` | `#FCFCFC`            | `#0A0A0A`               | Page                             |
| `--foreground` | `#171717`            | `#F5F5F5`               | Headings, strong text            |
| `--muted`      | `#737373`            | `#A3A3A3`               | Body text, metadata              |
| `--accent`     | `#171717`            | `#F5F5F5`               | Focus rings. Black, not blue     |
| `--line`       | `rgba(0,0,0,0.22)`   | `rgba(255,255,255,0.2)` | Dotted frame and rules           |
| `--border`     | `rgba(0,0,0,0.06)`   | `rgba(255,255,255,0.06)`| Faint borders                    |

The GitHub graph has its own scale: `--gh-0` to `--gh-4` are greys at rest, and `--gh-g1` to `--gh-g4` are the greens a dot turns on hover.

Where colour is allowed:

- **Tech logos:** always in brand colour in the bio. In Skills they stay grey until hover or focus.
- **Project cards:** one `accent` colour per project, set in `src/data/projects.ts`.
- **Status:** emerald for live, amber for in progress, grey for archived or discontinued.
- **Socials:** the brand colour appears only on hover.
- **Visit button:** a `#8da7ff` border.
- **Verified tick:** `#1d9bf0`.

## Type

| Role            | Font             | Size and weight                       |
| --------------- | ---------------- | ------------------------------------- |
| Name (`h1`)     | Instrument Serif | 26px on phones, 42px from `sm`        |
| Section heading | Instrument Serif | 26px on phones, 30px from `sm`        |
| Role line       | Inter            | 15px to 18px, semibold, muted         |
| Body            | Inter            | 15px to 16px, line height 1.85        |
| Project title   | Inter            | 20px, semibold                        |
| Metadata        | Inter            | 11px to 13px                          |
| Book names      | Geist            | Medium. Only on the bookshelf         |

Serif is for headings only. Don't set body text in it.

## Layout

- **Frame:** one centred column, at most `760px` wide, with dotted edges from `sm` up (`.frame`).
- **Rules:** `.rule` is a full-width dotted line with crosshair dots where it meets the frame. Put one between sections.
- **Section padding:** `px-6 sm:px-10 py-10`.
- **Inner lines:** lines inside a section stop at the frame edges. Experience rows and Socials cells use dotted `border-line` borders for this.
- **Project grid:** one column on phones, two from `sm`. Dashed boxes hang outside the text column, so each image lines up with the section heading.

### Homepage order

Hero, Socials, Music, Experience, Skills, Projects, Writings, GitHub Activity, Thoughts, Quote, Footer.

## Components

- **Liquid glass (`.liquid-glass`):** a frosted fill, a bright inner rim and a gloss on top. Used on the profile picture frame and the ⌘K button. The picture frame also shows a blurred, mirrored copy of the photo (`.liquid-glass__reflection`). Keep the reflection subtle: it should be felt more than seen.
- **Project card:** a dashed square box containing an accent gradient stage. The screenshot is cropped to the app window with `shot`, starts inset and runs off the right and bottom edges. No dots on the gradient.
- **Ribbon:** yellow and diagonal, with real numbers only. With several items it scrolls one at a time, and each fully leaves before the next appears. A green dot marks a live number.
- **Visit button:** web projects only, a rectangle with curved corners. It widens on hover as an arrow slides in. Discontinued projects have no Visit button, and the card links to the code instead.
- **Experience row:** logo tile (or first letter), company, role and dates. Rows with details expand.
- **Socials cell:** on hover the tile fills with the brand colour and the label rolls over to an action.
- **GitHub graph:** flat and grey. Dots turn green on hover and fade back slowly, leaving a trail.
- **Bookshelf:** one book is always open.

## Motion

Motion should feel light and should never block anything.

| What             | How                                                          |
| ---------------- | ------------------------------------------------------------ |
| Sections         | Fade and rise 16px as they scroll into view (`Reveal`)       |
| Role line        | Letters fade away left to right, every 3 seconds             |
| Hero underline   | Draws itself left to right about 0.6s after load             |
| Project card     | Screenshot tilts toward the mouse, with a spotlight and sheen |
| Cursor           | Follows closely, leans slightly as it moves, label trails    |
| Press feedback   | `active:scale-95`                                            |

Every animation must respect `prefers-reduced-motion`. Text should end up readable and in place with motion off.

## Cursor

The custom cursor is a black pointer with a light outline, its tip at the top-left and a straight left edge, like a normal system cursor. It only runs for a real mouse. Touch screens, text fields and anything marked `data-native-cursor` keep the system cursor. Add `data-cursor="Label"` to name what a click does.

## Mobile

Design for 375px first, and check 320px too.

- No sideways scrolling on any page. The GitHub graph is the one exception: it scrolls inside its own box and starts at today.
- Touch targets should be about 44px. Use `pointer-coarse:` to grow small controls without changing the desktop look.
- Text that says "Hover" must say "Tap" on touch screens (`pointer-coarse:hidden` and `pointer-coarse:inline`).
- The ID badge is hidden below `sm`, because dragging it would fight with scrolling.
- The footer wave needs WebGPU. Without it, a static wordmark stays visible.

## Rules

- Use tokens, not one-off colours, unless it's a brand colour.
- Check every UI change in light mode, dark mode and at phone width.
- Never show a made-up number. Ribbons and stats are real or absent.
- Keep each project's screenshot free of baked-in frames and watermarks by setting `shot`.
- Use `next/image` for images. The only exception is post covers, which can come from any URL.
