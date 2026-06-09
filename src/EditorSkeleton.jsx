import React from 'react';

/**
 * Lightweight, self-contained loading placeholder shaped like the editor
 * (top toolbar + canvas + right sidebar). Uses inline styles and its own
 * keyframes so it renders correctly even before `gutenberg-block-kit/styles`
 * has loaded, and is safe to server-render.
 */

const SHIMMER = `
@keyframes gbk-skeleton-shimmer {
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
}`;

const shimmerStyle = {
  background:
    'linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.08) 37%, rgba(0,0,0,0.04) 63%)',
  backgroundSize: '936px 100%',
  animation: 'gbk-skeleton-shimmer 1.4s ease-in-out infinite',
  borderRadius: 4,
};

export function EditorSkeleton({ label = 'Loading editor…' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 480,
        width: '100%',
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 6,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <style>{SHIMMER}</style>

      {/* Top toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          height: 60,
          padding: '0 16px',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          flexShrink: 0,
        }}
      >
        <div style={{ ...shimmerStyle, width: 32, height: 32, borderRadius: 6 }} />
        <div style={{ ...shimmerStyle, width: 32, height: 32, borderRadius: 6 }} />
        <div style={{ flex: 1 }} />
        <div style={{ ...shimmerStyle, width: 120, height: 28, borderRadius: 6 }} />
        <div style={{ ...shimmerStyle, width: 88, height: 32, borderRadius: 16 }} />
      </div>

      {/* Body: canvas + sidebar */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, padding: '40px clamp(16px, 8%, 120px)' }}>
          <div style={{ ...shimmerStyle, width: '55%', height: 36, marginBottom: 24 }} />
          <div style={{ ...shimmerStyle, width: '100%', height: 14, marginBottom: 12 }} />
          <div style={{ ...shimmerStyle, width: '92%', height: 14, marginBottom: 12 }} />
          <div style={{ ...shimmerStyle, width: '96%', height: 14, marginBottom: 32 }} />
          <div style={{ ...shimmerStyle, width: '100%', height: 180, marginBottom: 32, borderRadius: 8 }} />
          <div style={{ ...shimmerStyle, width: '85%', height: 14, marginBottom: 12 }} />
          <div style={{ ...shimmerStyle, width: '70%', height: 14 }} />
        </div>

        <div
          style={{
            width: 280,
            borderLeft: '1px solid rgba(0,0,0,0.08)',
            padding: 20,
            flexShrink: 0,
          }}
        >
          <div style={{ ...shimmerStyle, width: '60%', height: 16, marginBottom: 20 }} />
          <div style={{ ...shimmerStyle, width: '100%', height: 38, marginBottom: 14, borderRadius: 6 }} />
          <div style={{ ...shimmerStyle, width: '100%', height: 38, marginBottom: 14, borderRadius: 6 }} />
          <div style={{ ...shimmerStyle, width: '100%', height: 38, borderRadius: 6 }} />
        </div>
      </div>
    </div>
  );
}

export default EditorSkeleton;
