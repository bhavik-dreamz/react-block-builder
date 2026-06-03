import { registerBlockType } from '@wordpress/blocks';
import {
  useBlockProps,
  RichText,
  InspectorControls,
  PanelColorSettings,
} from '@wordpress/block-editor';
import {
  PanelBody,
  RangeControl,
  SelectControl,
  Button,
} from '@wordpress/components';

// Default empty card
const defaultCard = () => ({
  id: Date.now(),
  icon: '⭐',
  title: 'Card Title',
  description: 'Add a short description for this card.',
});

registerBlockType('myapp/card-grid', {
  apiVersion: 3,
  title: 'Card Grid',
  description: 'Repeatable cards with icon, title and description',
  category: 'myapp-blocks',
  icon: 'grid-view',

  attributes: {
    cards: {
      type: 'array',
      default: [
        { id: 1, icon: '🚀', title: 'Fast', description: 'Lightning fast performance out of the box.' },
        { id: 2, icon: '🎨', title: 'Beautiful', description: 'Stunning design that your users will love.' },
        { id: 3, icon: '🔒', title: 'Secure', description: 'Built with security best practices in mind.' },
      ],
    },
    columns: {
      type: 'number',
      default: 3,
    },
    backgroundColor: {
      type: 'string',
      default: '#ffffff',
    },
    cardBackground: {
      type: 'string',
      default: '#f8f9ff',
    },
    textColor: {
      type: 'string',
      default: '#1e1e1e',
    },
    accentColor: {
      type: 'string',
      default: '#3858e9',
    },
    borderRadius: {
      type: 'number',
      default: 12,
    },
    gap: {
      type: 'number',
      default: 24,
    },
    iconSize: {
      type: 'number',
      default: 40,
    },
  },

  edit: ({ attributes, setAttributes }) => {
    const {
      cards, columns,
      backgroundColor, cardBackground,
      textColor, accentColor,
      borderRadius, gap, iconSize,
    } = attributes;

    const blockProps = useBlockProps();

    function updateCard(id, field, value) {
      setAttributes({
        cards: cards.map((c) =>
          c.id === id ? { ...c, [field]: value } : c
        ),
      });
    }

    function addCard() {
      setAttributes({ cards: [...cards, defaultCard()] });
    }

    function removeCard(id) {
      setAttributes({ cards: cards.filter((c) => c.id !== id) });
    }

    return (
      <>
        <InspectorControls>

          {/* Layout */}
          <PanelBody title="Layout" initialOpen={true}>
            <SelectControl
              label="Columns"
              value={String(columns)}
              options={[
                { label: '1 Column', value: '1' },
                { label: '2 Columns', value: '2' },
                { label: '3 Columns', value: '3' },
                { label: '4 Columns', value: '4' },
              ]}
              onChange={(val) => setAttributes({ columns: Number(val) })}
            />
            <RangeControl
              label="Gap (px)"
              value={gap}
              onChange={(val) => setAttributes({ gap: val })}
              min={8}
              max={60}
            />
            <RangeControl
              label="Border Radius"
              value={borderRadius}
              onChange={(val) => setAttributes({ borderRadius: val })}
              min={0}
              max={40}
            />
            <RangeControl
              label="Icon Size (px)"
              value={iconSize}
              onChange={(val) => setAttributes({ iconSize: val })}
              min={20}
              max={80}
            />
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
                label: 'Card Background',
                value: cardBackground,
                onChange: (val) => setAttributes({ cardBackground: val }),
              },
              {
                label: 'Text Color',
                value: textColor,
                onChange: (val) => setAttributes({ textColor: val }),
              },
              {
                label: 'Accent Color',
                value: accentColor,
                onChange: (val) => setAttributes({ accentColor: val }),
              },
            ]}
          />

          {/* Cards manager */}
          <PanelBody title={`Cards (${cards.length})`} initialOpen={true}>
            {cards.map((card, index) => (
              <div
                key={card.id}
                style={{
                  padding: '10px',
                  marginBottom: '8px',
                  background: '#f5f5f5',
                  borderRadius: '6px',
                  fontSize: '13px',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}>
                  <strong>Card {index + 1}</strong>
                  <Button
                    onClick={() => removeCard(card.id)}
                    variant="link"
                    isDestructive
                    style={{ fontSize: '12px' }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              onClick={addCard}
              variant="secondary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
            >
              + Add Card
            </Button>
          </PanelBody>

        </InspectorControls>

        {/* Editor View */}
        <div {...blockProps}>
          <div style={{ backgroundColor, padding: '32px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: `${gap}px`,
            }}>
              {cards.map((card) => (
                <div
                  key={card.id}
                  style={{
                    background: cardBackground,
                    borderRadius: `${borderRadius}px`,
                    padding: '28px 24px',
                    border: `1px solid ${accentColor}22`,
                  }}
                >
                  {/* Icon */}
                  <RichText
                    tagName="p"
                    value={card.icon}
                    onChange={(val) => updateCard(card.id, 'icon', val)}
                    style={{ fontSize: `${iconSize}px`, marginBottom: '16px' }}
                  />

                  {/* Title */}
                  <RichText
                    tagName="h3"
                    value={card.title}
                    onChange={(val) => updateCard(card.id, 'title', val)}
                    placeholder="Card title..."
                    style={{
                      color: textColor,
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '10px',
                    }}
                  />

                  {/* Description */}
                  <RichText
                    tagName="p"
                    value={card.description}
                    onChange={(val) => updateCard(card.id, 'description', val)}
                    placeholder="Card description..."
                    style={{
                      color: textColor,
                      fontSize: '14px',
                      lineHeight: '1.6',
                      opacity: '0.75',
                    }}
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
      cards, columns,
      backgroundColor, cardBackground,
      textColor, accentColor,
      borderRadius, gap, iconSize,
    } = attributes;

    const blockProps = useBlockProps.save();

    return (
      <div {...blockProps} style={{ backgroundColor, padding: '32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
        }}>
          {cards.map((card) => (
            <div
              key={card.id}
              style={{
                background: cardBackground,
                borderRadius: `${borderRadius}px`,
                padding: '28px 24px',
                border: `1px solid ${accentColor}22`,
              }}
            >
              <p style={{ fontSize: `${iconSize}px`, marginBottom: '16px' }}>
                {card.icon}
              </p>
              <h3 style={{
                color: textColor,
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '10px',
              }}>
                {card.title}
              </h3>
              <p style={{
                color: textColor,
                fontSize: '14px',
                lineHeight: '1.6',
                opacity: '0.75',
              }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  },
});