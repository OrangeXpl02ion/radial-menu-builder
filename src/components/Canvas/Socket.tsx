import type { SlotItem, CommandDef } from '../../types/radial';
import { COMMAND_COLOR_MAP } from '../../data/commands';

interface SocketProps {
  x: number;
  y: number;
  index: number;
  item: SlotItem | null;
  selected: boolean;
  onSelect: () => void;
  slotIndex: number;
  onSwap: (a: number, b: number) => void;
  onDrop: (cmd: CommandDef, index: number) => void;
  onDelete: (i: number) => void;
  size?: number;
}

export function Socket({
  x, y, index, item, selected, onSelect,
  slotIndex, onSwap, onDrop, onDelete,
  size = 56,
}: SocketProps) {
  const half = size / 2;
  const color = item ? (COMMAND_COLOR_MAP[item.command] || '#4aeadc') : null;
  const empty = !item;
  const isNested = item?.isNestedMenu;
  const glyph = item ? (item.label || '??').slice(0, 2).toUpperCase() : '';

  function handleDragStart(e: React.DragEvent) {
    if (!item) { e.preventDefault(); return; }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/x-socket-index', String(slotIndex));
    e.dataTransfer.setData('application/x-command', JSON.stringify({
      command: item.command, icon: item.icon, label: item.label, isNestedMenu: item.isNestedMenu,
    }));
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const fromSocketStr = e.dataTransfer.getData('application/x-socket-index');
    const cmdStr = e.dataTransfer.getData('application/x-command');
    if (fromSocketStr !== '') {
      const fromIdx = parseInt(fromSocketStr, 10);
      if (fromIdx !== slotIndex) onSwap(fromIdx, slotIndex);
    } else if (cmdStr) {
      try {
        const cmd: CommandDef = JSON.parse(cmdStr);
        onDrop(cmd, slotIndex);
      } catch { /* ignore */ }
    }
  }

  const dragProps = !empty
    ? { draggable: true, onDragStart: handleDragStart }
    : {};
  const dropProps = { onDragOver: handleDragOver, onDrop: handleDrop };

  return (
    <g
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      style={{ cursor: 'pointer' }}
      {...(dragProps as React.SVGProps<SVGGElement>)}
      {...(dropProps as React.SVGProps<SVGGElement>)}
    >
      {/* Selection ring */}
      {selected && (
        <rect
          x={x - half - 6} y={y - half - 6}
          width={size + 12} height={size + 12}
          fill="none" stroke="#4aeadc" strokeWidth="1"
          strokeDasharray="3 3"
        />
      )}

      {/* Socket body */}
      <rect
        x={x - half} y={y - half}
        width={size} height={size}
        fill={empty ? 'transparent' : `${color}14`}
        stroke={empty ? '#2f2f2f' : color!}
        strokeWidth={empty ? 1 : 1.25}
        strokeDasharray={empty ? '4 3' : '0'}
      />

      {/* Corner L-ticks for filled sockets */}
      {!empty && color && (
        <g stroke={color} strokeWidth="1" fill="none">
          <path d={`M ${x-half} ${y-half+4} L ${x-half} ${y-half} L ${x-half+4} ${y-half}`} />
          <path d={`M ${x+half-4} ${y-half} L ${x+half} ${y-half} L ${x+half} ${y-half+4}`} />
          <path d={`M ${x+half} ${y+half-4} L ${x+half} ${y+half} L ${x+half-4} ${y+half}`} />
          <path d={`M ${x-half+4} ${y+half} L ${x-half} ${y+half} L ${x-half} ${y+half-4}`} />
        </g>
      )}

      {/* Glyph */}
      {!empty && (
        <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central"
          fill={color!}
          fontFamily='"JetBrains Mono", ui-monospace, monospace'
          fontSize="14" fontWeight="600"
          letterSpacing="0.05em"
          style={{ userSelect: 'none', pointerEvents: 'none' }}>
          {glyph}
        </text>
      )}

      {/* Nested badge */}
      {isNested && color && (
        <g>
          <rect x={x + half - 10} y={y - half - 2} width={12} height={8}
            fill="#0a0a0a" stroke={color} strokeWidth="0.75" />
          <text x={x + half - 4} y={y - half + 2.5}
            textAnchor="middle" dominantBaseline="central"
            fill={color} fontSize="6"
            fontFamily='"JetBrains Mono", monospace'
            style={{ userSelect: 'none', pointerEvents: 'none' }}>
            ↳
          </text>
        </g>
      )}

      {/* Slot index number */}
      <text
        x={x} y={y - half - 14}
        textAnchor="middle"
        fill={empty ? '#444444' : '#666666'}
        fontFamily='"JetBrains Mono", monospace'
        fontSize="9" letterSpacing="0.1em"
        style={{ userSelect: 'none', pointerEvents: 'none' }}>
        {String(index).padStart(2, '0')}
      </text>

      {/* Empty-state plus */}
      {empty && (
        <g stroke="#3a3a3a" strokeWidth="1" style={{ pointerEvents: 'none' }}>
          <line x1={x - 5} y1={y} x2={x + 5} y2={y} />
          <line x1={x} y1={y - 5} x2={x} y2={y + 5} />
        </g>
      )}

      {/* Invisible larger drag target on empty sockets */}
      {empty && (
        <rect
          x={x - half} y={y - half}
          width={size} height={size}
          fill="transparent" stroke="none"
        />
      )}
    </g>
  );
}
