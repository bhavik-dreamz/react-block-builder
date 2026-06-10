import React from 'react';

if (typeof window !== 'undefined' && !window.React) {
  window.React = React;
}

import './registerCategories.jsx';
import { ensureCustomCategoryFirst } from './registerCategories.jsx';

import { registerBlockType, unregisterBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { registerCoreBlocks } from '@wordpress/block-library';
import './blocks/paragraphFormats.jsx';

import customBlocksConfig from './data/customBlocksConfig.json';
import { resolveBlockIcon } from './utils/blockIcons.js';
import { getWpRuntime, exposeWpOnWindow } from './wp/runtime.js';

// ── JSON Block Factory ──────────────────────────────────────────────────────────
function registerJSONBlock(blockDef) {
  const slug = blockDef.name.replace('myapp/', '');

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
    icon: resolveBlockIcon(blockDef.icon),
    keywords: blockDef.keywords || [],
    attributes: blockDef.attributes,
    edit: Edit,
    save: Save,
  });
}

// ── Host block registration queue ───────────────────────────────────────────────
const pendingRegistrars = [];
let registered = false;
let initPromise = null;
const registeredExternalBlocks = new Set();

/**
 * Queue a host block registrar. Runs after core/bundled init, before first editor render.
 * @param {(wp: ReturnType<typeof getWpRuntime>) => void} registrar
 */
export function registerBlocks(registrar) {
  if (typeof registrar !== 'function') return;
  if (registered) {
    registrar(getWpRuntime());
    return;
  }
  pendingRegistrars.push(registrar);
}

function runPendingRegistrars() {
  const wp = getWpRuntime();
  while (pendingRegistrars.length) {
    const fn = pendingRegistrars.shift();
    try {
      fn(wp);
    } catch (err) {
      console.error('registerBlocks callback failed:', err);
    }
  }
}

function applyUnregisterList(names = []) {
  if (!Array.isArray(names)) return;
  names.forEach((name) => {
    if (typeof name !== 'string' || !name) return;
    try {
      unregisterBlockType(name);
    } catch (err) {
      console.warn(`unregisterBlockType("${name}") failed:`, err);
    }
  });
}

/**
 * Register core + bundled blocks once, then merge consumer block definitions.
 * @param {object[]} externalBlocks - JSON block defs (same shape as customBlocksConfig.json)
 * @param {object} [options]
 * @param {object[]} [options.customBlocksConfig] - Extra JSON blocks from the host app
 * @param {boolean} [options.disableBundledBlocks] - Skip kit myapp/* demo blocks
 * @param {string[]} [options.unregisterBlocks] - Block names to remove after init
 * @returns {Promise<void>}
 */
export async function initBlocks(externalBlocks = [], options = {}) {
  if (initPromise) {
    await initPromise;
    if (Array.isArray(externalBlocks)) {
      externalBlocks.forEach(blockDef => {
        if (blockDef?.name && !registeredExternalBlocks.has(blockDef.name)) {
          try {
            registerJSONBlock(blockDef);
            registeredExternalBlocks.add(blockDef.name);
          } catch (err) {
            console.error(`Failed to register dynamic block: ${blockDef.name}`, err);
          }
        }
      });
    }
    return;
  }

  initPromise = (async () => {
    const consumerJsonBlocks = Array.isArray(options.customBlocksConfig)
      ? options.customBlocksConfig
      : [];
    const disableBundledBlocks = options.disableBundledBlocks === true;
    const unregisterBlocks = Array.isArray(options.unregisterBlocks)
      ? options.unregisterBlocks
      : [];

    registered = true;

    [...customBlocksConfig, ...consumerJsonBlocks].forEach(registerJSONBlock);

    if (!disableBundledBlocks) {
      await import('./blocks/bundled.jsx');
    }

    registerCoreBlocks();
    ensureCustomCategoryFirst();

    runPendingRegistrars();
    exposeWpOnWindow();

    applyUnregisterList(unregisterBlocks);

    if (Array.isArray(externalBlocks)) {
      externalBlocks.forEach(blockDef => {
        if (blockDef?.name && !registeredExternalBlocks.has(blockDef.name)) {
          try {
            registerJSONBlock(blockDef);
            registeredExternalBlocks.add(blockDef.name);
          } catch (err) {
            console.error(`Failed to register dynamic block: ${blockDef.name}`, err);
          }
        }
      });
    }
  })();

  await initPromise;
}

export { getWpRuntime, exposeWpOnWindow, unregisterBlockType };
