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
  ButtonGroup,
  TextControl,
} from '@wordpress/components';
import {
  ActionBuilder,
  ActionLink,
  buttonActionAttribute,
  resolveButtonAction,
} from '../../actions/index.js';

function FreeConsultationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M4 4h10a2 2 0 0 1 2 2v3h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h16v-9h-6V6H4z"
      />
      <path
        fill="currentColor"
        d="M8 10h8v1.5H8V10zm0 3h6v1.5H8V13z"
      />
    </svg>
  );
}

function alignToFlex(value) {
  if (value === 'center') return 'center';
  if (value === 'right') return 'flex-end';
  return 'flex-start';
}

function ConsultationMedia({
  mediaType,
  imageUrl,
  videoUrl,
  borderRadius,
  onSelectImage,
  onSelectVideo,
  isEditor,
}) {
  const mediaStyle = {
    width: '100%',
    borderRadius: `${borderRadius}px`,
    display: 'block',
    objectFit: 'cover',
  };

  if (mediaType === 'video' && videoUrl) {
    return (
      <video
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        style={{ ...mediaStyle, aspectRatio: '16 / 10' }}
      />
    );
  }

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        style={{ ...mediaStyle, aspectRatio: '16 / 10' }}
      />
    );
  }

  if (!isEditor) return null;

  return (
    <MediaUploadCheck>
      <MediaUpload
        onSelect={(media) => {
          const isVideo = media.type === 'video' || media.mime?.startsWith('video/');
          if (isVideo) onSelectVideo(media.url);
          else onSelectImage(media.url);
        }}
        allowedTypes={['image', 'video']}
        render={({ open }) => (
          <div
            onClick={open}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.08)',
              border: '2px dashed rgba(255,255,255,0.35)',
              borderRadius: `${borderRadius}px`,
              aspectRatio: '16 / 10',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            <div style={{ fontSize: '36px' }}>🖼️</div>
            <p style={{ marginTop: '10px', fontSize: '14px' }}>Add image or video</p>
          </div>
        )}
      />
    </MediaUploadCheck>
  );
}

