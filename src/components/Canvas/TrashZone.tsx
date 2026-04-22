import { useState } from 'react';
import type { CommandDef } from '../../types/radial';

interface TrashZoneProps {
  cx: number;
  cy: number;
  onDelete: (index: number) => void;
}

export function TrashZone({ cx, cy, onDelete }: TrashZoneProps) {
  const [over, setOver] = useState(false);
  const strokeColor = over ? '#ff5a5a' : '#2a2a2a';

  function handleDragOver(e: React.DragEvent) {
    const hasSocket = e.dataTransfer.types.includes('application/x-socket-index');
    if (hasSocket) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setOver(true);
    }
  }

  function handleDragLeave() {
    setOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOver(false);
    const fromSocketStr = e.dataTransfer.getData('application/x-socket-index');
    if (fromSocketStr !== '') {
      onDelete(parseInt(fromSocketStr, 10));
    }
  }

  return (
    <g
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Larger invisible hit area */}
      <circle cx={cx} cy={cy} r={50} fill="transparent" stroke="none" />

      <circle cx={cx} cy={cy} r={34}
        fill="#0a0a0a"
        stroke={strokeColor}
        strokeWidth={over ? 1.5 : 1}
        strokeDasharray={over ? '0' : '3 3'}
        style={{ transition: 'stroke 150ms' }}
      />
      {/* Crosshair */}
      <g stroke={over ? '#ff5a5a44' : '#333333'} strokeWidth="1">
        <line x1={cx - 10} y1={cy} x2={cx + 10} y2={cy} />
        <line x1={cx} y1={cy - 10} x2={cx} y2={cy + 10} />
      </g>
      <text x={cx} y={cy + 52}
        textAnchor="middle"
        fontFamily='"JetBrains Mono", monospace'
        fontSize="8" fill={over ? '#ff5a5a' : '#444444'}
        letterSpacing="0.2em"
        style={{ userSelect: 'none', pointerEvents: 'none', transition: 'fill 150ms' }}>
        TRASH · 0,0
      </text>
    </g>
  );
}

// Suppress unused import warning — CommandDef referenced in parent
export type { CommandDef };
