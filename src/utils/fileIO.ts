import type { RadialMenu } from '../types/radial';

function pickFile(opts: { accept: string; multiple?: boolean; directory?: boolean }): Promise<File[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = opts.accept;
    if (opts.multiple) input.multiple = true;
    if (opts.directory) {
      input.setAttribute('webkitdirectory', '');
      input.setAttribute('directory', '');
    }
    input.onchange = () => resolve(Array.from(input.files ?? []));
    input.oncancel = () => resolve([]);
    input.click();
  });
}

function parseRadialMenu(text: string): RadialMenu | null {
  try {
    const j = JSON.parse(text);
    if (typeof j.name === 'string' && typeof j.command === 'string' && Array.isArray(j.items)) {
      return j as RadialMenu;
    }
    return null;
  } catch {
    return null;
  }
}

export async function openJsonFile(): Promise<RadialMenu | null> {
  const files = await pickFile({ accept: '.json,.radial.json' });
  if (!files.length) return null;
  const text = await files[0].text();
  return parseRadialMenu(text);
}

export async function openDirectory(): Promise<RadialMenu[]> {
  const files = await pickFile({ accept: '.json', multiple: true, directory: true });
  const results: RadialMenu[] = [];
  for (const file of files) {
    if (!file.name.endsWith('.json')) continue;
    const text = await file.text();
    const menu = parseRadialMenu(text);
    if (menu) results.push(menu);
  }
  return results;
}

export function downloadJson(obj: object, filename: string): void {
  const content = JSON.stringify(obj, null, 2) + '\n';
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
