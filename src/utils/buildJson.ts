import type { SlotItem, RadialMenu } from '../types/radial';

export function buildJson(
  name: string,
  commandId: string,
  slots: (SlotItem | null)[],
  slotCount: number,
): RadialMenu {
  return {
    name,
    command: commandId,
    items: slots.slice(0, slotCount).filter(Boolean).map((s) => ({
      command: (s as SlotItem).command,
      icon: (s as SlotItem).icon,
      label: (s as SlotItem).label,
    })),
  };
}
