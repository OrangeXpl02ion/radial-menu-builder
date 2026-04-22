import type { RadialMenu } from '../../types/radial';
import { COMMAND_COLOR_MAP } from '../../data/commands';

interface Token { s: string; c: string }
interface Line { t: Token[] }

function buildLines(json: RadialMenu): Line[] {
  const lines: Line[] = [];
  lines.push({ t: [{ s: '{', c: '#e8e8e8' }] });
  lines.push({ t: [
    { s: '  "', c: '#e8e8e8' }, { s: 'name', c: '#4aeadc' },
    { s: '": ', c: '#e8e8e8' }, { s: `"${json.name}"`, c: '#3dff9a' },
    { s: ',', c: '#666666' },
  ]});
  lines.push({ t: [
    { s: '  "', c: '#e8e8e8' }, { s: 'command', c: '#4aeadc' },
    { s: '": ', c: '#e8e8e8' }, { s: `"${json.command}"`, c: '#3dff9a' },
    { s: ',', c: '#666666' },
  ]});
  lines.push({ t: [
    { s: '  "', c: '#e8e8e8' }, { s: 'items', c: '#4aeadc' },
    { s: '": [', c: '#e8e8e8' },
  ]});
  json.items.forEach((item, i) => {
    const color = COMMAND_COLOR_MAP[item.command] || '#b97dff';
    const isLast = i === json.items.length - 1;
    lines.push({ t: [{ s: '    {', c: '#e8e8e8' }] });
    lines.push({ t: [
      { s: '      "', c: '#e8e8e8' }, { s: 'command', c: '#4aeadc' },
      { s: '": ', c: '#e8e8e8' }, { s: `"${item.command}"`, c: color },
      { s: ',', c: '#666666' },
    ]});
    lines.push({ t: [
      { s: '      "', c: '#e8e8e8' }, { s: 'icon', c: '#4aeadc' },
      { s: '": ', c: '#e8e8e8' }, { s: `"${item.icon}"`, c: '#3dff9a' },
      { s: ',', c: '#666666' },
    ]});
    lines.push({ t: [
      { s: '      "', c: '#e8e8e8' }, { s: 'label', c: '#4aeadc' },
      { s: '": ', c: '#e8e8e8' }, { s: `"${item.label}"`, c: '#3dff9a' },
    ]});
    lines.push({ t: [
      { s: '    }', c: '#e8e8e8' },
      { s: isLast ? '' : ',', c: '#666666' },
    ]});
  });
  lines.push({ t: [{ s: '  ]', c: '#e8e8e8' }] });
  lines.push({ t: [{ s: '}', c: '#e8e8e8' }] });
  return lines;
}

interface JsonLinesProps {
  json: RadialMenu;
}

export function JsonLines({ json }: JsonLinesProps) {
  const lines = buildLines(json);
  return (
    <div style={{
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 12,
      lineHeight: 1.55,
      letterSpacing: '0.01em',
      whiteSpace: 'pre',
      color: '#e8e8e8',
    }}>
      {lines.map((line, i) => (
        <div key={i} style={{ display: 'flex' }}>
          <span style={{
            width: 32,
            flexShrink: 0,
            color: '#333333',
            textAlign: 'right',
            paddingRight: 12,
            borderRight: '1px solid #1a1a1a',
            userSelect: 'none',
          }}>{String(i + 1).padStart(2, '0')}</span>
          <span style={{ paddingLeft: 12 }}>
            {line.t.map((tok, j) => (
              <span key={j} style={{ color: tok.c }}>{tok.s}</span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
