import { invoke } from '@tauri-apps/api/tauri'

export async function execute() {
  await invoke('plugin:awesome|execute')
}

export async function add(x: number, y: number): Promise<number> {
  return invoke<number>('plugin:awesome|add', {x, y});
}
