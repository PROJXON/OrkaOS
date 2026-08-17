# OrkaOS Web

The public-facing website for **OrkaOS**, a modular micro-stack that completes Google Workspace for small teams.

OrkaOS helps a pod start with one focused app, solve one real collaboration problem, and grow into a connected operating system without adopting an enterprise suite too early.

## Overview

This repository contains the public OrkaOS product website in an OrkaApp-style shell. The Overview folder is one continuous five-section experience for first-time visitors: **Start Here**, **Philosophy**, **Ecosystem**, **Adoption**, and **User Journey**. The left sidebar is the chapter control and tracks the section currently in view. The Orka Apps and Future Plan workspaces remain available in the same interface. The public shell intentionally omits the internal OrkaAnalytics-through-OrkaSheets tool rail.

The site is built as a responsive React application using Vite.

## Features

* OrkaOS GAS-inspired top bar, sidebar, guide bar, panes, and semantic design tokens
* Non-clickable Overview, Orka Apps, and Future Plan folder labels with GAS-style disclosure controls, child tabs, and folder/tab breadcrumbs
* Centered global search without a platform-specific shortcut badge
* User/Admin demonstration modes
* Nine-dot Orka app launcher
* Light and dark themes saved with `localStorage`
* Orka profile treatment with **OS User**, Settings, and About OrkaOS; the main theme control remains outside the profile menu
* Searchable, filterable three-pane Orka Apps workspace plus the restored **All App Cards** tab from the earlier site, alongside Favorites
* A story-led continuous Overview with substantial Philosophy, Ecosystem, Adoption, and four detailed User Journey operating cases; section focus transitions begin slightly before each chapter reaches the previous trigger point
* A living Ecosystem visual that keeps OrkaOS fixed as the central hub while the other 19 apps move on four independently rotating currents around it. Clicking an app pins it into a three-step slipstream lane, highlights approved related apps from the catalog pairing data, and activates the OrkaOS control center when a three-app flow is complete. Clicking a pinned app again removes it. The orbit stays intentionally slow, labels stay upright, and reduced-motion preferences disable the animation.
* A task-first **“I just need to…”** quick-answer launcher in User Journey replaces the older three-card starting-point block. Twelve common jobs map to supported Orka apps, and each answer opens the Catalog directly on that app.
* Restored original website widgets, including the desktop preview, collaboration flow, white-label demo, mobile mockup, adoption scope, and Gantt roadmap
* Browser-persisted Favorites tab plus public roadmap/planning views based on priority and stage rather than speculative launch dates
* Separate top-bar **OrkaAria** guide and **Orka AI** product controls: OrkaAria opens the interactive guided Q&A panel, while Orka AI opens a source-aligned product story describing the Google Workspace-first onboard-CTO concept, its four core functions, hours-based value model, read-only guardrails, and AWS/RSNA POC direction
* The primary Start Here hero and Orka AI hero use a restrained technical grid overlay adapted from the supplied V2 draft, keeping the grid on high-value dark storytelling surfaces rather than turning it into a site-wide wallpaper
* Configurable Google Apps Script feedback-form link
* Persistent lower participation area for Join the Pod, Alpha testing, and **Partner with OrkaOS**, plus the PROJXON / Google Workspace / AWS / RSNA credibility hierarchy; the RSNA Cloud Connect mark uses a transparent black-on-light asset sized for clear 100% zoom viewing
* Responsive desktop sidebar and mobile navigation drawer

## Technology Stack

