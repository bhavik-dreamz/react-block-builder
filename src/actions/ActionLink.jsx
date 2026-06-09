import { getActionPreviewHref, normalizeAction, serializeActionAttribute } from './utils.js';

/**
 * Renders a button/link with normalized action JSON on data-action for native apps.
 */
export function ActionLink({
  action,
  style,
  className,
  children,
  onClick,
}) {
  const normalized = normalizeAction(action);
  const href = getActionPreviewHref(normalized);

  return (
    <a
      href={href}
      style={style}
      className={className}
      data-action={serializeActionAttribute(normalized)}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
