# Changelog

## Unreleased

### Added

- **`headerButtons`** prop — show/hide individual header buttons (`deviceSwitcher`, `sidebar`, `preview`, `clear`, `save`, `viewSite`, `options`). All shown by default.
- **`confirmClear`** / **`confirmClearMessage`** props — Clear button now asks for confirmation before wiping content (`confirmClear` defaults `true`).
- **`devices`** prop — restrict which preview-width buttons appear (e.g. `['mobile']`); switcher auto-hides when only one device is allowed.
- **`defaultDevice`** prop — initial selected device; validated against `devices`, falls back to the first allowed device.
- Media Library modal: **tabbed UI** (Media library / Upload files), **drag-and-drop** upload, click-to-browse dropzone, **multi-file** upload with progress, and a selected-item check badge.

### Fixed

- Media Library **Upload button did nothing** — the upload control nested a `<button>` inside a `<label>`, which swallowed the click and never opened the file picker. Now triggers the hidden file input directly.

## 1.1.0

### Added

- **`gutenberg-block-kit/wp`** and **`gutenberg-block-kit/wp/*`** subpaths — shared `@wordpress` runtime for host-authored `.jsx` blocks (`blocks`, `block-editor`, `components`, `element`, `data`, `icons`).
- **`gutenberg-block-kit/actions`** — public export of `ActionBuilder`, `ActionLink`, `DEFAULT_BUTTON_ACTION`, `resolveItemButtonAction`, and related helpers.
- **`registerBlocks(callback)`** — queue host block registration; callback receives the kit `wp` runtime after init.
- **`disableBundledBlocks`** prop — skip all bundled `myapp/*` demo blocks.
- **`unregisterBlocks`** prop — remove specific blocks by name after init (e.g. `['myapp/carousel']`).
- Shared **`wp-runtime`** build chunk so editor and `wp/*` entries use one `@wordpress/blocks` registry.
- **`window.wp`** fallback assigned at editor init.
- **`test:wp-singleton`** — verifies registry singleton in CI.

### Changed

- **`initBlocks()`** is now async (`Promise<void>`); `BlockEditor` waits for block init before rendering.
