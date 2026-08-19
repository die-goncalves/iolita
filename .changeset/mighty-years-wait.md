---
"@iolita/preset": minor
"@iolita/ui": minor
---

Added **Tooltip** component for non-blocking contextual info panels triggered on hover or focus.

- **Preset**: Added `tooltip` slot recipe covering `trigger`, `positioner`, `content`, `arrow` and `arrowTip` parts.
- **UI**: Introduced component primitives (`Root`, `RootProvider`, `Trigger`, `Positioner`, `Content`, `Arrow`, `ArrowTip`), styled via the preset recipe, with support for timing delays, focus management, dismissal (Escape/click/pointer down/scroll), collision-aware positioning, and shared trigger values across multiple triggers.

  - Exported `useTooltip` and `useTooltipContext` hooks for external state management and inversion of control.
  - `asChild` support on `Trigger`.
  - Compatibility with `Presence` for CSS-based, placement-aware enter/exit animations.

  <br/>

  ```tsx
  <Tooltip.Root>
    <Tooltip.Trigger>Tooltip</Tooltip.Trigger>
    <Tooltip.Positioner>
      <Tooltip.Arrow>
        <Tooltip.ArrowTip />
      </Tooltip.Arrow>
      <Tooltip.Content>Content</Tooltip.Content>
    </Tooltip.Positioner>
  </Tooltip.Root>
  ```
