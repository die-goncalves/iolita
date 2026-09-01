---
"@iolita/preset": minor
"@iolita/ui": minor
---

Added **Dialog** component for focused user actions or confirmations that pause the primary workflow.

- **Preset**: Added `dialog` slot recipe covering `trigger`, `backdrop`, `positioner`, `content`, `headline`, `title`, `closeTrigger`, `description`, and `action` parts, with `xs`–`full` sizes, `center`/`top`/`bottom` placement, and `inside`/`outside` scroll behavior variants.
- **UI**: Added `Dialog` compound component (`Root`, `RootProvider`, `Trigger`, `Backdrop`, `Positioner`, `Content`, `Headline`, `Title`, `CloseTrigger`, `Description`, `Action`), with support for modal and non-modal modes, focus trapping and scroll lock in modal mode, dismissal via outside click or Escape, and multiple triggers sharing a single dialog instance.
  - `useDialog`/`useDialogContext` exposed for building custom compositions.
  - Exported `useDialog` and `useDialogContext` hooks for external state management and inversion of control.
  - `asChild` support on `Trigger`/`CloseTrigger`.
  - `Title` renders as `h3` by default, with `as` to render any heading level (`h1`–`h6`).
  - Compatibility with `Presence` for CSS-based, placement-aware enter/exit animations.

  <br/>

  ```tsx
  <Dialog.Root>
    <Dialog.Trigger>Trigger</Dialog.Trigger>
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Content>
        <Dialog.Headline>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.CloseTrigger>CloseTrigger</Dialog.CloseTrigger>
        </Dialog.Headline>
        <Dialog.Description>Description</Dialog.Description>
        <Dialog.Action>Action</Dialog.Action>
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Root>
  ```
