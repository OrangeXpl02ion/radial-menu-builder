import type { CommandCategory } from '../types/radial';

export const COMMAND_CATEGORIES: CommandCategory[] = [
  {
    id: 'sketch',
    label: 'SKETCH & PRIMITIVES',
    color: '#3dff9a',
    commands: [
      { command: 'command:curve',         label: 'Curve',       icon: 'curve'   },
      { command: 'command:line',          label: 'Line',        icon: 'line'    },
      { command: 'command:rectangle',     label: 'Rectangle',   icon: 'rect'    },
      { command: 'command:center-circle', label: 'Circle',      icon: 'circle'  },
      { command: 'command:polygon',       label: 'Polygon',     icon: 'poly'    },
      { command: 'command:text',          label: 'Text',        icon: 'text'    },
      { command: 'command:sphere',        label: 'Sphere',      icon: 'sphere'  },
      { command: 'command:box',           label: 'Box',         icon: 'box'     },
      { command: 'command:cylinder',      label: 'Cylinder',    icon: 'cyl'     },
    ],
  },
  {
    id: 'solid',
    label: 'SOLID OPERATIONS',
    color: '#ff4aea',
    commands: [
      { command: 'command:extrude',       label: 'Extrude',     icon: 'extrude' },
      { command: 'command:revolve',       label: 'Revolve',     icon: 'revolve' },
      { command: 'command:sweep',         label: 'Sweep',       icon: 'sweep'   },
      { command: 'command:loft',          label: 'Loft',        icon: 'loft'    },
      { command: 'command:boolean-union', label: 'Union',       icon: 'union'   },
      { command: 'command:boolean-diff',  label: 'Difference',  icon: 'diff'    },
      { command: 'command:boolean-isect', label: 'Intersect',   icon: 'isect'   },
      { command: 'command:shell',         label: 'Shell',       icon: 'shell'   },
      { command: 'command:fillet',        label: 'Fillet',      icon: 'fillet'  },
      { command: 'command:chamfer',       label: 'Chamfer',     icon: 'chamfer' },
      { command: 'command:offset-face',   label: 'Offset Face', icon: 'offset'  },
      { command: 'command:mirror',        label: 'Mirror',      icon: 'mirror'  },
    ],
  },
  {
    id: 'curve',
    label: 'CURVE TOOLS',
    color: '#ff8a3d',
    commands: [
      { command: 'command:fillet-curve',  label: 'Fillet Curve', icon: 'fcurve' },
      { command: 'command:trim',          label: 'Trim',         icon: 'trim'   },
      { command: 'command:bridge-curve',  label: 'Bridge',       icon: 'bridge' },
      { command: 'command:project-curve', label: 'Project',      icon: 'proj'   },
      { command: 'command:offset-curve',  label: 'Offset Curve', icon: 'ocurve' },
      { command: 'command:join-curves',   label: 'Join Curves',  icon: 'join'   },
    ],
  },
  {
    id: 'select',
    label: 'SELECTION & VIEW',
    color: '#4aeadc',
    commands: [
      { command: 'command:select-all',  label: 'Select All',  icon: 'sel'    },
      { command: 'command:deselect',    label: 'Deselect',    icon: 'desel'  },
      { command: 'command:hide',        label: 'Hide',        icon: 'hide'   },
      { command: 'command:isolate',     label: 'Isolate',     icon: 'iso'    },
      { command: 'command:zoom-fit',    label: 'Zoom Fit',    icon: 'zoom'   },
      { command: 'command:view-front',  label: 'View: Front', icon: 'vfront' },
      { command: 'command:view-top',    label: 'View: Top',   icon: 'vtop'   },
    ],
  },
  {
    id: 'io',
    label: 'IMPORT / EXPORT',
    color: '#ffd23d',
    commands: [
      { command: 'command:import',      label: 'Import',      icon: 'imp'  },
      { command: 'command:export',      label: 'Export',      icon: 'exp'  },
      { command: 'command:export-stl',  label: 'Export STL',  icon: 'stl'  },
      { command: 'command:export-step', label: 'Export STEP', icon: 'step' },
    ],
  },
  {
    id: 'nested',
    label: 'NESTED MENUS',
    color: '#b97dff',
    nested: true,
    commands: [
      { command: 'user:sketch-tools',   label: 'Sketch Tools',  icon: 'menu', isNestedMenu: true },
      { command: 'user:solid-ops',      label: 'Solid Ops',     icon: 'menu', isNestedMenu: true },
      { command: 'user:view-controls',  label: 'View Controls', icon: 'menu', isNestedMenu: true },
    ],
  },
];

export const COMMAND_COLOR_MAP: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const cat of COMMAND_CATEGORIES) {
    for (const c of cat.commands) m[c.command] = cat.color;
  }
  return m;
})();
