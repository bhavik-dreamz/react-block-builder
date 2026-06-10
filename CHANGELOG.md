# Changelog

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
