# @iolita/ui

## 0.1.0

### Minor Changes

- [`cf84420`](https://github.com/die-goncalves/iolita/commit/cf84420bff2695c44f9e80cccb0161a50525645c) - Added **Popover** component for floating panels positioned relative to a trigger.

  - **Preset**: Added `popover` slot recipe covering `anchor`, `trigger`, `positioner`, `content`, `arrow`, `arrowTip`, `closeTrigger`, `title`, `description`, and `indicator` parts.
  - **UI**: Introduced component primitives (`Root`, `RootProvider`, `Trigger`, `Positioner`, `Content`, `Arrow`, `ArrowTip`, `CloseTrigger`, `Title`, `Description`), styled via the preset recipe, with support for modal behavior, focus management, dismissal (outside click/Escape), collision-aware positioning, and shared trigger values across multiple triggers.

    - `usePopover`/`usePopoverContext` exposed for building custom compositions.
    - `asChild` support on `Trigger`/`CloseTrigger`.
    - Compatibility with `Presence` for CSS-based, placement-aware enter/exit animations.

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

  Key commits: [[`5a7bd10`](https://github.com/die-goncalves/iolita/commit/5a7bd10f82c42c7e9bc6a102a35068ffea21e547), [`0e212ee`](https://github.com/die-goncalves/iolita/commit/0e212eef397d18ed78a653d4af24f1b65c7f536f), [`17539d9`](https://github.com/die-goncalves/iolita/commit/17539d966d309c70b2c362fce60225709ba1b48a), [`13a224f`](https://github.com/die-goncalves/iolita/commit/13a224f247fa28e74731ce4389e9688b82fa0145)]

  [View Diff](https://github.com/die-goncalves/iolita/compare/5a7bd10f82c42c7e9bc6a102a35068ffea21e547^...cf84420bff2695c44f9e80cccb0161a50525645c)

- [`d1584ba`](https://github.com/die-goncalves/iolita/commit/d1584baa90605c5d09617dee2afef0f7113d03d9) - Added **Menu** component for displaying a list of actions or options triggered by a button.

  - **Preset**: Added `menu` slot recipe covering `trigger`, `positioner`, `content`, `arrow`, `arrowTip`, `item`, `triggerItem`, `surface`, `itemGroup`, `itemGroupLabel`, `separator`, `itemText`, and `itemIndicator` parts, with a `gap` variant.
  - **UI**: Added `Menu` compound component (`Root`, `RootProvider`, `Trigger`, `Positioner`, `Content`, `Arrow`, `ArrowTip`, `Item`, `TriggerItem`, `Surface`, `ItemGroup`, `ItemGroupLabel`, `Separator`, `OptionItem`, `ItemText`, `ItemIndicator`), with support for focus management via `aria-activedescendant`, typeahead navigation, full keyboard navigation (arrow keys, `Home`/`End`, `Page Up`/`Page Down`), dismissal via outside click or `Escape`, and checkbox/radio option items.

    - Nested submenus compose a `Root` inside a parent menu's `Surface` or `Menu.ItemGroup`, with a `TriggerItem` as its trigger. Submenus can be nested to any depth.
    - `Root`/`RootProvider` accept a function as `children`, exposing the current `open` state.
    - `useMenu`/`useMenuContext` exposed for building custom compositions.
    - `asChild` support on `Trigger`.
    - `leadingIcon`, `trailingIcon`, and `trailingText` on `Item`/`TriggerItem`, for icons and keyboard-shortcut hints.
    - Compatibility with `Presence` for CSS-based, placement-aware enter/exit animations.

    ```tsx
    <Menu.Root>
      <Menu.Trigger>Trigger</Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.ItemGroup>
            <Menu.ItemGroupLabel>File</Menu.ItemGroupLabel>
            <Menu.Item value="note_add">New file</Menu.Item>
            <Menu.Item value="file_open">Open file...</Menu.Item>
            <Menu.Item value="folder_open">Open folder...</Menu.Item>
          </Menu.ItemGroup>

          <Menu.ItemGroup>
            <Menu.ItemGroupLabel>Edit</Menu.ItemGroupLabel>
            <Menu.Item value="undo">Undo</Menu.Item>
            <Menu.Item value="redo">Redo</Menu.Item>
          </Menu.ItemGroup>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
    ```

  Key commits: [[`ec3fab7`](https://github.com/die-goncalves/iolita/commit/ec3fab71ba3ecabe41a5fb3f7527470d85ddf7f6), [`df417fa`](https://github.com/die-goncalves/iolita/commit/df417fa29b128fe0835958a158baea81a34533d6), [`8999c5c`](https://github.com/die-goncalves/iolita/commit/8999c5c73523de52e60e4be733d6e57e163193f8), [`d0b382c`](https://github.com/die-goncalves/iolita/commit/d0b382c805c51f80117213960b09c120ef1a559f)]

  [View Diff](https://github.com/die-goncalves/iolita/compare/ec3fab71ba3ecabe41a5fb3f7527470d85ddf7f6^...d1584baa90605c5d09617dee2afef0f7113d03d9)

- [`83ee2c2`](https://github.com/die-goncalves/iolita/commit/83ee2c2aa9252f641a1a6d573cbda9a52fa67bf5) - **Presence**: Added `asChild` support and render prop APIs.

  - `asChild` support on `Gate`, for composing without an extra DOM node.
  - `Root` and `Gate` accept a render prop as `children`, exposing `shouldUnmount` (on `Root`) and the resolved `data-state`/`hidden` attributes (on `Gate`), for building custom presence-aware content without extra DOM nodes.

  Key commits: [[`9cad25b`](https://github.com/die-goncalves/iolita/commit/9cad25bed659a3ea243d0f979c5529e83aba3155), [`3086af4`](https://github.com/die-goncalves/iolita/commit/3086af4eebfaada966696f558ac3c5450e18400f)]

  [View Diff](https://github.com/die-goncalves/iolita/compare/9cad25bed659a3ea243d0f979c5529e83aba3155^...83ee2c2aa9252f641a1a6d573cbda9a52fa67bf5)

- [`dcd83b5`](https://github.com/die-goncalves/iolita/commit/dcd83b51fa24023f3214f8a50031390027898946) - Added **Presence** component for managing mount/unmount animations.

  Controls the enter/exit lifecycle of animated elements, keeping them mounted long enough to finish exit animations before hiding or unmounting them.

  Key commits: [[`1f9633b`](https://github.com/die-goncalves/iolita/commit/1f9633b3e03656e5ff9a627cd740077f951a141f), [`66d7350`](https://github.com/die-goncalves/iolita/commit/66d7350687f7ec19103f3934767d4ed4dfb62bdf), [`f2683d4`](https://github.com/die-goncalves/iolita/commit/f2683d4cd798ee0e47532f2a73d60c88c0405524)]

  [View Diff](https://github.com/die-goncalves/iolita/compare/1f9633b3e03656e5ff9a627cd740077f951a141f^...dcd83b51fa24023f3214f8a50031390027898946)

- [`05fe2c5`](https://github.com/die-goncalves/iolita/commit/05fe2c509cb153bc79599a6e41ae20d1415bb8d3) - Added **Tooltip** component for non-blocking contextual info panels triggered on hover or focus.

  - **Preset**: Added `tooltip` slot recipe covering `trigger`, `positioner`, `content`, `arrow` and `arrowTip` parts.
  - **UI**: Introduced component primitives (`Root`, `RootProvider`, `Trigger`, `Positioner`, `Content`, `Arrow`, `ArrowTip`), styled via the preset recipe, with support for timing delays, focus management, dismissal (Escape/click/pointer down/scroll), collision-aware positioning, and shared trigger values across multiple triggers.

    - `useTooltip`/`useTooltipContext` exposed for building custom compositions.
    - `asChild` support on `Trigger`.
    - Compatibility with `Presence` for CSS-based, placement-aware enter/exit animations.

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

  Key commits: [[`c442c8f`](https://github.com/die-goncalves/iolita/commit/c442c8f74f3a394afc47e0a243fd8af60f5ec400), [`5d5770c`](https://github.com/die-goncalves/iolita/commit/5d5770cb2287d368ee9959bbc29158dc105c5ec2), [`c397f15`](https://github.com/die-goncalves/iolita/commit/c397f151f210b4ffa1bfa6d6adbcabc084d97724), [`f261c40`](https://github.com/die-goncalves/iolita/commit/f261c403e856637f68d6d6c5f001e15b1b9e012b)]

  [View Diff](https://github.com/die-goncalves/iolita/compare/c442c8f74f3a394afc47e0a243fd8af60f5ec400^...05fe2c509cb153bc79599a6e41ae20d1415bb8d3)

- [`2c84002`](https://github.com/die-goncalves/iolita/commit/2c840026062577bf1ae26b00934b920699b88de5) - Added **Button** component for triggering actions with a single click, tap, or key press.

  - **Preset**: Added `button` recipe with `solid`/`ghost` variants and `sm`/`md` sizes.
  - **UI**: Added `Button` component consuming the recipe, supporting loading and disabled states, optional icon with configurable placement, and full keyboard accessibility.

  Key commits: [[`1de5695`](https://github.com/die-goncalves/iolita/commit/1de5695a531927aa389342b351c63a51a09f7fa7), [`29d718d`](https://github.com/die-goncalves/iolita/commit/29d718d09f6577f105f5c4dd8896864550983bb9), [`4c25e1a`](https://github.com/die-goncalves/iolita/commit/4c25e1ad57b96a93d2c53d8128cff6612f022445), [`2468b49`](https://github.com/die-goncalves/iolita/commit/2468b4947b3051ffa80845d57e4275870dcbbf77)]

  [View Diff](https://github.com/die-goncalves/iolita/compare/1de5695a531927aa389342b351c63a51a09f7fa7^...2c840026062577bf1ae26b00934b920699b88de5)

- [`6e088c9`](https://github.com/die-goncalves/iolita/commit/6e088c9a8ad398b2b70a31dedc102d5cad8f2c55) - Added **Dialog** component for focused user actions or confirmations that pause the primary workflow.

  - **Preset**: Added `dialog` slot recipe covering `trigger`, `backdrop`, `positioner`, `content`, `headline`, `title`, `closeTrigger`, `description`, and `action` parts, with `xs`–`full` sizes, `center`/`top`/`bottom` placement, and `inside`/`outside` scroll behavior variants.
  - **UI**: Added `Dialog` compound component (`Root`, `RootProvider`, `Trigger`, `Backdrop`, `Positioner`, `Content`, `Headline`, `Title`, `CloseTrigger`, `Description`, `Action`), with support for modal and non-modal modes, focus trapping and scroll lock in modal mode, dismissal via outside click or Escape, and multiple triggers sharing a single dialog instance.

    - `useDialog`/`useDialogContext` exposed for building custom compositions.
    - `asChild` support on `Trigger`/`CloseTrigger`.
    - `Title` renders as `h3` by default, with `as` to render any heading level (`h1`–`h6`).
    - Compatibility with `Presence` for CSS-based, placement-aware enter/exit animations.

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

  Key commits: [[`0eacbbb`](https://github.com/die-goncalves/iolita/commit/0eacbbb7bca6925f1f98e14222ac70a579a24e00), [`b4bc2b2`](https://github.com/die-goncalves/iolita/commit/b4bc2b2733388d3233d5943ee31e9b7a6508617f), [`5214e69`](https://github.com/die-goncalves/iolita/commit/5214e69761b1f4f63ccefa2c032230cc5f06b8e4), [`8162d58`](https://github.com/die-goncalves/iolita/commit/8162d5866cfed6f05383d46e4bbe9e8891335667)]

  [View Diff](https://github.com/die-goncalves/iolita/compare/0eacbbb7bca6925f1f98e14222ac70a579a24e00^...6e088c9a8ad398b2b70a31dedc102d5cad8f2c55)

### Patch Changes

- [`59728c1`](https://github.com/die-goncalves/iolita/commit/59728c16e99ad887d6c860125983c80bb0be5f11) - Update `@zag-js/*` dependencies to `1.43.1`
- [`67ee36a`](https://github.com/die-goncalves/iolita/commit/67ee36aabfa9598db36d7b8bbc25af89dd1aec7c) - Update `@zag-js/*` dependencies to `1.44.0`.
- [`1cec71e`](https://github.com/die-goncalves/iolita/commit/1cec71e0b2fa6159f15e4d1e3fd5e10cb14e689a) - Update `@zag-js/*` dependencies to `1.43.3`.
- Updated dependencies []:
  - @iolita/styled-system@0.0.1
