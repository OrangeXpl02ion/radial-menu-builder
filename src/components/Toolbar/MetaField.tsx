import { useState } from 'react';

interface MetaFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
  warning?: boolean;
  width?: number;
}

export function MetaField({ label, value, onChange, mono = false, warning = false, width = 160 }: MetaFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 8,
        color: '#666666',
        letterSpacing: '0.22em',
      }}>{label}</span>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${warning ? '#ff8a3d' : focused ? '#4aeadc' : '#2a2a2a'}`,
        background: '#0a0a0a',
        padding: '4px 8px',
        width,
        transition: 'border-color 100ms',
      }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 0,
            outline: 'none',
            fontFamily: mono
              ? '"JetBrains Mono", ui-monospace, monospace'
              : '"Barlow Condensed", sans-serif',
            fontSize: mono ? 11 : 13,
            fontWeight: mono ? 400 : 500,
            color: '#e8e8e8',
            letterSpacing: mono ? '0.04em' : '0.03em',
          }}
        />
        {warning && (
          <span style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9,
            color: '#ff8a3d',
            letterSpacing: '0.1em',
          }}>⚠</span>
        )}
      </div>
    </div>
  );
}
