import { useRef, useState, useEffect } from 'react';
import type { SlotItem, CommandDef } from '../../types/radial';
import { COMMAND_COLOR_MAP } from '../../data/commands';
import { Socket } from './Socket';
import { SocketPopup } from './SocketPopup';
import { TrashZone } from './TrashZone';

const SIZE = 560;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RING_RADIUS = 190;
const INNER_RADIUS = 150;
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const SANS = '"Barlow Condensed", sans-serif';

interface RadialCanvasProps {
  slots: (SlotItem | null)[];
  slotCount: number;
  selectedIndex: number | null;
  onSelectSlot: (i: number) => void;
  onDeleteSlot: (i: number) => void;
  onSwapSlots: (a: number, b: number) => void;
  onDropCommand: (cmd: CommandDef, index: number) => void;
  menuName: string;
  commandId: string;
  onWheel: (delta: number) => void;
}

function getPositions(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return { x: CX + Math.cos(angle) * RING_RADIUS, y: CY + Math.sin(angle) * RING_RADIUS };
  });
}

export function RadialCanvas({
  slots, slotCount, selectedIndex, onSelectSlot, onDeleteSlot,
  onSwapSlots, onDropCommand, menuName, commandId, onWheel,
}: RadialCanvasProps) {
  const positions = getPositions(slotCount);
  const filledCount = slots.slice(0, slotCount).filter(Boolean).length;

  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(SIZE);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      // Popup bleeds beyond the SVG viewBox: 70 SVG units top/bottom, 160 left/right.
      // Scale canvasSize so the popup always fits inside the container.
      const BLEED_V = 78;  // 70 + 8px breathing room
      const BLEED_H = 168; // 160 + 8px breathing room
      const maxH = Math.floor(height * SIZE / (SIZE + 2 * BLEED_V));
      const maxW = Math.floor(width  * SIZE / (SIZE + 2 * BLEED_H));
      setCanvasSize(Math.min(maxH, maxW, SIZE));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    onWheel(e.deltaY > 0 ? -1 : 1);
  }

  function handleCanvasDrop(e: React.DragEvent) {
    e.preventDefault();
    const cmdStr = e.dataTransfer.getData('application/x-command');
    const socketStr = e.dataTransfer.getData('application/x-socket-index');
    if (socketStr !== '') return; // socket-to-socket handled by Socket component
    if (!cmdStr) return;
    try {
      const cmd: CommandDef = JSON.parse(cmdStr);
      // Find nearest socket to drop position
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      // Account for centered SVG wrapper within the container
      const offsetX = (rect.width - canvasSize) / 2;
      const offsetY = (rect.height - canvasSize) / 2;
      const scale = SIZE / canvasSize;
      const sx = (px - offsetX) * scale;
      const sy = (py - offsetY) * scale;
      let nearest = 0;
      let minDist = Infinity;
      positions.forEach((pos, i) => {
        const d = Math.hypot(pos.x - sx, pos.y - sy);
        if (d < minDist) { minDist = d; nearest = i; }
      });
      onDropCommand(cmd, nearest);
    } catch { /* ignore */ }
  }

  function handleCanvasDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  const selectedItem = selectedIndex !== null ? slots[selectedIndex] : null;

  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        background: '#0a0a0a',
        overflow: 'hidden',
        minHeight: 0,
      }}
      onWheel={handleWheel}
      onClick={() => onSelectSlot(-1)}
      onDrop={handleCanvasDrop}
      onDragOver={handleCanvasDragOver}
    >
      {/* Grid backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(#141414 1px, transparent 1px),
          linear-gradient(90deg, #141414 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
        opacity: 0.6,
        pointerEvents: 'none',
      }} />

      {/* HUD: Top-left */}
      <div style={{
        position: 'absolute', top: 16, left: 16, zIndex: 2,
        fontFamily: MONO, fontSize: 10, color: '#666666', letterSpacing: '0.12em',
        pointerEvents: 'none',
      }}>
        <div style={{ color: '#888888' }}>CANVAS</div>
        <div style={{ marginTop: 4, color: '#4aeadc' }}>● LIVE</div>
      </div>

      {/* HUD: Top-right */}
      <div style={{
        position: 'absolute', top: 16, right: 16, zIndex: 2,
        fontFamily: MONO, fontSize: 10, color: '#666666', letterSpacing: '0.12em',
        textAlign: 'right',
        pointerEvents: 'none',
      }}>
        <div>SLOTS <span style={{ color: '#e8e8e8' }}>{String(filledCount).padStart(2, '0')}/{String(slotCount).padStart(2, '0')}</span></div>
        <div style={{ marginTop: 4 }}>RADIUS <span style={{ color: '#e8e8e8' }}>{RING_RADIUS}</span></div>
      </div>

      {/* HUD: Bottom-left */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16, zIndex: 2,
        fontFamily: MONO, fontSize: 9, color: '#555555', letterSpacing: '0.14em', lineHeight: 1.6,
        pointerEvents: 'none',
      }}>
        <div>X · Y · θ</div>
        <div>θ = 360° / {slotCount}</div>
        <div>= {(360 / slotCount).toFixed(1)}°</div>
      </div>

      {/* HUD: Bottom-right */}
      <div style={{
        position: 'absolute', bottom: 16, right: 16, zIndex: 2,
        fontFamily: MONO, fontSize: 9, color: '#555555', letterSpacing: '0.14em',
        textAlign: 'right', lineHeight: 1.6,
        pointerEvents: 'none',
      }}>
        <div>SCROLL ▲▼ TO ADJUST COUNT</div>
        <div>CLICK SOCKET TO SELECT</div>
        <div>DRAG TO CENTER TO DELETE</div>
      </div>

      {/* SVG */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div style={{ position: 'relative', width: canvasSize, height: canvasSize, flexShrink: 0 }}>
        <svg
          width={canvasSize} height={canvasSize}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ overflow: 'visible', display: 'block' }}
        >
          {/* Outer bounding frame */}
          <rect x="40" y="40" width={SIZE - 80} height={SIZE - 80}
            fill="none" stroke="#1a1a1a" strokeWidth="1" />

          {/* Corner markers */}
          {([[40,40],[SIZE-40,40],[40,SIZE-40],[SIZE-40,SIZE-40]] as [number,number][]).map(([cx, cy], i) => (
            <g key={i} stroke="#2a2a2a" strokeWidth="1">
              <line x1={cx-6} y1={cy} x2={cx+6} y2={cy} />
              <line x1={cx} y1={cy-6} x2={cx} y2={cy+6} />
            </g>
          ))}

          {/* Dimension callout top */}
          <g fontFamily={MONO} fontSize="8" fill="#555555" letterSpacing="0.1em">
            <line x1="40" y1="24" x2={SIZE-40} y2="24" stroke="#2a2a2a" strokeWidth="0.5" strokeDasharray="2 2" />
            <line x1="40" y1="18" x2="40" y2="30" stroke="#2a2a2a" strokeWidth="0.5" />
            <line x1={SIZE-40} y1="18" x2={SIZE-40} y2="30" stroke="#2a2a2a" strokeWidth="0.5" />
            <rect x={SIZE/2 - 22} y="18" width="44" height="12" fill="#0a0a0a" />
            <text x={SIZE/2} y="27" textAnchor="middle">480 PX</text>
          </g>

          {/* Dashed outer ring */}
          <circle cx={CX} cy={CY} r={RING_RADIUS}
            fill="none" stroke="#252525" strokeWidth="1" strokeDasharray="2 4" />

          {/* Solid inner ring */}
          <circle cx={CX} cy={CY} r={INNER_RADIUS}
            fill="none" stroke="#161616" strokeWidth="1" />

          {/* Angular guides */}
          {Array.from({ length: slotCount }, (_, i) => {
            const angle = (i / slotCount) * Math.PI * 2 - Math.PI / 2;
            return (
              <line key={i}
                x1={CX} y1={CY}
                x2={CX + Math.cos(angle) * INNER_RADIUS}
                y2={CY + Math.sin(angle) * INNER_RADIUS}
                stroke="#1d1d1d" strokeWidth="1" strokeDasharray="2 4"
              />
            );
          })}

          {/* Tick marks on ring */}
          {Array.from({ length: slotCount }, (_, i) => {
            const angle = (i / slotCount) * Math.PI * 2 - Math.PI / 2;
            const x1 = CX + Math.cos(angle) * (RING_RADIUS - 6);
            const y1 = CY + Math.sin(angle) * (RING_RADIUS - 6);
            const x2 = CX + Math.cos(angle) * (RING_RADIUS + 6);
            const y2 = CY + Math.sin(angle) * (RING_RADIUS + 6);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2a2a2a" strokeWidth="1" />;
          })}

          {/* Center trash zone */}
          <TrashZone cx={CX} cy={CY} onDelete={onDeleteSlot} />

          {/* Center menu label */}
          <text x={CX} y={CY - 54}
            textAnchor="middle" fontFamily={MONO}
            fontSize="8" fill="#555555" letterSpacing="0.2em"
            style={{ pointerEvents: 'none' }}>
            MENU / {commandId}
          </text>
          <text x={CX} y={CY - 40}
            textAnchor="middle" fontFamily={SANS}
            fontWeight="600" fontSize="16" fill="#e8e8e8" letterSpacing="0.08em"
            style={{ pointerEvents: 'none' }}>
            {menuName.toUpperCase()}
          </text>

          {/* Connector line for selected filled socket */}
          {selectedIndex !== null && slots[selectedIndex] && (() => {
            const p = positions[selectedIndex];
            const item = slots[selectedIndex] as SlotItem;
            const color = COMMAND_COLOR_MAP[item.command] || '#4aeadc';
            const angle = (selectedIndex / slotCount) * Math.PI * 2 - Math.PI / 2;
            const lx = CX + Math.cos(angle) * (RING_RADIUS + 30);
            const ly = CY + Math.sin(angle) * (RING_RADIUS + 30);
            return (
              <line x1={p.x} y1={p.y} x2={lx} y2={ly}
                stroke={color} strokeWidth="0.75" strokeDasharray="2 2" />
            );
          })()}

          {/* Sockets */}
          {positions.map((p, i) => (
            <Socket
              key={i}
              x={p.x} y={p.y}
              index={i + 1}
              item={slots[i] ?? null}
              selected={selectedIndex === i}
              onSelect={() => onSelectSlot(i)}
              slotIndex={i}
              onSwap={onSwapSlots}
              onDrop={onDropCommand}
              onDelete={onDeleteSlot}
            />
          ))}
        </svg>

        {/* HTML popup overlay — positioned inside the scaled square wrapper */}
        {selectedIndex !== null && selectedItem && (
          <SocketPopup
            item={selectedItem}
            slotIndex={selectedIndex}
            slotCount={slotCount}
            svgSize={SIZE}
            renderedSize={canvasSize}
            ringRadius={RING_RADIUS}
            onDelete={onDeleteSlot}
            onClose={() => onSelectSlot(selectedIndex)}
          />
        )}
        </div>
      </div>
    </div>
  );
}
