# Contributing to react-block-builder

First off — thank you for taking the time to contribute! 🎉  
This project is built to be extended by the community. Whether you're fixing a bug, adding a new block, or building an entire block pack, your contribution is welcome.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How to Create a Custom Block](#how-to-create-a-custom-block)
- [How to Create a Block Pack (Plugin)](#how-to-create-a-block-pack-plugin)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)
- [Community](#community)

---

## Code of Conduct

Be kind and respectful. This is an open, inclusive project.  
Harassment, discrimination, or toxic behavior of any kind will not be tolerated.

---

## Ways to Contribute

| Type | Examples |
|------|----------|
| 🐛 Bug fix | Fix an editor crash, layout issue, or broken block |
| ✨ New block | Add a Testimonial block, Pricing Table, FAQ Accordion, etc. |
| 🧱 Block pack | Publish a standalone NPM package of multiple blocks |
| 📖 Docs | Improve README, add JSDoc comments, fix typos |
| 💡 Feature idea | Open a GitHub Discussion or Issue |
| ⭐ Spread the word | Star the repo, share on LinkedIn/Twitter |

---

## Getting Started

### Prerequisites

- Node.js `>= 18`
- npm or pnpm

### Setup

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/react-block-builder.git
cd react-block-builder

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open `http://localhost:5173` — the editor should be running.

### Create a branch

```bash
git checkout -b feat/my-new-block
```

Use a clear prefix:
- `feat/` — new feature or block
- `fix/` — bug fix
- `docs/` — documentation only
- `refactor/` — code cleanup with no behaviour change

---

## Project Structure

```
src/
├── blocks/                  ← Custom block components live here
│   ├── hero-banner/
│   │   ├── index.js         ← Block registration (name, attributes, edit, save)
│   │   └── style.css        ← Block-specific styles
│   ├── cta-block/
│   ├── image-text/
│   └── card-grid/
│
├── data/
│   ├── customBlocksConfig.json  ← JSON-defined blocks (auto-registered at startup)
│   ├── blockTemplates.js        ← Page templates shown in the toolbar picker
│   └── api.js                   ← Data layer (localStorage by default)
│
├── registerBlocks.jsx       ← Imports and registers all blocks + the JSON factory
├── App.jsx                  ← Main editor shell
└── FrontendPage.jsx         ← Public-facing page viewer
```

---

## How to Create a Custom Block

### Option A — Full React block (recommended for interactive blocks)

1. Create a folder under `src/blocks/your-block-name/`.

2. Create `index.js`:

```js
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';

registerBlockType('myapp/your-block-name', {
  title: 'Your Block Title',
  description: 'A short description shown in the inserter.',
  category: 'myapp-blocks',   // Use this to appear under "My Custom Blocks"
  icon: 'star-filled',         // Any Dashicon slug or a custom SVG
  keywords: ['your', 'keywords'],

  attributes: {
    heading: { type: 'string', default: 'Hello World' },
    body:    { type: 'string', default: 'Your content here.' },
  },

  edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();
    return (
      <div {...blockProps} className="your-block">
        <RichText
          tagName="h2"
          value={attributes.heading}
          onChange={(heading) => setAttributes({ heading })}
          placeholder="Enter heading..."
        />
        <RichText
          tagName="p"
          value={attributes.body}
          onChange={(body) => setAttributes({ body })}
          placeholder="Enter body text..."
        />
      </div>
    );
  },

  save({ attributes }) {
    const blockProps = useBlockProps.save();
    return (
      <div {...blockProps} className="your-block">
        <RichText.Content tagName="h2" value={attributes.heading} />
        <RichText.Content tagName="p" value={attributes.body} />
      </div>
    );
  },
});
```

3. Import it in `src/registerBlocks.jsx`:

```js
import './blocks/your-block-name';
```

4. Add styles to `src/index.css` or create `src/blocks/your-block-name/style.css` and import it from `index.js`.

---

### Option B — JSON block (great for simple content blocks)

Add an entry to `src/data/customBlocksConfig.json`:

```json
{
  "name": "myapp/quote-block",
  "title": "Quote Block",
  "description": "A styled pull-quote block.",
  "category": "myapp-blocks",
  "icon": "format-quote",
  "keywords": ["quote", "pull", "cite"],
  "attributes": {
    "quoteText":   { "type": "string", "default": "Your quote here." },
    "authorName":  { "type": "string", "default": "Author Name" },
    "accentColor": { "type": "string", "default": "#3858e9" }
  }
}
```

**Notes:**
- Attributes with `color` in their name automatically get a colour picker in the sidebar.
- No JSX needed — the JSON factory handles registration.
- In production, replace the static JSON import with a `fetch()` from your API.

---

## How to Create a Block Pack (Plugin)

Want to publish your own block collection as a standalone NPM package?

### 1. Scaffold a new package

```bash
mkdir gutenberg-block-kit-my-pack
cd gutenberg-block-kit-my-pack
npm init -y
```

### 2. Add peer dependencies

```json
{
  "peerDependencies": {
    "react": "^18",
    "@wordpress/blocks": "^12",
    "@wordpress/block-editor": "^12"
  }
}
```

### 3. Create your blocks

Follow the same pattern as Option A above. Export a `register()` function:

```js
// src/index.js
import './blocks/my-testimonial';
import './blocks/my-pricing-table';

export function register() {
  // blocks self-register on import — nothing extra needed
}
```

### 4. Publish to NPM

```bash
npm publish --access public
```

### 5. Use in react-block-builder

```bash
npm install gutenberg-block-kit-my-pack
```

```js
// In registerBlocks.jsx
import { register } from 'gutenberg-block-kit-my-pack';
register();
```

### 6. List your pack in the community

Open a GitHub Discussion titled `[Block Pack] your-pack-name` and share the NPM link so others can discover it.

---

## Submitting a Pull Request

1. Make sure your branch is up to date with `main`:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. Run the dev server and test your change manually.

3. Keep the PR focused — one block or one fix per PR.

4. Fill in the PR description:
   - What does this PR do?
   - Screenshots or a short screen recording if it's a visual change
   - Any breaking changes?

5. Open the PR against the `main` branch.

A maintainer will review it, leave feedback if needed, and merge when ready.

---

## Reporting Bugs

Open a [GitHub Issue](https://github.com/bhavik-dreamz/react-block-builder/issues/new) and include:

- Steps to reproduce
- Expected behaviour
- Actual behaviour
- Browser + Node.js version
- Screenshot or console error if available

---

## Requesting Features

Open a [GitHub Discussion](https://github.com/bhavik-dreamz/react-block-builder/discussions) under the **Ideas** category.  
Describe your use case — even a short paragraph helps us understand the value.

---

## Community

- 💬 [GitHub Discussions](https://github.com/bhavik-dreamz/react-block-builder/discussions) — questions, ideas, block pack announcements
- 🐛 [GitHub Issues](https://github.com/bhavik-dreamz/react-block-builder/issues) — bug reports
- 📦 NPM: [gutenberg-block-kit](https://www.npmjs.com/package/gutenberg-block-kit)
- 🚀 Live demo: [react-block-builder.vercel.app](https://react-block-builder.vercel.app)

---

Built with ❤️ by [Bhavik Patel](https://github.com/bhavik-dreamz) · Dynamic Dreamz, Surat, India.  
MIT License — free to use, fork, and extend forever.
