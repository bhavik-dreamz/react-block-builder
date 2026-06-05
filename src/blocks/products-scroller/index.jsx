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
import { plus, trash, copy } from '@wordpress/icons';

function ProductsScrollerIcon() {
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
        d="M3 5h6v14H3V5zm8 0h10v6H11V5zm0 8h10v6H11v-6z"
      />
    </svg>
  );
}

const defaultProduct = (overrides = {}) => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  imageUrl: '',
  title: 'Product Title',
  price: '₹ 24,220',
  productUrl: '#',
  showWishlist: true,
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

function productAccordionTitle(product, index) {
  const label = product.title?.trim() || 'Untitled';
  const preview = label.length > 24 ? `${label.slice(0, 24)}…` : label;
  return `Product ${index + 1} — ${preview}`;
}

function WishlistButton({ show, isEditor }) {
  if (!show) return null;
  return (
    <button
      type="button"
      aria-label="Add to wishlist"
      onClick={isEditor ? (e) => e.preventDefault() : undefined}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        width: '34px',
        height: '34px',
        border: 'none',
        borderRadius: '4px',
        background: 'rgba(255,255,255,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21s-7-4.6-9.5-9.1C.8 8.8 2.4 5 6 5c2 0 3.2 1.2 4 2.4C10.8 6.2 12 5 14 5c3.6 0 5.2 3.8 3.5 6.9C19 16.4 12 21 12 21z"
          stroke="#1e1e1e"
          strokeWidth="1.6"
        />
      </svg>
    </button>
  );
}

