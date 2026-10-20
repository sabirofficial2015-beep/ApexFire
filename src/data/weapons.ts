import { Weapon } from '../types/index.ts';

export const WEAPONS_DATABASE: Weapon[] = [
  {
    id: 'm1887',
    name: 'M1887',
    category: 'Shotgun',
    damage: 100,
    fireRate: 40,
    range: 19,
    reloadSpeed: 55,
    magazine: 2,
    accuracy: 10,
    armorPenetration: 54,
    movementSpeed: 79,
    headshotMultiplier: 4.0,
    oneTapCapable: true,
    dragTechnique: 'Rotation Drag',
    description: 'The king of close combat. Capable of instant 1-tap kills with high armor penetration.'
  },
  {
    id: 'desert_eagle',
    name: 'Desert Eagle',
    category: 'Pistol',
    damage: 90,
    fireRate: 33,
    range: 38,
    reloadSpeed: 69,
    magazine: 7,
    accuracy: 45,
    armorPenetration: 0,
    movementSpeed: 76,
    headshotMultiplier: 5.5,
    oneTapCapable: true,
    dragTechnique: 'Straight Fast Drag',
    description: 'The iconic high-caliber pistol. Deals massive 495 damage headshots on unarmored targets.'
  },
  {
    id: 'mp40',
    name: 'MP40',
    category: 'SMG',
    damage: 48,
    fireRate: 83,
    range: 22,
    reloadSpeed: 48,
    magazine: 20,
    accuracy: 17,
    armorPenetration: 0,
    movementSpeed: 77,
    headshotMultiplier: 2.7,
    oneTapCapable: false,
    dragTechnique: 'Straight Fast Drag',
    description: 'Highest natural fire rate SMG. Deadly when dragging from chest to head at close range.'
  },
  {
    id: 'woodpecker',
    name: 'Woodpecker',
    category: 'Marksman',
    damage: 72,
    fireRate: 38,
    range: 63,
    reloadSpeed: 48,
    magazine: 12,
    accuracy: 69,
    armorPenetration: 77,
    movementSpeed: 62,
    headshotMultiplier: 4.8,
    oneTapCapable: true,
    dragTechnique: 'J-Drag',
    description: 'High armor penetration marksman rifle. Punches straight through Level 3 helmets.'
  },
  {
    id: 'ump',
    name: 'UMP',
    category: 'SMG',
    damage: 50,
    fireRate: 75,
    range: 25,
    reloadSpeed: 59,
    magazine: 30,
    accuracy: 42,
    armorPenetration: 63,
    movementSpeed: 79,
    headshotMultiplier: 2.8,
    oneTapCapable: false,
    dragTechnique: 'J-Drag',
    description: 'Tournament favorite SMG due to built-in armor penetration and forgiving recoil bloom.'
  },
  {
    id: 'awm',
    name: 'AWM',
    category: 'Sniper',
    damage: 90,
    fireRate: 27,
    range: 91,
    reloadSpeed: 34,
    magazine: 5,
    accuracy: 90,
    armorPenetration: 0,
    movementSpeed: 65,
    headshotMultiplier: 3.3,
    oneTapCapable: true,
    dragTechnique: 'Quick Scope',
    description: 'Deadliest long-range sniper rifle with extreme accuracy and stopping power.'
  },
  {
    id: 'm1014',
    name: 'M1014',
    category: 'Shotgun',
    damage: 94,
    fireRate: 39,
    range: 10,
    reloadSpeed: 20,
    magazine: 6,
    accuracy: 10,
    armorPenetration: 0,
    movementSpeed: 60,
    headshotMultiplier: 3.8,
    oneTapCapable: true,
    dragTechnique: 'Rotation Drag',
    description: 'Auto-shotgun with 6 shells. Deadly for jump-shots and close quarters defensive holds.'
  },
  {
    id: 'ak47',
    name: 'AK',
    category: 'AR',
    damage: 62,
    fireRate: 56,
    range: 73,
    reloadSpeed: 41,
    magazine: 30,
    accuracy: 41,
    armorPenetration: 0,
    movementSpeed: 62,
    headshotMultiplier: 3.5,
    oneTapCapable: false,
    dragTechnique: 'Straight Fast Drag',
    description: 'Heavy assault rifle with raw power. Requires disciplined drag due to initial recoil kick.'
  }
];

export function calculateDamage(weapon: Weapon, helmetLevel: number, vestLevel: number, isHeadshot: boolean): number {
  if (isHeadshot) {
    const baseHs = weapon.damage * weapon.headshotMultiplier;
    // Helmet reduction (Level 1: -20%, Level 2: -30%, Level 3: -45%, Level 4: -55%)
    const helmetReductions = [0, 0.20, 0.30, 0.45, 0.55];
    const rawReduction = helmetReductions[helmetLevel] || 0;
    // Armor penetration reduces effectiveness of armor
    const effectiveReduction = Math.max(0, rawReduction * (1 - weapon.armorPenetration / 100));
    return Math.round(baseHs * (1 - effectiveReduction));
  } else {
    // Vest reduction (Level 1: -33%, Level 2: -50%, Level 3: -66%, Level 4: -70%)
    const vestReductions = [0, 0.33, 0.50, 0.66, 0.70];
    const rawReduction = vestReductions[vestLevel] || 0;
    const effectiveReduction = Math.max(0, rawReduction * (1 - weapon.armorPenetration / 100));
    return Math.round(weapon.damage * (1 - effectiveReduction));
  }
}
