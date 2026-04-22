import { COMMAND_COLOR_MAP } from '../../data/commands';
import type { SlotItem } from '../../types/radial';

interface SocketPopupProps {
  item: SlotItem;
  slotIndex: number;
  slotCount: number;
  svgSize: number;
  ringRadius: number;
  onDelete: (i: number) => void;
  onClose: () => void;
}

const MONO = '"JetBrains Mono", ui-monospace, monospace';
const SANS = '"Barlow Condensed", sans-serif';
const POP_W = 200;
const POP_H = 110;

export function SocketPopup({
  item, slotIndex, slotCount, svgSize, ringRadius, onDelete, onClose,
}: SocketPopupProps) {
  const color = COMMAND_COLOR_MAP[item.command] || '#4aeadc';
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const angle = (slotIndex / slotCount) * Math.PI * 2 - Math.PI / 2;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  const ax = cx + cosA * (ringRadius + 46);
  const ay = cy + sinA * (ringRadius + 46);

  let left: number;
  let top: number;

  if (Math.abs(cosA) < 0.2) {
    left = ax - POP_W / 2;
  } else if (cosA > 0) {
    left = ax + 4;
  } else {
    left = ax - POP_W - 4;
  }

  if (Math.abs(sinA) < 0.2) {
    top = ay - POP_H / 2;
  } else if (sinA > 0) {
    top = ay + 4;
  } else {
    top = ay - POP_H - 4;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(50% - ${svgSize / 2}px + ${left}px)`,
        top: `calc(50% - ${svgSize / 2}px + ${top}px)`,
        width: POP_W,
        background: '#0a0a0a',
        border: `1px solid ${color}`,
        boxShadow: `0 0 0 3px #0a0a0a, 0 0 24px ${color}22`,
        zIndex: 5,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 8px',
        borderBottom: `1px solid ${color}44`,
        background: `${color}0a`,
      }}>
        <div style={{ width: 6, height: 6, background: color, flexShrink: 0 }} />
        <span style={{
          fontFamily: MONO,
          fontSize: 8,
          color,
          letterSpacing: '0.2em',
          fontWeight: 600,
        }}>SLOT {String(slotIndex + 1).padStart(2, '0')}</span>
        <div style={{ flex: 1 }} />
        <span
          onClick={onClose}
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: '#888888',
            cursor: 'pointer',
            lineHeight: 1,
          }}>×</span>
      </div>

      {/* Body */}
      <div style={{ padding: '7px 8px 8px' }}>
        <div style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 14,
          color,
          letterSpacing: '0.06em',
          lineHeight: 1.15,
          wordBreak: 'break-word',
          textTransform: 'uppercase',
        }}>
          {item.label}
        </div>
        <div style={{
          fontFamily: MONO,
          fontSize: 9,
          color: '#888888',
          marginTop: 3,
          wordBreak: 'break-all',
          lineHeight: 1.3,
        }}>
          {item.command}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', borderTop: '1px solid #1a1a1a' }}>
        <div
          onClick={() => onDelete(slotIndex)}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#ff5a5a18')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          style={{
            flex: 1,
            padding: '6px 8px',
            fontFamily: MONO,
            fontSize: 9,
            color: '#ff5a5a',
            letterSpacing: '0.18em',
            textAlign: 'center',
            cursor: 'pointer',
            borderRight: '1px solid #1a1a1a',
            userSelect: 'none',
            transition: 'background 100ms',
          }}
        >
          [ − SUBTRACT ]
        </div>
        <div
          onClick={onClose}
          style={{
            padding: '6px 10px',
            fontFamily: MONO,
            fontSize: 9,
            color: '#888888',
            letterSpacing: '0.18em',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          CLOSE
        </div>
      </div>
    </div>
  );
}
