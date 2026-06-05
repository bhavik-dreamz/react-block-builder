import { addFilter, removeFilter } from '@wordpress/hooks';
import HostMediaUpload from './HostMediaUpload.jsx';

const FILTER_NAME = 'gutenberg-block-kit/host-media-upload';

let active = false;

export function registerHostMediaUpload() {
  if (active) {
    return;
  }
  active = true;
  addFilter('editor.MediaUpload', FILTER_NAME, () => HostMediaUpload);
}

export function unregisterHostMediaUpload() {
  if (!active) {
    return;
  }
  removeFilter('editor.MediaUpload', FILTER_NAME);
  active = false;
}
