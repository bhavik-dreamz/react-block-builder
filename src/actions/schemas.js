import { ACTION_NAMES } from './constants.js';

/**
 * Field types: text | url | textarea | page-select | page-params | product-picker | collection-picker
 * Only keys listed here are persisted in saved JSON.
 */
export const ACTION_SCHEMAS = {
  [ACTION_NAMES.OPEN_ORDERS]: { fields: [] },
  [ACTION_NAMES.COPY_TO_CLIPBOARD]: {
    fields: [
      { key: 'text', label: 'Text', type: 'textarea', required: true },
      { key: 'title', label: 'Title', type: 'text', required: true },
    ],
  },
  [ACTION_NAMES.OPEN_MY_ACCOUNT]: { fields: [] },
  [ACTION_NAMES.OPEN_WEBVIEW]: {
    fields: [
      { key: 'webViewUrl', label: 'Webview URL', type: 'url', required: true },
      { key: 'title', label: 'Title', type: 'text', required: true },
    ],
  },
  [ACTION_NAMES.OPEN_URL]: {
    fields: [
      { key: 'url', label: 'URL', type: 'url', required: true },
    ],
  },
  [ACTION_NAMES.OPEN_INAPP_PAGE]: {
    fields: [
      { key: 'pageId', label: 'Page', type: 'page-select' },
      { key: 'manualPageId', label: 'Manual Page ID', type: 'text' },
      {
        key: 'pageParamsRaw',
        label: 'Page Params',
        type: 'page-params',
        help: 'Comma-separated key=value pairs, e.g. abc=123,xyz=456',
      },
    ],
  },
  [ACTION_NAMES.OPEN_SEARCH_PAGE]: { fields: [] },
  [ACTION_NAMES.OPEN_CART_PAGE]: { fields: [] },
  [ACTION_NAMES.OPEN_WISHLIST_PAGE]: { fields: [] },
  [ACTION_NAMES.OPEN_PRODUCT]: {
    fields: [
      { key: 'productId', label: 'Product', type: 'product-picker', required: true },
      { key: 'productHandle', label: 'Product Handle', type: 'text', readOnly: true },
    ],
  },
  [ACTION_NAMES.OPEN_COLLECTION]: {
    fields: [
      { key: 'collectionId', label: 'Collection', type: 'collection-picker', required: true },
      { key: 'collectionHandle', label: 'Collection Handle', type: 'text', readOnly: true },
    ],
  },
  [ACTION_NAMES.OPEN_LOGIN_PAGE]: { fields: [] },
  [ACTION_NAMES.OPEN_BOTTOM_TAB]: {
    fields: [
      { key: 'pageId', label: 'Page ID', type: 'text', required: true },
    ],
  },
  [ACTION_NAMES.SHOW_MESSAGE]: {
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
    ],
  },
  [ACTION_NAMES.OPEN_HOME]: { fields: [] },
  [ACTION_NAMES.LOGOUT]: { fields: [] },
  [ACTION_NAMES.GO_BACK]: { fields: [] },
};

export const DEFAULT_PARAMS_BY_ACTION = {
  [ACTION_NAMES.OPEN_URL]: { url: 'https://www.example.com' },
  [ACTION_NAMES.COPY_TO_CLIPBOARD]: {
    text: 'Hey everyone, check out this awesome website!',
    title: 'Copy to clipboard',
  },
  [ACTION_NAMES.OPEN_WEBVIEW]: {
    webViewUrl: 'https://www.example.com',
    title: 'Example Website',
  },
  [ACTION_NAMES.OPEN_INAPP_PAGE]: {
    pageId: '',
    manualPageId: '',
    pageParamsRaw: '',
  },
  [ACTION_NAMES.OPEN_BOTTOM_TAB]: { pageId: '' },
  [ACTION_NAMES.SHOW_MESSAGE]: { title: 'Hello World' },
  [ACTION_NAMES.OPEN_PRODUCT]: {
    productId: '',
    productHandle: '',
    productTitle: '',
  },
  [ACTION_NAMES.OPEN_COLLECTION]: {
    collectionId: '',
    collectionHandle: '',
    collectionTitle: '',
  },
};
