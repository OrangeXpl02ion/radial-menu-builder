import { ColorChip } from './ColorChip';
import type { CommandCategory } from '../../types/radial';

interface CategoryHeaderProps {
  cat: CommandCategory;
  expanded: boolean;
  count: number;
  onToggle: () => void;
}

export function CategoryHeader({ cat, expanded, count, onToggle }: CategoryHeaderProps) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderTop: '1px solid #1a1a1a',
        borderBottom: expanded ? `1px solid ${cat.color}33` : '1px solid #1a1a1a',
        background: expanded ? `${cat.color}0a` : 'transparent',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <span style={{
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 9,
        color: cat.color,
        width: 8,
      }}>{expanded ? '▼' : '▶'}</span>
      <ColorChip color={cat.color} size={8} />
      <span style={{
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: '0.14em',
        color: '#e8e8e8',
        flex: 1,
      }}>{cat.label}</span>
      <span style={{
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 9,
        color: '#666666',
        letterSpacing: '0.1em',
      }}>{String(count).padStart(2, '0')}</span>
    </div>
  );
}
