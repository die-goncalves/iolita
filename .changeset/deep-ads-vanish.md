---
"@iolita/preset": minor
"@iolita/ui": minor
---

Added **Popover** component for floating panels positioned relative to a trigger.

- **Preset**: Added `popover` slot recipe covering `anchor`, `trigger`, `positioner`, `content`, `arrow`, `arrowTip`, `closeTrigger`, `title`, `description`, and `indicator` parts.
- **UI**: Introduced component primitives (`Root`, `RootProvider`, `Trigger`, `Positioner`, `Content`, `Arrow`, `ArrowTip`, `CloseTrigger`, `Title`, `Description`), styled via the preset recipe, with support for modal behavior, focus management, dismissal (outside click/Escape), collision-aware positioning, and shared trigger values across multiple triggers.
  - Exported `usePopover` and `usePopoverContext` hooks for external state management and inversion of control.
  - `asChild` support on `Trigger`/`CloseTrigger`.
  - Compatibility with `Presence` for CSS-based, placement-aware enter/exit animations.

  <br/>

  ```tsx
  <Popover.Root>
    <Popover.Trigger>Open Popover</Popover.Trigger>
    <Popover.Positioner>
      <Popover.Content>
        <Popover.Arrow>
          <Popover.ArrowTip />
        </Popover.Arrow>
        <Popover.Title>Title</Popover.Title>
        <Popover.Description>Description</Popover.Description>
        <Popover.CloseTrigger>Close</Popover.CloseTrigger>
      </Popover.Content>
    </Popover.Positioner>
  </Popover.Root>
  ```
