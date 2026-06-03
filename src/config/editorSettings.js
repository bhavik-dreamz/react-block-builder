export const EDITOR_SETTINGS = {
  hasFixedToolbar: false,
  hasInlineToolbar: true,
  focusMode: false,
  isRTL: false,
  keepCaretInsideBlock: false,
  bodyPlaceholder: 'Click + to add your first block...',
  supportsLayout: true,
  disableCustomColors: false,
  disableCustomFontSizes: false,
  disableCustomGradients: false,
  enableCustomLineHeight: true,
  enableCustomSpacingSize: true,
  enableCustomUnits: ['px', 'em', 'rem', '%', 'vw', 'vh'],
  fontSizes: [
    { name: 'Small',  slug: 'small',     size: '12px' },
    { name: 'Normal', slug: 'normal',    size: '16px' },
    { name: 'Medium', slug: 'medium',    size: '20px' },
    { name: 'Large',  slug: 'large',     size: '24px' },
    { name: 'XL',     slug: 'x-large',  size: '32px' },
    { name: '2XL',    slug: 'xx-large', size: '40px' },
    { name: '3XL',    slug: 'xxx-large',size: '48px' },
    { name: 'Huge',   slug: 'huge',     size: '64px' },
  ],
  border: {
    color: true,
    radius: true,
    width: true,
    style: true,
  },
  colors: [
    { name: 'Black',      slug: 'black',      color: '#000000' },
    { name: 'White',      slug: 'white',      color: '#ffffff' },
    { name: 'Gray 100',   slug: 'gray-100',   color: '#f3f4f6' },
    { name: 'Gray 300',   slug: 'gray-300',   color: '#d1d5db' },
    { name: 'Gray 500',   slug: 'gray-500',   color: '#6b7280' },
    { name: 'Gray 700',   slug: 'gray-700',   color: '#374151' },
    { name: 'Gray 900',   slug: 'gray-900',   color: '#111827' },
    { name: 'Blue 100',   slug: 'blue-100',   color: '#dbeafe' },
    { name: 'Blue 500',   slug: 'blue-500',   color: '#3b82f6' },
    { name: 'Blue 700',   slug: 'blue-700',   color: '#1d4ed8' },
    { name: 'Green 500',  slug: 'green-500',  color: '#22c55e' },
    { name: 'Green 700',  slug: 'green-700',  color: '#15803d' },
    { name: 'Red 500',    slug: 'red-500',    color: '#ef4444' },
    { name: 'Red 700',    slug: 'red-700',    color: '#b91c1c' },
    { name: 'Yellow 500', slug: 'yellow-500', color: '#eab308' },
    { name: 'Purple 500', slug: 'purple-500', color: '#a855f7' },
    { name: 'Purple 700', slug: 'purple-700', color: '#7e22ce' },
    { name: 'Pink 500',   slug: 'pink-500',   color: '#ec4899' },
    { name: 'Primary',    slug: 'primary',    color: '#3858e9' },
    { name: 'Secondary',  slug: 'secondary',  color: '#1e1e1e' },
  ],
  gradients: [
    { name: 'Blue to Purple', slug: 'blue-purple',  gradient: 'linear-gradient(135deg,#3b82f6 0%,#a855f7 100%)' },
    { name: 'Green to Blue',  slug: 'green-blue',   gradient: 'linear-gradient(135deg,#22c55e 0%,#3b82f6 100%)' },
    { name: 'Pink to Orange', slug: 'pink-orange',  gradient: 'linear-gradient(135deg,#ec4899 0%,#f97316 100%)' },
    { name: 'Purple to Pink', slug: 'purple-pink',  gradient: 'linear-gradient(135deg,#a855f7 0%,#ec4899 100%)' },
    { name: 'Yellow to Red',  slug: 'yellow-red',   gradient: 'linear-gradient(135deg,#eab308 0%,#ef4444 100%)' },
    { name: 'Sunset',         slug: 'sunset',       gradient: 'linear-gradient(135deg,#f97316 0%,#ec4899 50%,#a855f7 100%)' },
    { name: 'Ocean',          slug: 'ocean',        gradient: 'linear-gradient(135deg,#0ea5e9 0%,#22c55e 100%)' },
    { name: 'Midnight',       slug: 'midnight',     gradient: 'linear-gradient(135deg,#1e3a8a 0%,#7e22ce 100%)' },
  ],
  __experimentalFeatures: {
    color:      { text: true, background: true, customColor: true, link: true, gradients: true, customGradient: true },
    typography: { fontSize: true, lineHeight: true, fontStyle: true, fontWeight: true, letterSpacing: true, textDecoration: true, textTransform: true },
    spacing:    { padding: true, margin: true, units: ['px','em','rem','%','vw','vh'] },
    border:     { color: true, radius: true, style: true, width: true },
    layout:     { contentSize: '800px', wideSize: '1200px' },
  },
  __experimentalBlockPatterns: [],
  __experimentalBlockPatternCategories: [],
  __experimentalDragAndDrop: true,
  imageEditing: false,
  mediaUpload: null,
  allowedBlockTypes: true,
  styles: [
    {
      css: `
        .wp-block { max-width: 100%; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .wp-block-button__link { border-radius: 4px; padding: 10px 24px; font-size: 16px; font-weight: 500; cursor: pointer; display: inline-block; text-decoration: none; }
        .is-style-outline .wp-block-button__link { background: transparent !important; border: 2px solid currentColor !important; }
        .is-style-squared .wp-block-button__link { border-radius: 0 !important; }
        .wp-block-heading { line-height: 1.3; margin-bottom: 16px; }
        .wp-block-paragraph { line-height: 1.7; margin-bottom: 16px; }
        .wp-block-quote { border-left: 4px solid #3858e9; padding: 8px 0 8px 20px; margin: 0 0 16px; }
        .wp-block-pullquote { border-top: 4px solid #1e1e1e; border-bottom: 4px solid #1e1e1e; padding: 24px; text-align: center; font-size: 22px; font-style: italic; }
        .is-style-solid-color.wp-block-pullquote { background: #1e1e1e; color: #fff; border: none; padding: 32px; }
        .wp-block-code { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 14px; }
        .wp-block-list { padding-left: 24px; margin-bottom: 16px; }
        .wp-block-list li { margin-bottom: 6px; line-height: 1.7; }
        .wp-block-image img { max-width: 100%; height: auto; display: block; }
        .wp-block-image figcaption { font-size: 13px; color: #6b7280; text-align: center; margin-top: 8px; }
        .is-style-rounded img { border-radius: 50% !important; }
        .wp-block-table table { width: 100%; border-collapse: collapse; }
        .wp-block-table td, .wp-block-table th { border: 1px solid #e0e0e0; padding: 10px 14px; }
        .wp-block-table th { background: #f5f5f5; font-weight: 600; }
        .is-style-stripes tr:nth-child(odd) td { background: #f9fafb; }
        .wp-block-separator { border: none; border-top: 2px solid #e0e0e0; margin: 24px auto; }
        .wp-block-separator.is-style-dots { border: none; text-align: center; }
        .wp-block-separator.is-style-dots::before { content: '· · ·'; font-size: 24px; letter-spacing: 12px; color: #6b7280; }
        .wp-block-columns { display: flex; gap: 24px; margin-bottom: 16px; flex-wrap: wrap; }
        .wp-block-column { flex: 1; min-width: 160px; }
        .wp-block-cover { position: relative; min-height: 300px; display: flex; align-items: center; justify-content: center; background-size: cover; background-position: center; }
        .has-text-align-left { text-align: left; }
        .has-text-align-center { text-align: center; }
        .has-text-align-right { text-align: right; }
        .has-small-font-size { font-size: 12px !important; }
        .has-normal-font-size { font-size: 16px !important; }
        .has-medium-font-size { font-size: 20px !important; }
        .has-large-font-size { font-size: 24px !important; }
        .has-x-large-font-size { font-size: 32px !important; }
        .has-huge-font-size { font-size: 64px !important; }
      `,
      isGlobalStyles: true,
    },
  ],
};
