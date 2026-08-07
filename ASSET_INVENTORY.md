# OrkaOS Modular Asset Inventory — August 2026

## Existing assets to keep

- `src/assets/brand/orka-logo-on-dark.png` — core brand mark for light surfaces.
- `src/assets/brand/orka-logo-on-light.png` — core brand mark for dark surfaces and interactive cores.
- `src/assets/brand/orkaos-wordmark-on-light.png` — existing wordmark.
- `src/assets/story/orka-pod-formation.webp` — supplied pod artwork retained only where a full photographic brand metaphor is already appropriate.

## Existing assets removed

The following generated cinematic scene assets were removed from production because they read as generic underwater/sci-fi concept art rather than OrkaOS product storytelling:

- `ecosystem-environment.webp`
- `mental-model-current.webp`
- `origin-current-environment.webp`
- `flow-fragmented.webp`
- `flow-synchronized.webp`

## New modular assets required and implemented

| Asset | Purpose | Format | Transparent | Code animated / stateful | Appears in | Brand reference |
| --- | --- | --- | --- | --- | --- | --- |
| `topology-field.svg` | Quiet oceanographic/topology depth without scenery | SVG | Yes | Opacity/state changes | Ecosystem, origin, flow, mental-model instrument | Orka blue, technical detailing, topology |
| `current-ribbon.svg` | Shared visual language for work moving through a system | SVG | Yes | Opacity, transform, state emphasis | Ecosystem, origin, flow, mental-model instrument | Flow/current metaphor, restrained blue |
| `pod-member.svg` | Technical orca member that can move independently | SVG | Yes | Formation transforms | Origin, flow, mental-model instrument | Pod behavior, orca identity |
| `node-shell.svg` | Reusable app/system node shell | SVG | Yes | Scale/highlight/selection | Ecosystem, origin, mental-model instrument | OrkaApp precision, navigation |
| `navigation-dial.svg` | Refined navigation/core instrument face | SVG | Yes | Rotation/emphasis | Ecosystem hub, mental-model instrument | Navigation, technical instrument language |
| `slipstream-streak.svg` | Directional acceleration layer | SVG | Yes | Reveal/translate | Mental-model instrument | Slipstream behavior |
| `workflow-message.svg` | Message/workflow fragment | SVG | Yes | Repositioned across states | Origin, fragmented→flow | Google-adjacent clean UI surface |
| `workflow-document.svg` | Document/workflow fragment | SVG | Yes | Repositioned across states | Origin, fragmented→flow | Google-adjacent clean UI surface |
| `workflow-task.svg` | Task/workflow fragment | SVG | Yes | Repositioned across states | Origin, fragmented→flow | OrkaApp task/process language |

## Large illustrations required

None for this pass. The interactive systems are better expressed as 2–6 reusable visual parts plus HTML/SVG interaction and motion/state logic. The existing supplied pod artwork remains the only full illustrative story asset in these Overview sections.
