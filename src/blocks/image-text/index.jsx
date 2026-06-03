import { registerBlockType } from '@wordpress/blocks';
import {
  useBlockProps,
  RichText,
  InspectorControls,
  PanelColorSettings,
  MediaUpload,
  MediaUploadCheck,
} from '@wordpress/block-editor';
import {
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
  Button,
} from '@wordpress/components';

registerBlockType('myapp/image-text', {
  apiVersion: 3,
  title: 'Image + Text',
  description: 'Side by side image and text layout',
  category: 'myapp-blocks',
  icon: 'align-pull-left',

  attributes: {
    title: {
      type: 'string',
      default: 'Your Headline Here',
    },
    body: {
      type: 'string',
      default: 'Add your description text here. This block allows you to place an image and text side by side.',
    },
    buttonText: {
      type: 'string',
      default: 'Learn More',
    },
    imageUrl: {
      type: 'string',
      default: '',
    },
    imageAlt: {
      type: 'string',
      default: '',
    },
    imagePosition: {
      type: 'string',
      default: 'left',  // left | right
    },
    backgroundColor: {
      type: 'string',
      default: '#ffffff',
    },
    textColor: {
      type: 'string',
      default: '#1e1e1e',
    },
    buttonColor: {
      type: 'string',
      default: '#3858e9',
    },
    imageWidth: {
      type: 'number',
      default: 50,
    },
    borderRadius: {
      type: 'number',
      default: 8,
    },
    showButton: {
      type: 'boolean',
      default: true,
    },
    gap: {
      type: 'number',
      default: 40,
    },
  },

  edit: ({ attributes, setAttributes }) => {
    const {
      title, body, buttonText,
      imageUrl, imageAlt, imagePosition,
      backgroundColor, textColor, buttonColor,
      imageWidth, borderRadius,
      showButton, gap,
    } = attributes;

    const blockProps = useBlockProps();

    const isImageLeft = imagePosition === 'left';

    const wrapperStyle = {
      backgroundColor,
      padding: '40px',
      borderRadius: `${borderRadius}px`,
      display: 'flex',
      flexDirection: isImageLeft ? 'row' : 'row-reverse',
      gap: `${gap}px`,
      alignItems: 'center',
    };

    const imageStyle = {
      width: `${imageWidth}%`,
      flexShrink: 0,
    };

    const textStyle = {
      flex: 1,
    };

    return (
      <>
        <InspectorControls>

          {/* Layout */}
          <PanelBody title="Layout" initialOpen={true}>
            <SelectControl
              label="Image Position"
              value={imagePosition}
              options={[
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ]}
              onChange={(val) => setAttributes({ imagePosition: val })}
            />
            <RangeControl
              label="Image Width (%)"
              value={imageWidth}
              onChange={(val) => setAttributes({ imageWidth: val })}
              min={20}
              max={70}
            />
            <RangeControl
              label="Gap (px)"
              value={gap}
              onChange={(val) => setAttributes({ gap: val })}
              min={0}
              max={80}
            />
            <RangeControl
              label="Border Radius"
              value={borderRadius}
              onChange={(val) => setAttributes({ borderRadius: val })}
              min={0}
              max={40}
            />
          </PanelBody>

          {/* Image */}
          <PanelBody title="Image" initialOpen={true}>
            <MediaUploadCheck>
              <MediaUpload
                onSelect={(media) => setAttributes({
                  imageUrl: media.url,
                  imageAlt: media.alt,
                })}
                allowedTypes={['image']}
                render={({ open }) => (
                  <div>
                    <Button
                      onClick={open}
                      variant="secondary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {imageUrl ? 'Change Image' : 'Set Image'}
                    </Button>
                    {imageUrl && (
                      <Button
                        onClick={() => setAttributes({ imageUrl: '', imageAlt: '' })}
                        variant="link"
                        isDestructive
                        style={{ marginTop: '8px' }}
                      >
                        Remove Image
                      </Button>
                    )}
                  </div>
                )}
              />
            </MediaUploadCheck>
          </PanelBody>

          {/* Colors */}
          <PanelColorSettings
            title="Colors"
            colorSettings={[
              {
                label: 'Background',
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

          {/* Button */}
          <PanelBody title="Button" initialOpen={false}>
            <ToggleControl
              label="Show Button"
              checked={showButton}
              onChange={(val) => setAttributes({ showButton: val })}
            />
          </PanelBody>

        </InspectorControls>

        <div {...blockProps}>
          <div style={wrapperStyle}>

            {/* Image side */}
            <div style={imageStyle}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  style={{ width: '100%', borderRadius: '8px', display: 'block' }}
                />
              ) : (
                <MediaUploadCheck>
                  <MediaUpload
                    onSelect={(media) => setAttributes({
                      imageUrl: media.url,
                      imageAlt: media.alt,
                    })}
                    allowedTypes={['image']}
                    render={({ open }) => (
                      <div
                        onClick={open}
                        style={{
                          background: '#f0f4ff',
                          border: '2px dashed #3858e9',
                          borderRadius: '8px',
                          padding: '40px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          color: '#3858e9',
                        }}
                      >
                        <div style={{ fontSize: '32px' }}>🖼️</div>
                        <p style={{ marginTop: '8px', fontSize: '14px' }}>
                          Click to add image
                        </p>
                      </div>
                    )}
                  />
                </MediaUploadCheck>
              )}
            </div>

            {/* Text side */}
            <div style={textStyle}>
              <RichText
                tagName="h2"
                value={title}
                onChange={(val) => setAttributes({ title: val })}
                placeholder="Your headline..."
                style={{
                  color: textColor,
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  lineHeight: '1.3',
                }}
              />
              <RichText
                tagName="p"
                value={body}
                onChange={(val) => setAttributes({ body: val })}
                placeholder="Your description..."
                style={{
                  color: textColor,
                  fontSize: '16px',
                  lineHeight: '1.7',
                  marginBottom: '24px',
                  opacity: '0.85',
                }}
              />
              {showButton && (
                <RichText
                  tagName="p"
                  value={buttonText}
                  onChange={(val) => setAttributes({ buttonText: val })}
                  placeholder="Button text..."
                  style={{
                    display: 'inline-block',
                    background: buttonColor,
                    color: '#fff',
                    padding: '10px 24px',
                    borderRadius: '6px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                />
              )}
            </div>

          </div>
        </div>
      </>
    );
  },

  save: ({ attributes }) => {
    const {
      title, body, buttonText,
      imageUrl, imageAlt, imagePosition,
      backgroundColor, textColor, buttonColor,
      imageWidth, borderRadius, showButton, gap,
    } = attributes;

    const blockProps = useBlockProps.save();
    const isImageLeft = imagePosition === 'left';

    return (
      <div {...blockProps} style={{
        backgroundColor,
        padding: '40px',
        borderRadius: `${borderRadius}px`,
        display: 'flex',
        flexDirection: isImageLeft ? 'row' : 'row-reverse',
        gap: `${gap}px`,
        alignItems: 'center',
      }}>
        <div style={{ width: `${imageWidth}%`, flexShrink: 0 }}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={imageAlt}
              style={{ width: '100%', borderRadius: '8px', display: 'block' }}
            />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <RichText.Content
            tagName="h2"
            value={title}
            style={{
              color: textColor,
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '16px',
            }}
          />
          <RichText.Content
            tagName="p"
            value={body}
            style={{
              color: textColor,
              fontSize: '16px',
              lineHeight: '1.7',
              marginBottom: '24px',
            }}
          />
          {showButton && (
            <RichText.Content
              tagName="p"
              value={buttonText}
              style={{
                display: 'inline-block',
                background: buttonColor,
                color: '#fff',
                padding: '10px 24px',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: '600',
              }}
            />
          )}
        </div>
      </div>
    );
  },
});