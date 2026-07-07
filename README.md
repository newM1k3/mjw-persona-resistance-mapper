<div align="center">

![MJW Design](https://mjwdesign.ca/wp-content/uploads/2024/01/mjw-design-logo.png)

**Built with [MJW Design](https://mjwdesign.ca) — AI-Powered Development**

---

</div>

# MJW Persona Resistance Mapper

A focused tool for understanding and visualising persona resistance patterns. It guides users through a structured input wizard, analyses the supplied context through a secure Netlify Function, and renders a rich resistance map that surfaces the friction, objections, and psychological barriers standing between a persona and a desired outcome. Optional **PocketBase cloud persistence** lets teams save and revisit maps over time.

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
| **Cloud Save** | Optionally persists completed maps to PocketBase so they can be retrieved and compared later. |

**Key interactions:**

- Step through the input wizard to define the persona and the target outcome.
- Submit the wizard to trigger the server-side resistance analysis.
- Review the rendered resistance map, which organises barriers by type and severity.
- Save maps to PocketBase cloud storage for future reference.
- Load and compare previously saved resistance maps.

## How to Use

Open the app to reach the input wizard. Work through each step to describe your persona — their role, motivations, current context — and specify the outcome or change you are trying to achieve. Submit the completed wizard to trigger the analysis. While the function runs, a loading state keeps the interface responsive. When the map is ready it displays the full breakdown of resistance factors. Use the optional save feature to persist maps to PocketBase if your team needs to track persona resistance across multiple sessions or projects.

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
| `VITE_POCKETBASE_URL` | Optional | Frontend/public | PocketBase sign-in and cloud map persistence | Public PocketBase/PocketHost URL used for user authentication and saving resistance maps. Example: `https://mjwdesign-core.pockethost.io`. |
| `OPENAI_API_KEY` | Optional | Netlify Function/server only | Resistance analysis through OpenAI | Server-side OpenAI API key used inside `map-resistance`. Never expose this as a `VITE_` variable. |
| `GEMINI_API_KEY` | Optional | Netlify Function/server only | Resistance analysis through Gemini fallback | Server-side Gemini API key. Used only when `OPENAI_API_KEY` is absent. Never expose this as a `VITE_` variable. |
| `AI_MODEL` | Optional | Netlify Function/server only | AI model override | Override the default model used by the analysis function. |

## Cloud Persistence and PocketBase

The app works fully with **no environment variables**. In local-only mode, generated maps are displayed in the session but not persisted. Users can still step through the wizard and review the full resistance map output without any backend configuration.

Cloud persistence is optional. When `VITE_POCKETBASE_URL` is configured, the app enables saving completed maps to PocketBase. Authenticated users can store and retrieve resistance map records tied to their account. Normal user authentication runs through the public PocketBase URL; **no PocketBase superuser token is placed in frontend code**.

### Recommended `resistance_maps` Collection

Create a PocketBase collection named `resistance_maps`. The implementation expects authenticated users to own their own records through an `owner` relation field. Configure the following fields as a starting point.

| Field | Type | Notes |
| :---- | :---- | :---- |
| `title` | text | Display name for the saved map. |
| `persona_input` | json | Serialised wizard inputs describing the persona and context. |
| `resistance_output` | json | Full analysis result returned by the Netlify Function. |
| `owner` | relation to `users` | Should point to the authenticated user. |
| `notes` | text | Optional team annotations added after review. |
| `created` | system field | Managed by PocketBase. |
| `updated` | system field | Managed by PocketBase. |

Recommended collection rules should allow authenticated users to create records for themselves and only read, update, or delete their own records. A practical rule pattern is `@request.auth.id != "" && owner = @request.auth.id` for user-scoped list/view/update/delete rules.

## Netlify Function: map-resistance

The resistance analysis is implemented in `netlify/functions/map-resistance.ts`. Browser code calls `/api/map-resistance` (redirected via `netlify.toml` to `/.netlify/functions/map-resistance`). The function receives the structured wizard payload, calls the configured AI provider, and returns the resistance map data. API keys are never exposed to the frontend.

Configure one AI provider in your Netlify site settings under **Site configuration → Environment variables**. After adding variables, redeploy the site. If no API key is configured the function will return an error response, which the app surfaces as an explicit message rather than a silent failure.

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

Deploy first with no environment variables to confirm the wizard and loading state render correctly, then add AI provider keys for the analysis function and `VITE_POCKETBASE_URL` for cloud saves if those features are needed.

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

### v0.1.0 — Initial Release

- Implemented guided input wizard for persona and outcome context capture.
- Added secure Netlify Function for server-side AI resistance analysis with OpenAI-first and Gemini-fallback provider handling.
- Added resistance map output component with structured barrier categorisation.
- Added loading state and explicit error messaging for unconfigured or failed analysis.
- Added optional PocketBase cloud persistence for saving and retrieving resistance maps.
- Configured Netlify deployment with `/api/*` proxy redirect for clean function URLs.

---

Part of the **MJW Personal App Platform**.