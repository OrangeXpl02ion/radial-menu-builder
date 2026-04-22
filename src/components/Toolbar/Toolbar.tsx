import { StrokeButton } from './StrokeButton';
import { MetaField } from './MetaField';

interface ToolbarProps {
  menuName: string;
  onMenuNameChange: (v: string) => void;
  commandId: string;
  onCommandIdChange: (v: string) => void;
  onNew: () => void;
  onLoad: () => void;
  onLoadFolder: () => void;
  onExport: () => void;
  onClearAll: () => void;
  isDirty: boolean;
}

const ID_PATTERN = /^[a-z0-9-]+:[a-z0-9-]+$/;

export function Toolbar({
  menuName, onMenuNameChange,
  commandId, onCommandIdChange,
  onNew, onLoad, onLoadFolder, onExport, onClearAll,
  isDirty,
}: ToolbarProps) {
  const idValid = ID_PATTERN.test(commandId);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'stretch',
      borderBottom: '1px solid #1a1a1a',
      background: '#0c0c0c',
      flexShrink: 0,
      overflowX: 'auto',
    }}>
      {/* Brand block */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        borderRight: '1px solid #1a1a1a',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 3 L3 21 L8 21 L8 14 L14 14 C17 14 20 11 20 8 C20 5 17 3 14 3 L3 3 Z M8 7 L14 7 C15 7 15.5 7.5 15.5 8.5 C15.5 9.5 15 10 14 10 L8 10 L8 7 Z"
            fill="#4aeadc"
          />
        </svg>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 10,
            fontWeight: 600,
            color: '#e8e8e8',
            letterSpacing: '0.22em',
          }}>PLASTICITY</div>
          <div style={{
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 8,
            color: '#666666',
            letterSpacing: '0.18em',
          }}>RADIAL MENU BUILDER v0.3</div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '10px 14px',
        borderRight: '1px solid #1a1a1a',
      }}>
        <StrokeButton label="NEW" onClick={onNew} />
        <StrokeButton label="LOAD" onClick={onLoad} />
        <StrokeButton label="LOAD FOLDER" onClick={onLoadFolder} />
        <div style={{ width: 8 }} />
        <StrokeButton label="CLEAR ALL" danger onClick={onClearAll} />
        <div style={{ width: 8 }} />
        <StrokeButton label="EXPORT" primary onClick={onExport} />
      </div>

      {/* Meta fields */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '6px 16px',
        flex: 1,
      }}>
        <MetaField
          label="MENU NAME"
          value={menuName}
          onChange={onMenuNameChange}
          width={180}
        />
        <MetaField
          label="COMMAND ID"
          value={commandId}
          onChange={onCommandIdChange}
          mono
          warning={!idValid}
          width={220}
        />
      </div>

      {/* Status strip */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '10px 16px',
        borderLeft: '1px solid #1a1a1a',
        minWidth: 140,
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 8,
          color: '#666666',
          letterSpacing: '0.22em',
        }}>STATUS</div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 3,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 10,
          letterSpacing: '0.14em',
          color: isDirty ? '#ff8a3d' : '#3dff9a',
        }}>
          <span style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            background: isDirty ? '#ff8a3d' : '#3dff9a',
            flexShrink: 0,
          }} />
          {isDirty ? 'UNSAVED' : 'SAVED'}
        </div>
      </div>
    </div>
  );
}
