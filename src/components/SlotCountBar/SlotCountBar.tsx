import type { SlotItem } from '../../types/radial';
import { COMMAND_COLOR_MAP } from '../../data/commands';

interface SlotCountBarProps {
  slots: (SlotItem | null)[];
  slotCount: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

const MONO = '"JetBrains Mono", ui-monospace, monospace';

export function SlotCountBar({ slots, slotCount, onDecrement, onIncrement }: SlotCountBarProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 16px',
      borderTop: '1px solid #1a1a1a',
      background: '#0c0c0c',
      flexShrink: 0,
      height: 40,
    }}>
      <span style={{
        fontFamily: MONO, fontSize: 9, color: '#666666', letterSpacing: '0.2em',
      }}>SLOT COUNT</span>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'stretch', border: '1px solid #2a2a2a' }}>
        <div
          onClick={onDecrement}
          style={{
            padding: '4px 12px',
            cursor: 'pointer',
            fontFamily: MONO, fontSize: 12, color: '#cccccc',
            borderRight: '1px solid #2a2a2a',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >−</div>
        <div style={{
          padding: '4px 16px',
          fontFamily: MONO, fontSize: 12, color: '#4aeadc',
          letterSpacing: '0.1em',
          minWidth: 32, textAlign: 'center',
          lineHeight: 1,
        }}>{String(slotCount).padStart(2, '0')}</div>
        <div
          onClick={onIncrement}
          style={{
            padding: '4px 12px',
            cursor: 'pointer',
            fontFamily: MONO, fontSize: 12, color: '#cccccc',
            borderLeft: '1px solid #2a2a2a',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >+</div>
      </div>

      {/* Progress strip */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: 3,
        height: 6,
        alignItems: 'center',
        padding: '0 8px',
      }}>
        {Array.from({ length: slotCount }, (_, i) => {
          const item = slots[i];
          const color = item ? (COMMAND_COLOR_MAP[item.command] || '#b97dff') : null;
          return (
            <div key={i} style={{
              flex: 1,
              height: 6,
              background: item ? color! : 'transparent',
              border: `1px solid ${item ? color! : '#2a2a2a'}`,
            }} />
          );
        })}
      </div>

      <span style={{
        fontFamily: MONO, fontSize: 9, color: '#666666', letterSpacing: '0.2em',
      }}>
        θ {(360 / slotCount).toFixed(1)}°
      </span>
    </div>
  );
}
