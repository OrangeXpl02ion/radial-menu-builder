import { useState } from 'react';

interface StrokeButtonProps {
  label: string;
  onClick?: () => void;
  color?: string;
  primary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

export function StrokeButton({ label, onClick, primary = false, danger = false, disabled = false }: StrokeButtonProps) {
  const [hover, setHover] = useState(false);
  const c = danger ? '#ff5a5a' : primary ? '#4aeadc' : '#e8e8e8';
  const active = hover && !disabled;

  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        border: `1px solid ${active ? c : '#333333'}`,
        background: active ? `${c}14` : 'transparent',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 10,
        letterSpacing: '0.16em',
        color: active ? c : disabled ? '#555' : '#cccccc',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        transition: 'all 100ms',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span style={{ color: active ? c : '#555555' }}>[</span>
      <span>{label}</span>
      <span style={{ color: active ? c : '#555555' }}>]</span>
    </div>
  );
}
