---
"@iolita/preset": minor
"@iolita/ui": minor
---

Added **Menu** component for displaying a list of actions or options triggered by a button.

- **Preset**: Added `menu` slot recipe covering `trigger`, `positioner`, `content`, `arrow`, `arrowTip`, `item`, `triggerItem`, `surface`, `itemGroup`, `itemGroupLabel`, `separator`, `itemText`, and `itemIndicator` parts, with a `gap` variant.
- **UI**: Added `Menu` compound component (`Root`, `RootProvider`, `Trigger`, `Positioner`, `Content`, `Arrow`, `ArrowTip`, `Item`, `TriggerItem`, `Surface`, `ItemGroup`, `ItemGroupLabel`, `Separator`, `OptionItem`, `ItemText`, `ItemIndicator`), with support for focus management via `aria-activedescendant`, typeahead navigation, full keyboard navigation (arrow keys, `Home`/`End`, `Page Up`/`Page Down`), dismissal via outside click or `Escape`, and checkbox/radio option items.
  - Nested submenus compose a `Root` inside a parent menu's `Surface` or `Menu.ItemGroup`, with a `TriggerItem` as its trigger. Submenus can be nested to any depth.
  - `Root`/`RootProvider` accept a function as `children`, exposing the current `open` state.
  - `useMenu`/`useMenuContext` exposed for building custom compositions.
  - `asChild` support on `Trigger`.
  - `leadingIcon`, `trailingIcon`, and `trailingText` on `Item`/`TriggerItem`, for icons and keyboard-shortcut hints.
  - Compatibility with `Presence` for CSS-based, placement-aware enter/exit animations.

  <br/>

  ```jsx
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
          <Menu.Item value="save">Undo</Menu.Item>
          <Menu.Item value="save_as">Redo</Menu.Item>
        </Menu.ItemGroup>
      </Menu.Content>
    </Menu.Positioner>
  </Menu.Root>
  ```
