import { useState } from 'react';
import type { CommandDef } from '../../types/radial';

interface CommandRowProps {
  cmd: CommandDef;
  color: string;
  onAssign: () => void;
  isHighlighted: boolean;
}

export function CommandRow({ cmd, color, onAssign, isHighlighted }: CommandRowProps) {
  const [hover, setHover] = useState(false);
  const active = hover || isHighlighted;
  const glyph = cmd.isNestedMenu ? '↳' : (cmd.label || '??').slice(0, 2).toUpperCase();

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/x-command', JSON.stringify(cmd));
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onAssign}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '6px 12px 6px 26px',
        cursor: 'grab',
        borderLeft: active ? `2px solid ${color}` : '2px solid transparent',
        background: active ? `${color}12` : 'transparent',
        transition: 'background 100ms',
      }}
    >
      <div style={{
        width: 20,
        height: 20,
        flexShrink: 0,
        border: `1px solid ${active ? color : '#333333'}`,
        background: active ? `${color}18` : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 9,
        fontWeight: 600,
        color: active ? color : '#666666',
        letterSpacing: '0.05em',
      }}>
        {glyph}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: 13,
          fontWeight: 500,
          color: '#e8e8e8',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>{cmd.label}</div>
        <div style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 9,
          color: '#666666',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>{cmd.command}</div>
      </div>
      <div style={{
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 11,
        color: active ? color : '#333333',
        width: 12,
        textAlign: 'center',
      }}>
        {active ? '+' : ''}
      </div>
    </div>
  );
}
