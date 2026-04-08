import { addFilter } from '@wordpress/hooks';

// ── 1. Extend block supports ─────────────────────────────────────────────────
function addCustomSupports(settings, name) {

  // Apply to ALL blocks
  const allBlockExtensions = {
    color: {
      text: true,
      background: true,
      gradients: true,
      link: true,
    },
    spacing: {
      margin: true,
      padding: true,
      blockGap: true,
    },
    shadow: true,
  };

  // Apply only to specific blocks
  const blockSpecificExtensions = {

    'core/paragraph': {
      typography: {
        fontSize: true,
        lineHeight: true,
        textAlign: true,
      },
      color: {
        text: true,
        background: true,
        gradients: true,
        link: true,
      },
    },

    'core/heading': {
      typography: {
        fontSize: true,
        lineHeight: true,
        textAlign: true,
      },
      color: {
        text: true,
        background: true,
        gradients: true,
      },
    },

    'core/image': {
      align: ['left', 'center', 'right', 'wide', 'full'],
      shadow: true,
      dimensions: {
        width: true,
        height: true,
      },
      filter: {
        duotone: true,
      },
    },

    'core/group': {
      color: {
        text: true,
        background: true,
        gradients: true,
      },
      dimensions: {
        minHeight: true,
      },
      position: {
        sticky: true,
      },
    },

    'core/button': {
      color: {
        text: true,
        background: true,
        gradients: true,
      },
      shadow: true,
      typography: {
        fontSize: true,
      },
    },

    'core/columns': {
      color: {
        text: true,
        background: true,
        gradients: true,
      },
      spacing: {
        margin: true,
        padding: true,
        blockGap: ['horizontal', 'vertical'],
      },
    },
  };

  // Merge all-block extensions
  settings.supports = {
    ...settings.supports,
    ...allBlockExtensions,
    // Merge color deeply so we don't overwrite existing color supports
    color: {
      ...allBlockExtensions.color,
      ...(settings.supports?.color || {}),
    },
    spacing: {
      ...allBlockExtensions.spacing,
      ...(settings.supports?.spacing || {}),
    },
  };

  // Merge block-specific extensions on top
  if (blockSpecificExtensions[name]) {
    const specific = blockSpecificExtensions[name];
    settings.supports = {
      ...settings.supports,
      ...specific,
      // Deep merge color if both exist
      ...(specific.color && {
        color: {
          ...(settings.supports?.color || {}),
          ...specific.color,
        },
      }),
      // Deep merge typography if both exist
      ...(specific.typography && {
        typography: {
          ...(settings.supports?.typography || {}),
          ...specific.typography,
        },
      }),
      // Deep merge spacing if both exist
      ...(specific.spacing && {
        spacing: {
          ...(settings.supports?.spacing || {}),
          ...specific.spacing,
        },
      }),
    };
  }

  return settings;
}

addFilter(
  'blocks.registerBlockType',   // WP hook name
  'my-app/add-custom-supports', // unique namespace — change to your project name
  addCustomSupports
);