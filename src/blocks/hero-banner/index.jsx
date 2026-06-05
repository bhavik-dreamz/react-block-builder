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

const buttonBaseStyle = {
  display: 'inline-block',
  padding: '14px 32px',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  textDecoration: 'none',
};

function HeroBackground({ backgroundType, backgroundVideo, overlayStyle }) {
  const mediaStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    pointerEvents: 'none',
  };

  return (
    <>
      {backgroundType === 'video' && backgroundVideo && (
        <video
          src={backgroundVideo}
          autoPlay
          muted
          loop
          playsInline
          style={mediaStyle}
        />
      )}
      {(backgroundType === 'image' || backgroundType === 'video') && overlayStyle && (
        <div style={overlayStyle} />
      )}
    </>
  );
}

function HeroButtons({
  showButton,
  showButton2,
  buttonText,
  button2Text,
  buttonColor,
  button2Color,
  button2Style,
  onChangeButtonText,
  onChangeButton2Text,
  isEditor,
}) {
  if (!showButton && !showButton2) return null;

  const primaryStyle = {
    ...buttonBaseStyle,
    background: buttonColor,
    color: '#fff',
  };

  const secondaryStyle = button2Style === 'outline'
    ? {
        ...buttonBaseStyle,
        background: 'transparent',
        color: button2Color || buttonColor,
        border: `2px solid ${button2Color || buttonColor}`,
      }
    : {
        ...buttonBaseStyle,
        background: button2Color || buttonColor,
        color: '#fff',
      };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
      {showButton && (
        isEditor ? (
          <RichText
            tagName="span"
            value={buttonText}
            onChange={onChangeButtonText}
            placeholder="Button text..."
            style={primaryStyle}
          />
        ) : (
          <span style={primaryStyle}>
            <RichText.Content value={buttonText} />
          </span>
        )
      )}
      {showButton2 && (
        isEditor ? (
          <RichText
            tagName="span"
            value={button2Text}
            onChange={onChangeButton2Text}
            placeholder="Second button..."
            style={secondaryStyle}
          />
        ) : (
          <span style={secondaryStyle}>
            <RichText.Content value={button2Text} />
          </span>
        )
      )}
    </div>
  );
}

