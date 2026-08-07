# OrkaOS Public Website — V1.6 Update Notes

This update brings the public OrkaOS website closer to the current OrkaSales / OrkaOS application shell while keeping the website’s existing public content and conversion paths.

## Included

- Renamed public-facing OrkaAira references to **OrkaAria**.
- Added a public OrkaAria guide panel with suggested questions and clearly disclosed prewritten responses.
- Restyled the pane-size control as the compact three-segment selector used by the newer app shell.
- Removed the Mac-specific search shortcut badge and the `Cmd/Ctrl + K` listener.
- Added **Future Plan → Rollout Calendar** with Month, Quarter, and List views.
- Added estimated rollout labels to app details and the roadmap table.
- Updated the app launcher, version chip, guide bar, and “What’s new” alerts.
- Preserved light/dark themes, responsive navigation, favorites, intake flows, and existing website content.

## Public-Site Boundary

The internal platform-tool rail from OrkaAnalytics through OrkaSheets remains intentionally excluded from this public-facing website.

## Rollout Estimate Note

The provided OrkaSales source did not include public rollout dates for the full OrkaApp catalog. The dates in `src/products.js` are therefore labeled as planning estimates and subject to change. Update `ESTIMATED_ROLLOUTS` when approved dates or windows are available.

## V1.6.1 follow-up

- Removed the OrkaOS.com catalog entry and its rollout record, leaving exactly 20 Orka apps.
- Replaced remaining app-pair references to OrkaOS.com with OrkaOS ecosystem relationships.
- Matched the supplied OrkaSales three-segment pane-size selector dimensions and state styling.
- Matched OrkaSales scrollbars: transparent at rest, Orka blue during active scrolling, then hidden again after 700 ms.


## V1 hero simplification

- The public version chip now reads `v1`.
- The opening hero now contains only the headline and a concise subheading; the eyebrow, action buttons, proof chips, and decorative app-pod panel were removed.
- The hero was rebalanced as a spacious single-column composition across desktop and mobile.

## Spatial storytelling / ecosystem redesign — August 2026

- Rebuilt the problem-to-app recommender as a spatial OrkaOS ecosystem with app-family context, discoverable app nodes, guided three-app routes, the OrkaOS hub, and Google Workspace visibly retained as the foundation.
- Added an autonomous example journey that yields immediately to user interaction and respects `prefers-reduced-motion`.
- Added an interactive Pod / Flow / Slipstream / Ecosystem instrument so the brand mental models change behavior and meaning instead of appearing as four static cards.
- Re-expressed the origin story as a navigable current and added a fragmented-work → synchronized-flow comparison.
- Replaced the audience-stage card row with an interactive fit current and converted remaining sequential four-card sections into timeline/current compositions.
- Preserved the existing app catalog, intake flow, roadmap, theme behavior, app shell demo, product data, conversion actions, and supplied pod-formation artwork.
- Added responsive fallbacks so the orbital visualization becomes a clear stacked route on small screens rather than shrinking into an unreadable diagram.

## V4 asset-first visual rebuild — 2026-08-07

This pass keeps the V3 interaction concepts while replacing the prototype-like SVG/CSS execution with generated production artwork and simpler, collision-safe interaction layers.

### What changed

- Rebuilt **“What feels stuck first?”** as a hybrid ecosystem scene using `ecosystem-environment.webp`, three art-directed route positions, four subdued context apps, one fixed `viewBox` route, a dedicated OrkaOS destination, and a persistent Google Workspace foundation.
- Rebuilt **Pod / Flow / Slipstream / Ecosystem** around `mental-model-current.webp`; the generated current scene now carries the visual metaphor while four accessible HTML anchors control an adjacent live readout.
- Rebuilt the **origin story** as an editorial image sequence using `origin-current-environment.webp`, four collision-safe waypoints, and a separate narrative region. The hand-authored wave path was removed.
- Rebuilt **Fragmented → In flow** using separate generated state assets, `flow-fragmented.webp` and `flow-synchronized.webp`, with the existing state toggle controlling the visual comparison.
- Preserved the recommendation logic, app data, autonomous demo behavior, reduced-motion support, app exploration, product catalog actions, and Google Workspace positioning.

### Responsive QA

The four rebuilt visual systems were rendered and inspected at:

- 1440px desktop
- 1280px laptop
- 768px tablet
- 390px mobile

The mobile ecosystem intentionally changes from the desktop spatial route into a vertical current rather than shrinking or distorting the desktop composition. The mental-model artwork remains square (`aspect-ratio: 1 / 1`), labels remain outside connector geometry, and the origin sequence changes to a stacked editorial layout.

### Validation

- TypeScript parser: zero JS/JSX parse diagnostics across `src/`.
- CSS parser: zero stylesheet parse errors.
- Local import audit: no missing relative source or asset imports.
- Visual anchor collision check: zero mental-model anchor overlaps at 1440px and 390px.

## V5 modular asset-system correction — 2026-08-07

This pass corrects the V4 interpretation of “asset.” The interaction concepts remain, but large generic sci-fi generated scenes have been removed and replaced with reusable OrkaOS visual parts composed and animated by code.

### Asset-system changes

- Removed the five V4 generated cinematic WebPs (`ecosystem-environment`, `mental-model-current`, `origin-current-environment`, `flow-fragmented`, `flow-synchronized`).
- Added a reusable vector family: topology field, current ribbon, technical orca/pod member, node shell, navigation dial, slipstream streak, and message/document/task workflow fragments.
- Reused the same current, pod, node, and OrkaOS-core vocabulary across multiple sections instead of generating unrelated images per section.
- Kept the supplied `orka-pod-formation.webp` and existing logo/wordmark assets.

### Interaction changes

- The ecosystem keeps its original pain-point → recommended app → next apps → OrkaOS logic, but the environment is now constructed from topology/current/node/dial assets rather than a flattened background scene.
- The origin story uses one evolving composition: displaced workflow pieces → aligned current → pod formation → connected app system.
- Pod / Flow / Slipstream / Ecosystem is now one modular instrument with separate dial, current, pod, slipstream, node, and core layers controlled by React state.
- Fragmented → In flow now moves the same workflow pieces into alignment; it no longer swaps between two generated pictures.

### Responsive and accessibility

- Secondary ecosystem context nodes are removed at tablet/mobile widths when they would compete with the primary route.
- The mobile ecosystem keeps the route as a readable vertical sequence rather than scaling desktop geometry.
- The mental-model instrument remains square and moves its controls into a 2×2 layout on smaller screens.
- Existing keyboard controls, `aria-pressed` states, live regions, progressive disclosure, and `prefers-reduced-motion` handling remain intact.