registerBlockType('myapp/free-consultation', {
  title: 'Free Consultation',
  description: 'Consultation section with title, description, media and CTA button',
  category: 'myapp-blocks',
  icon: FreeConsultationIcon,

  attributes: {
    title: {
      type: 'string',
      default: 'Not Sure About Style or Size?',
    },
    subtitle: {
      type: 'string',
      default: 'COMPLIMENTARY SERVICE',
    },
    description: {
      type: 'string',
      default: 'Book a free live video consultation with our expert stylists. Get personalized recommendations, size guidance, and styling advice from the comfort of your home.',
    },
    buttonText: {
      type: 'string',
      default: 'BOOK FREE CONSULTATION',
    },
    buttonAction: buttonActionAttribute,
    showButton: {
      type: 'boolean',
      default: true,
    },
    mediaType: {
      type: 'string',
      default: 'image',
    },
    imageUrl: {
      type: 'string',
      default: '',
    },
    videoUrl: {
      type: 'string',
      default: '',
    },
    backgroundColor: {
      type: 'string',
      default: '#5c2438',
    },
    textColor: {
      type: 'string',
      default: '#ffffff',
    },
    subtitleColor: {
      type: 'string',
      default: '#d4b8c4',
    },
    buttonColor: {
      type: 'string',
      default: '#ffffff',
    },
    buttonTextColor: {
      type: 'string',
      default: '#1e1e1e',
    },
    textAlign: {
      type: 'string',
      default: 'center',
    },
    buttonAlign: {
      type: 'string',
      default: 'center',
    },
    sectionPadding: {
      type: 'number',
      default: 56,
    },
    gap: {
      type: 'number',
      default: 28,
    },
    contentMaxWidth: {
      type: 'number',
      default: 640,
    },
    borderRadius: {
      type: 'number',
      default: 0,
    },
    titleSize: {
      type: 'number',
      default: 40,
    },
    subtitleSize: {
      type: 'number',
      default: 12,
    },
    descriptionSize: {
      type: 'number',
      default: 16,
    },
  },

  edit: ({ attributes, setAttributes }) => {
    const {
      title, subtitle, description,
      buttonText, buttonAction, showButton,
      mediaType, imageUrl, videoUrl,
      backgroundColor, textColor, subtitleColor, buttonColor, buttonTextColor,
      textAlign, buttonAlign,
      sectionPadding, gap, contentMaxWidth, borderRadius,
      titleSize, subtitleSize, descriptionSize,
    } = attributes;

    const blockProps = useBlockProps({ className: 'myapp-free-consultation-editor' });

    const wrapperStyle = {
      backgroundColor,
      padding: `${sectionPadding}px`,
    };

    const innerStyle = {
      width: '100%',
      maxWidth: `${contentMaxWidth}px`,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
      gap: `${gap}px`,
      textAlign,
    };

    const subtitleStyle = {
      color: subtitleColor,
      fontSize: `${subtitleSize}px`,
      fontWeight: '600',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      margin: 0,
    };

    const titleStyle = {
      color: textColor,
      fontSize: `${titleSize}px`,
      fontWeight: '400',
      fontFamily: 'Georgia, "Times New Roman", serif',
      lineHeight: '1.25',
      margin: 0,
    };

    const descriptionStyle = {
      color: textColor,
      fontSize: `${descriptionSize}px`,
      lineHeight: '1.75',
      margin: 0,
      opacity: '0.95',
    };

    const buttonStyle = {
      display: 'inline-block',
      background: buttonColor,
      color: buttonTextColor,
      padding: '16px 36px',
      borderRadius: `${borderRadius}px`,
      fontSize: '13px',
      fontWeight: '700',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      textDecoration: 'none',
      border: 'none',
    };

    const mediaWrapStyle = {
      width: '100%',
    };

    const buttonRowStyle = {
      width: '100%',
      display: 'flex',
      justifyContent: alignToFlex(buttonAlign),
    };

    return (
      <>
        <BlockControls>
          <AlignmentToolbar
            value={textAlign}
            onChange={(val) => setAttributes({ textAlign: val || 'center' })}
          />
        </BlockControls>

        <InspectorControls>

          <PanelColorSettings
            title="Background"
            colorSettings={[
              {
                label: 'Background Color',
                value: backgroundColor,
                onChange: (val) => setAttributes({ backgroundColor: val }),
              },
            ]}
          />

          <PanelBody title="Content" initialOpen={true}>
            <TextControl
              label="Sub Title"
              value={subtitle}
              onChange={(val) => setAttributes({ subtitle: val })}
            />
            <TextControl
              label="Title"
              value={title}
              onChange={(val) => setAttributes({ title: val })}
            />
            <TextControl
              label="Description"
              value={description}
              onChange={(val) => setAttributes({ description: val })}
            />
          </PanelBody>

          <PanelBody title="Media" initialOpen={true}>
            <p style={{ marginBottom: '8px', fontWeight: 500 }}>Media Type</p>
            <ButtonGroup style={{ marginBottom: '16px', display: 'flex' }}>
              {[
                { label: 'Image', value: 'image' },
                { label: 'Video', value: 'video' },
              ].map(({ label, value }) => (
                <Button
                  key={value}
                  variant={mediaType === value ? 'primary' : 'secondary'}
                  onClick={() => setAttributes({ mediaType: value })}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {label}
                </Button>
              ))}
            </ButtonGroup>

            {mediaType === 'image' && (
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={(media) => setAttributes({ imageUrl: media.url })}
                  allowedTypes={['image']}
                  render={({ open }) => (
                    <div style={{ marginBottom: '12px' }}>
                      <Button
                        onClick={open}
                        variant="secondary"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        {imageUrl ? 'Change Image' : 'Add Image'}
                      </Button>
                      {imageUrl && (
                        <Button
                          onClick={() => setAttributes({ imageUrl: '' })}
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
            )}

            {mediaType === 'video' && (
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={(media) => setAttributes({ videoUrl: media.url })}
                  allowedTypes={['video']}
                  render={({ open }) => (
                    <div style={{ marginBottom: '12px' }}>
                      <Button
                        onClick={open}
                        variant="secondary"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        {videoUrl ? 'Change Video' : 'Add Video'}
                      </Button>
                      {videoUrl && (
                        <Button
                          onClick={() => setAttributes({ videoUrl: '' })}
                          variant="link"
                          isDestructive
                          style={{ marginTop: '8px' }}
                        >
                          Remove Video
                        </Button>
                      )}
                    </div>
                  )}
                />
              </MediaUploadCheck>
            )}

            <RangeControl
              label="Media Border Radius"
              value={borderRadius}
              onChange={(val) => setAttributes({ borderRadius: val })}
              min={0}
              max={40}
            />
          </PanelBody>

          <PanelBody title="Button" initialOpen={false}>
            <ToggleControl
              label="Show Button"
              checked={showButton}
              onChange={(val) => setAttributes({ showButton: val })}
            />
            {showButton && (
              <ActionBuilder
                label="Button Action"
                value={resolveButtonAction(attributes)}
                onChange={(action) => setAttributes({ buttonAction: action })}
              />
            )}
          </PanelBody>

          <PanelBody title="Layout & Alignment" initialOpen={true}>
            <SelectControl
              label="Text Alignment"
              value={textAlign}
              options={[
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ]}
              onChange={(val) => setAttributes({ textAlign: val })}
            />
            <SelectControl
              label="Button Alignment"
              value={buttonAlign}
              options={[
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ]}
              onChange={(val) => setAttributes({ buttonAlign: val })}
            />
            <RangeControl
              label="Section Padding (px)"
              value={sectionPadding}
              onChange={(val) => setAttributes({ sectionPadding: val })}
              min={16}
              max={120}
            />
            <RangeControl
              label="Content Gap (px)"
              value={gap}
              onChange={(val) => setAttributes({ gap: val })}
              min={12}
              max={64}
            />
            <RangeControl
              label="Content Max Width (px)"
              value={contentMaxWidth}
              onChange={(val) => setAttributes({ contentMaxWidth: val })}
              min={320}
              max={900}
            />
          </PanelBody>

          <PanelColorSettings
            title="Colors"
            colorSettings={[
              {
                label: 'Text Color',
                value: textColor,
                onChange: (val) => setAttributes({ textColor: val }),
              },
              {
                label: 'Sub Title Color',
                value: subtitleColor,
                onChange: (val) => setAttributes({ subtitleColor: val }),
              },
              {
                label: 'Button Background',
                value: buttonColor,
                onChange: (val) => setAttributes({ buttonColor: val }),
              },
              {
                label: 'Button Text Color',
                value: buttonTextColor,
                onChange: (val) => setAttributes({ buttonTextColor: val }),
              },
            ]}
          />

          <PanelBody title="Typography" initialOpen={false}>
            <RangeControl
              label="Title Size (px)"
              value={titleSize}
              onChange={(val) => setAttributes({ titleSize: val })}
              min={24}
              max={56}
            />
            <RangeControl
              label="Sub Title Size (px)"
              value={subtitleSize}
              onChange={(val) => setAttributes({ subtitleSize: val })}
              min={10}
              max={24}
            />
            <RangeControl
              label="Description Size (px)"
              value={descriptionSize}
              onChange={(val) => setAttributes({ descriptionSize: val })}
              min={12}
              max={24}
            />
          </PanelBody>

        </InspectorControls>

        <div {...blockProps}>
          <div style={wrapperStyle}>
            <div style={innerStyle}>
              <RichText
                tagName="p"
                value={subtitle}
                onChange={(val) => setAttributes({ subtitle: val })}
                placeholder="Sub title..."
                style={subtitleStyle}
              />
              <RichText
                tagName="h2"
                value={title}
                onChange={(val) => setAttributes({ title: val })}
                placeholder="Title..."
                style={titleStyle}
              />
              <RichText
                tagName="p"
                value={description}
                onChange={(val) => setAttributes({ description: val })}
                placeholder="Description..."
                style={descriptionStyle}
              />

              <div style={mediaWrapStyle}>
                <ConsultationMedia
                  mediaType={mediaType}
                  imageUrl={imageUrl}
                  videoUrl={videoUrl}
                  borderRadius={borderRadius}
                  onSelectImage={(url) => setAttributes({ imageUrl: url, mediaType: 'image' })}
                  onSelectVideo={(url) => setAttributes({ videoUrl: url, mediaType: 'video' })}
                  isEditor
                />
              </div>

              {showButton && (
                <div style={buttonRowStyle}>
                  <RichText
                    tagName="span"
                    value={buttonText}
                    onChange={(val) => setAttributes({ buttonText: val })}
                    placeholder="Button text..."
                    style={buttonStyle}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  },

  save: ({ attributes }) => {
    const {
      title, subtitle, description,
      buttonText, buttonAction, showButton,
      mediaType, imageUrl, videoUrl,
      backgroundColor, textColor, subtitleColor, buttonColor, buttonTextColor,
      textAlign, buttonAlign,
      sectionPadding, gap, contentMaxWidth, borderRadius,
      titleSize, subtitleSize, descriptionSize,
    } = attributes;

    const blockProps = useBlockProps.save({ className: 'myapp-free-consultation' });

    const subtitleStyle = {
      color: subtitleColor,
      fontSize: `${subtitleSize}px`,
      fontWeight: '600',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      margin: 0,
    };

    const titleStyle = {
      color: textColor,
      fontSize: `${titleSize}px`,
      fontWeight: '400',
      fontFamily: 'Georgia, "Times New Roman", serif',
      lineHeight: '1.25',
      margin: 0,
    };

    const descriptionStyle = {
      color: textColor,
      fontSize: `${descriptionSize}px`,
      lineHeight: '1.75',
      margin: 0,
      opacity: '0.95',
    };

    const buttonStyle = {
      display: 'inline-block',
      background: buttonColor,
      color: buttonTextColor,
      padding: '16px 36px',
      borderRadius: `${borderRadius}px`,
      fontSize: '13px',
      fontWeight: '700',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      textDecoration: 'none',
    };

    return (
      <div {...blockProps} style={{ backgroundColor, padding: `${sectionPadding}px` }}>
        <div style={{
          width: '100%',
          maxWidth: `${contentMaxWidth}px`,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
          gap: `${gap}px`,
          textAlign,
        }}>
          <RichText.Content tagName="p" value={subtitle} style={subtitleStyle} />
          <RichText.Content tagName="h2" value={title} style={titleStyle} />
          <RichText.Content tagName="p" value={description} style={descriptionStyle} />

          <div style={{ width: '100%' }}>
            <ConsultationMedia
              mediaType={mediaType}
              imageUrl={imageUrl}
              videoUrl={videoUrl}
              borderRadius={borderRadius}
              isEditor={false}
            />
          </div>

          {showButton && (
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: alignToFlex(buttonAlign),
            }}>
              <ActionLink action={resolveButtonAction(attributes)} style={buttonStyle}>
                <RichText.Content value={buttonText} />
              </ActionLink>
            </div>
          )}
        </div>
      </div>
    );
  },
});
