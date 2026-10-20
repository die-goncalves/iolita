---
"@iolita/preset": minor
"@iolita/ui": minor
---

Added `Body`, `ScrollArea` and `ScrollAreaViewport` subcomponents for the **Tooltip** component, enabling structured layouts and scrollable content panels.

- **Preset**: Added `body`, `scrollArea` and `scrollAreaViewport` slots to the `tooltip` slot recipe, with the corner radius configurable through `--tooltip-border-radius`. Background, text color and padding moved from `content` to `body`, and overflow handling moved to `scrollAreaViewport`.
- **UI**: Added `Tooltip.Body`, for the tooltip surface and padding, plus `Tooltip.ScrollArea` and `Tooltip.ScrollAreaViewport`, for scrolling content that exceeds the available space. `Tooltip.Content` no longer provides background or padding, so content must be wrapped in `Tooltip.Body`.

  ```tsx
  <Tooltip.Root>
    <Tooltip.Trigger>Tooltip</Tooltip.Trigger>
    <Tooltip.Positioner>
      <Tooltip.Content>
        <Tooltip.Arrow>
          <Tooltip.ArrowTip />
        </Tooltip.Arrow>
        <Tooltip.ScrollArea>
          <Tooltip.ScrollAreaViewport>
            <Tooltip.Body>Content</Tooltip.Body>
          </Tooltip.ScrollAreaViewport>
        </Tooltip.ScrollArea>
      </Tooltip.Content>
    </Tooltip.Positioner>
  </Tooltip.Root>
  ```
