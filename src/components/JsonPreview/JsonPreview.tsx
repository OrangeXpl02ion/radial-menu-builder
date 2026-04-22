import { useState } from 'react';
import type { SlotItem } from '../../types/radial';
import { buildJson } from '../../utils/buildJson';
import { downloadJson } from '../../utils/fileIO';
import { StrokeButton } from '../Toolbar/StrokeButton';
import { JsonLines } from './JsonLines';

interface JsonPreviewProps {
  name: string;
  commandId: string;
  slots: (SlotItem | null)[];
  slotCount: number;
  expanded: boolean;
  onToggle: () => void;
}

export function JsonPreview({ name, commandId, slots, slotCount, expanded, onToggle }: JsonPreviewProps) {
  const [copied, setCopied] = useState(false);
  const json = buildJson(name, commandId, slots, slotCount);
  const jsonStr = JSON.stringify(json, null, 2) + '\n';
  const bytes = new TextEncoder().encode(jsonStr).length;

  function handleCopy() {
    navigator.clipboard.writeText(jsonStr).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  function handleDownload() {
    downloadJson(json, (name || 'menu') + '.radial.json');
  }

  return (
    <div style={{
      borderTop: `1px solid ${expanded ? '#4aeadc' : '#1a1a1a'}`,
      background: '#0a0a0a',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      maxHeight: expanded ? 280 : 36,
      transition: 'max-height 150ms, border-color 150ms',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 14px',
          borderBottom: expanded ? '1px solid #1a1a1a' : 'none',
          background: '#0c0c0c',
          cursor: 'pointer',
          userSelect: 'none',
          flexShrink: 0,
          height: 36,
        }}
      >
        <span style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 9,
          color: '#4aeadc',
          letterSpacing: '0.14em',
        }}>{expanded ? '▼' : '▶'}</span>
        <span style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 10,
          fontWeight: 600,
          color: '#e8e8e8',
          letterSpacing: '0.22em',
        }}>OUTPUT.RADIAL.JSON</span>
        <span style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 9,
          color: '#666666',
          letterSpacing: '0.14em',
        }}>{bytes} B · {json.items.length} ITEMS</span>
        <div style={{ flex: 1 }} />
        {expanded && (
          <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: 6 }}>
            <StrokeButton
              label={copied ? 'COPIED' : 'COPY'}
              primary={copied}
              onClick={handleCopy}
            />
            <StrokeButton label="DOWNLOAD" onClick={handleDownload} />
          </div>
        )}
      </div>

      {/* Body */}
      {expanded && (
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 0',
          minHeight: 0,
        }}>
          <JsonLines json={json} />
        </div>
      )}
    </div>
  );
}
