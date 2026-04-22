import { useState } from 'react';
import { COMMAND_CATEGORIES } from '../../data/commands';
import type { CommandDef } from '../../types/radial';
import { CategoryHeader } from './CategoryHeader';
import { CommandRow } from './CommandRow';

interface CommandLibraryProps {
  onAssign: (cmd: CommandDef) => void;
  assignedCommands: Set<string>;
}

const TOTAL = COMMAND_CATEGORIES.reduce((s, c) => s + c.commands.length, 0);

export function CommandLibrary({ onAssign, assignedCommands }: CommandLibraryProps) {
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1100);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const e: Record<string, boolean> = {};
    COMMAND_CATEGORIES.forEach((c, i) => { e[c.id] = i < 3; });
    return e;
  });

  const q = query.trim().toLowerCase();

  const filteredCats = COMMAND_CATEGORIES.map((cat) => ({
    ...cat,
    commands: q
      ? cat.commands.filter((c) =>
          c.label.toLowerCase().includes(q) || c.command.toLowerCase().includes(q))
      : cat.commands,
  })).filter((cat) => !q || cat.commands.length > 0);

  const totalMatches = filteredCats.reduce((s, c) => s + c.commands.length, 0);

  function toggleExpanded(id: string) {
    setExpanded((e) => ({ ...e, [id]: !e[id] }));
  }

  if (collapsed) {
    return (
      <div style={{
        width: 36,
        flexShrink: 0,
        background: '#0c0c0c',
        borderRight: '1px solid #1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 10,
        gap: 8,
      }}>
        <div
          onClick={() => setCollapsed(false)}
          title="Show command library"
          style={{
            width: 20, height: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 10, color: '#666666',
            border: '1px solid #2a2a2a',
            userSelect: 'none',
          }}
        >▶</div>
        <div style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 8, color: '#444444',
          letterSpacing: '0.1em',
          writingMode: 'vertical-rl',
          marginTop: 4,
        }}>LIBRARY</div>
      </div>
    );
  }

  return (
    <div style={{
      width: 320,
      flexShrink: 0,
      background: '#0c0c0c',
      borderRight: '1px solid #1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 12px',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 10,
          fontWeight: 600,
          color: '#e8e8e8',
          letterSpacing: '0.18em',
        }}>LIBRARY</span>
        <span style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 9,
          color: '#555555',
          letterSpacing: '0.14em',
        }}>/ COMMANDS</span>
        <div style={{ flex: 1 }} />
        <span style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 9,
          color: '#666666',
          letterSpacing: '0.1em',
          padding: '1px 6px',
          border: '1px solid #2a2a2a',
        }}>{q ? `${totalMatches}/` : ''}{TOTAL}</span>
        <div
          onClick={() => setCollapsed(true)}
          title="Hide command library"
          style={{
            width: 20, height: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 10, color: '#555555',
            border: '1px solid #2a2a2a',
            userSelect: 'none',
            marginLeft: 4,
          }}
        >◀</div>
      </div>

      {/* Search */}
      <div style={{ padding: 10, borderBottom: '1px solid #1a1a1a', flexShrink: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          border: `1px solid ${query ? '#4aeadc' : '#2a2a2a'}`,
          background: '#0a0a0a',
          padding: '6px 10px',
          transition: 'border-color 100ms',
        }}>
          <span style={{
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 10,
            color: '#666666',
            letterSpacing: '0.14em',
          }}>[?]</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH COMMANDS..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 0,
              outline: 'none',
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 11,
              color: '#e8e8e8',
              letterSpacing: '0.06em',
            }}
          />
          {query && (
            <span
              onClick={() => setQuery('')}
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                color: '#888888',
                cursor: 'pointer',
              }}>×</span>
          )}
        </div>
      </div>

      {/* Category list */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {filteredCats.map((cat) => {
          const isExpanded = q ? true : expanded[cat.id];
          return (
            <div key={cat.id}>
              <CategoryHeader
                cat={cat}
                expanded={isExpanded}
                count={cat.commands.length}
                onToggle={() => toggleExpanded(cat.id)}
              />
              {isExpanded && (
                <div style={{ paddingTop: 4, paddingBottom: 4 }}>
                  {cat.commands.map((cmd) => (
                    <CommandRow
                      key={cmd.command}
                      cmd={cmd}
                      color={cat.color}
                      isHighlighted={assignedCommands.has(cmd.command)}
                      onAssign={() => onAssign(cmd)}
                    />
                  ))}
                  {cat.commands.length === 0 && (
                    <div style={{
                      padding: '8px 26px',
                      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                      fontSize: 10,
                      color: '#444444',
                    }}>— NO MATCHES —</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid #1a1a1a',
        background: '#0a0a0a',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 9,
        color: '#555555',
        letterSpacing: '0.12em',
        display: 'flex',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span>CLICK ▸ ASSIGN</span>
        <span>DRAG ▸ SOCKET</span>
      </div>
    </div>
  );
}
