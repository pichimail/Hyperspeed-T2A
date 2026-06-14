# HyperSpeed T2A

HyperSpeed T2A is a prompt-to-app builder that turns a written idea or screenshot into a runnable React application with live preview, code view, sharing, and version history.

The project is white-labeled as **HyperSpeed** and is ready to be extended into a v0.app / Lovable / Emergent / Base44-style application builder with a stronger backend, persistent projects, agentic repair loops, and multi-runtime sandboxing.

## What is included now

- Prompt-to-React app generation with streaming responses.
- Screenshot upload as a starting point for UI recreation.
- Multi-file generated app output.
- Sandpack-based preview and code viewer.
- Chat-based iteration flow.
- Share routes for generated apps.
- Dynamic Open Graph image endpoint.
- Prisma + PostgreSQL persistence.
- Optional observability and file upload integrations.

## Tech stack

- **Next.js App Router** with React, TypeScript, and Tailwind CSS.
- **shadcn/ui foundation** for reusable generated app components.
- **Lucide React** icons.
- **Sandpack / CodeSandbox** for browser previews.
- **Prisma** with PostgreSQL, recommended through Neon.
- **Together-compatible inference adapter** through `TOGETHER_API_KEY`.
- **S3-compatible upload flow** through `next-s3-upload` for screenshots.
- **Dynamic OG images** through Next.js image generation.

## Required environment keys

Create a `.env` file in the project root:

```bash
TOGETHER_API_KEY="your_together_api_key"
CSB_API_KEY="your_codesandbox_api_key"
DATABASE_URL="your_neon_or_postgres_prisma_connection_string"
```

Optional keys:

```bash
HELICONE_API_KEY="your_helicone_key"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
NEXT_PUBLIC_DEVELOPMENT_URL="http://localhost:3000"
S3_UPLOAD_REGION="your_s3_region"
S3_UPLOAD_BUCKET="your_s3_bucket"
S3_UPLOAD_SECRET="your_s3_secret"
S3_UPLOAD_KEY="your_s3_key"
```

## Local setup

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Open `http://localhost:3000`.

## Create and push the GitHub repository

After downloading the project, run this from the project root if you have GitHub CLI installed:

```bash
git init
git add .
git commit -m "White-label HyperSpeed T2A"
gh repo create Hyperspeed-T2A --public --source=. --remote=origin --push
```

Without GitHub CLI:

```bash
git init
git add .
git commit -m "White-label HyperSpeed T2A"
git branch -M main
git remote add origin https://github.com/<your-github-username>/Hyperspeed-T2A.git
git push -u origin main
```

## Production deploy

### Vercel

1. Create a PostgreSQL database, preferably Neon.
2. Add all required environment variables in Vercel Project Settings.
3. Deploy the repository to Vercel.
4. Keep the build command as:

```bash
npm run build
```

The current build script runs Prisma generation, database migrations, and Next.js build:

```bash
prisma generate && prisma migrate deploy && next build
```

### Database notes

The Prisma schema includes generated apps, chats, messages, and stored generated files. Run migrations before first production traffic.

## Routes

- `/` - HyperSpeed prompt-to-app home.
- `/chats/[id]` - active build session with chat, code, and preview.
- `/share/[id]` - legacy shared generated app route.
- `/share/v2/[messageId]` - current shared generated app route.
- `/api/create-chat` - creates the build session.
- `/api/get-next-completion-stream-promise` - streams the next generation.
- `/api/og` - creates dynamic OG images.
- `/api/s3-upload` - screenshot upload endpoint.

## Future tasks roadmap

This list merges the screenshot notes with the current code structure and orders the work by real product impact.

### 1. Project foundation and persistence

- Move from message-first storage to project-first storage: projects, files, versions, deployments, previews, and ownership.
- Save every generated version as a checkpoint so users can go back and forth safely.
- Preserve user-edited code and always use edited code as the base for the next change.
- Add direct code-diff application instead of asking the model to regenerate full files from scratch.
- Add duplicate-publish protection so the same app is not published repeatedly by accident.

### 2. Generation quality and repair loop

- Add a prompt rewriter that converts weak prompts into strong build specs before generation.
- Add a self-correcting loop that detects missing imports, runtime errors, TypeScript errors, and blank previews, then repairs automatically.
- Surface sandbox errors clearly to the user with a fix button and concise error summaries.
- Add model routing by task: planner, coder, vision, repair, title, and summarizer.
- Add hidden reasoning/planning summaries for better multi-step work without exposing private model traces.
- Add memory compression so long chat sessions keep the right file and decision context.

### 3. Sandbox and runtime expansion

- Upgrade from preview-only Sandpack to a stronger runtime layer using E2B or CodeSandbox SDK where needed.
- Add support for Python, Streamlit, and simple backend/API examples.
- Add package install handling, dependency validation, and fallback imports.
- Add screenshot upload as a first-class creation path with image-to-layout and image-to-component flows.
- Add runtime logs, preview reload, command output, and clearer build-state transitions.

### 4. Sharing, gallery, and public app pages

- Add a `/featured` or `/gallery` route for curated example apps and templates.
- Add `/id/[prompt]` or `/templates/[slug]` routes that open ready-to-run sandbox examples.
- Make sharing open as a clean modal with copy link, public/private toggle, and social preview.
- Generate dynamic OG images per generation using app title, prompt, and screenshot preview.
- Add Playwright-based screenshots for richer public preview cards.

### 5. Design system and themes

- Add a consistent component library registry built around shadcn/ui.
- Let users toggle shadcn components, plain Tailwind components, and custom design packs.
- Add dark/light mode across the full app.
- Add theme tokens that pass cleanly into generated apps.
- Add template families for dashboards, landing pages, tools, ecommerce, internal apps, and mobile-first flows.

### 6. Backend hardening

- Add authentication, user projects, teams, and permissions.
- Add admin controls for models, rate limits, user usage, published apps, and abuse handling.
- Add Redis/Upstash rate limiting before public traffic increases.
- Add queue-based generation for long-running tasks.
- Store screenshots, generated archives, and preview assets in S3-compatible storage.
- Add deployment targets such as Vercel, Netlify, or self-hosted Docker.

### 7. Observability and evaluation

- Add structured generation logs across planner, coder, repair, and publish steps.
- Add evals with Braintrust or a similar system to measure generation quality over time.
- Track broken previews, missing imports, repair success rate, and publish success rate.
- Add regression tests for prompt-to-code, update-code, screenshot-to-code, and share flows.

## Next enhancement moves

1. Build the project model and file-version schema first. This unlocks safe editing, checkpoints, diffs, and publish control.
2. Add the repair loop next. A builder app becomes serious only when it can fix its own broken previews.
3. Add gallery/templates after the engine is stable. Templates increase quality and reduce prompt chaos.
4. Add Python/Streamlit runtime only after the TypeScript flow is reliable. Otherwise the runtime layer becomes spaghetti confetti.
5. Add admin/rate limits before public launch, not after traffic arrives with a hammer.

## License

See `LICENSE`.
