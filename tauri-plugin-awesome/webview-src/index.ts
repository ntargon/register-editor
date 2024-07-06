import { invoke } from '@tauri-apps/api/tauri'

export async function add(x: number, y: number): Promise<number> {
  return invoke<number>('plugin:awesome|add', {x, y});
}

export async function connect(): Promise<boolean> {
  return invoke<boolean>('plugin:awesome|connect');
}

export async function disconnect(): Promise<boolean> {
  return invoke<boolean>('plugin:awesome|disconnect');
}

export async function is_connected(): Promise<boolean> {
  return invoke<boolean>('plugin:awesome|is_connected');
}

export async function exec(command: string): Promise<string> {
  return invoke<string>('plugin:awesome|exec', {command});
}

export async function configure(config: Config): Promise<void> {
  return invoke<void>('plugin:awesome|configure', {config});
}

export type Config = {
  username: string,
  password: string,
  ip_address: string,
};