function ProductFields({
  product,
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
      title={productAccordionTitle(product, index)}
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
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
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
                  {product.imageUrl ? 'Change Image' : 'Add Image'}
                </Button>
                {product.imageUrl && (
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

      <FieldGroup label="Product Details">
        <TextControl
          label="Product Title"
          value={product.title}
          onChange={(val) => onUpdate('title', val)}
        />
        <TextControl
          label="Price"
          value={product.price}
          onChange={(val) => onUpdate('price', val)}
          help="e.g. ₹ 24,220"
        />
        <TextControl
          label="Product URL"
          value={product.productUrl}
          onChange={(val) => onUpdate('productUrl', val)}
          placeholder="https://"
        />
        <ToggleControl
          label="Show Wishlist Icon"
          checked={product.showWishlist}
          onChange={(val) => onUpdate('showWishlist', val)}
        />
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

function ProductCard({
  product,
  titleColor,
  priceColor,
  titleSize,
  priceSize,
  onUpdate,
  isEditor,
}) {
  const imageWrap = {
    position: 'relative',
    width: '100%',
    aspectRatio: '3 / 4',
    background: '#f3f3f3',
    overflow: 'hidden',
    marginBottom: '12px',
  };

  const titleStyle = {
    color: titleColor,
    fontSize: `${titleSize}px`,
    lineHeight: '1.45',
    margin: '0 0 8px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const priceStyle = {
    color: priceColor,
    fontSize: `${priceSize}px`,
    fontWeight: '700',
    margin: 0,
  };

  const cardInner = (
    <>
      <div style={imageWrap}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : isEditor ? (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '13px',
          }}>
            Add product image
          </div>
        ) : null}
        <WishlistButton show={product.showWishlist} isEditor={isEditor} />
      </div>

      {isEditor ? (
        <>
          <RichText
            tagName="h3"
            value={product.title}
            onChange={(val) => onUpdate('title', val)}
            placeholder="Product title..."
            style={titleStyle}
          />
          <RichText
            tagName="p"
            value={product.price}
            onChange={(val) => onUpdate('price', val)}
            placeholder="Price..."
            style={priceStyle}
          />
        </>
      ) : (
        <>
          <RichText.Content tagName="h3" value={product.title} style={titleStyle} />
          <RichText.Content tagName="p" value={product.price} style={priceStyle} />
        </>
      )}
    </>
  );

  if (isEditor) {
    return <div>{cardInner}</div>;
  }

  return (
    <a href={product.productUrl} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      {cardInner}
    </a>
  );
}

const navArrowStyle = {
  position: 'absolute',
  top: '42%',
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

registerBlockType('myapp/products-scroller', {
  title: 'Product Scroller',
  description: 'Horizontal product scroller with best sellers and footer CTA',
  category: 'myapp-blocks',
  icon: ProductsScrollerIcon,

  attributes: {
    sectionSubtitle: {
      type: 'string',
      default: 'MOST LOVED BY OUR CUSTOMERS',
    },
    sectionTitle: {
      type: 'string',
      default: 'Best Sellers',
    },
    products: {
      type: 'array',
      default: [
        defaultProduct({
          id: 1,
          title: 'Sea Green Georgette Indo Western with Embroidery',
          price: '₹ 24,220',
        }),
        defaultProduct({
          id: 2,
          title: 'Blush Pink Silk Lehenga with Zari Work',
          price: '₹ 32,500',
        }),
        defaultProduct({
          id: 3,
          title: 'Ivory Cotton Kurta Set with Gold Detailing',
          price: '₹ 18,990',
        }),
        defaultProduct({
          id: 4,
          title: 'Royal Blue Velvet Sherwani Ensemble',
          price: '₹ 45,000',
        }),
      ],
    },
    showArrows: {
      type: 'boolean',
      default: true,
    },
    showFooterButton: {
      type: 'boolean',
      default: true,
    },
    footerButtonText: {
      type: 'string',
      default: 'VIEW ALL BEST SELLERS',
    },
    footerButtonUrl: {
      type: 'string',
      default: '#',
    },
    cardWidth: {
      type: 'number',
      default: 28,
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
      default: '#ffffff',
    },
    sectionSubtitleColor: {
      type: 'string',
      default: '#802040',
    },
    sectionTitleColor: {
      type: 'string',
      default: '#1e1e1e',
    },
    titleColor: {
      type: 'string',
      default: '#1e1e1e',
    },
    priceColor: {
      type: 'string',
      default: '#1e1e1e',
    },
    footerButtonColor: {
      type: 'string',
      default: '#802040',
    },
    subtitleSize: {
      type: 'number',
      default: 12,
    },
    titleSize: {
      type: 'number',
      default: 40,
    },
    productTitleSize: {
      type: 'number',
      default: 14,
    },
    priceSize: {
      type: 'number',
      default: 15,
    },
  },

  edit: ({ attributes, setAttributes }) => {
    const {
      sectionSubtitle, sectionTitle, products: productsAttr,
      showArrows, showFooterButton, footerButtonText, footerButtonUrl,
      cardWidth, gap, sectionPadding,
      backgroundColor, sectionSubtitleColor, sectionTitleColor,
      titleColor, priceColor, footerButtonColor,
      subtitleSize, titleSize, productTitleSize, priceSize,
    } = attributes;

    const products = Array.isArray(productsAttr) && productsAttr.length > 0
      ? productsAttr
      : [defaultProduct({ id: 1 })];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [expandedProductId, setExpandedProductId] = useState(products[0]?.id ?? null);
    const blockProps = useBlockProps({ className: 'myapp-products-scroller-editor' });

    const safeIndex = Math.min(currentIndex, Math.max(products.length - 1, 0));

    function updateProduct(id, field, value) {
      setAttributes({
        products: products.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
      });
    }

    function addProduct() {
      const item = defaultProduct();
      setAttributes({ products: [...products, item] });
      setExpandedProductId(item.id);
      setCurrentIndex(products.length);
    }

    function cloneProduct(id) {
      const index = products.findIndex((p) => p.id === id);
      const source = products[index];
      if (!source) return;
      const clone = defaultProduct({
        imageUrl: source.imageUrl,
        title: source.title ? `${source.title} (Copy)` : 'Product (Copy)',
        price: source.price,
        productUrl: source.productUrl,
        showWishlist: source.showWishlist,
      });
      const next = [...products.slice(0, index + 1), clone, ...products.slice(index + 1)];
      setAttributes({ products: next });
      setExpandedProductId(clone.id);
      setCurrentIndex(index + 1);
    }

    function removeProduct(id) {
      if (products.length <= 1) return;
      const removeIndex = products.findIndex((p) => p.id === id);
      const next = products.filter((p) => p.id !== id);
      setAttributes({ products: next });
      let nextIndex = safeIndex;
      if (removeIndex < safeIndex) nextIndex = safeIndex - 1;
      else if (removeIndex === safeIndex) nextIndex = Math.min(safeIndex, next.length - 1);
      setCurrentIndex(nextIndex);
      if (expandedProductId === id) setExpandedProductId(next[nextIndex]?.id ?? null);
    }

    function goPrev() {
      setCurrentIndex((i) => Math.max(0, i - 1));
    }

    function goNext() {
      setCurrentIndex((i) => Math.min(products.length - 1, i + 1));
    }

    const footerButtonStyle = {
      display: 'inline-block',
      background: 'transparent',
      color: footerButtonColor,
      border: `1.5px solid ${footerButtonColor}`,
      padding: '14px 32px',
      fontSize: '12px',
      fontWeight: '700',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      textDecoration: 'none',
      cursor: 'pointer',
    };

    return (
      <>
        <InspectorControls>

          <PanelColorSettings
            title="Section Background"
            colorSettings={[
              { label: 'Background Color', value: backgroundColor, onChange: (val) => setAttributes({ backgroundColor: val }) },
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

          <PanelBody title={`Products (${products.length})`} initialOpen={true}>
            <Button
              variant="primary"
              icon={plus}
              onClick={addProduct}
              style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }}
            >
              Add Product
            </Button>

            {products.map((product, index) => (
              <ProductFields
                key={product.id}
                product={product}
                index={index}
                isOpen={expandedProductId === product.id}
                onToggle={(nextOpen) => {
                  if (nextOpen) {
                    setExpandedProductId(product.id);
                    setCurrentIndex(index);
                  } else {
                    setExpandedProductId(null);
                  }
                }}
                onUpdate={(field, val) => updateProduct(product.id, field, val)}
                onClone={() => cloneProduct(product.id)}
                onRemove={() => removeProduct(product.id)}
                canRemove={products.length > 1}
              />
            ))}
          </PanelBody>

          <PanelBody title="Footer Button" initialOpen={false}>
            <ToggleControl
              label="Show Footer Button"
              checked={showFooterButton}
              onChange={(val) => setAttributes({ showFooterButton: val })}
            />
            {showFooterButton && (
              <>
                <TextControl
                  label="Button Text"
                  value={footerButtonText}
                  onChange={(val) => setAttributes({ footerButtonText: val })}
                />
                <TextControl
                  label="Button URL"
                  value={footerButtonUrl}
                  onChange={(val) => setAttributes({ footerButtonUrl: val })}
                />
              </>
            )}
          </PanelBody>

          <PanelBody title="Scroller Settings" initialOpen={false}>
            <ToggleControl
              label="Show Arrows"
              checked={showArrows}
              onChange={(val) => setAttributes({ showArrows: val })}
            />
            <RangeControl
              label="Card Width (%)"
              value={cardWidth}
              onChange={(val) => setAttributes({ cardWidth: val })}
              min={22}
              max={45}
              help="Smaller width shows more of the next product"
            />
            <RangeControl
              label="Gap (px)"
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
            title="Colors"
            colorSettings={[
              { label: 'Sub Title Color', value: sectionSubtitleColor, onChange: (val) => setAttributes({ sectionSubtitleColor: val }) },
              { label: 'Section Title Color', value: sectionTitleColor, onChange: (val) => setAttributes({ sectionTitleColor: val }) },
              { label: 'Product Title', value: titleColor, onChange: (val) => setAttributes({ titleColor: val }) },
              { label: 'Price', value: priceColor, onChange: (val) => setAttributes({ priceColor: val }) },
              { label: 'Footer Button', value: footerButtonColor, onChange: (val) => setAttributes({ footerButtonColor: val }) },
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
              label="Product Title Size (px)"
              value={productTitleSize}
              onChange={(val) => setAttributes({ productTitleSize: val })}
              min={12}
              max={18}
            />
            <RangeControl
              label="Price Size (px)"
              value={priceSize}
              onChange={(val) => setAttributes({ priceSize: val })}
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
                  fontWeight: '700',
                  margin: 0,
                  lineHeight: '1.2',
                }}
              />
            </div>

            <div style={{ position: 'relative', overflow: 'hidden', marginBottom: showFooterButton ? '32px' : 0 }}>
              <div
                style={{
                  display: 'flex',
                  gap: `${gap}px`,
                  transform: `translateX(calc(-${safeIndex} * (${cardWidth}% + ${gap}px)))`,
                  transition: 'transform 0.35s ease',
                }}
              >
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    style={{ flex: `0 0 ${cardWidth}%`, minWidth: `${cardWidth}%` }}
                    onClick={() => {
                      setCurrentIndex(index);
                      setExpandedProductId(product.id);
                    }}
                  >
                    <ProductCard
                      product={product}
                      titleColor={titleColor}
                      priceColor={priceColor}
                      titleSize={productTitleSize}
                      priceSize={priceSize}
                      onUpdate={(field, val) => updateProduct(product.id, field, val)}
                      isEditor
                    />
                  </div>
                ))}
              </div>

              {showArrows && products.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous products"
                    onClick={goPrev}
                    disabled={safeIndex === 0}
                    style={{ ...navArrowStyle, left: '4px', opacity: safeIndex === 0 ? 0.4 : 1 }}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    aria-label="Next products"
                    onClick={goNext}
                    disabled={safeIndex >= products.length - 1}
                    style={{
                      ...navArrowStyle,
                      right: '4px',
                      opacity: safeIndex >= products.length - 1 ? 0.4 : 1,
                    }}
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {showFooterButton && (
              <div style={{ textAlign: 'center' }}>
                <RichText
                  tagName="span"
                  value={footerButtonText}
                  onChange={(val) => setAttributes({ footerButtonText: val })}
                  placeholder="Footer button..."
                  style={footerButtonStyle}
                />
              </div>
            )}
          </div>
        </div>
      </>
    );
  },

  save: ({ attributes }) => {
    const {
      sectionSubtitle, sectionTitle, products: productsAttr,
      showArrows, showFooterButton, footerButtonText, footerButtonUrl,
      cardWidth, gap, sectionPadding,
      backgroundColor, sectionSubtitleColor, sectionTitleColor,
      titleColor, priceColor, footerButtonColor,
      subtitleSize, titleSize, productTitleSize, priceSize,
    } = attributes;

    const products = Array.isArray(productsAttr) && productsAttr.length > 0
      ? productsAttr
      : [defaultProduct({ id: 1 })];

    const blockProps = useBlockProps.save({
      className: 'myapp-products-scroller',
      'data-show-arrows': showArrows ? 'true' : 'false',
      'data-card-width': String(cardWidth),
      'data-gap': String(gap),
    });

    const footerButtonStyle = {
      display: 'inline-block',
      background: 'transparent',
      color: footerButtonColor,
      border: `1.5px solid ${footerButtonColor}`,
      padding: '14px 32px',
      fontSize: '12px',
      fontWeight: '700',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      textDecoration: 'none',
    };

    return (
      <div {...blockProps} style={{ backgroundColor, padding: `${sectionPadding}px` }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <RichText.Content
            tagName="p"
            value={sectionSubtitle}
            style={{
              color: sectionSubtitleColor,
              fontSize: `${subtitleSize}px`,
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
              fontWeight: '700',
              margin: 0,
            }}
          />
        </div>

        <div className="myapp-products-scroller__viewport" style={{ position: 'relative', overflow: 'hidden', marginBottom: showFooterButton ? '32px' : 0 }}>
          <div
            className="myapp-products-scroller__track"
            style={{
              display: 'flex',
              gap: `${gap}px`,
              transform: 'translateX(0)',
              transition: 'transform 0.35s ease',
            }}
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="myapp-products-scroller__item"
                data-product-index={index}
                style={{ flex: `0 0 ${cardWidth}%`, minWidth: `${cardWidth}%` }}
              >
                <ProductCard
                  product={product}
                  titleColor={titleColor}
                  priceColor={priceColor}
                  titleSize={productTitleSize}
                  priceSize={priceSize}
                  isEditor={false}
                />
              </div>
            ))}
          </div>

          {showArrows && products.length > 1 && (
            <>
              <button type="button" className="myapp-products-scroller__arrow myapp-products-scroller__arrow--prev" aria-label="Previous products" style={{ ...navArrowStyle, left: '4px' }}>
                ‹
              </button>
              <button type="button" className="myapp-products-scroller__arrow myapp-products-scroller__arrow--next" aria-label="Next products" style={{ ...navArrowStyle, right: '4px' }}>
                ›
              </button>
            </>
          )}
        </div>

        {showFooterButton && (
          <div style={{ textAlign: 'center' }}>
            <a href={footerButtonUrl} style={footerButtonStyle}>
              <RichText.Content value={footerButtonText} />
            </a>
          </div>
        )}
      </div>
    );
  },
});
