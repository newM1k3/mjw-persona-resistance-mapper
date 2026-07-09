<div align="center">

![MJW Design](https://mjwdesign.ca/wp-content/uploads/2024/01/mjw-design-logo.png)

**Built with [MJW Design](https://mjwdesign.ca) — AI-Powered Development**

---

</div>

# MJW Persona Resistance Mapper

A focused tool for understanding and visualising persona resistance patterns. It guides users through a structured input wizard, analyses the supplied context through a secure Netlify Function, and renders a rich resistance map that surfaces the friction, objections, and psychological barriers standing between a persona and a desired outcome. Built for fast, single-session analysis without the need for a database.

## Screenshots

| Input Wizard | Resistance Map Output |
| :---- | :---- |
| ![MJW Persona Resistance Mapper input wizard — placeholder](public/screenshots/wizard.png) | ![MJW Persona Resistance Mapper resistance map output — placeholder](public/screenshots/map.png) |

## What It Does

Generic survey tools and persona documents describe who someone is but rarely surface *why* they resist change. This tool is built specifically to map resistance — the gap between a persona's current state and the action or outcome being proposed.

| Step | What Happens |
| :---- | :---- |
| **Input Wizard** | Collects persona details, the desired outcome, and relevant context through a guided multi-step form. |
| **Analysis** | Submits the structured input to a secure Netlify Function (`map-resistance`) that performs the AI-assisted analysis. |
| **Loading State** | Displays a clear in-progress state while the function processes the request. |
| **Resistance Map** | Renders the resulting map of friction points, objections, emotional blockers, and recommended approaches. |
| **Export** | Easily copy the generated resistance map to your clipboard for sharing or saving. |

**Key interactions:**

- Step through the input wizard to define the persona and the target outcome.
- Submit the wizard to trigger the server-side resistance analysis.
- Review the rendered resistance map, which organises barriers by type and severity.
- Copy the completed map to your clipboard.

## How to Use

Open the app to reach the input wizard. Work through each step to describe your persona — their role, motivations, current context — and specify the outcome or change you are trying to achieve. Submit the completed wizard to trigger the analysis. While the function runs, a loading state keeps the interface responsive. When the map is ready it displays the full breakdown of resistance factors. 

The tool is designed for desktop use where the map output can be reviewed and annotated comfortably, though the wizard and map render correctly on smaller screens.

## Stack

| Layer | Technology |
| :---- | :---- |
| UI framework | React 18 \+ TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Optional cloud persistence | PocketBase |
| Analysis backend | Netlify Functions |
| Hosting | Netlify |

## Local Development

npm install

npm run dev

The app works with **no environment variables** for the wizard and map UI. Without a configured AI provider key or PocketBase URL the analysis function will not return results, but the wizard and loading state render correctly so the UI can be developed and tested independently.

## Quality Checks

npm run typecheck

npm run lint

npm run build

## Available Scripts

npm run dev        \# Start development server (http://localhost:5173)

npm run build      \# Production build → dist/

npm run preview    \# Preview production build locally

npm run lint       \# ESLint check

npm run typecheck  \# TypeScript type check (no emit)

## Environment Variables

All environment variables are optional unless you enable the related feature. The wizard and map UI remain usable in local mode with no configured variables.

| Variable | Required? | Scope | Enables | Description |
| :---- | :---- | :---- | :---- | :---- |
| `ANTHROPIC_API_KEY` | Required | Netlify Function/server only | Resistance analysis through Claude | Server-side Anthropic API key used inside `map-resistance`. Never expose this as a `VITE_` variable. |

## Netlify Function: map-resistance

The resistance analysis is implemented in `netlify/functions/map-resistance.ts`. Browser code calls `/api/map-resistance` (redirected via `netlify.toml` to `/.netlify/functions/map-resistance`). The function receives the structured wizard payload, calls the Anthropic API (Claude 3.5 Sonnet), and returns the resistance map data. API keys are never exposed to the frontend.

Configure your Anthropic API key in your Netlify site settings under **Site configuration → Environment variables**. After adding variables, redeploy the site. If no API key is configured the function will return an error response, which the app surfaces as an explicit message rather than a silent failure.

## Netlify Deployment

The `netlify.toml` at the project root configures the Vite build, function bundling, and routing. To deploy on Netlify, connect this GitHub repository and use the following production settings.

| Setting | Value |
| :---- | :---- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Functions directory | `netlify/functions` |
| Node/package install | Netlify default Node environment with `npm install` |

\[build\]

  command \= "npm run build"

  publish \= "dist"

\[functions\]

  node\_bundler \= "esbuild"

\[\[redirects\]\]

  from \= "/api/\*"

  to \= "/.netlify/functions/:splat"

  status \= 200

\[\[redirects\]\]

  from \= "/\*"

  to \= "/index.html"

  status \= 200

Deploy first with no environment variables to confirm the wizard and loading state render correctly, then add your `ANTHROPIC_API_KEY` for the analysis function.

## Project Structure

src/

  components/

    InputWizard.tsx       \# Guided multi-step persona and context input form

    LoadingState.tsx      \# In-progress indicator shown during analysis

    ResistanceMap.tsx     \# Rendered output of the resistance analysis

  lib/

    pocketbase.ts         \# Optional PocketBase client wrapper

  types/

    index.ts              \# Shared input, output, and map record types

  App.tsx                 \# Root layout and wizard/map state orchestration

  main.tsx                \# Entry point

netlify/

  functions/

    map-resistance.ts     \# Secure server-side AI resistance analysis function

public/

  screenshots/            \# README screenshots

## Changelog

### v0.2.0 — Backend Hardening, Frontend Refactor & Product Enhancements

- **Backend:** Replaced raw JSON string parsing with Anthropic Tool Use (structured outputs) to guarantee schema compliance.
- **Backend:** Added Zod schema validation on the Netlify Function before returning data to the client.
- **Backend:** Differentiated error responses (400 for missing fields, 502 for AI provider failures, 500 for validation/server errors).
- **Backend:** Added explicit missing API key detection with a clear error message.
- **Backend:** Framework selection is now honoured server-side — the system prompt adapts based on the user's chosen framework.
- **Frontend:** Lifted wizard input state to `App.tsx` so both inputs and outputs are available for export.
- **Frontend:** Hardened `frameworkBadgeColors` to use `.includes()` matching instead of exact string equality.
- **Frontend:** Added "Copy as Markdown" clipboard export to the `ResistanceMap` component.
- **Frontend:** Added a 4th wizard step for framework selection (Auto-Select, Cialdini, Kahneman, Fogg).
- **Frontend:** Wizard restores previous input values after an error, so users don't lose their work.
- **Frontend:** Dynamic CTA block — headline and sub-copy adapt based on the detected resistance type.
- **Metadata:** Renamed `package.json` from `vite-react-typescript-starter` to `mjw-persona-resistance-mapper`.
- **Docs:** Aligned README with actual implementation (Anthropic/Claude, no PocketBase persistence claims).

### v0.1.0 — Initial Release

- Implemented guided input wizard for persona and outcome context capture.
- Added secure Netlify Function for server-side AI resistance analysis powered by Claude 3.5 Sonnet with structured tool use and Zod validation.
- Added resistance map output component with structured barrier categorisation.
- Added loading state and explicit error messaging for unconfigured or failed analysis.
- Added Copy to Clipboard export functionality.
- Configured Netlify deployment with `/api/*` proxy redirect for clean function URLs.

---

Part of the **MJW Personal App Platform**.