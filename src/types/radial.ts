export interface SlotItem {
  command: string;
  icon: string;
  label: string;
  isNestedMenu?: boolean;
}

export interface CommandDef {
  command: string;
  label: string;
  icon: string;
  isNestedMenu?: boolean;
}

export interface CommandCategory {
  id: string;
  label: string;
  color: string;
  nested?: boolean;
  commands: CommandDef[];
}

export interface RadialMenu {
  name: string;
  command: string;
  items: Omit<SlotItem, 'isNestedMenu'>[];
}
