import { useEffect, useState } from 'react';
import { useMenuStore, getAssignedCommands } from './store/menuStore';
import { Toolbar } from './components/Toolbar/Toolbar';
import { CommandLibrary } from './components/Sidebar/CommandLibrary';
import { RadialCanvas } from './components/Canvas/RadialCanvas';
import { SlotCountBar } from './components/SlotCountBar/SlotCountBar';
import { JsonPreview } from './components/JsonPreview/JsonPreview';
import { openJsonFile, openDirectory, downloadJson } from './utils/fileIO';
import { buildJson } from './utils/buildJson';
import type { CommandDef } from './types/radial';

function TitleBar() {
  return (
    <div style={{
      height: 32,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      background: '#080808',
      borderBottom: '1px solid #1a1a1a',
      padding: '0 12px',
      position: 'relative',
    }}>
      {/* Traffic lights */}
      <div style={{ display: 'flex', gap: 8 }}>
        {(['#ff5a5a', '#ffb347', '#3dff9a'] as const).map((c, i) => (
          <div key={i} style={{
            width: 10, height: 10,
            background: 'transparent',
            border: `1px solid ${c}`,
          }} />
        ))}
      </div>
      {/* Centered title */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 10,
          color: '#888888',
          letterSpacing: '0.24em',
        }}>PLASTICITY ▸ RADIAL MENU BUILDER</span>
      </div>
      {/* Right meta */}
      <div style={{
        marginLeft: 'auto',
        display: 'flex',
        gap: 14,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 9,
        color: '#555555',
        letterSpacing: '0.18em',
      }}>
        <span>WIN · X64</span>
        <span style={{ color: '#4aeadc' }}>● CONNECTED</span>
      </div>
    </div>
  );
}

export function App() {
  const store = useMenuStore();
  const assignedCommands = getAssignedCommands(store);
  const [jsonExpanded, setJsonExpanded] = useState(true);

  // Keyboard handlers
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Don't capture when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (store.selectedSlotIndex !== null) {
          store.deleteSlot(store.selectedSlotIndex);
        }
      }
      if (e.key === 'Escape') {
        store.selectSlot(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const json = buildJson(store.name, store.commandId, store.slots, store.slotCount);
        downloadJson(json, (store.name || 'menu') + '.radial.json');
        store.setIsDirty(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [store]);

  async function handleLoad() {
    const menu = await openJsonFile();
    if (menu) store.loadMenu(menu);
  }

  async function handleLoadFolder() {
    const menus = await openDirectory();
    if (menus.length) store.loadMenus(menus);
  }

  function handleExport() {
    const json = buildJson(store.name, store.commandId, store.slots, store.slotCount);
    downloadJson(json, (store.name || 'menu') + '.radial.json');
    store.setIsDirty(false);
  }

  function handleAssign(cmd: CommandDef) {
    store.assignCommand(cmd);
  }

  function handleSelectSlot(i: number) {
    if (i === -1) {
      store.selectSlot(null);
      return;
    }
    store.selectSlot(store.selectedSlotIndex === i ? null : i);
  }

  function handleWheel(delta: number) {
    store.setSlotCount(store.slotCount + delta);
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#050505',
      border: '1px solid #1a1a1a',
      overflow: 'hidden',
    }}>
      <TitleBar />
      <Toolbar
        menuName={store.name}
        onMenuNameChange={store.setName}
        commandId={store.commandId}
        onCommandIdChange={store.setCommandId}
        onNew={store.newMenu}
        onLoad={handleLoad}
        onLoadFolder={handleLoadFolder}
        onExport={handleExport}
        isDirty={store.isDirty}
      />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <CommandLibrary
          onAssign={handleAssign}
          assignedCommands={assignedCommands}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
          <RadialCanvas
            slots={store.slots}
            slotCount={store.slotCount}
            selectedIndex={store.selectedSlotIndex}
            onSelectSlot={handleSelectSlot}
            onDeleteSlot={store.deleteSlot}
            onSwapSlots={store.swapSlots}
            onDropCommand={store.assignToSlot}
            menuName={store.name}
            commandId={store.commandId}
            onWheel={handleWheel}
          />
          <SlotCountBar
            slots={store.slots}
            slotCount={store.slotCount}
            onDecrement={() => store.setSlotCount(store.slotCount - 1)}
            onIncrement={() => store.setSlotCount(store.slotCount + 1)}
          />
          <JsonPreview
            name={store.name}
            commandId={store.commandId}
            slots={store.slots}
            slotCount={store.slotCount}
            expanded={jsonExpanded}
            onToggle={() => setJsonExpanded((v) => !v)}
          />
        </div>
      </div>
    </div>
  );
}