registerBlockType('myapp/hero-banner', {
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
    button2Text: {
      type: 'string',
      default: 'Learn More',
    },
    button2Url: {
      type: 'string',
      default: '#',
    },
    backgroundImage: {
      type: 'string',
      default: '',
    },
    backgroundVideo: {
      type: 'string',
      default: '',
    },
    backgroundType: {
      type: 'string',
      default: 'image',
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
    button2Color: {
      type: 'string',
      default: '#ffffff',
    },
    button2Style: {
      type: 'string',
      default: 'outline',
    },
    textAlign: {
      type: 'string',
      default: 'center',
    },
    variant: {
      type: 'string',
      default: 'overlay',
    },
    imagePosition: {
      type: 'string',
      default: 'right',
    },
    minHeight: {
      type: 'number',
      default: 500,
    },
    showButton: {
      type: 'boolean',
      default: true,
    },
    showButton2: {
      type: 'boolean',
      default: false,
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
      title, subtitle, buttonText, buttonUrl,
      button2Text, button2Url,
      backgroundImage, backgroundVideo, backgroundType, backgroundColor,
      overlayColor, overlayOpacity,
      textColor, buttonColor, button2Color, button2Style,
      textAlign, variant, imagePosition, minHeight,
      showButton, showButton2, showSubtitle,
      titleSize, subtitleSize,
    } = attributes;

    const blockProps = useBlockProps({
      className: 'hero-banner-editor',
    });

    const isOverlay = variant === 'overlay';
    const isImageLeft = imagePosition === 'left';

    const backgroundImageStyle = backgroundType === 'image' && backgroundImage
      ? `url(${backgroundImage})`
      : 'none';

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
      maxWidth: isOverlay ? '800px' : '100%',
      width: '100%',
    };

    const titleStyle = {
      color: textColor,
      fontSize: `${titleSize}px`,
      fontWeight: '700',
      lineHeight: '1.2',
      marginBottom: '16px',
    };

    const subtitleStyle = {
      color: textColor,
      fontSize: `${subtitleSize}px`,
      opacity: '0.85',
      marginBottom: '24px',
      lineHeight: '1.6',
    };

    const renderMediaSide = () => {
      if (backgroundType === 'video' && backgroundVideo) {
        return (
          <video
            src={backgroundVideo}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        );
      }

      if (backgroundImage) {
        return (
          <img
            src={backgroundImage}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        );
      }

      return (
        <MediaUploadCheck>
          <MediaUpload
            onSelect={(media) => {
              const isVideo = media.type === 'video' || (media.mime && media.mime.startsWith('video/'));
              if (isVideo) {
                setAttributes({ backgroundVideo: media.url, backgroundType: 'video' });
              } else {
                setAttributes({ backgroundImage: media.url, backgroundType: 'image' });
              }
            }}
            allowedTypes={['image', 'video']}
            render={({ open }) => (
              <div
                onClick={open}
                style={{
                  background: '#f0f4ff',
                  border: '2px dashed #3858e9',
                  height: '100%',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#3858e9',
                }}
              >
                <div style={{ fontSize: '32px' }}>🖼️</div>
                <p style={{ marginTop: '8px', fontSize: '14px' }}>Click to add media</p>
              </div>
            )}
          />
        </MediaUploadCheck>
      );
    };

    const renderContent = () => (
      <>
        <RichText
          tagName="h1"
          value={title}
          onChange={(val) => setAttributes({ title: val })}
          placeholder="Hero Title..."
          style={titleStyle}
        />
        {showSubtitle && (
          <RichText
            tagName="p"
            value={subtitle}
            onChange={(val) => setAttributes({ subtitle: val })}
            placeholder="Hero subtitle..."
            style={subtitleStyle}
          />
        )}
        <HeroButtons
          showButton={showButton}
          showButton2={showButton2}
          buttonText={buttonText}
          button2Text={button2Text}
          buttonColor={buttonColor}
          button2Color={button2Color}
          button2Style={button2Style}
          onChangeButtonText={(val) => setAttributes({ buttonText: val })}
          onChangeButton2Text={(val) => setAttributes({ button2Text: val })}
          isEditor
        />
      </>
    );

    return (
      <>
        <BlockControls>
          <AlignmentToolbar
            value={textAlign}
            onChange={(val) => setAttributes({ textAlign: val || 'center' })}
          />
        </BlockControls>

        <InspectorControls>

          {/* Layout Variant */}
          <PanelBody title="Layout" initialOpen={true}>
            <SelectControl
              label="Hero Variant"
              value={variant}
              options={[
                { label: 'Overlay Text', value: 'overlay' },
                { label: 'Half Text / Half Image', value: 'split' },
              ]}
              onChange={(val) => setAttributes({ variant: val })}
            />
            {variant === 'split' && (
              <SelectControl
                label="Image Side"
                value={imagePosition}
                options={[
                  { label: 'Image Right (Text Left)', value: 'right' },
                  { label: 'Image Left (Text Right)', value: 'left' },
                ]}
                onChange={(val) => setAttributes({ imagePosition: val })}
              />
            )}
          </PanelBody>

          {/* Background */}
          <PanelBody title="Background" initialOpen={true}>
            <p style={{ marginBottom: '8px', fontWeight: 500 }}>Background Type</p>
            <ButtonGroup style={{ marginBottom: '16px', display: 'flex' }}>
              {[
                { label: 'Color', value: 'color' },
                { label: 'Image', value: 'image' },
                { label: 'Video', value: 'video' },
              ].map(({ label, value }) => (
                <Button
                  key={value}
                  variant={backgroundType === value ? 'primary' : 'secondary'}
                  onClick={() => setAttributes({ backgroundType: value })}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {label}
                </Button>
              ))}
            </ButtonGroup>

            {backgroundType === 'color' && (
              <PanelColorSettings
                title=""
                colorSettings={[
                  {
                    label: 'Background Color',
                    value: backgroundColor,
                    onChange: (val) => setAttributes({ backgroundColor: val }),
                  },
                ]}
              />
            )}

            {backgroundType === 'image' && (
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
            )}

            {backgroundType === 'video' && (
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={(media) => setAttributes({ backgroundVideo: media.url })}
                  allowedTypes={['video']}
                  render={({ open }) => (
                    <div style={{ marginBottom: '12px' }}>
                      <Button
                        onClick={open}
                        variant="secondary"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        {backgroundVideo ? 'Change Video' : 'Set Background Video'}
                      </Button>
                      {backgroundVideo && (
                        <Button
                          onClick={() => setAttributes({ backgroundVideo: '' })}
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
              label="Min Height (px)"
              value={minHeight}
              onChange={(val) => setAttributes({ minHeight: val })}
              min={200}
              max={900}
            />

            {isOverlay && backgroundType !== 'color' && (
              <RangeControl
                label="Overlay Opacity (%)"
                value={overlayOpacity}
                onChange={(val) => setAttributes({ overlayOpacity: val })}
                min={0}
                max={100}
              />
            )}
          </PanelBody>

          {/* Colors */}
          <PanelColorSettings
            title="Colors"
            colorSettings={[
              ...(backgroundType === 'color' ? [] : [{
                label: 'Fallback Background Color',
                value: backgroundColor,
                onChange: (val) => setAttributes({ backgroundColor: val }),
              }]),
              ...(isOverlay && backgroundType !== 'color' ? [{
                label: 'Overlay Color',
                value: overlayColor,
                onChange: (val) => setAttributes({ overlayColor: val }),
              }] : []),
              {
                label: 'Text Color',
                value: textColor,
                onChange: (val) => setAttributes({ textColor: val }),
              },
              {
                label: 'Primary Button Color',
                value: buttonColor,
                onChange: (val) => setAttributes({ buttonColor: val }),
              },
              ...(showButton2 ? [{
                label: 'Secondary Button Color',
                value: button2Color,
                onChange: (val) => setAttributes({ button2Color: val }),
              }] : []),
            ]}
          />

          {/* Typography */}
          <PanelBody title="Typography" initialOpen={false}>
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

          {/* Buttons */}
          <PanelBody title="Buttons" initialOpen={false}>
            <ToggleControl
              label="Show Primary Button"
              checked={showButton}
              onChange={(val) => setAttributes({ showButton: val })}
            />
            {showButton && (
              <TextControl
                label="Primary Button URL"
                value={buttonUrl}
                onChange={(val) => setAttributes({ buttonUrl: val })}
              />
            )}
            <ToggleControl
              label="Show Secondary Button"
              checked={showButton2}
              onChange={(val) => setAttributes({ showButton2: val })}
            />
            {showButton2 && (
              <>
                <TextControl
                  label="Secondary Button URL"
                  value={button2Url}
                  onChange={(val) => setAttributes({ button2Url: val })}
                />
                <SelectControl
                  label="Secondary Button Style"
                  value={button2Style}
                  options={[
                    { label: 'Outline', value: 'outline' },
                    { label: 'Filled', value: 'filled' },
                  ]}
                  onChange={(val) => setAttributes({ button2Style: val })}
                />
              </>
            )}
          </PanelBody>

          {/* Visibility */}
          <PanelBody title="Visibility" initialOpen={false}>
            <ToggleControl
              label="Show Subtitle"
              checked={showSubtitle}
              onChange={(val) => setAttributes({ showSubtitle: val })}
            />
          </PanelBody>

        </InspectorControls>

        {/* Editor View */}
        <div {...blockProps}>
          {isOverlay ? (
            <div style={{
              backgroundColor,
              backgroundImage: backgroundType === 'image' ? backgroundImageStyle : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: `${minHeight}px`,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: textAlign === 'center'
                ? 'center'
                : textAlign === 'right' ? 'flex-end' : 'flex-start',
              overflow: 'hidden',
            }}>
              <HeroBackground
                backgroundType={backgroundType}
                backgroundVideo={backgroundVideo}
                overlayStyle={overlayStyle}
              />
              <div style={contentStyle}>
                {renderContent()}
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: isImageLeft ? 'row' : 'row-reverse',
              minHeight: `${minHeight}px`,
              backgroundColor,
              overflow: 'hidden',
            }}>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: textAlign === 'center'
                  ? 'center'
                  : textAlign === 'right' ? 'flex-end' : 'flex-start',
              }}>
                <div style={contentStyle}>
                  {renderContent()}
                </div>
              </div>
              <div style={{ flex: 1, minHeight: `${minHeight}px` }}>
                {renderMediaSide()}
              </div>
            </div>
          )}
        </div>
      </>
    );
  },

  save: ({ attributes }) => {
    const {
      title, subtitle, buttonText, buttonUrl,
      button2Text, button2Url,
      backgroundImage, backgroundVideo, backgroundType, backgroundColor,
      overlayColor, overlayOpacity,
      textColor, buttonColor, button2Color, button2Style,
      textAlign, variant, imagePosition, minHeight,
      showButton, showButton2, showSubtitle,
      titleSize, subtitleSize,
    } = attributes;

    const blockProps = useBlockProps.save({
      className: 'hero-banner',
    });

    const isOverlay = variant === 'overlay';
    const isImageLeft = imagePosition === 'left';

    const backgroundImageStyle = backgroundType === 'image' && backgroundImage
      ? `url(${backgroundImage})`
      : 'none';

    const overlayStyle = {
      position: 'absolute',
      inset: 0,
      backgroundColor: overlayColor,
      opacity: overlayOpacity / 100,
    };

    const contentStyle = {
      position: 'relative',
      zIndex: 1,
      textAlign,
      padding: '40px',
      maxWidth: isOverlay ? '800px' : '100%',
      width: '100%',
    };

    const titleStyle = {
      color: textColor,
      fontSize: `${titleSize}px`,
      fontWeight: '700',
      lineHeight: '1.2',
      marginBottom: '16px',
    };

    const subtitleStyle = {
      color: textColor,
      fontSize: `${subtitleSize}px`,
      opacity: '0.85',
      marginBottom: '24px',
    };

    const primaryBtnStyle = {
      ...buttonBaseStyle,
      background: buttonColor,
      color: '#fff',
    };

    const secondaryBtnStyle = button2Style === 'outline'
      ? {
          ...buttonBaseStyle,
          background: 'transparent',
          color: button2Color || buttonColor,
          border: `2px solid ${button2Color || buttonColor}`,
        }
      : {
          ...buttonBaseStyle,
          background: button2Color || buttonColor,
          color: '#fff',
        };

    const renderSavedButtons = () => {
      if (!showButton && !showButton2) return null;
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
          {showButton && (
            <a href={buttonUrl} style={primaryBtnStyle}>
              <RichText.Content value={buttonText} />
            </a>
          )}
          {showButton2 && (
            <a href={button2Url} style={secondaryBtnStyle}>
              <RichText.Content value={button2Text} />
            </a>
          )}
        </div>
      );
    };

    if (isOverlay) {
      return (
        <div {...blockProps} style={{
          backgroundColor,
          backgroundImage: backgroundType === 'image' ? backgroundImageStyle : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: `${minHeight}px`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: textAlign === 'center'
            ? 'center'
            : textAlign === 'right' ? 'flex-end' : 'flex-start',
          overflow: 'hidden',
        }}>
          <HeroBackground
            backgroundType={backgroundType}
            backgroundVideo={backgroundVideo}
            overlayStyle={overlayStyle}
          />
          <div style={contentStyle}>
            <RichText.Content tagName="h1" value={title} style={titleStyle} />
            {showSubtitle && (
              <RichText.Content tagName="p" value={subtitle} style={subtitleStyle} />
            )}
            {renderSavedButtons()}
          </div>
        </div>
      );
    }

    const mediaSide = () => {
      if (backgroundType === 'video' && backgroundVideo) {
        return (
          <video
            src={backgroundVideo}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        );
      }
      if (backgroundImage) {
        return (
          <img
            src={backgroundImage}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        );
      }
      return null;
    };

    return (
      <div {...blockProps} style={{
        display: 'flex',
        flexDirection: isImageLeft ? 'row' : 'row-reverse',
        minHeight: `${minHeight}px`,
        backgroundColor,
        overflow: 'hidden',
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: textAlign === 'center'
            ? 'center'
            : textAlign === 'right' ? 'flex-end' : 'flex-start',
        }}>
          <div style={contentStyle}>
            <RichText.Content tagName="h1" value={title} style={titleStyle} />
            {showSubtitle && (
              <RichText.Content tagName="p" value={subtitle} style={subtitleStyle} />
            )}
            {renderSavedButtons()}
          </div>
        </div>
        <div style={{ flex: 1, minHeight: `${minHeight}px` }}>
          {mediaSide()}
        </div>
      </div>
    );
  },
});
