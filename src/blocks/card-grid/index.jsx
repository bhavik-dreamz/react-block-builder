import { useState } from '@wordpress/element';
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
  TextControl,
} from '@wordpress/components';
import { plus, copy, trash } from '@wordpress/icons';

const defaultCard = (overrides = {}) => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  icon: '⭐',
  title: 'Card Title',
  description: 'Add a short description for this card.',
  ...overrides,
});

function cardAccordionTitle(card, index) {
  const label = card.title?.trim() || 'Untitled';
  const preview = label.length > 22 ? `${label.slice(0, 22)}…` : label;
  return `Card ${index + 1} — ${preview}`;
}

function CardFields({
  card,
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
      title={cardAccordionTitle(card, index)}
      opened={isOpen}
      onToggle={onToggle}
    >
      <TextControl
        label="Icon (emoji or text)"
        value={card.icon}
        onChange={(val) => onUpdate('icon', val)}
        help="Use an emoji like 🚀 or any short text"
      />
      <TextControl
        label="Title"
        value={card.title}
        onChange={(val) => onUpdate('title', val)}
      />
      <TextControl
        label="Description"
        value={card.description}
        onChange={(val) => onUpdate('description', val)}
      />

      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '12px',
        flexWrap: 'wrap',
      }}>
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

registerBlockType('myapp/card-grid', {
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
      cards: cardsAttr, columns,
      backgroundColor, cardBackground,
      textColor, accentColor,
      borderRadius, gap, iconSize,
    } = attributes;

    const cards = Array.isArray(cardsAttr) && cardsAttr.length > 0
      ? cardsAttr
      : [defaultCard({ id: 1 })];

    const [expandedCardId, setExpandedCardId] = useState(cards[0]?.id ?? null);
    const blockProps = useBlockProps();

    function updateCard(id, field, value) {
      setAttributes({
        cards: cards.map((c) =>
          c.id === id ? { ...c, [field]: value } : c
        ),
      });
    }

    function addCard() {
      const newCard = defaultCard();
      setAttributes({ cards: [...cards, newCard] });
      setExpandedCardId(newCard.id);
    }

    function cloneCard(id) {
      const index = cards.findIndex((c) => c.id === id);
      const source = cards[index];
      if (!source) return;

      const clone = defaultCard({
        icon: source.icon,
        title: source.title ? `${source.title} (Copy)` : 'Card Title (Copy)',
        description: source.description,
      });

      const next = [
        ...cards.slice(0, index + 1),
        clone,
        ...cards.slice(index + 1),
      ];
      setAttributes({ cards: next });
      setExpandedCardId(clone.id);
    }

    function removeCard(id) {
      if (cards.length <= 1) return;
      const next = cards.filter((c) => c.id !== id);
      setAttributes({ cards: next });
      if (expandedCardId === id) {
        setExpandedCardId(next[0]?.id ?? null);
      }
    }

    function expandCard(id) {
      setExpandedCardId(id);
    }

    return (
      <>
        <InspectorControls>

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

          <PanelBody title={`Cards (${cards.length})`} initialOpen={true}>
            <Button
              variant="primary"
              icon={plus}
              onClick={addCard}
              style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }}
            >
              Add Card
            </Button>

            {cards.map((card, index) => (
              <CardFields
                key={card.id}
                card={card}
                index={index}
                isOpen={expandedCardId === card.id}
                onToggle={(nextOpen) => {
                  if (nextOpen) {
                    expandCard(card.id);
                  } else {
                    setExpandedCardId(null);
                  }
                }}
                onUpdate={(field, val) => updateCard(card.id, field, val)}
                onClone={() => cloneCard(card.id)}
                onRemove={() => removeCard(card.id)}
                canRemove={cards.length > 1}
              />
            ))}
          </PanelBody>

        </InspectorControls>

        <div {...blockProps}>
          <div style={{ backgroundColor, padding: '32px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: `${gap}px`,
            }}>
              {cards.map((card) => {
                const isActive = expandedCardId === card.id;
                return (
                  <div
                    key={card.id}
                    onClick={() => expandCard(card.id)}
                    style={{
                      background: cardBackground,
                      borderRadius: `${borderRadius}px`,
                      padding: '28px 24px',
                      border: isActive
                        ? `2px solid ${accentColor}`
                        : `1px solid ${accentColor}22`,
                      boxShadow: isActive ? `0 0 0 2px ${accentColor}33` : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <RichText
                      tagName="p"
                      value={card.icon}
                      onChange={(val) => updateCard(card.id, 'icon', val)}
                      style={{ fontSize: `${iconSize}px`, marginBottom: '16px' }}
                    />
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
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  },

  save: ({ attributes }) => {
    const {
      cards: cardsAttr, columns,
      backgroundColor, cardBackground,
      textColor, accentColor,
      borderRadius, gap, iconSize,
    } = attributes;

    const cards = Array.isArray(cardsAttr) && cardsAttr.length > 0
      ? cardsAttr
      : [defaultCard({ id: 1 })];

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
