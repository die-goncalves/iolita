---
"@iolita/preset": minor
"@iolita/ui": minor
---

Added **RadioGroup** component for selecting a single option from a set of mutually exclusive choices.

- **Preset**: Added `radio-group` slot recipe covering `root`, `label`, `item`, `itemControl`, `itemIndicator`, `itemText`, `supportingText`, and `errorText` parts.
- **UI**: Introduced component primitives (`Root`, `RootProvider`, `Label`, `Item`, `ItemControl`, `ItemIndicator`, `ItemText`, `ItemHiddenInput`, `SupportingText`, `ErrorText`), styled via the preset recipe, with support for keyboard navigation, states like `disabled`, `invalid`, and `readOnly`, automatic `aria-describedby` wiring for descriptions and error texts, and accessible form control attributes.

  - `useRadioGroup`/`useRadioGroupContext` exposed for building custom compositions.
  - `asChild` support on `SupportingText`.
  - Conditional rendering of `ErrorText` only when `invalid` is true.
  - Dynamic detection and linking of supporting text and error text via internal registration effects.

  ```tsx
  <RadioGroup.Root>
    <RadioGroup.Label>Label</RadioGroup.Label>
    <RadioGroup.Item value="option-1">
      <RadioGroup.ItemHiddenInput />
      <RadioGroup.ItemControl>
        <RadioGroup.ItemIndicator />
      </RadioGroup.ItemControl>
      <RadioGroup.ItemText>Option 1</RadioGroup.ItemText>
    </RadioGroup.Item>
    <RadioGroup.SupportingText>Some supporting text.</RadioGroup.SupportingText>
    <RadioGroup.ErrorText>Some error text.</RadioGroup.ErrorText>
  </RadioGroup.Root>
  ```