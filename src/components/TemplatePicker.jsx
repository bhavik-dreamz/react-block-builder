import React from 'react';
import { useEditor } from '../context/EditorContext';

export default function TemplatePicker() {
  const {
    templatePickerOpen, setTemplatePickerOpen,
    templateReplaceMode, setTemplateReplaceMode,
    blockTemplates,
    applyTemplate,
  } = useEditor();

  if (!templatePickerOpen) return null;

  return (
    <div className="template-picker">
      <div className="template-picker-header">
        <span className="template-picker-title">Choose a Template</span>
        <label className="template-replace-toggle">
          <input
            type="checkbox"
            checked={templateReplaceMode}
            onChange={e => setTemplateReplaceMode(e.target.checked)}
          />
          Replace existing content
        </label>
        <button
          className="template-picker-close"
          onClick={() => setTemplatePickerOpen(false)}
          title="Close"
        >
          ✕
        </button>
      </div>
      <div className="template-picker-grid">
        {blockTemplates.map(tpl => (
          <button
            key={tpl.slug}
            className="template-card"
            onClick={() => applyTemplate(tpl)}
            title={tpl.description}
          >
            <span className="template-card-icon">{tpl.icon}</span>
            <span className="template-card-label">{tpl.label}</span>
            <span className="template-card-meta">{tpl.category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
