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

function EditorsPicksIcon() {
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
        d="M4 4h16v5H4V4zm0 7h10v9H4v-9zm12 0h4v9h-4v-9z"
      />
    </svg>
  );
}

const defaultBanner = (overrides = {}) => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  backgroundColor: '#a89888',
  title: 'Banner Title',
  description: 'Add a short description for this pick.',
  buttonText: 'SHOP NOW',
  buttonUrl: '#',
  showButton: true,
  imageUrl: '',
  ...overrides,
});

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

function bannerAccordionTitle(banner, index) {
  const label = banner.title?.trim() || 'Untitled';
  const preview = label.length > 22 ? `${label.slice(0, 22)}…` : label;
  return `Pick ${index + 1} — ${preview}`;
}

function BannerFields({
  banner,
  index,
  isOpen,
  onToggle,
  onUpdate,
  onClone,
  onRemove,
  canRemove,
}) {
  return (
    <PanelBody
      title={bannerAccordionTitle(banner, index)}
      opened={isOpen}
      onToggle={onToggle}
    >
      <FieldGroup label="Background">
        <PanelColorSettings
          title=""
          colorSettings={[
            {
              label: 'Banner Background Color',
              value: banner.backgroundColor,
              onChange: (val) => onUpdate('backgroundColor', val),
            },
          ]}
        />
      </FieldGroup>

      <FieldGroup label="Image">
        <MediaUploadCheck>
          <MediaUpload
            onSelect={(media) => onUpdate('imageUrl', media.url)}
            allowedTypes={['image']}
            render={({ open }) => (
              <div>
                {banner.imageUrl && (
                  <img
                    src={banner.imageUrl}
                    alt=""
                    style={{
                      width: '100%',
                      height: '90px',
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
                  {banner.imageUrl ? 'Change Image' : 'Add Image'}
                </Button>
                {banner.imageUrl && (
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

      <FieldGroup label="Content">
        <TextControl
          label="Title"
          value={banner.title}
          onChange={(val) => onUpdate('title', val)}
          placeholder="For the Groom"
        />
        <TextareaControl
          label="Description"
          value={banner.description}
          onChange={(val) => onUpdate('description', val)}
          rows={3}
        />
      </FieldGroup>

      <FieldGroup label="Button">
        <ToggleControl
          label="Show Button"
          checked={banner.showButton}
          onChange={(val) => onUpdate('showButton', val)}
        />
        {banner.showButton && (
          <>
            <TextControl
              label="Button Text"
              value={banner.buttonText}
              onChange={(val) => onUpdate('buttonText', val)}
              placeholder="SHOP NOW"
            />
            <TextControl
              label="Button URL"
              value={banner.buttonUrl}
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

function PickBanner({
  banner,
  textColor,
  buttonColor,
  buttonTextColor,
  bannerTitleSize,
  bannerDescriptionSize,
  bannerMinHeight,
  imageWidth,
  onUpdate,
  isEditor,
}) {
  const buttonStyle = {
    display: 'inline-block',
    background: buttonColor,
    color: buttonTextColor,
    padding: '14px 28px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
  };

  const titleStyle = {
    color: textColor,
    fontSize: `${bannerTitleSize}px`,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: '700',
    lineHeight: '1.2',
    margin: '0 0 14px',
  };

  const descriptionStyle = {
    color: textColor,
    fontSize: `${bannerDescriptionSize}px`,
    lineHeight: '1.65',
    margin: '0 0 24px',
    opacity: '0.95',
    maxWidth: '420px',
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: `${bannerMinHeight}px`,
      overflow: 'hidden',
      background: banner.backgroundColor,
    }}>
      {banner.imageUrl && (
        <img
          src={banner.imageUrl}
          alt=""
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: `${imageWidth}%`,
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(to right, ${banner.backgroundColor} 38%, ${banner.backgroundColor}cc 52%, transparent 72%)`,
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '40px 48px',
        maxWidth: `${100 - imageWidth + 10}%`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: `${bannerMinHeight}px`,
        boxSizing: 'border-box',
      }}>
        {isEditor ? (
          <>
            <RichText
              tagName="h3"
              value={banner.title}
              onChange={(val) => onUpdate('title', val)}
              placeholder="Banner title..."
              style={titleStyle}
            />
            <RichText
              tagName="p"
              value={banner.description}
              onChange={(val) => onUpdate('description', val)}
              placeholder="Description..."
              style={descriptionStyle}
            />
            {banner.showButton && (
              <RichText
                tagName="span"
                value={banner.buttonText}
                onChange={(val) => onUpdate('buttonText', val)}
                placeholder="Button text..."
                style={buttonStyle}
              />
            )}
          </>
        ) : (
          <>
            <RichText.Content tagName="h3" value={banner.title} style={titleStyle} />
            <RichText.Content tagName="p" value={banner.description} style={descriptionStyle} />
            {banner.showButton && (
              <a href={banner.buttonUrl} style={buttonStyle}>
                <RichText.Content value={banner.buttonText} />
              </a>
            )}
          </>
        )}
      </div>

      {isEditor && !banner.imageUrl && (
        <MediaUploadCheck>
          <MediaUpload
            onSelect={(media) => onUpdate('imageUrl', media.url)}
            allowedTypes={['image']}
            render={({ open }) => (
              <div
                onClick={open}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  width: `${imageWidth}%`,
                  height: '100%',
                  background: 'rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: textColor,
                  fontSize: '14px',
                }}
              >
                Add banner image →
              </div>
            )}
          />
        </MediaUploadCheck>
      )}
    </div>
  );
}

registerBlockType('myapp/editors-picks', {
  title: "Editor's Picks",
  description: 'Stacked promo banners with gradient text panel and image',
  category: 'myapp-blocks',
  icon: EditorsPicksIcon,

  attributes: {
    sectionSubtitle: {
      type: 'string',
      default: 'MOST LOVED BY OUR CUSTOMERS',
    },
    sectionTitle: {
      type: 'string',
      default: "Editor's Picks",
    },
    banners: {
      type: 'array',
      default: [
        defaultBanner({
          id: 1,
          backgroundColor: '#a89888',
          title: 'For the Groom',
          description: 'Explore refined ensembles designed with classic craftsmanship and contemporary style.',
        }),
        defaultBanner({
          id: 2,
          backgroundColor: '#6b7c5c',
          title: 'For the Bride',
          description: 'Discover timeless bridal styles crafted with elegance, intricate details, and modern sophistication.',
        }),
      ],
    },
    backgroundColor: {
      type: 'string',
      default: '#faf9f7',
    },
    sectionSubtitleColor: {
      type: 'string',
      default: '#800040',
    },
    sectionTitleColor: {
      type: 'string',
      default: '#1e1e1e',
    },
    bannerTextColor: {
      type: 'string',
      default: '#ffffff',
    },
    buttonColor: {
      type: 'string',
      default: '#ffffff',
    },
    buttonTextColor: {
      type: 'string',
      default: '#1e1e1e',
    },
    sectionPadding: {
      type: 'number',
      default: 48,
    },
    bannerGap: {
      type: 'number',
      default: 20,
    },
    bannerMinHeight: {
      type: 'number',
      default: 280,
    },
    imageWidth: {
      type: 'number',
      default: 52,
    },
    subtitleSize: {
      type: 'number',
      default: 12,
    },
    titleSize: {
      type: 'number',
      default: 40,
    },
    bannerTitleSize: {
      type: 'number',
      default: 32,
    },
    bannerDescriptionSize: {
      type: 'number',
      default: 15,
    },
  },

  edit: ({ attributes, setAttributes }) => {
    const {
      sectionSubtitle, sectionTitle, banners: bannersAttr,
      backgroundColor, sectionSubtitleColor, sectionTitleColor,
      bannerTextColor, buttonColor, buttonTextColor,
      sectionPadding, bannerGap, bannerMinHeight, imageWidth,
      subtitleSize, titleSize, bannerTitleSize, bannerDescriptionSize,
    } = attributes;

    const banners = Array.isArray(bannersAttr) && bannersAttr.length > 0
      ? bannersAttr
      : [defaultBanner({ id: 1 })];

    const [expandedBannerId, setExpandedBannerId] = useState(banners[0]?.id ?? null);
    const blockProps = useBlockProps({ className: 'myapp-editors-picks-editor' });

    function updateBanner(id, field, value) {
      setAttributes({
        banners: banners.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
      });
    }

    function addBanner() {
      const newBanner = defaultBanner();
      setAttributes({ banners: [...banners, newBanner] });
      setExpandedBannerId(newBanner.id);
    }

    function cloneBanner(id) {
      const index = banners.findIndex((b) => b.id === id);
      const source = banners[index];
      if (!source) return;
      const clone = defaultBanner({
        backgroundColor: source.backgroundColor,
        title: source.title ? `${source.title} (Copy)` : 'Banner (Copy)',
        description: source.description,
        buttonText: source.buttonText,
        buttonUrl: source.buttonUrl,
        showButton: source.showButton,
        imageUrl: source.imageUrl,
      });
      const next = [...banners.slice(0, index + 1), clone, ...banners.slice(index + 1)];
      setAttributes({ banners: next });
      setExpandedBannerId(clone.id);
    }

    function removeBanner(id) {
      if (banners.length <= 1) return;
      const next = banners.filter((b) => b.id !== id);
      setAttributes({ banners: next });
      if (expandedBannerId === id) setExpandedBannerId(next[0]?.id ?? null);
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
            />
            <TextControl
              label="Title"
              value={sectionTitle}
              onChange={(val) => setAttributes({ sectionTitle: val })}
            />
          </PanelBody>

          <PanelBody title={`Editor's Picks (${banners.length})`} initialOpen={true}>
            <Button
              variant="primary"
              icon={plus}
              onClick={addBanner}
              style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }}
            >
              Add Pick
            </Button>

            {banners.map((banner, index) => (
              <BannerFields
                key={banner.id}
                banner={banner}
                index={index}
                isOpen={expandedBannerId === banner.id}
                onToggle={(nextOpen) => {
                  if (nextOpen) setExpandedBannerId(banner.id);
                  else setExpandedBannerId(null);
                }}
                onUpdate={(field, val) => updateBanner(banner.id, field, val)}
                onClone={() => cloneBanner(banner.id)}
                onRemove={() => removeBanner(banner.id)}
                canRemove={banners.length > 1}
              />
            ))}
          </PanelBody>

          <PanelBody title="Layout" initialOpen={false}>
            <RangeControl
              label="Section Padding (px)"
              value={sectionPadding}
              onChange={(val) => setAttributes({ sectionPadding: val })}
              min={24}
              max={100}
            />
            <RangeControl
              label="Gap Between Banners (px)"
              value={bannerGap}
              onChange={(val) => setAttributes({ bannerGap: val })}
              min={8}
              max={48}
            />
            <RangeControl
              label="Banner Height (px)"
              value={bannerMinHeight}
              onChange={(val) => setAttributes({ bannerMinHeight: val })}
              min={200}
              max={420}
            />
            <RangeControl
              label="Image Width (%)"
              value={imageWidth}
              onChange={(val) => setAttributes({ imageWidth: val })}
              min={40}
              max={65}
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
            title="Banner Colors"
            colorSettings={[
              { label: 'Banner Text', value: bannerTextColor, onChange: (val) => setAttributes({ bannerTextColor: val }) },
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
              label="Banner Title Size (px)"
              value={bannerTitleSize}
              onChange={(val) => setAttributes({ bannerTitleSize: val })}
              min={24}
              max={44}
            />
            <RangeControl
              label="Banner Description Size (px)"
              value={bannerDescriptionSize}
              onChange={(val) => setAttributes({ bannerDescriptionSize: val })}
              min={12}
              max={20}
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
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  letterSpacing: '0.12em',
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
                  fontWeight: '700',
                  margin: 0,
                  lineHeight: '1.2',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: `${bannerGap}px` }}>
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  onClick={() => setExpandedBannerId(banner.id)}
                  style={{
                    outline: expandedBannerId === banner.id ? '2px solid #3858e9' : 'none',
                    outlineOffset: '2px',
                    cursor: 'pointer',
                  }}
                >
                  <PickBanner
                    banner={banner}
                    textColor={bannerTextColor}
                    buttonColor={buttonColor}
                    buttonTextColor={buttonTextColor}
                    bannerTitleSize={bannerTitleSize}
                    bannerDescriptionSize={bannerDescriptionSize}
                    bannerMinHeight={bannerMinHeight}
                    imageWidth={imageWidth}
                    onUpdate={(field, val) => updateBanner(banner.id, field, val)}
                    isEditor
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  },

  save: ({ attributes }) => {
    const {
      sectionSubtitle, sectionTitle, banners: bannersAttr,
      backgroundColor, sectionSubtitleColor, sectionTitleColor,
      bannerTextColor, buttonColor, buttonTextColor,
      sectionPadding, bannerGap, bannerMinHeight, imageWidth,
      subtitleSize, titleSize, bannerTitleSize, bannerDescriptionSize,
    } = attributes;

    const banners = Array.isArray(bannersAttr) && bannersAttr.length > 0
      ? bannersAttr
      : [defaultBanner({ id: 1 })];

    const blockProps = useBlockProps.save({ className: 'myapp-editors-picks' });

    return (
      <div {...blockProps} style={{ backgroundColor, padding: `${sectionPadding}px` }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <RichText.Content
            tagName="p"
            value={sectionSubtitle}
            style={{
              color: sectionSubtitleColor,
              fontSize: `${subtitleSize}px`,
              fontFamily: 'Georgia, "Times New Roman", serif',
              letterSpacing: '0.12em',
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
              fontWeight: '700',
              margin: 0,
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: `${bannerGap}px` }}>
          {banners.map((banner) => (
            <PickBanner
              key={banner.id}
              banner={banner}
              textColor={bannerTextColor}
              buttonColor={buttonColor}
              buttonTextColor={buttonTextColor}
              bannerTitleSize={bannerTitleSize}
              bannerDescriptionSize={bannerDescriptionSize}
              bannerMinHeight={bannerMinHeight}
              imageWidth={imageWidth}
              isEditor={false}
            />
          ))}
        </div>
      </div>
    );
  },
});
