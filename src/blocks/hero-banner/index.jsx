import { registerBlockType } from '@wordpress/blocks';
import {
  useBlockProps,
  RichText,
  InspectorControls,
  PanelColorSettings,
  BlockControls,
  AlignmentToolbar,
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

registerBlockType('myapp/hero-banner', {
  apiVersion: 3,
  title: 'Hero Banner',
  description: 'Full width hero section with background, title and subtitle',
  category: 'myapp-blocks',
  icon: 'cover-image',

  attributes: {
    title: {
      type: 'string',
      default: 'Welcome to Our Site',
    },
    subtitle: {
      type: 'string',
      default: 'A short description that tells your story',
    },
    buttonText: {
      type: 'string',
      default: 'Get Started',
    },
    buttonUrl: {
      type: 'string',
      default: '#',
    },
    backgroundImage: {
      type: 'string',
      default: '',
    },
    backgroundColor: {
      type: 'string',
      default: '#1a1a2e',
    },
    overlayColor: {
      type: 'string',
      default: '#000000',
    },
    overlayOpacity: {
      type: 'number',
      default: 40,
    },
    textColor: {
      type: 'string',
      default: '#ffffff',
    },
    buttonColor: {
      type: 'string',
      default: '#3858e9',
    },
    textAlign: {
      type: 'string',
      default: 'center',
    },
    minHeight: {
      type: 'number',
      default: 500,
    },
    showButton: {
      type: 'boolean',
      default: true,
    },
    showSubtitle: {
      type: 'boolean',
      default: true,
    },
    titleSize: {
      type: 'number',
      default: 48,
    },
    subtitleSize: {
      type: 'number',
      default: 20,
    },
  },

  edit: ({ attributes, setAttributes }) => {
    const {
      title, subtitle, buttonText,
      backgroundImage, backgroundColor,
      overlayColor, overlayOpacity,
      textColor, buttonColor,
      textAlign, minHeight,
      showButton, showSubtitle,
      titleSize, subtitleSize,
    } = attributes;

    const blockProps = useBlockProps({
      className: 'hero-banner-editor',
    });

    const wrapperStyle = {
      backgroundColor,
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: `${minHeight}px`,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: textAlign === 'center'
        ? 'center'
        : textAlign === 'right' ? 'flex-end' : 'flex-start',
    };

    const overlayStyle = {
      position: 'absolute',
      inset: 0,
      backgroundColor: overlayColor,
      opacity: overlayOpacity / 100,
      pointerEvents: 'none',
    };

    const contentStyle = {
      position: 'relative',
      zIndex: 1,
      textAlign,
      padding: '40px',
      maxWidth: '800px',
      width: '100%',
    };

    return (
      <>
        <BlockControls>
          <AlignmentToolbar
            value={textAlign}
            onChange={(val) => setAttributes({ textAlign: val })}
          />
        </BlockControls>

        <InspectorControls>

          {/* Background */}
          <PanelBody title="Background" initialOpen={true}>
            <MediaUploadCheck>
              <MediaUpload
                onSelect={(media) => setAttributes({ backgroundImage: media.url })}
                allowedTypes={['image']}
                render={({ open }) => (
                  <div style={{ marginBottom: '12px' }}>
                    <Button
                      onClick={open}
                      variant="secondary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {backgroundImage ? 'Change Image' : 'Set Background Image'}
                    </Button>
                    {backgroundImage && (
                      <Button
                        onClick={() => setAttributes({ backgroundImage: '' })}
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

            <RangeControl
              label="Min Height (px)"
              value={minHeight}
              onChange={(val) => setAttributes({ minHeight: val })}
              min={200}
              max={900}
            />

            <RangeControl
              label="Overlay Opacity (%)"
              value={overlayOpacity}
              onChange={(val) => setAttributes({ overlayOpacity: val })}
              min={0}
              max={100}
            />
          </PanelBody>

          {/* Colors */}
          <PanelColorSettings
            title="Colors"
            colorSettings={[
              {
                label: 'Background Color',
                value: backgroundColor,
                onChange: (val) => setAttributes({ backgroundColor: val }),
              },
              {
                label: 'Overlay Color',
                value: overlayColor,
                onChange: (val) => setAttributes({ overlayColor: val }),
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
          <PanelBody title="Typography" initialOpen={false}>
            <RangeControl
              label="Title Size (px)"
              value={titleSize}
              onChange={(val) => setAttributes({ titleSize: val })}
              min={20}
              max={100}
            />
            <RangeControl
              label="Subtitle Size (px)"
              value={subtitleSize}
              onChange={(val) => setAttributes({ subtitleSize: val })}
              min={12}
              max={40}
            />
          </PanelBody>

          {/* Visibility */}
          <PanelBody title="Visibility" initialOpen={false}>
            <ToggleControl
              label="Show Subtitle"
              checked={showSubtitle}
              onChange={(val) => setAttributes({ showSubtitle: val })}
            />
            <ToggleControl
              label="Show Button"
              checked={showButton}
              onChange={(val) => setAttributes({ showButton: val })}
            />
          </PanelBody>

        </InspectorControls>

        {/* Editor View */}
        <div {...blockProps}>
          <div style={wrapperStyle}>
            <div style={overlayStyle} />
            <div style={contentStyle}>
              <RichText
                tagName="h1"
                value={title}
                onChange={(val) => setAttributes({ title: val })}
                placeholder="Hero Title..."
                style={{
                  color: textColor,
                  fontSize: `${titleSize}px`,
                  fontWeight: '700',
                  lineHeight: '1.2',
                  marginBottom: '16px',
                }}
              />
              {showSubtitle && (
                <RichText
                  tagName="p"
                  value={subtitle}
                  onChange={(val) => setAttributes({ subtitle: val })}
                  placeholder="Hero subtitle..."
                  style={{
                    color: textColor,
                    fontSize: `${subtitleSize}px`,
                    opacity: '0.85',
                    marginBottom: '24px',
                    lineHeight: '1.6',
                  }}
                />
              )}
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
                    padding: '14px 32px',
                    borderRadius: '8px',
                    fontSize: '16px',
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
      title, subtitle, buttonText, buttonUrl,
      backgroundImage, backgroundColor,
      overlayColor, overlayOpacity,
      textColor, buttonColor,
      textAlign, minHeight,
      showButton, showSubtitle,
      titleSize, subtitleSize,
    } = attributes;

    const blockProps = useBlockProps.save({
      className: 'hero-banner',
    });

    return (
      <div {...blockProps} style={{
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: `${minHeight}px`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: textAlign === 'center'
          ? 'center'
          : textAlign === 'right' ? 'flex-end' : 'flex-start',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: overlayColor,
          opacity: overlayOpacity / 100,
        }} />
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign,
          padding: '40px',
          maxWidth: '800px',
          width: '100%',
        }}>
          <RichText.Content
            tagName="h1"
            value={title}
            style={{
              color: textColor,
              fontSize: `${titleSize}px`,
              fontWeight: '700',
              lineHeight: '1.2',
              marginBottom: '16px',
            }}
          />
          {showSubtitle && (
            <RichText.Content
              tagName="p"
              value={subtitle}
              style={{
                color: textColor,
                fontSize: `${subtitleSize}px`,
                opacity: '0.85',
                marginBottom: '24px',
              }}
            />
          )}
          {showButton && (
            <a href={buttonUrl} style={{
              display: 'inline-block',
              background: buttonColor,
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              textDecoration: 'none',
            }}>
              <RichText.Content value={buttonText} />
            </a>
          )}
        </div>
      </div>
    );
  },
});