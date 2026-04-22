import { create } from 'zustand';
import type { SlotItem, CommandDef, RadialMenu } from '../types/radial';
import { slugify } from '../utils/slugify';
import { COMMAND_CATEGORIES } from '../data/commands';

function findCmd(command: string): SlotItem | null {
  for (const cat of COMMAND_CATEGORIES) {
    const hit = cat.commands.find((c) => c.command === command);
    if (hit) return { command: hit.command, icon: hit.icon, label: hit.label, isNestedMenu: hit.isNestedMenu };
  }
  return null;
}

const SEED_SLOTS: (SlotItem | null)[] = [
  findCmd('command:extrude'),
  findCmd('command:boolean-union'),
  findCmd('command:boolean-diff'),
  null,
  findCmd('command:fillet'),
  { command: 'user:sketch-tools', icon: 'menu', label: 'Sketch Tools', isNestedMenu: true },
  null,
  findCmd('command:mirror'),
];

interface MenuState {
  name: string;
  commandId: string;
  commandIdTouched: boolean;
  slots: (SlotItem | null)[];
  slotCount: number;
  loadedMenus: RadialMenu[];
  selectedSlotIndex: number | null;
  isDirty: boolean;

  setName(v: string): void;
  setCommandId(v: string): void;
  setSlotCount(n: number): void;
  assignCommand(cmd: CommandDef): void;
  assignToSlot(cmd: CommandDef, index: number): void;
  swapSlots(a: number, b: number): void;
  deleteSlot(i: number): void;
  selectSlot(i: number | null): void;
  newMenu(): void;
  loadMenu(menu: RadialMenu): void;
  loadMenus(menus: RadialMenu[]): void;
  setIsDirty(v: boolean): void;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  name: 'Modeling Ops',
  commandId: 'user:modeling-ops',
  commandIdTouched: false,
  slots: SEED_SLOTS,
  slotCount: 8,
  loadedMenus: [],
  selectedSlotIndex: null,
  isDirty: true,

  setName(v) {
    set((s) => {
      const [ns] = s.commandId.split(':');
      return {
        name: v,
        commandId: s.commandIdTouched ? s.commandId : `${ns || 'user'}:${slugify(v)}`,
        isDirty: true,
      };
    });
  },

  setCommandId(v) {
    set({ commandId: v, commandIdTouched: true, isDirty: true });
  },

  setSlotCount(n) {
    const clamped = Math.max(3, Math.min(12, n));
    set((s) => {
      const next = [...s.slots];
      while (next.length < clamped) next.push(null);
      return { slotCount: clamped, slots: next, isDirty: true };
    });
  },

  assignCommand(cmd) {
    set((s) => {
      const next = [...s.slots];
      while (next.length < s.slotCount) next.push(null);
      const item: SlotItem = { command: cmd.command, icon: cmd.icon, label: cmd.label, isNestedMenu: cmd.isNestedMenu };
      if (s.selectedSlotIndex !== null && s.selectedSlotIndex < s.slotCount) {
        next[s.selectedSlotIndex] = item;
      } else {
        const firstEmpty = next.findIndex((slot, i) => i < s.slotCount && !slot);
        if (firstEmpty >= 0) next[firstEmpty] = item;
        else next[0] = item;
      }
      return { slots: next, isDirty: true };
    });
  },

  assignToSlot(cmd, index) {
    set((s) => {
      const next = [...s.slots];
      while (next.length < s.slotCount) next.push(null);
      next[index] = { command: cmd.command, icon: cmd.icon, label: cmd.label, isNestedMenu: cmd.isNestedMenu };
      return { slots: next, isDirty: true };
    });
  },

  swapSlots(a, b) {
    set((s) => {
      const next = [...s.slots];
      while (next.length < s.slotCount) next.push(null);
      [next[a], next[b]] = [next[b], next[a]];
      return { slots: next, isDirty: true };
    });
  },

  deleteSlot(i) {
    set((s) => {
      const next = [...s.slots];
      next[i] = null;
      return { slots: next, selectedSlotIndex: null, isDirty: true };
    });
  },

  selectSlot(i) {
    set({ selectedSlotIndex: i });
  },

  newMenu() {
    set((s) => ({
      name: 'Untitled Menu',
      commandId: 'user:untitled-menu',
      commandIdTouched: false,
      slots: new Array(s.slotCount).fill(null),
      selectedSlotIndex: null,
      isDirty: false,
    }));
  },

  loadMenu(menu) {
    const newSlotCount = Math.max(3, Math.min(12, menu.items.length || 8));
    const slots: (SlotItem | null)[] = menu.items.map((item) => ({
      command: item.command,
      icon: item.icon,
      label: item.label,
    }));
    while (slots.length < newSlotCount) slots.push(null);
    set({
      name: menu.name,
      commandId: menu.command,
      commandIdTouched: true,
      slots,
      slotCount: newSlotCount,
      selectedSlotIndex: null,
      isDirty: false,
    });
  },

  loadMenus(menus) {
    set((s) => {
      const existing = new Set(s.loadedMenus.map((m) => m.command));
      const newMenus = menus.filter((m) => !existing.has(m.command));
      return { loadedMenus: [...s.loadedMenus, ...newMenus] };
    });
  },

  setIsDirty(v) {
    set({ isDirty: v });
  },
}));

export const getAssignedCommands = (state: MenuState): Set<string> =>
  new Set(state.slots.slice(0, state.slotCount).filter(Boolean).map((s) => (s as SlotItem).command));
