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
