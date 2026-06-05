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
  TextareaControl,
} from '@wordpress/components';
import { plus, trash, copy } from '@wordpress/icons';

function ClientStoriesIcon() {
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
        d="M4 5h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm10 2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"
      />
      <path fill="currentColor" d="M6 9h4v1.5H6V9zm0 2.5h3v1.5H6v-1.5z" />
    </svg>
  );
}

const defaultStory = (overrides = {}) => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  imageUrl: '',
  quote: 'The experience was beyond my expectations. The quality is exquisite and the team was incredibly helpful.',
  clientName: 'Priya M.',
  location: 'Mumbai',
  rating: 5,
  buttonText: 'VIEW PRODUCT',
  buttonUrl: '#',
  showButton: true,
  ...overrides,
});

function StarRating({ rating, color, size = 16 }) {
  return (
    <div style={{ display: 'flex', gap: '2px', lineHeight: 1 }} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            color,
            fontSize: `${size}px`,
            opacity: star <= rating ? 1 : 0.25,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function storyAccordionTitle(story, index) {
  const label = story.clientName?.trim() || 'Untitled';
  return `Story ${index + 1} — ${label}`;
}

function FieldGroup({ label, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <p style={{
        margin: '0 0 10px',
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: '#1e1e1e',
      }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function StoryFields({
  story,
  index,
  isOpen,
  onToggle,
  onUpdate,
  onClone,
  onRemove,
  canRemove,
  accentColor,
}) {
  return (
    <PanelBody
      title={storyAccordionTitle(story, index)}
      opened={isOpen}
      onToggle={onToggle}
    >
      <FieldGroup label="Image">
        <MediaUploadCheck>
          <MediaUpload
            onSelect={(media) => onUpdate('imageUrl', media.url)}
            allowedTypes={['image']}
            render={({ open }) => (
              <div>
                {story.imageUrl && (
                  <img
                    src={story.imageUrl}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      marginBottom: '8px',
                      display: 'block',
                      border: '1px solid #e0e0e0',
                    }}
                  />
                )}
                <Button
                  onClick={open}
                  variant="secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {story.imageUrl ? 'Change Image' : 'Add Image'}
                </Button>
                {story.imageUrl && (
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
      </FieldGroup>

      <FieldGroup label="Testimonial">
        <TextareaControl
          label="Quote"
          value={story.quote}
          onChange={(val) => onUpdate('quote', val)}
          rows={4}
          help="Client review text shown on the card"
        />
      </FieldGroup>

      <FieldGroup label="Client Info">
        <TextControl
          label="Client Name"
          value={story.clientName}
          onChange={(val) => onUpdate('clientName', val)}
          placeholder="e.g. Priya M."
        />
        <TextControl
          label="Location"
          value={story.location}
          onChange={(val) => onUpdate('location', val)}
          placeholder="e.g. Mumbai"
        />
      </FieldGroup>

      <FieldGroup label="Star Rating">
        <RangeControl
          label="Rating (1–5)"
          value={story.rating}
          onChange={(val) => onUpdate('rating', val)}
          min={1}
          max={5}
        />
        <div style={{ marginTop: '4px' }}>
          <StarRating rating={story.rating} color={accentColor} size={18} />
        </div>
      </FieldGroup>

      <FieldGroup label="Button">
        <ToggleControl
          label="Show Button"
          checked={story.showButton}
          onChange={(val) => onUpdate('showButton', val)}
        />
        {story.showButton && (
          <>
            <TextControl
              label="Button Text"
              value={story.buttonText}
              onChange={(val) => onUpdate('buttonText', val)}
              placeholder="VIEW PRODUCT"
            />
            <TextControl
              label="Button URL"
              value={story.buttonUrl}
              onChange={(val) => onUpdate('buttonUrl', val)}
              placeholder="https://"
            />
          </>
        )}
      </FieldGroup>

      <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
        <Button
          variant="secondary"
          icon={copy}
          onClick={onClone}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          Clone
        </Button>
        {canRemove && (
          <Button
            variant="secondary"
            icon={trash}
            onClick={onRemove}
            isDestructive
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Delete
          </Button>
        )}
      </div>
    </PanelBody>
  );
}

function StoryCard({
  story,
  cardBackground,
  accentColor,
  quoteColor,
  nameColor,
  locationColor,
  buttonColor,
  buttonTextColor,
  borderColor,
  quoteSize,
  nameSize,
  locationSize,
  starSize,
  onUpdate,
  isEditor,
}) {
  const cardStyle = {
    background: cardBackground,
    border: `1px solid ${borderColor}`,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  };

  const bodyStyle = {
    padding: '20px 22px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const quoteStyle = {
    color: quoteColor,
    fontSize: `${quoteSize}px`,
    lineHeight: '1.65',
    margin: 0,
    fontStyle: 'italic',
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: '12px',
  };

  const buttonStyle = {
    display: 'block',
    width: '100%',
    background: buttonColor,
    color: buttonTextColor,
    padding: '14px 20px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    textAlign: 'center',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={cardStyle}>
      {story.imageUrl ? (
        <img
          src={story.imageUrl}
          alt=""
          style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }}
        />
      ) : isEditor ? (
        <div style={{
          width: '100%',
          aspectRatio: '4 / 3',
          background: '#eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#888',
          fontSize: '14px',
        }}>
          Add story image
        </div>
      ) : null}

      <div style={bodyStyle}>
        {isEditor ? (
          <RichText
            tagName="p"
            value={story.quote}
            onChange={(val) => onUpdate('quote', val)}
            placeholder="Client quote..."
            style={quoteStyle}
          />
        ) : (
          <RichText.Content tagName="p" value={story.quote} style={quoteStyle} />
        )}

        <div style={footerStyle}>
          <div>
            {isEditor ? (
              <>
                <RichText
                  tagName="p"
                  value={story.clientName}
                  onChange={(val) => onUpdate('clientName', val)}
                  placeholder="Client name..."
                  style={{ color: nameColor, fontWeight: '700', margin: '0 0 4px', fontSize: `${nameSize}px` }}
                />
                <RichText
                  tagName="p"
                  value={story.location}
                  onChange={(val) => onUpdate('location', val)}
                  placeholder="Location..."
                  style={{ color: locationColor, margin: 0, fontSize: `${locationSize}px` }}
                />
              </>
            ) : (
              <>
                <RichText.Content
                  tagName="p"
                  value={story.clientName}
                  style={{ color: nameColor, fontWeight: '700', margin: '0 0 4px', fontSize: `${nameSize}px` }}
                />
                <RichText.Content
                  tagName="p"
                  value={story.location}
                  style={{ color: locationColor, margin: 0, fontSize: `${locationSize}px` }}
                />
              </>
            )}
          </div>
          <StarRating rating={story.rating} color={accentColor} size={starSize} />
        </div>
      </div>

      {story.showButton && (
        isEditor ? (
          <RichText
            tagName="div"
            value={story.buttonText}
            onChange={(val) => onUpdate('buttonText', val)}
            placeholder="Button text..."
            style={buttonStyle}
          />
        ) : (
          <a href={story.buttonUrl} style={buttonStyle}>
            <RichText.Content value={story.buttonText} />
          </a>
        )
      )}
    </div>
  );
}

const navArrowStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  fontSize: '20px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
};

registerBlockType('myapp/client-stories', {
  title: 'Client Stories',
  description: 'Testimonial slider with client quotes, ratings and product links',
  category: 'myapp-blocks',
  icon: ClientStoriesIcon,

  attributes: {
    sectionSubtitle: {
      type: 'string',
      default: 'WHAT OUR CUSTOMERS SAY',
    },
    sectionTitle: {
      type: 'string',
      default: 'Client Stories',
    },
    stories: {
      type: 'array',
      default: [
        defaultStory({
          id: 1,
          quote: 'The bridal lehenga was beyond my expectations. The craftsmanship is exquisite and the team was incredibly helpful.',
          clientName: 'Priya M.',
          location: 'Mumbai',
        }),
        defaultStory({
          id: 2,
          quote: 'Beautiful quality and fast delivery. I felt supported through every step of choosing the perfect outfit.',
          clientName: 'Ananya S.',
          location: 'Delhi',
        }),
        defaultStory({
          id: 3,
          quote: 'Outstanding service and stunning designs. Highly recommend for anyone looking for premium ethnic wear.',
          clientName: 'Riya K.',
          location: 'Bangalore',
        }),
      ],
    },
    showArrows: {
      type: 'boolean',
      default: true,
    },
    cardWidth: {
      type: 'number',
      default: 78,
    },
    gap: {
      type: 'number',
      default: 20,
    },
    sectionPadding: {
      type: 'number',
      default: 48,
    },
    backgroundColor: {
      type: 'string',
      default: '#f7f7f7',
    },
    cardBackground: {
      type: 'string',
      default: '#ffffff',
    },
    accentColor: {
      type: 'string',
      default: '#800040',
    },
    sectionSubtitleColor: {
      type: 'string',
      default: '#800040',
    },
    sectionTitleColor: {
      type: 'string',
      default: '#1e1e1e',
    },
    quoteColor: {
      type: 'string',
      default: '#444444',
    },
    nameColor: {
      type: 'string',
      default: '#1e1e1e',
    },
    locationColor: {
      type: 'string',
      default: '#888888',
    },
    buttonColor: {
      type: 'string',
      default: '#800040',
    },
    buttonTextColor: {
      type: 'string',
      default: '#ffffff',
    },
    borderColor: {
      type: 'string',
      default: '#e8e8e8',
    },
    subtitleSize: {
      type: 'number',
      default: 12,
    },
    titleSize: {
      type: 'number',
      default: 40,
    },
    quoteSize: {
      type: 'number',
      default: 15,
    },
    nameSize: {
      type: 'number',
      default: 15,
    },
    locationSize: {
      type: 'number',
      default: 13,
    },
    starSize: {
      type: 'number',
      default: 16,
    },
  },

  edit: ({ attributes, setAttributes }) => {
    const {
      sectionSubtitle, sectionTitle, stories: storiesAttr,
      showArrows, cardWidth, gap, sectionPadding,
      backgroundColor, cardBackground, accentColor,
      sectionSubtitleColor, sectionTitleColor,
      quoteColor, nameColor, locationColor,
      buttonColor, buttonTextColor, borderColor,
      subtitleSize, titleSize,
      quoteSize, nameSize, locationSize, starSize,
    } = attributes;

    const stories = Array.isArray(storiesAttr) && storiesAttr.length > 0
      ? storiesAttr
      : [defaultStory({ id: 1 })];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [expandedStoryId, setExpandedStoryId] = useState(stories[0]?.id ?? null);
    const blockProps = useBlockProps({ className: 'myapp-client-stories-editor' });

    const safeIndex = Math.min(currentIndex, Math.max(stories.length - 1, 0));

    function updateStory(id, field, value) {
      setAttributes({
        stories: stories.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
      });
    }

    function addStory() {
      const newStory = defaultStory();
      setAttributes({ stories: [...stories, newStory] });
      setExpandedStoryId(newStory.id);
      setCurrentIndex(stories.length);
    }

    function cloneStory(id) {
      const index = stories.findIndex((s) => s.id === id);
      const source = stories[index];
      if (!source) return;
      const clone = defaultStory({
        imageUrl: source.imageUrl,
        quote: source.quote,
        clientName: source.clientName ? `${source.clientName} (Copy)` : 'Client (Copy)',
        location: source.location,
        rating: source.rating,
        buttonText: source.buttonText,
        buttonUrl: source.buttonUrl,
        showButton: source.showButton,
      });
      const next = [...stories.slice(0, index + 1), clone, ...stories.slice(index + 1)];
      setAttributes({ stories: next });
      setExpandedStoryId(clone.id);
      setCurrentIndex(index + 1);
    }

    function removeStory(id) {
      if (stories.length <= 1) return;
      const removeIndex = stories.findIndex((s) => s.id === id);
      const next = stories.filter((s) => s.id !== id);
      setAttributes({ stories: next });
      let nextIndex = safeIndex;
      if (removeIndex < safeIndex) nextIndex = safeIndex - 1;
      else if (removeIndex === safeIndex) nextIndex = Math.min(safeIndex, next.length - 1);
      setCurrentIndex(nextIndex);
      if (expandedStoryId === id) setExpandedStoryId(next[nextIndex]?.id ?? null);
    }

    function goPrev() {
      setCurrentIndex((i) => (i === 0 ? stories.length - 1 : i - 1));
    }

    function goNext() {
      setCurrentIndex((i) => (i === stories.length - 1 ? 0 : i + 1));
    }

    return (
      <>
        <InspectorControls>

          <PanelColorSettings
            title="Section Background"
            colorSettings={[
              {
                label: 'Background Color',
                value: backgroundColor,
                onChange: (val) => setAttributes({ backgroundColor: val }),
              },
            ]}
          />

          <PanelBody title="Section Header" initialOpen={true}>
            <TextControl
              label="Sub Title"
              value={sectionSubtitle}
              onChange={(val) => setAttributes({ sectionSubtitle: val })}
              help="Uppercase label above the main title"
            />
            <TextControl
              label="Title"
              value={sectionTitle}
              onChange={(val) => setAttributes({ sectionTitle: val })}
              help="Main section heading"
            />
          </PanelBody>

          <PanelBody title={`Client Stories (${stories.length})`} initialOpen={true}>
            <Button
              variant="primary"
              icon={plus}
              onClick={addStory}
              style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }}
            >
              Add Story
            </Button>

            {stories.map((story, index) => (
              <StoryFields
                key={story.id}
                story={story}
                index={index}
                isOpen={expandedStoryId === story.id}
                onToggle={(nextOpen) => {
                  if (nextOpen) {
                    setExpandedStoryId(story.id);
                    setCurrentIndex(index);
                  } else {
                    setExpandedStoryId(null);
                  }
                }}
                onUpdate={(field, val) => updateStory(story.id, field, val)}
                onClone={() => cloneStory(story.id)}
                onRemove={() => removeStory(story.id)}
                canRemove={stories.length > 1}
                accentColor={accentColor}
              />
            ))}
          </PanelBody>

          <PanelBody title="Slider Settings" initialOpen={false}>
            <ToggleControl
              label="Show Arrows"
              checked={showArrows}
              onChange={(val) => setAttributes({ showArrows: val })}
            />
            <RangeControl
              label="Card Width (%)"
              value={cardWidth}
              onChange={(val) => setAttributes({ cardWidth: val })}
              min={60}
              max={95}
              help="Lower values reveal more of the next card"
            />
            <RangeControl
              label="Gap Between Cards (px)"
              value={gap}
              onChange={(val) => setAttributes({ gap: val })}
              min={8}
              max={40}
            />
            <RangeControl
              label="Section Padding (px)"
              value={sectionPadding}
              onChange={(val) => setAttributes({ sectionPadding: val })}
              min={24}
              max={100}
            />
          </PanelBody>

          <PanelColorSettings
            title="Section Colors"
            colorSettings={[
              { label: 'Sub Title Color', value: sectionSubtitleColor, onChange: (val) => setAttributes({ sectionSubtitleColor: val }) },
              { label: 'Title Color', value: sectionTitleColor, onChange: (val) => setAttributes({ sectionTitleColor: val }) },
            ]}
          />

          <PanelColorSettings
            title="Card Colors"
            colorSettings={[
              { label: 'Card Background', value: cardBackground, onChange: (val) => setAttributes({ cardBackground: val }) },
              { label: 'Card Border', value: borderColor, onChange: (val) => setAttributes({ borderColor: val }) },
              { label: 'Quote Text', value: quoteColor, onChange: (val) => setAttributes({ quoteColor: val }) },
              { label: 'Client Name', value: nameColor, onChange: (val) => setAttributes({ nameColor: val }) },
              { label: 'Location', value: locationColor, onChange: (val) => setAttributes({ locationColor: val }) },
              { label: 'Star Rating', value: accentColor, onChange: (val) => setAttributes({ accentColor: val }) },
              { label: 'Button Background', value: buttonColor, onChange: (val) => setAttributes({ buttonColor: val }) },
              { label: 'Button Text', value: buttonTextColor, onChange: (val) => setAttributes({ buttonTextColor: val }) },
            ]}
          />

          <PanelBody title="Typography" initialOpen={false}>
            <RangeControl
              label="Sub Title Size (px)"
              value={subtitleSize}
              onChange={(val) => setAttributes({ subtitleSize: val })}
              min={10}
              max={18}
            />
            <RangeControl
              label="Section Title Size (px)"
              value={titleSize}
              onChange={(val) => setAttributes({ titleSize: val })}
              min={28}
              max={56}
            />
            <RangeControl
              label="Quote Size (px)"
              value={quoteSize}
              onChange={(val) => setAttributes({ quoteSize: val })}
              min={12}
              max={20}
            />
            <RangeControl
              label="Client Name Size (px)"
              value={nameSize}
              onChange={(val) => setAttributes({ nameSize: val })}
              min={12}
              max={20}
            />
            <RangeControl
              label="Location Size (px)"
              value={locationSize}
              onChange={(val) => setAttributes({ locationSize: val })}
              min={10}
              max={18}
            />
            <RangeControl
              label="Star Size (px)"
              value={starSize}
              onChange={(val) => setAttributes({ starSize: val })}
              min={12}
              max={24}
            />
          </PanelBody>

        </InspectorControls>

        <div {...blockProps}>
          <div style={{ backgroundColor, padding: `${sectionPadding}px` }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <RichText
                tagName="p"
                value={sectionSubtitle}
                onChange={(val) => setAttributes({ sectionSubtitle: val })}
                style={{
                  color: sectionSubtitleColor,
                  fontSize: `${subtitleSize}px`,
                  fontWeight: '600',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  margin: '0 0 10px',
                }}
              />
              <RichText
                tagName="h2"
                value={sectionTitle}
                onChange={(val) => setAttributes({ sectionTitle: val })}
                style={{
                  color: sectionTitleColor,
                  fontSize: `${titleSize}px`,
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontWeight: '400',
                  margin: 0,
                  lineHeight: '1.2',
                }}
              />
            </div>

            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <div
                style={{
                  display: 'flex',
                  gap: `${gap}px`,
                  transform: `translateX(calc(-${safeIndex} * (${cardWidth}% + ${gap}px)))`,
                  transition: 'transform 0.35s ease',
                }}
              >
                {stories.map((story, index) => (
                  <div
                    key={story.id}
                    style={{
                      flex: `0 0 ${cardWidth}%`,
                      minWidth: `${cardWidth}%`,
                    }}
                    onClick={() => {
                      setCurrentIndex(index);
                      setExpandedStoryId(story.id);
                    }}
                  >
                    <StoryCard
                      story={story}
                      cardBackground={cardBackground}
                      accentColor={accentColor}
                      quoteColor={quoteColor}
                      nameColor={nameColor}
                      locationColor={locationColor}
                      buttonColor={buttonColor}
                      buttonTextColor={buttonTextColor}
                      borderColor={borderColor}
                      quoteSize={quoteSize}
                      nameSize={nameSize}
                      locationSize={locationSize}
                      starSize={starSize}
                      onUpdate={(field, val) => updateStory(story.id, field, val)}
                      isEditor
                    />
                  </div>
                ))}
              </div>

              {showArrows && stories.length > 1 && (
                <>
                  <button type="button" aria-label="Previous story" onClick={goPrev} style={{ ...navArrowStyle, left: '8px' }}>
                    ‹
                  </button>
                  <button type="button" aria-label="Next story" onClick={goNext} style={{ ...navArrowStyle, right: '8px' }}>
                    ›
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  },

  save: ({ attributes }) => {
    const {
      sectionSubtitle, sectionTitle, stories: storiesAttr,
      showArrows, cardWidth, gap, sectionPadding,
      backgroundColor, cardBackground, accentColor,
      sectionSubtitleColor, sectionTitleColor,
      quoteColor, nameColor, locationColor,
      buttonColor, buttonTextColor, borderColor,
      subtitleSize, titleSize,
      quoteSize, nameSize, locationSize, starSize,
    } = attributes;

    const stories = Array.isArray(storiesAttr) && storiesAttr.length > 0
      ? storiesAttr
      : [defaultStory({ id: 1 })];

    const blockProps = useBlockProps.save({
      className: 'myapp-client-stories',
      'data-show-arrows': showArrows ? 'true' : 'false',
      'data-card-width': String(cardWidth),
      'data-gap': String(gap),
    });

    return (
      <div {...blockProps} style={{ backgroundColor, padding: `${sectionPadding}px` }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <RichText.Content
            tagName="p"
            value={sectionSubtitle}
            style={{
              color: sectionSubtitleColor,
              fontSize: `${subtitleSize}px`,
              fontWeight: '600',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              margin: '0 0 10px',
            }}
          />
          <RichText.Content
            tagName="h2"
            value={sectionTitle}
            style={{
              color: sectionTitleColor,
              fontSize: `${titleSize}px`,
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontWeight: '400',
              margin: 0,
            }}
          />
        </div>

        <div className="myapp-client-stories__viewport" style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            className="myapp-client-stories__track"
            style={{
              display: 'flex',
              gap: `${gap}px`,
              transform: 'translateX(0)',
              transition: 'transform 0.35s ease',
            }}
          >
            {stories.map((story, index) => (
              <div
                key={story.id}
                className="myapp-client-stories__card-wrap"
                data-story-index={index}
                style={{ flex: `0 0 ${cardWidth}%`, minWidth: `${cardWidth}%` }}
              >
                <StoryCard
                  story={story}
                  cardBackground={cardBackground}
                  accentColor={accentColor}
                  quoteColor={quoteColor}
                  nameColor={nameColor}
                  locationColor={locationColor}
                  buttonColor={buttonColor}
                  buttonTextColor={buttonTextColor}
                  borderColor={borderColor}
                  quoteSize={quoteSize}
                  nameSize={nameSize}
                  locationSize={locationSize}
                  starSize={starSize}
                  isEditor={false}
                />
              </div>
            ))}
          </div>

          {showArrows && stories.length > 1 && (
            <>
              <button type="button" className="myapp-client-stories__arrow myapp-client-stories__arrow--prev" aria-label="Previous story" style={{ ...navArrowStyle, left: '8px' }}>
                ‹
              </button>
              <button type="button" className="myapp-client-stories__arrow myapp-client-stories__arrow--next" aria-label="Next story" style={{ ...navArrowStyle, right: '8px' }}>
                ›
              </button>
            </>
          )}
        </div>
      </div>
    );
  },
});
