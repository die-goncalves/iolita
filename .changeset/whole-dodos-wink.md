---
"@iolita/preset": minor
"@iolita/ui": minor
---

Added **Checkbox** component for toggling binary options or selecting multiple values within a group.

- **Preset**: Added `checkbox` slot recipe covering `root`, `control`, `indicator`, `label`, `group`, `groupLabel`, `groupSupportingText`, and `groupErrorText`.
- **UI**: Introduced component primitives (`Root`, `RootProvider`, `Control`, `Indicator`, `Label`, `HiddenInput`, `Group`, `GroupLabel`, `GroupSupportingText`, `GroupErrorText`), with support for `checked`, `indeterminate`, `disabled`, `invalid`, `readOnly`, and required states, controlled and uncontrolled multi-select groups via `Checkbox.Group`, and accessible group labeling and descriptions (`aria-labelledby` and `aria-describedby`).

  - `useCheckbox`/`useCheckboxContext` and `useCheckboxGroup`/`useCheckboxGroupContext` exposed for building custom compositions.
  - `asChild` support on `GroupSupportingText`. 
  - Conditional rendering of `GroupErrorText` only when invalid is true.
  - Dynamic detection and linking of group label, supporting text, and error text via internal registration effects.   

  ```tsx
  <Checkbox.Group>
    <Checkbox.GroupLabel>Group Label</Checkbox.GroupLabel>
    <Checkbox.Root value="option-1">
      <Checkbox.HiddenInput />
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label>Option 1</Checkbox.Label>
    </Checkbox.Root>
    <Checkbox.GroupSupportingText>Some supporting text.</Checkbox.GroupSupportingText>
    <Checkbox.GroupErrorText>Some error text.</Checkbox.GroupErrorText>
  </Checkbox.Group>
  ```
