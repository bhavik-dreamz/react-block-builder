import { useEffect, useState } from '@wordpress/element';
import {
  SelectControl,
  TextControl,
  TextareaControl,
  Button,
  Notice,
} from '@wordpress/components';
import { ACTION_NAMES, ACTION_OPTIONS } from './constants.js';
import { ACTION_SCHEMAS } from './schemas.js';
import {
  denormalizeAction,
  getDefaultActionForType,
  normalizeAction,
  validateAction,
} from './utils.js';
import { useActionBuilderHost } from './ActionBuilderContext.jsx';

function FieldLabel({ children }) {
  return (
    <p className="gbk-action-builder__field-label">{children}</p>
  );
}

export function ActionBuilder({
  label = 'Action',
  value,
  onChange,
}) {
  const host = useActionBuilderHost();
  const [pages, setPages] = useState(host?.pages || []);
  const [loadingPages, setLoadingPages] = useState(false);

  const editorAction = denormalizeAction(value || getDefaultActionForType(ACTION_NAMES.OPEN_URL));
  const { actionName, params = {} } = editorAction;
  const schema = ACTION_SCHEMAS[actionName] || { fields: [] };
  const validation = validateAction(editorAction);

  useEffect(() => {
    let cancelled = false;

    async function loadPages() {
      if (!host?.fetchPages) {
        setPages(host?.pages || []);
        return;
      }
      setLoadingPages(true);
      try {
        const result = await host.fetchPages();
        if (!cancelled) setPages(result || []);
      } catch {
        if (!cancelled) setPages(host?.pages || []);
      } finally {
        if (!cancelled) setLoadingPages(false);
      }
    }

    loadPages();
    return () => { cancelled = true; };
  }, [host]);

  const emit = (next) => {
    onChange(normalizeAction(denormalizeAction(next)));
  };

  const handleActionTypeChange = (nextName) => {
    emit(getDefaultActionForType(nextName));
  };

  const handleParamChange = (key, val) => {
    emit({
      actionName,
      params: { ...params, [key]: val },
    });
  };

  const renderField = (field) => {
    const fieldValue = params[field.key] ?? '';

    if (field.type === 'product-picker') {
      const title = params.productTitle || params.productHandle || params.productId;
      return (
        <div key={field.key} className="gbk-action-builder__picker">
          <FieldLabel>{field.label}</FieldLabel>
          {title ? (
            <p className="gbk-action-builder__picker-value">{title}</p>
          ) : (
            <p className="gbk-action-builder__picker-empty">No product selected</p>
          )}
          <Button
            variant="secondary"
            onClick={async () => {
              if (!host?.pickProduct) return;
              const picked = await host.pickProduct();
              if (!picked) return;
              emit({
                actionName,
                params: {
                  ...params,
                  productId: picked.productId,
                  productHandle: picked.productHandle || '',
                  productTitle: picked.productTitle || picked.title || '',
                },
              });
            }}
            disabled={!host?.pickProduct}
          >
            {host?.pickProduct ? 'Select Product' : 'Connect Shopify product picker'}
          </Button>
        </div>
      );
    }

    if (field.type === 'collection-picker') {
      const title = params.collectionTitle || params.collectionHandle || params.collectionId;
      return (
        <div key={field.key} className="gbk-action-builder__picker">
          <FieldLabel>{field.label}</FieldLabel>
          {title ? (
            <p className="gbk-action-builder__picker-value">{title}</p>
          ) : (
            <p className="gbk-action-builder__picker-empty">No collection selected</p>
          )}
          <Button
            variant="secondary"
            onClick={async () => {
              if (!host?.pickCollection) return;
              const picked = await host.pickCollection();
              if (!picked) return;
              emit({
                actionName,
                params: {
                  ...params,
                  collectionId: picked.collectionId,
                  collectionHandle: picked.collectionHandle || '',
                  collectionTitle: picked.collectionTitle || picked.title || '',
                },
              });
            }}
            disabled={!host?.pickCollection}
          >
            {host?.pickCollection ? 'Select Collection' : 'Connect Shopify collection picker'}
          </Button>
        </div>
      );
    }

    if (field.type === 'page-select') {
      const pageOptions = [
        { label: loadingPages ? 'Loading pages…' : 'Select a page', value: '' },
        ...pages.map((page) => ({
          label: page.title || page.id,
          value: page.id,
        })),
      ];
      return (
        <SelectControl
          key={field.key}
          label={field.label}
          value={params.pageId || ''}
          options={pageOptions}
          onChange={(val) => handleParamChange('pageId', val)}
        />
      );
    }

    if (field.type === 'page-params') {
      return (
        <TextControl
          key={field.key}
          label={field.label}
          help={field.help}
          value={params.pageParamsRaw || ''}
          onChange={(val) => handleParamChange('pageParamsRaw', val)}
        />
      );
    }

    if (field.type === 'textarea') {
      return (
        <TextareaControl
          key={field.key}
          label={field.label}
          value={fieldValue}
          onChange={(val) => handleParamChange(field.key, val)}
        />
      );
    }

    return (
      <TextControl
        key={field.key}
        label={field.label}
        type={field.type === 'url' ? 'url' : 'text'}
        value={fieldValue}
        onChange={(val) => handleParamChange(field.key, val)}
        help={field.help}
        readOnly={field.readOnly}
      />
    );
  };

  return (
    <div className="gbk-action-builder">
      {label ? <FieldLabel>{label}</FieldLabel> : null}

      <SelectControl
        label="Action Type"
        value={actionName}
        options={ACTION_OPTIONS}
        onChange={handleActionTypeChange}
      />

      {schema.fields.map(renderField)}

      {actionName === ACTION_NAMES.OPEN_INAPP_PAGE && (
        <TextControl
          label="Manual Page ID"
          value={params.manualPageId || ''}
          onChange={(val) => handleParamChange('manualPageId', val)}
          help="Overrides the page dropdown when filled"
        />
      )}

      {!validation.valid && validation.errors.length > 0 && (
        <Notice status="warning" isDismissible={false}>
          {validation.errors.join('. ')}
        </Notice>
      )}
    </div>
  );
}

export default ActionBuilder;
