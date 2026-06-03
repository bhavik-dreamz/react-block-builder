import { registerFormatType, toggleFormat } from "@wordpress/rich-text";
import { BlockControls } from "@wordpress/block-editor";
import { ToolbarGroup, ToolbarButton } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import {
  formatUnderline,
  formatStrikethrough,
  superscript,
  subscript,
  code,
  brush,
} from "@wordpress/icons";

function useParagraphOnly() {
  return useSelect((select) => {
    const block = select("core/block-editor").getSelectedBlock();
    return block?.name === "core/paragraph";
  }, []);
}

registerFormatType("myapp/highlight", {
  title: "Highlight",
  tagName: "mark",
  className: "myapp-highlight",
  edit({ isActive, value, onChange }) {
    const isParagraph = useParagraphOnly();
    if (isParagraph === false) return null;
    return (
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton icon={brush} title="Highlight" isActive={isActive}
            onClick={() => onChange(toggleFormat(value, { type: "myapp/highlight" }))} />
        </ToolbarGroup>
      </BlockControls>
    );
  },
});

registerFormatType("myapp/underline", {
  title: "Underline",
  tagName: "span",
  className: "myapp-underline",
  edit({ isActive, value, onChange }) {
    const isParagraph = useParagraphOnly();
    if (isParagraph === false) return null;
    return (
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton icon={formatUnderline} title="Underline" isActive={isActive}
            onClick={() => onChange(toggleFormat(value, { type: "myapp/underline" }))} />
        </ToolbarGroup>
      </BlockControls>
    );
  },
});

registerFormatType("myapp/strikethrough", {
  title: "Strikethrough",
  tagName: "s",
  className: null,
  edit({ isActive, value, onChange }) {
    const isParagraph = useParagraphOnly();
    if (isParagraph === false) return null;
    return (
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton icon={formatStrikethrough} title="Strikethrough" isActive={isActive}
            onClick={() => onChange(toggleFormat(value, { type: "myapp/strikethrough" }))} />
        </ToolbarGroup>
      </BlockControls>
    );
  },
});

registerFormatType("myapp/superscript", {
  title: "Superscript",
  tagName: "sup",
  className: null,
  edit({ isActive, value, onChange }) {
    const isParagraph = useParagraphOnly();
    if (isParagraph === false) return null;
    return (
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton icon={superscript} title="Superscript" isActive={isActive}
            onClick={() => onChange(toggleFormat(value, { type: "myapp/superscript" }))} />
        </ToolbarGroup>
      </BlockControls>
    );
  },
});

registerFormatType("myapp/subscript", {
  title: "Subscript",
  tagName: "sub",
  className: null,
  edit({ isActive, value, onChange }) {
    const isParagraph = useParagraphOnly();
    if (isParagraph === false) return null;
    return (
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton icon={subscript} title="Subscript" isActive={isActive}
            onClick={() => onChange(toggleFormat(value, { type: "myapp/subscript" }))} />
        </ToolbarGroup>
      </BlockControls>
    );
  },
});

registerFormatType("myapp/inline-code", {
  title: "Inline Code",
  tagName: "code",
  className: "myapp-inline-code",
  edit({ isActive, value, onChange }) {
    const isParagraph = useParagraphOnly();
    if (isParagraph === false) return null;
    return (
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton icon={code} title="Inline Code" isActive={isActive}
            onClick={() => onChange(toggleFormat(value, { type: "myapp/inline-code" }))} />
        </ToolbarGroup>
      </BlockControls>
    );
  },
});
