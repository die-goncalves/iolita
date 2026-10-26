---
"@iolita/preset": minor
"@iolita/ui": minor
---

Added **Text Input** component for capturing user text input with support for labels, validation errors, and supporting text.

- **Preset**: Added `text-input` slot recipe covering `root`, `label`, `input`, `supportingText`, and `errorText` parts.
- **UI**: Introduced component primitives (`Root`, `RootProvider`, `Label`, `Input`, `SupportingText`, `ErrorText`), styled via the preset recipe, with support for `disabled`, `read-only`, `required`, and `invalid` states, automatic `aria-describedby` wiring for descriptions and error texts, and accessible form control attributes.

  - `useTextInput`/`useTextInputContext` exposed for building custom compositions.
  - `asChild` support on `SupportingText`.
  - Conditional rendering of `ErrorText` only when `invalid` is true.
  - Dynamic detection and linking of supporting text and error text via internal registration effects.

  ```tsx
  <TextInput.Root>
    <TextInput.Label>Label</TextInput.Label>
    <TextInput.Input />
    <TextInput.SupportingText>Some supporting text.</TextInput.SupportingText>
    <TextInput.ErrorText>Some error text.</TextInput.ErrorText>
  </TextInput.Root>
  ```
