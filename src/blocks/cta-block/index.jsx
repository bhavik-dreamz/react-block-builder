import { registerBlockType } from '@wordpress/blocks';
import {
  useBlockProps,
  RichText,
  InspectorControls,
  PanelColorSettings,
  BlockControls,
  AlignmentToolbar,
} from '@wordpress/block-editor';
import {
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
} from '@wordpress/components';

registerBlockType('myapp/cta-block', {
  apiVersion: 3,
  title: 'Call to Action',
  description: 'A customizable call to action block',
  category: 'text',
  icon: 'megaphone',

  attributes: {
    // ---- Content ----
    title: {
      type: 'string',
      default: 'Your Title Here',
    },
    buttonText: {
      type: 'string',
      default: 'Click Me',
    },
    // ---- Colors ----
    backgroundColor: {
      type: 'string',
      default: '#f0f4ff',
    },
    textColor: {
      type: 'string',
      default: '#1e1e1e',
    },
    buttonColor: {
      type: 'string',
      default: '#3858e9',
    },
    // ---- Layout ----
    textAlign: {
      type: 'string',
      default: 'left',
    },
    fontSize: {
      type: 'number',
      default: 22,
    },
    borderRadius: {
      type: 'number',
      default: 8,
    },
    // ---- Toggle ----
    showButton: {
      type: 'boolean',
      default: true,
    },
    buttonStyle: {
      type: 'string',
      default: 'filled',  // filled | outline
    },
  },

  edit: ({ attributes, setAttributes }) => {
    const {
      title,
      buttonText,
      backgroundColor,
      textColor,
      buttonColor,
      textAlign,
      fontSize,
      borderRadius,
      showButton,
      buttonStyle,
    } = attributes;

    const blockProps = useBlockProps({
      style: {
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        padding: '24px',
        textAlign,
      },
    });

    // Button style variants
    const buttonStyles = {
      filled: {
        background: buttonColor,
        color: '#fff',
        border: 'none',
        padding: '10px 24px',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'inline-block',
        marginTop: '12px',
      },
      outline: {
        background: 'transparent',
        color: buttonColor,
        border: `2px solid ${buttonColor}`,
        padding: '10px 24px',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'inline-block',
        marginTop: '12px',
      },
    };

    return (
      <>
        {/* ---- BLOCK TOOLBAR (alignment) ---- */}
        <BlockControls>
          <AlignmentToolbar
            value={textAlign}
            onChange={(val) => setAttributes({ textAlign: val })}
          />
        </BlockControls>

        {/* ---- SIDEBAR INSPECTOR CONTROLS ---- */}
        <InspectorControls>

          {/* Colors */}
          <PanelColorSettings
            title="Color Settings"
            colorSettings={[
              {
                label: 'Background Color',
                value: backgroundColor,
                onChange: (val) => setAttributes({ backgroundColor: val }),
              },
              {
                label: 'Text Color',
                value: textColor,
                onChange: (val) => setAttributes({ textColor: val }),
              },
              {
                label: 'Button Color',
                value: buttonColor,
                onChange: (val) => setAttributes({ buttonColor: val }),
              },
            ]}
          />

          {/* Typography */}
          <PanelBody title="Typography" initialOpen={true}>
            <RangeControl
              label="Title Font Size"
              value={fontSize}
              onChange={(val) => setAttributes({ fontSize: val })}
              min={14}
              max={60}
            />
          </PanelBody>

          {/* Layout */}
          <PanelBody title="Layout" initialOpen={true}>
            <RangeControl
              label="Border Radius"
              value={borderRadius}
              onChange={(val) => setAttributes({ borderRadius: val })}
              min={0}
              max={40}
            />
          </PanelBody>

          {/* Button Settings */}
          <PanelBody title="Button Settings" initialOpen={true}>
            <ToggleControl
              label="Show Button"
              checked={showButton}
              onChange={(val) => setAttributes({ showButton: val })}
            />
            {showButton && (
              <SelectControl
                label="Button Style"
                value={buttonStyle}
                options={[
                  { label: 'Filled', value: 'filled' },
                  { label: 'Outline', value: 'outline' },
                ]}
                onChange={(val) => setAttributes({ buttonStyle: val })}
              />
            )}
          </PanelBody>

        </InspectorControls>

        {/* ---- BLOCK EDITOR VIEW ---- */}
        <div {...blockProps}>
          <RichText
            tagName="h2"
            value={title}
            onChange={(val) => setAttributes({ title: val })}
            placeholder="Enter title..."
            style={{
              color: textColor,
              fontSize: `${fontSize}px`,
              fontWeight: '600',
              marginBottom: '8px',
            }}
          />

          {showButton && (
            <RichText
              tagName="p"
              value={buttonText}
              onChange={(val) => setAttributes({ buttonText: val })}
              placeholder="Button text..."
              style={buttonStyles[buttonStyle]}
            />
          )}
        </div>
      </>
    );
  },

  save: ({ attributes }) => {
    const {
      title,
      buttonText,
      backgroundColor,
      textColor,
      buttonColor,
      textAlign,
      fontSize,
      borderRadius,
      showButton,
      buttonStyle,
    } = attributes;

    const blockProps = useBlockProps.save({
      style: {
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        padding: '24px',
        textAlign,
      },
    });

    return (
      <div {...blockProps}>
        <RichText.Content
          tagName="h2"
          value={title}
          style={{
            color: textColor,
            fontSize: `${fontSize}px`,
            fontWeight: '600',
            marginBottom: '8px',
          }}
        />
        {showButton && (
          <button
            className={`cta-button cta-button--${buttonStyle}`}
            style={{
              background: buttonStyle === 'filled' ? buttonColor : 'transparent',
              color: buttonStyle === 'filled' ? '#fff' : buttonColor,
              border: buttonStyle === 'outline' ? `2px solid ${buttonColor}` : 'none',
            }}
          >
            <RichText.Content value={buttonText} />
          </button>
        )}
      </div>
    );
  },
});