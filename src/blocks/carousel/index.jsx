import { useState } from '@wordpress/element';
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
  ToggleControl,
  Button,
  TextControl,
} from '@wordpress/components';
import { plus, trash } from '@wordpress/icons';

function CarouselBlockIcon() {
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
        d="M4 5h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm0 2v9h16V7H4z"
      />
      <path
        fill="currentColor"
        d="M8.2 11.5 6.7 13l1.5 1.5V11.5zm7.6 0V14.5L17.3 13l-1.5-1.5z"
      />
      <circle cx="9" cy="19.5" r="1.1" fill="currentColor" />
      <circle cx="12" cy="19.5" r="1.1" fill="currentColor" />
      <circle cx="15" cy="19.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

const defaultSlide = (overrides = {}) => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  imageUrl: '',
  imageAlt: '',
  title: 'Slide Title',
  subtitle: 'Add a short description for this slide.',
  buttonText: 'Learn More',
  buttonUrl: '#',
  showButton: true,
  ...overrides,
});

const arrowButtonStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 3,
  background: 'rgba(255,255,255,0.9)',
  border: 'none',
  borderRadius: '50%',
  width: '44px',
  height: '44px',
  fontSize: '22px',
  lineHeight: 1,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
};

function CarouselSlideContent({
  slide,
  textColor,
  titleSize,
  subtitleSize,
  buttonColor,
  textAlign,
  onUpdate,
  isEditor,
}) {
  const contentJustify = textAlign === 'center'
    ? 'center'
    : textAlign === 'right' ? 'flex-end' : 'flex-start';

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    textAlign,
    padding: '40px',
    maxWidth: '800px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: textAlign === 'center'
      ? 'center'
      : textAlign === 'right' ? 'flex-end' : 'flex-start',
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
    opacity: '0.9',
    marginBottom: '24px',
    lineHeight: '1.6',
  };

  const buttonStyle = {
    display: 'inline-block',
    background: buttonColor,
    color: '#fff',
    padding: '14px 32px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: contentJustify,
    }}>
      <div style={contentStyle}>
        {isEditor ? (
          <>
            <RichText
              tagName="h2"
              value={slide.title}
              onChange={(val) => onUpdate('title', val)}
              placeholder="Main title..."
              style={titleStyle}
            />
            <RichText
              tagName="p"
              value={slide.subtitle}
              onChange={(val) => onUpdate('subtitle', val)}
              placeholder="Sub title..."
              style={subtitleStyle}
            />
            {slide.showButton && (
              <RichText
                tagName="span"
                value={slide.buttonText}
                onChange={(val) => onUpdate('buttonText', val)}
                placeholder="Button text..."
                style={buttonStyle}
              />
            )}
          </>
        ) : (
          <>
            <RichText.Content tagName="h2" value={slide.title} style={titleStyle} />
            <RichText.Content tagName="p" value={slide.subtitle} style={subtitleStyle} />
            {slide.showButton && (
              <a href={slide.buttonUrl} style={buttonStyle}>
                <RichText.Content value={slide.buttonText} />
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function slideAccordionTitle(slide, index) {
  const label = slide.title?.trim() || 'Untitled';
  const preview = label.length > 24 ? `${label.slice(0, 24)}…` : label;
  return `Slide ${index + 1} — ${preview}`;
}

function SlideFields({ slide, index, isOpen, onToggle, onUpdate, onRemove, canRemove }) {
  return (
    <PanelBody
      title={slideAccordionTitle(slide, index)}
      opened={isOpen}
      onToggle={onToggle}
    >
      {canRemove && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
          <Button
            icon={trash}
            label="Remove slide"
            onClick={onRemove}
            isDestructive
            variant="tertiary"
            size="small"
          />
        </div>
      )}

      <MediaUploadCheck>
        <MediaUpload
          onSelect={(media) => onUpdate('imageUrl', media.url)}
          allowedTypes={['image']}
          render={({ open }) => (
            <div style={{ marginBottom: '12px' }}>
              {slide.imageUrl ? (
                <div
                  onClick={open}
                  style={{
                    marginBottom: '8px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1px solid #ddd',
                  }}
                >
                  <img
                    src={slide.imageUrl}
                    alt=""
                    style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ) : null}
              <Button
                onClick={open}
                variant="secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {slide.imageUrl ? 'Change Image' : 'Add Image'}
              </Button>
              {slide.imageUrl && (
                <Button
                  onClick={() => onUpdate('imageUrl', '')}
                  variant="link"
                  isDestructive
                  style={{ marginTop: '4px' }}
                >
                  Remove Image
                </Button>
              )}
            </div>
          )}
        />
      </MediaUploadCheck>

      <TextControl
        label="Main Title"
        value={slide.title}
        onChange={(val) => onUpdate('title', val)}
      />
      <TextControl
        label="Sub Title"
        value={slide.subtitle}
        onChange={(val) => onUpdate('subtitle', val)}
      />
      <ToggleControl
        label="Show Button"
        checked={slide.showButton}
        onChange={(val) => onUpdate('showButton', val)}
      />
      {slide.showButton && (
        <>
          <TextControl
            label="Button Text"
            value={slide.buttonText}
            onChange={(val) => onUpdate('buttonText', val)}
          />
          <TextControl
            label="Button URL"
            value={slide.buttonUrl}
            onChange={(val) => onUpdate('buttonUrl', val)}
          />
        </>
      )}
    </PanelBody>
  );
}

registerBlockType('myapp/carousel', {
  title: 'Carousel',
  description: 'Image carousel with title, subtitle and button slides',
  category: 'myapp-blocks',
  icon: CarouselBlockIcon,

  attributes: {
    slides: {
      type: 'array',
      default: [
        defaultSlide({
          id: 1,
          title: 'Welcome to Our Site',
          subtitle: 'Discover amazing content on every slide.',
        }),
        defaultSlide({
          id: 2,
          title: 'Built for You',
          subtitle: 'Customize each slide with your own message.',
        }),
      ],
    },
    showArrows: {
      type: 'boolean',
      default: true,
    },
    showDots: {
      type: 'boolean',
      default: true,
    },
    slideHeight: {
      type: 'number',
      default: 500,
    },
    overlayColor: {
      type: 'string',
      default: '#000000',
    },
    overlayOpacity: {
      type: 'number',
      default: 35,
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
    titleSize: {
      type: 'number',
      default: 42,
    },
    subtitleSize: {
      type: 'number',
      default: 18,
    },
  },

  edit: ({ attributes, setAttributes }) => {
    const {
      slides: slidesAttr,
      showArrows,
      showDots,
      slideHeight,
      overlayColor,
      overlayOpacity,
      textColor,
      buttonColor,
      textAlign,
      titleSize,
      subtitleSize,
    } = attributes;

    const slides = Array.isArray(slidesAttr) && slidesAttr.length > 0
      ? slidesAttr
      : [defaultSlide({ id: 1 })];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [expandedSlideId, setExpandedSlideId] = useState(slides[0]?.id ?? null);
    const blockProps = useBlockProps({ className: 'myapp-carousel-editor' });

    const safeIndex = Math.min(currentIndex, Math.max(slides.length - 1, 0));
    const currentSlide = slides[safeIndex] || defaultSlide();

    function expandSlide(index) {
      const slide = slides[index];
      if (!slide) return;
      setExpandedSlideId(slide.id);
      setCurrentIndex(index);
    }

    function updateSlide(id, field, value) {
      setAttributes({
        slides: slides.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
      });
    }

    function addSlide() {
      const newSlide = defaultSlide();
      const next = [...slides, newSlide];
      setAttributes({ slides: next });
      setCurrentIndex(next.length - 1);
      setExpandedSlideId(newSlide.id);
    }

    function removeSlide(id) {
      if (slides.length <= 1) return;
      const removeIndex = slides.findIndex((s) => s.id === id);
      const next = slides.filter((s) => s.id !== id);
      setAttributes({ slides: next });

      let nextIndex = safeIndex;
      if (removeIndex < safeIndex) {
        nextIndex = safeIndex - 1;
      } else if (removeIndex === safeIndex) {
        nextIndex = Math.min(safeIndex, next.length - 1);
      }

      setCurrentIndex(nextIndex);
      if (expandedSlideId === id) {
        setExpandedSlideId(next[nextIndex]?.id ?? null);
      }
    }

    function goPrev() {
      setCurrentIndex((i) => {
        const next = i === 0 ? slides.length - 1 : i - 1;
        setExpandedSlideId(slides[next]?.id ?? null);
        return next;
      });
    }

    function goNext() {
      setCurrentIndex((i) => {
        const next = i === slides.length - 1 ? 0 : i + 1;
        setExpandedSlideId(slides[next]?.id ?? null);
        return next;
      });
    }

    const slideFrameStyle = {
      position: 'relative',
      height: `${slideHeight}px`,
      overflow: 'hidden',
      borderRadius: '4px',
      background: '#1a1a2e',
    };

    const overlayStyle = {
      position: 'absolute',
      inset: 0,
      backgroundColor: overlayColor,
      opacity: overlayOpacity / 100,
      zIndex: 1,
      pointerEvents: 'none',
    };

    return (
      <>
        <InspectorControls>

          <PanelBody title={`Slides (${slides.length})`} initialOpen={true}>
            <Button
              variant="primary"
              icon={plus}
              onClick={addSlide}
              style={{ width: '100%', justifyContent: 'center', marginBottom: '16px' }}
            >
              Add Slide
            </Button>

            {slides.map((slide, index) => (
              <SlideFields
                key={slide.id}
                slide={slide}
                index={index}
                isOpen={expandedSlideId === slide.id}
                onToggle={(nextOpen) => {
                  if (nextOpen) {
                    expandSlide(index);
                  } else {
                    setExpandedSlideId(null);
                  }
                }}
                onUpdate={(field, val) => updateSlide(slide.id, field, val)}
                onRemove={() => removeSlide(slide.id)}
                canRemove={slides.length > 1}
              />
            ))}
          </PanelBody>

          <PanelBody title="Carousel Settings" initialOpen={true}>
            <ToggleControl
              label="Show Arrows"
              checked={showArrows}
              onChange={(val) => setAttributes({ showArrows: val })}
            />
            <ToggleControl
              label="Show Dots"
              checked={showDots}
              onChange={(val) => setAttributes({ showDots: val })}
            />
            <RangeControl
              label="Slide Height (px)"
              value={slideHeight}
              onChange={(val) => setAttributes({ slideHeight: val })}
              min={300}
              max={800}
            />
          </PanelBody>

          <PanelColorSettings
            title="Colors"
            colorSettings={[
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

          <PanelBody title="Typography" initialOpen={false}>
            <RangeControl
              label="Title Size (px)"
              value={titleSize}
              onChange={(val) => setAttributes({ titleSize: val })}
              min={24}
              max={72}
            />
            <RangeControl
              label="Subtitle Size (px)"
              value={subtitleSize}
              onChange={(val) => setAttributes({ subtitleSize: val })}
              min={14}
              max={32}
            />
          </PanelBody>

        </InspectorControls>

        <div {...blockProps}>
          <div style={slideFrameStyle}>
            {currentSlide.imageUrl ? (
              <img
                src={currentSlide.imageUrl}
                alt={currentSlide.imageAlt || ''}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={(media) => updateSlide(currentSlide.id, 'imageUrl', media.url)}
                  allowedTypes={['image']}
                  render={({ open }) => (
                    <div
                      onClick={open}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#fff',
                        background: '#2a2a4a',
                      }}
                    >
                      <div style={{ fontSize: '40px' }}>🖼️</div>
                      <p style={{ marginTop: '12px', fontSize: '14px' }}>Click to add slide image</p>
                    </div>
                  )}
                />
              </MediaUploadCheck>
            )}

            <div style={overlayStyle} />

            <CarouselSlideContent
              slide={currentSlide}
              textColor={textColor}
              titleSize={titleSize}
              subtitleSize={subtitleSize}
              buttonColor={buttonColor}
              textAlign={textAlign}
              onUpdate={(field, val) => updateSlide(currentSlide.id, field, val)}
              isEditor
            />

            {showArrows && slides.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={goPrev}
                  style={{ ...arrowButtonStyle, left: '16px' }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={goNext}
                  style={{ ...arrowButtonStyle, right: '16px' }}
                >
                  ›
                </button>
              </>
            )}

            {showDots && slides.length > 1 && (
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                zIndex: 3,
              }}>
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => expandSlide(index)}
                    style={{
                      width: safeIndex === index ? '24px' : '10px',
                      height: '10px',
                      borderRadius: '999px',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      background: safeIndex === index ? '#ffffff' : 'rgba(255,255,255,0.5)',
                      transition: 'width 0.2s ease',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  },

  save: ({ attributes }) => {
    const {
      slides: slidesAttr,
      showArrows,
      showDots,
      slideHeight,
      overlayColor,
      overlayOpacity,
      textColor,
      buttonColor,
      textAlign,
      titleSize,
      subtitleSize,
    } = attributes;

    const slides = Array.isArray(slidesAttr) && slidesAttr.length > 0
      ? slidesAttr
      : [defaultSlide({ id: 1 })];

    const blockProps = useBlockProps.save({
      className: 'myapp-carousel',
      'data-show-arrows': showArrows ? 'true' : 'false',
      'data-show-dots': showDots ? 'true' : 'false',
    });

    const overlayStyle = {
      position: 'absolute',
      inset: 0,
      backgroundColor: overlayColor,
      opacity: overlayOpacity / 100,
      zIndex: 1,
    };

    return (
      <div {...blockProps}>
        <div
          className="myapp-carousel__track"
          style={{ position: 'relative', height: `${slideHeight}px`, overflow: 'hidden' }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="myapp-carousel__slide"
              data-slide-index={index}
              style={{
                position: index === 0 ? 'relative' : 'absolute',
                inset: index === 0 ? undefined : 0,
                width: '100%',
                height: '100%',
                display: index === 0 ? 'block' : 'none',
              }}
            >
              {slide.imageUrl && (
                <img
                  src={slide.imageUrl}
                  alt={slide.imageAlt || ''}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              )}
              <div style={overlayStyle} />
              <CarouselSlideContent
                slide={slide}
                textColor={textColor}
                titleSize={titleSize}
                subtitleSize={subtitleSize}
                buttonColor={buttonColor}
                textAlign={textAlign}
                isEditor={false}
              />
            </div>
          ))}

          {showArrows && slides.length > 1 && (
            <>
              <button
                type="button"
                className="myapp-carousel__arrow myapp-carousel__arrow--prev"
                aria-label="Previous slide"
                style={{ ...arrowButtonStyle, left: '16px' }}
              >
                ‹
              </button>
              <button
                type="button"
                className="myapp-carousel__arrow myapp-carousel__arrow--next"
                aria-label="Next slide"
                style={{ ...arrowButtonStyle, right: '16px' }}
              >
                ›
              </button>
            </>
          )}

          {showDots && slides.length > 1 && (
            <div
              className="myapp-carousel__dots"
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                zIndex: 3,
              }}
            >
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className="myapp-carousel__dot"
                  data-slide-index={index}
                  aria-label={`Go to slide ${index + 1}`}
                  style={{
                    width: index === 0 ? '24px' : '10px',
                    height: '10px',
                    borderRadius: '999px',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    background: index === 0 ? '#ffffff' : 'rgba(255,255,255,0.5)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
});
