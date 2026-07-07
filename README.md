<div align="center">

![MJW Design](https://mjwdesign.ca/wp-content/uploads/2024/01/mjw-design-logo.png)

**Built with [MJW Design](https://mjwdesign.ca) — AI-Powered Development**

---

</div>

# MJW Persona Resistance Mapper

A focused persona analysis tool for understanding and mapping resistance patterns in target audiences. It guides users through a structured input wizard, analyzes persona data through a secure Netlify Function, and renders a clear visual resistance map. The app supports optional **PocketBase cloud persistence** for saving and retrieving resistance maps across sessions.

## Screenshots

| Input Wizard | Resistance Map Output |
| :---- | :---- |
| ![MJW Persona Resistance Mapper input wizard — placeholder](public/screenshots/wizard.png) | ![MJW Persona Resistance Mapper resistance map output — placeholder](public/screenshots/map.png) |

## What It Does

Unlike generic survey or persona tools, this app is purpose-built for mapping the specific resistance patterns and friction points that prevent a persona from adopting a product, service, or idea.

| Feature | Description |
| :---- | :---- |
| **Input Wizard** | Step-by-step guided form for defining persona attributes, context, and perceived barriers. |
| **Resistance Map** | Visual output that surfaces and organises resistance themes from the persona analysis. |
| **AI-Powered Analysis** | Secure Netlify Function processes persona inputs and returns structured resistance insights. |
| **Loading State** | Polished intermediate state while analysis is in progress. |
| **Optional Cloud Saves** | PocketBase integration for persisting maps across sessions and devices. |

**Key interactions:**

- Walk through the input wizard to describe a persona's context, goals, and perceived objections.
- Submit the wizard to trigger the secure `map-resistance` Netlify Function.
- Review the rendered resistance map highlighting key friction themes and barrier categories.
- Optionally sign in with PocketBase to save and reload resistance maps.

## How to Use

Open the app and follow the input wizard to define your persona. Provide as much context as possible about the persona's background, motivations, and the specific change or decision they are being asked to make. Once submitted, the tool analyses the inputs server-side and renders a resistance map. Use the map to prioritise messaging, identify objection-handling needs, or inform product positioning decisions.

The app is designed for desktop use where the wizard form and resistance map output are most comfortable to read and navigate, though it remains accessible at smaller screen sizes for review purposes.

## Stack

| Layer | Technology |
| :---- | :---- |
| UI framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| AI backend | Netlify Functions (map-resistance) |
| Optional cloud persistence | PocketBase |
| Hosting | Netlify |

## Local Development

npm install

npm run dev

The app works fully with **no environment variables** for local UI development. Without an AI provider key or PocketBase URL, the wizard and map components remain navigable. The `map-resistance` Netlify Function requires an AI provider key to return analysis results; cloud save features require `VITE_POCKETBASE_URL`.

## Quality Checks

npm run typecheck

npm run lint

npm run build

## Available Scripts

npm run dev        # Start development server (http://localhost:5173)

npm run build      # Production build → dist/

npm run preview    # Preview production build locally

npm run lint       # ESLint check

npm run typecheck  # TypeScript type check (no emit)

## Environment Variables

All environment variables are optional unless you enable the related feature. The app remains navigable in local-only mode with no configured variables.

| Variable | Required? | Scope | Enables | Description |
| :---- | :---- | :---- | :---- | :---- |
| `VITE_POCKETBASE_URL` | Optional | Frontend/public | PocketBase sign-in and cloud saved maps | Public PocketBase/PocketHost URL for user authentication and map record CRUD. Example: `https://mjwdesign-core.pockethost.io`. |
| `AI_API_KEY` | Optional | Netlify Function/server only | Resistance analysis through AI provider | Server-side AI provider key. Never expose this as a `VITE_` variable. |
| `AI_MODEL` | Optional | Netlify Function/server only | AI model override | Defaults to a sensible model when not set. Configure in Netlify site environment variables. |

## PocketBase Cloud Saves

The app works fully without PocketBase configured. In local-only mode, users can still complete the wizard and view resistance maps within their session; no persistent record is created unless PocketBase is available.

When `VITE_POCKETBASE_URL` is configured, the app presents a sign-in option. Authenticated users can save resistance map records and reload them across sessions and devices.

### Recommended `resistance_maps` Collection

Create a PocketBase collection named `resistance_maps`. The implementation expects authenticated users to own their own records through an `owner` relation field.

| Field | Type | Notes |
| :---- | :---- | :---- |
| `title` | text | Display name or persona label for the saved map. |
| `persona_input` | json | Stores the wizard form values submitted by the user. |
| `resistance_output` | json | Stores the structured resistance map returned by the Netlify Function. |
| `owner` | relation to `users` | Should point to the authenticated user. |
| `notes` | text | Optional free-text notes about the analysis. |
| `created` | system field | Managed by PocketBase. |
| `updated` | system field | Managed by PocketBase. |

Recommended collection rules should allow authenticated users to create records for themselves and only read, update, or delete their own records. A practical rule pattern is `@request.auth.id != "" && owner = @request.auth.id` for user-scoped list/view/update/delete operations.

## AI Analysis Setup

The resistance analysis is implemented through `netlify/functions/map-resistance.ts`. Browser code calls `/api/map-resistance` (proxied via `netlify.toml` redirects); it never calls AI providers directly and never includes API keys in frontend code.

Configure your AI provider key in Netlify site settings under **Site configuration → Environment variables**. After adding environment variables, redeploy the Netlify site. If no API key is configured, the app displays a setup message rather than failing silently.

## Netlify Deployment

The `netlify.toml` at the project root configures the Vite build, API proxy redirects, and static routing. To deploy on Netlify, connect this GitHub repository and use the following production settings.

| Setting | Value |
| :---- | :---- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Functions directory | `netlify/functions` |
| Node/package install | Netlify default Node environment with `npm install` |

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Deploy first with no environment variables to confirm the local-only UI works, then add `VITE_POCKETBASE_URL` for cloud saves and your AI provider key to enable the resistance analysis function.

## Project Structure

```
src/
  components/
    InputWizard.tsx       # Step-by-step persona input form
    LoadingState.tsx      # In-progress analysis indicator
    ResistanceMap.tsx     # Visual resistance map output renderer
  lib/
    pocketbase.ts         # Optional PocketBase client wrapper
  types/
    index.ts              # Shared persona and resistance map types
  App.tsx                 # Root layout and wizard/map orchestration
  main.tsx                # Entry point
  index.css               # Global styles

netlify/
  functions/
    map-resistance.ts     # Secure server-side AI analysis function

public/
  screenshots/            # README screenshots
```

## Changelog

### v1.0.0 — Initial Release

- Implemented step-by-step InputWizard for structured persona data entry.
- Implemented ResistanceMap component for visual resistance theme output.
- Implemented polished LoadingState for in-progress analysis feedback.
- Added secure `map-resistance` Netlify Function for server-side AI analysis with no client-side API key exposure.
- Added optional PocketBase integration for authenticated cloud persistence of persona inputs and resistance map outputs.
- Configured `netlify.toml` with API proxy redirects and SPA fallback routing.
- Added README, environment variable documentation, and Netlify deployment instructions.

---

Part of the **MJW Personal App Platform**.