* [React](https://react.dev/)
* [Vite](https://vite.dev/)
* [React Hook Form](https://react-hook-form.com/)
* [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)
* JavaScript
* CSS

## Getting Started

### Prerequisites

Install the following before running the project:

* Node.js
* npm

### Installation

Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd orka-os-web
```

Install the project dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal, typically:

```text
http://localhost:5173
```

## Available Scripts

### Start the development server

```bash
npm run dev
```

Runs the website locally with Vite hot-module replacement.

### Create a production build

```bash
npm run build
```

Generates an optimized production build in the `dist/` directory.

### Preview the production build

```bash
npm run preview
```

Serves the generated production build locally for final testing.

Run `npm run build` before using this command.

### Run the linter

```bash
npm run lint
```

Checks the project source code using Oxlint.

## Project Structure

```text
orka-os-web/
├── public/
│   ├── brand/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── index.css
│   ├── legacy-widgets.css
│   ├── LegacyWidgets.jsx
│   ├── IntakeForm.css
│   ├── IntakeForm.jsx
│   ├── OverviewStory.css
│   ├── OverviewStory.jsx
│   └── main.jsx
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## Intake Form

The intake form supports three primary paths:

* Join the Pod
* Join Alpha Testing
* Partner with OrkaOS (mapped to the legacy internal `Partner with PROJXON` value for backend compatibility)

The form collects information such as:

* Contact details
* Professional or student background
* Team size
* OrkaOS product interests
* Current tools and operational needs
* Testing availability
* Preferred communication methods

### Current submission behavior

The form prepares a structured JavaScript payload when submitted.

When no submission handler is provided, the payload is currently written to the browser console and displayed in a browser alert:

```javascript
console.log('Form Submitted:', payload);
```

For production use, connect the form to an API, Google Apps Script webhook, serverless function, CRM, or another secure backend.

The `IntakeForm` component accepts an `onSubmitData` callback:

```jsx
<IntakeForm
  isOpen={isFormOpen}
  onClose={() => setIsFormOpen(false)}
  defaultIntent={formIntent}
  onSubmitData={handleFormSubmission}
/>
```

Example submission handler:

```javascript
async function handleFormSubmission(payload) {
  const response = await fetch('/api/intake', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Unable to submit the intake form.');
  }
}
```

Do not place private API keys, credentials, or secrets directly in frontend source code.

## Environment Variables

Create a local `.env` file when environment-specific configuration is needed:

```env
VITE_FEEDBACK_FORM_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_TURNSTILE_SITE_KEY=YOUR_TURNSTILE_SITE_KEY
```

Access Vite environment variables in the application with:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

Only variables beginning with `VITE_` are exposed to browser code. Because these values are included in the frontend bundle, they must not contain secrets.

A shareable template can be committed as `.env.example`:

```env
VITE_FEEDBACK_FORM_URL=
VITE_TURNSTILE_SITE_KEY=
```

Local `.env` files should remain excluded from Git.

## Production Build

Create the deployable version of the site with:

```bash
npm run build
```

The generated files will be placed in:

```text
dist/
```

The `dist/` directory is generated output and should not normally be committed to the repository.

The project can be deployed to a static hosting provider that supports Vite applications, including:

* GitHub Pages
* Netlify
* Vercel
* Cloudflare Pages
* AWS Amplify
* Amazon S3 with CloudFront

## Git Guidelines

The following files and folders should not be committed:

```text
node_modules/
dist/
dist-ssr/
.env
.env.*
*.local
*.log
.vite/
coverage/
.DS_Store
.idea/
```

Before committing, review the files shown in GitHub Desktop or run:

```bash
git status
```

Make sure dependencies, generated builds, environment files, and credentials are not included.

Keep `package-lock.json` committed so installations remain consistent across development and deployment environments.

## Accessibility

The website includes accessibility-focused behavior such as:

* Semantic navigation and page sections
* Descriptive ARIA labels
* Keyboard-accessible controls
* Escape-key handling for the intake dialog
* Focus trapping within the modal
* Focus restoration after the modal closes
* Visible form validation messages
* Light and dark color-scheme support

Accessibility should be reviewed whenever interactive components or visual styles are changed.

## Development Notes

* Shell behavior and page components are defined in `src/App.jsx`; catalog and rollout-estimate data are defined in `src/products.js`.
* Intake-form options and validation are defined in `src/IntakeForm.jsx`.
* Global page styles are located in `src/index.css`.
* Intake-form-specific styles are located in `src/IntakeForm.css`.
* The selected theme is stored under the browser key `orkaos-theme`.
* Vite is configured with a relative base path to support static deployment.

## Contributing

When making changes:

1. Create a new branch.
2. Install dependencies with `npm install`.
3. Run the site locally with `npm run dev`.
4. Run `npm run lint`.
5. Create a production build with `npm run build`.
6. Review the finished site before opening a pull request.

Use clear commit messages that describe the purpose of each change.

Example:

```text
Add mobile navigation improvements
```

## License

No open-source license is currently included in this repository.

Unless a license is added, the source code and project assets should be treated as proprietary to the project owner.

## Living Ecosystem interaction

The Ecosystem visual keeps OrkaOS fixed in the center and places the other 19 apps in orbit, with an interactive three-app slipstream builder. The flow lane is rendered below the orbit field so it never covers floating apps. Orbit rings are non-interactive visual geometry while each app node owns its own pointer target, keeping apps on all four rings selectable. Selected apps can be removed by clicking them again in the flow lane.

## Latest readability pass

- Increased Overview microcopy to a 12px minimum, converted the team-size range markers to width-safe pills, improved active Slipstream contrast, and allowed compact ecosystem labels to wrap instead of clipping at 100% browser zoom.
