export interface SensiProfile {
  id: string;
  name: string;
  emulator: string;
  mouseDpi: number;
  pollingRate: number; // Hz (125, 500, 1000)
  windowsPointerSpeed: number; // 1-11, default 6
  enhancePointerPrecision: boolean; // false = raw input
  // Emulator settings
  emulatorX: number; // X-axis mouse sensitivity
  emulatorY: number; // Y-axis mouse sensitivity (crucial for drag)
  tweaks: number; // e.g. 16450, 21058, 2, 808016466
  // In-game Free Fire settings (0-100)
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  sniperScope: number;
  freeLook: number;
  author?: string;
  notes?: string;
}

export type DeviceType = 'emulator' | 'phone';

export interface DeviceSensiPreset {
  id: string;
  name: string;
  deviceType: DeviceType;
  brand: string;
  modelBadge: string;
  // In-Game Sensitivity (0-100)
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  sniperScope: number;
  freeLook: number;
  // Emulator Specific
  emulatorX?: number;
  emulatorY?: number;
  mouseDpi?: number;
  tweaks?: number;
  // Phone Specific
  phoneDpi?: number;
  pointerSpeed?: string;
  fireButtonSize?: number;
  fireButtonPosition?: string;
  touchHoldDelay?: string;
  graphicSetting?: string;
  headshotTrick: string;
  rating: number;
}


export interface ProPlayer {
  id: string;
  name: string;
  realName: string;
  team: string;
  country: string;
  avatarColor: string;
  signatureWeapon: string;
  emulator: string;
  mouse: string;
  mouseDpi: number;
  pollingRate: number;
  windowsPointerSpeed: number;
  emulatorX: number;
  emulatorY: number;
  tweaks: number;
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  sniperScope: number;
  freeLook: number;
  playstyle: string;
  tips: string;
}

export interface Weapon {
  id: string;
  name: string;
  category: 'Shotgun' | 'SMG' | 'AR' | 'Marksman' | 'Sniper' | 'Pistol';
  damage: number;
  fireRate: number;
  range: number;
  reloadSpeed: number;
  magazine: number;
  accuracy: number;
  armorPenetration: number;
  movementSpeed: number;
  headshotMultiplier: number;
  oneTapCapable: boolean;
  dragTechnique: 'J-Drag' | 'Straight Fast Drag' | 'Rotation Drag' | 'Quick Scope';
  description: string;
}

export interface TournamentTeam {
  id: string;
  slot: number;
  name: string;
  tag: string;
  match1Placement: number;
  match1Kills: number;
  match2Placement: number;
  match2Kills: number;
  match3Placement: number;
  match3Kills: number;
}

export interface KeyMapping {
  action: string;
  key: string;
  category: 'Movement' | 'Combat' | 'Navigation' | 'Utility';
  description: string;
}
