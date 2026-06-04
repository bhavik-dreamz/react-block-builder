import React from 'react';

if (typeof window !== 'undefined' && !window.React) {
  window.React = React;
}

import { registerBlockType, getCategories, setCategories } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';
//import './blocks/extendBlocks';
import './blocks/paragraphFormats.jsx';
import { registerCoreBlocks } from '@wordpress/block-library';

// Hand-crafted blocks
import './blocks/cta-block/index.jsx';
import './blocks/hero-banner/index.jsx';
import './blocks/image-text/index.jsx';
import './blocks/card-grid/index.jsx';

// Step 18 + 20 — JSON-driven block definitions
// In production: swap the static import for a fetch() call to your API/database
import customBlocksConfig from './data/customBlocksConfig.json';

// ── JSON Block Factory ──────────────────────────────────────────────────────────
// Loops over customBlocksConfig and registers each entry as a fully functional
// Gutenberg block, simulating blocks loaded from a database.
function registerJSONBlock(blockDef) {
  const slug = blockDef.name.replace('myapp/', '');

  // Separate text attrs from color attrs so we can render them differently
  const textKeys = Object.keys(blockDef.attributes).filter(
    k => blockDef.attributes[k].type === 'string' && !k.toLowerCase().includes('color'),
  );
  const colorKeys = Object.keys(blockDef.attributes).filter(k =>
    k.toLowerCase().includes('color'),
  );

  function Edit({ attributes, setAttributes }) {
    const accent = colorKeys.length ? attributes[colorKeys[0]] : '#3858e9';
    const bp = useBlockProps({
      className: `myapp-json-block myapp-json-block--${slug}`,
      style: { borderLeft: `4px solid ${accent}` },
    });

    return (
      <div {...bp}>
        <span className="myapp-json-block-label">{blockDef.title}</span>

        {textKeys.map(key => {
          const isHeading =
            key.includes('title') || key.includes('heading') ||
            key === 'text' || key === 'author';
          return (
            <RichText
              key={key}
              tagName={isHeading ? 'strong' : 'p'}
              value={attributes[key]}
              onChange={val => setAttributes({ [key]: val })}
              placeholder={blockDef.attributes[key].default || key}
              className={`myapp-attr-${key}`}
            />
          );
        })}

        {colorKeys.map(key => (
          <div key={key} className="myapp-color-row">
            <label>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</label>
            <input
              type="color"
              value={attributes[key]}
              onChange={e => setAttributes({ [key]: e.target.value })}
            />
            <span
              className="myapp-color-swatch"
              style={{ background: attributes[key] }}
            />
          </div>
        ))}
      </div>
    );
  }

  function Save({ attributes }) {
    const accent = colorKeys.length ? attributes[colorKeys[0]] : '#3858e9';
    const bp = useBlockProps.save({
      className: `myapp-json-block myapp-json-block--${slug}`,
      style: { borderLeft: `4px solid ${accent}` },
    });

    return (
      <div {...bp}>
        {textKeys.map(key => {
          const isHeading =
            key.includes('title') || key.includes('heading') ||
            key === 'text' || key === 'author';
          const Tag = isHeading ? 'strong' : 'p';
          return (
            <Tag key={key} className={`myapp-attr-${key}`}>
              <RichText.Content value={attributes[key]} />
            </Tag>
          );
        })}
      </div>
    );
  }

  registerBlockType(blockDef.name, {
    apiVersion: 3,
    title: blockDef.title,
    description: blockDef.description,
    category: blockDef.category,
    icon: blockDef.icon,
    keywords: blockDef.keywords || [],
    attributes: blockDef.attributes,
    edit: Edit,
    save: Save,
  });
}

// ── Init ───────────────────────────────────────────────────────────────────────
let registered = false;
const registeredExternalBlocks = new Set();

/**
 * Register core + bundled blocks once, then merge consumer block definitions.
 * @param {object[]} externalBlocks - JSON block defs (same shape as customBlocksConfig.json)
 * @param {{ customBlocksConfig?: object[] }} [options] - Extra JSON blocks from the host app
 */
export function initBlocks(externalBlocks = [], options = {}) {
  const consumerJsonBlocks = Array.isArray(options.customBlocksConfig)
    ? options.customBlocksConfig
    : [];

  if (!registered) {
    registered = true;

    // Step 18 — Custom category with SVG icon shown in the + inserter
    setCategories([
      {
        slug: 'myapp-blocks',
        title: 'My Custom Blocks',
        icon: () => (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
          </svg>
        ),
      },
      ...getCategories(),
    ]);

    // Bundled JSON blocks + host-provided JSON blocks (simulates DB import)
    [...customBlocksConfig, ...consumerJsonBlocks].forEach(registerJSONBlock);

    // Core Gutenberg blocks + hand-crafted blocks (imported at the top)
    registerCoreBlocks();
  }

  // Register dynamically injected external block definitions
  if (Array.isArray(externalBlocks)) {
    externalBlocks.forEach(blockDef => {
      if (blockDef && blockDef.name && !registeredExternalBlocks.has(blockDef.name)) {
        try {
          registerJSONBlock(blockDef);
          registeredExternalBlocks.add(blockDef.name);
        } catch (err) {
          console.error(`Failed to register dynamic block: ${blockDef.name}`, err);
        }
      }
    });
  }

  // Import formats AFTER core blocks are registered to avoid store conflicts
  // import('@wordpress/format-library').catch(err => console.error('Failed to load format-library:', err));
}