# OrkaOS Web

The public-facing website for **OrkaOS**, a modular micro-stack that completes Google Workspace for small teams.

OrkaOS helps a pod start with one focused app, solve one real collaboration problem, and grow into a connected operating system without adopting an enterprise suite too early.

## Overview

This repository contains the public OrkaOS product website in an OrkaApp-style shell. The Overview folder is a five-chapter guided story for first-time visitors: **Start Here**, **The Story**, **How It Works**, **The Orka Way**, and **Is It for You?** The Orka Apps and Future Plan workspaces remain available in the same interface. The public shell intentionally omits the internal OrkaAnalytics-through-OrkaSheets tool rail.

The site is built as a responsive React application using Vite.

## Features

* OrkaOS GAS-inspired top bar, sidebar, guide bar, panes, and semantic design tokens
* Non-clickable Overview, Orka Apps, and Future Plan folder labels with GAS-style disclosure controls, child tabs, and folder/tab breadcrumbs
* Centered global search without a platform-specific shortcut badge
* User/Admin demonstration modes
* Nine-dot Orka app launcher
* Light and dark themes saved with `localStorage`
* Gray anonymous profile avatar and profile menu
* Searchable, filterable three-pane Orka Apps workspace with the latest compact collapse / balanced / expand selector, plus the restored original card explorer in its own child tab
* A redesigned story-led Overview with a plain-English product definition, origin story, micro-stack model, product principles, audience fit, FAQs, and starting paths
* Restored original website widgets, including the desktop preview, collaboration flow, white-label demo, mobile mockup, adoption scope, and Gantt roadmap
* Browser-persisted Favorites tab, public product roadmap, and estimated OrkaApp rollout calendar with Month, Quarter, and List views
* OrkaAria public guide with transparent prewritten answers for ecosystem, app, pane, and rollout questions
* Configurable Google Apps Script feedback-form link
* Persistent CTA footer on every tab for Pod, Alpha, Beta, and PROJXON partnership paths
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
* Partner with PROJXON

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
