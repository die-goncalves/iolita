---
"@iolita/ui": minor
---

**Presence**: Added `asChild` support and `Show` subcomponent.

- `asChild` support on `Gate`, for composing without an extra DOM node.
- `Root` and `Gate` now accept a function as `children`, exposing `shouldUnmount` (on `Root`) and the resolved `data-state`/`hidden` attributes (on `Gate`), for building custom presence-aware content without extra DOM nodes.
