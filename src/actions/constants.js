export const ACTION_NAMES = {
  OPEN_ORDERS: 'OPEN_ORDERS',
  COPY_TO_CLIPBOARD: 'COPY_TO_CLIPBOARD',
  OPEN_MY_ACCOUNT: 'OPEN_MY_ACCOUNT',
  OPEN_WEBVIEW: 'OPEN_WEBVIEW',
  OPEN_URL: 'OPEN_URL',
  OPEN_INAPP_PAGE: 'OPEN_INAPP_PAGE',
  OPEN_SEARCH_PAGE: 'OPEN_SEARCH_PAGE',
  OPEN_CART_PAGE: 'OPEN_CART_PAGE',
  OPEN_WISHLIST_PAGE: 'OPEN_WISHLIST_PAGE',
  OPEN_PRODUCT: 'OPEN_PRODUCT',
  OPEN_COLLECTION: 'OPEN_COLLECTION',
  OPEN_LOGIN_PAGE: 'OPEN_LOGIN_PAGE',
  OPEN_BOTTOM_TAB: 'OPEN_BOTTOM_TAB',
  SHOW_MESSAGE: 'SHOW_MESSAGE',
  OPEN_HOME: 'OPEN_HOME',
  LOGOUT: 'LOGOUT',
  GO_BACK: 'GO_BACK',
};

export const ACTION_OPTIONS = [
  { value: ACTION_NAMES.OPEN_ORDERS, label: 'Open Orders' },
  { value: ACTION_NAMES.COPY_TO_CLIPBOARD, label: 'Copy To Clipboard' },
  { value: ACTION_NAMES.OPEN_MY_ACCOUNT, label: 'Open My Account' },
  { value: ACTION_NAMES.OPEN_WEBVIEW, label: 'Open Webview' },
  { value: ACTION_NAMES.OPEN_URL, label: 'Open URL' },
  { value: ACTION_NAMES.OPEN_INAPP_PAGE, label: 'Open In-App Page' },
  { value: ACTION_NAMES.OPEN_SEARCH_PAGE, label: 'Open Search Page' },
  { value: ACTION_NAMES.OPEN_CART_PAGE, label: 'Open Cart Page' },
  { value: ACTION_NAMES.OPEN_WISHLIST_PAGE, label: 'Open Wishlist Page' },
  { value: ACTION_NAMES.OPEN_PRODUCT, label: 'Open Product' },
  { value: ACTION_NAMES.OPEN_COLLECTION, label: 'Open Collection' },
  { value: ACTION_NAMES.OPEN_LOGIN_PAGE, label: 'Open Login Page' },
  { value: ACTION_NAMES.OPEN_BOTTOM_TAB, label: 'Open Bottom Tab' },
  { value: ACTION_NAMES.SHOW_MESSAGE, label: 'Show Message' },
  { value: ACTION_NAMES.OPEN_HOME, label: 'Open Home' },
  { value: ACTION_NAMES.LOGOUT, label: 'Logout' },
  { value: ACTION_NAMES.GO_BACK, label: 'Go Back' },
];

export const DEFAULT_BUTTON_ACTION = {
  actionName: ACTION_NAMES.OPEN_URL,
  params: { url: '#' },
};
