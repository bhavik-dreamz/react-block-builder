/**
 * Demo action config — reference for package consumers.
 *
 * The package ships only the generic `OPEN_URL` action. App-specific actions
 * (Shopify, CMS pages, native screens) are supplied here via `customActions`
 * and merged into the registry. This whole file lives in the demo, not in
 * `dist` — copy/adapt it in your own app.
 */
import { parsePageParams, pageParamsToRaw } from 'gutenberg-block-kit/editor';
import { listPages } from './api.js';

/** Action definitions added on top of the built-in OPEN_URL. */
export const shopifyActions = [
  {
    name: 'COPY_TO_CLIPBOARD',
    label: 'Copy To Clipboard',
    fields: [
      { key: 'text', label: 'Text', type: 'textarea', required: true },
      { key: 'title', label: 'Title', type: 'text', required: true },
    ],
    defaultParams: {
      text: 'Hey everyone, check out this awesome website!',
      title: 'Copy to clipboard',
    },
  },
  {
    name: 'OPEN_WEBVIEW',
    label: 'Open Webview',
    fields: [
      { key: 'webViewUrl', label: 'Webview URL', type: 'url', required: true },
      { key: 'title', label: 'Title', type: 'text', required: true },
    ],
    defaultParams: { webViewUrl: 'https://www.example.com', title: 'Example Website' },
    previewHref: (p) => p.webViewUrl || '#',
  },
  {
    name: 'OPEN_INAPP_PAGE',
    label: 'Open In-App Page',
    fields: [
      { key: 'pageId', label: 'Page', type: 'page-select', required: true },
      {
        key: 'pageParamsRaw',
        label: 'Page Params',
        type: 'page-params',
        help: 'Comma-separated key=value pairs, e.g. abc=123,xyz=456',
      },
    ],
    editorOnlyKeys: ['pageParamsRaw'],
    // editor params -> persisted params (pageParamsRaw string -> pageParams object)
    normalizeParams: (p) => {
      const out = {};
      const pageId = (p.pageId || '').trim();
      if (pageId) out.pageId = pageId;
      const pageParams = (p.pageParams && typeof p.pageParams === 'object' && Object.keys(p.pageParams).length)
        ? p.pageParams
        : parsePageParams(p.pageParamsRaw || '');
      if (Object.keys(pageParams).length) out.pageParams = pageParams;
      return out;
    },
    // persisted params -> editor params (pageParams object -> pageParamsRaw string)
    denormalizeParams: (p) => ({ pageParamsRaw: pageParamsToRaw(p.pageParams) }),
  },
  {
    name: 'OPEN_PRODUCT',
    label: 'Open Product',
    fields: [
      { key: 'productId', label: 'Product', type: 'product-picker', required: true },
      { key: 'productHandle', label: 'Product Handle', type: 'text', readOnly: true },
    ],
    defaultParams: { productId: '', productHandle: '', productTitle: '' },
    previewHref: (p) => (p.productHandle ? `/products/${p.productHandle}` : '#'),
  },
  {
    name: 'OPEN_COLLECTION',
    label: 'Open Collection',
    fields: [
      { key: 'collectionId', label: 'Collection', type: 'collection-picker', required: true },
      { key: 'collectionHandle', label: 'Collection Handle', type: 'text', readOnly: true },
    ],
    defaultParams: { collectionId: '', collectionHandle: '', collectionTitle: '' },
    previewHref: (p) => (p.collectionHandle ? `/collections/${p.collectionHandle}` : '#'),
  },
  {
    name: 'OPEN_BOTTOM_TAB',
    label: 'Open Bottom Tab',
    fields: [{ key: 'pageId', label: 'Page ID', type: 'text', required: true }],
    defaultParams: { pageId: '' },
  },
  {
    name: 'SHOW_MESSAGE',
    label: 'Show Message',
    fields: [{ key: 'title', label: 'Title', type: 'text', required: true }],
    defaultParams: { title: 'Hello World' },
  },
  { name: 'OPEN_ORDERS', label: 'Open Orders', previewHref: () => '/account/orders' },
  { name: 'OPEN_MY_ACCOUNT', label: 'Open My Account', previewHref: () => '/account' },
  { name: 'OPEN_SEARCH_PAGE', label: 'Open Search Page', previewHref: () => '/search' },
  { name: 'OPEN_CART_PAGE', label: 'Open Cart Page', previewHref: () => '/cart' },
  { name: 'OPEN_WISHLIST_PAGE', label: 'Open Wishlist Page', previewHref: () => '/wishlist' },
  { name: 'OPEN_LOGIN_PAGE', label: 'Open Login Page', previewHref: () => '/account/login' },
  { name: 'OPEN_HOME', label: 'Open Home', previewHref: () => '/' },
  { name: 'LOGOUT', label: 'Logout' },
  { name: 'GO_BACK', label: 'Go Back' },
];

/** Full config passed to BlockEditor's `actions` prop (registry + host hooks). */
export const demoActions = {
  customActions: shopifyActions,
  fetchPages: async () => {
    const list = await listPages();
    return (list || []).map((p) => ({ id: p.id, title: p.title }));
  },
  // Wire real Shopify pickers here; stubbed for the demo.
  pickProduct: null,
  pickCollection: null,
};
