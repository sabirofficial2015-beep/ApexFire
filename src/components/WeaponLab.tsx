import React, { useState } from 'react';
import { Shield, ShieldAlert, Zap, Target, Flame, ArrowUpRight } from 'lucide-react';
import { WEAPONS_DATABASE, calculateDamage } from '../data/weapons.ts';
import { Weapon } from '../types/index.ts';
import { soundEffects } from '../utils/audio.ts';

export const WeaponLab: React.FC = () => {
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon>(WEAPONS_DATABASE[0]);
  const [helmetLevel, setHelmetLevel] = useState<number>(2); // Level 2 default
  const [vestLevel, setVestLevel] = useState<number>(2); // Level 2 default

  const headshotDmg = calculateDamage(selectedWeapon, helmetLevel, vestLevel, true);
  const bodyDmg = calculateDamage(selectedWeapon, helmetLevel, vestLevel, false);
  const isOneTap = headshotDmg >= 200;
  const shotsToKillBody = Math.ceil(200 / Math.max(1, bodyDmg));
  const shotsToKillHead = Math.ceil(200 / Math.max(1, headshotDmg));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Free Fire Weapon & Armor Penetration Lab</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Calculate exact headshot damage, vest reductions, one-tap thresholds, and drag techniques across all helmets.
          </p>
        </div>

        {/* Protection Quick Toggles */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
            <span className="text-neutral-400 px-1 font-medium">Helmet:</span>
            {[0, 1, 2, 3, 4].map(lvl => (
              <button
                key={lvl}
                onClick={() => {
                  setHelmetLevel(lvl);
                  soundEffects.playClick();
                }}
                className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold transition-colors ${
                  helmetLevel === lvl
                    ? 'bg-red-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {lvl === 0 ? '-' : lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
            <span className="text-neutral-400 px-1 font-medium">Vest:</span>
            {[0, 1, 2, 3, 4].map(lvl => (
              <button
                key={lvl}
                onClick={() => {
                  setVestLevel(lvl);
                  soundEffects.playClick();
                }}
                className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold transition-colors ${
                  vestLevel === lvl
                    ? 'bg-blue-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {lvl === 0 ? '-' : lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Weapon Catalog (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Select Weapon ({WEAPONS_DATABASE.length})
          </div>

          <div className="space-y-2">
            {WEAPONS_DATABASE.map(w => {
              const isSelected = selectedWeapon.id === w.id;
              return (
                <button
                  key={w.id}
                  onClick={() => {
                    setSelectedWeapon(w);
                    soundEffects.playClick();
                  }}
                  className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-neutral-800/90 border-orange-500 text-white shadow-sm'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center font-bold text-xs text-orange-400 font-mono">
                      {w.category.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{w.name}</span>
                        {w.oneTapCapable && (
                          <span className="text-[10px] font-mono text-orange-400 font-semibold bg-orange-950/60 px-1.5 py-0.2 rounded border border-orange-500/30">
                            1-TAP
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        {w.category} · Drag: {w.dragTechnique}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-neutral-200">
                      {w.damage} Dmg
                    </div>
                    <div className="text-[10px] font-mono text-orange-400">
                      Pen: {w.armorPenetration}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Damage Calculation & Target Simulation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-Time Damage Verdict Banner */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{selectedWeapon.category}</span>
                <h2 className="text-xl font-bold text-white mt-0.5">{selectedWeapon.name}</h2>
              </div>

              <div className="text-right">
                {isOneTap ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 font-bold text-xs shadow-sm shadow-red-950/50">
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    <span>INSTANT ONE-TAP KILL (200+ HP)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-950 border border-neutral-800 text-neutral-400 text-xs">
                    <span>{shotsToKillHead} Headshots to Kill</span>
                  </span>
                )}
              </div>
            </div>

            {/* Damage Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Headshot Card */}
              <div className="p-4 bg-neutral-950 border border-red-900/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1.5 font-semibold text-red-400">
                    <Target className="w-3.5 h-3.5" /> Headshot Damage
                  </span>
                  <span className="font-mono">Helmet Lvl {helmetLevel}</span>
                </div>
                <div className="text-4xl font-extrabold font-mono text-red-500 tabular-nums">
                  {headshotDmg}
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  Base multiplier: <strong className="text-white">{selectedWeapon.headshotMultiplier}x</strong> · {shotsToKillHead} shot to eliminate (200 HP)
                </div>
              </div>

              {/* Bodyshot Card */}
              <div className="p-4 bg-neutral-950 border border-blue-900/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1.5 font-semibold text-blue-400">
                    <Shield className="w-3.5 h-3.5" /> Chest/Body Damage
                  </span>
                  <span className="font-mono">Vest Lvl {vestLevel}</span>
                </div>
                <div className="text-4xl font-extrabold font-mono text-amber-400 tabular-nums">
                  {bodyDmg}
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  Needs <strong className="text-white">{shotsToKillBody} body shots</strong> to eliminate (200 HP)
                </div>
              </div>
            </div>

            {/* Drag Technique Recommendation */}
            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-neutral-200">Recommended Drag Technique:</div>
                <div className="text-sm font-bold text-orange-400 mt-0.5">{selectedWeapon.dragTechnique}</div>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm text-right">
                {selectedWeapon.dragTechnique === 'Rotation Drag'
                  ? 'Flick in a slight curve following the enemy movement vector. Perfect for close-range shotgun hops.'
                  : selectedWeapon.dragTechnique === 'J-Drag'
                  ? 'Lower reticle slightly then sweep sharply upward into an upside-down hook.'
                  : selectedWeapon.dragTechnique === 'Straight Fast Drag'
                  ? 'Immediate rapid vertical wrist flick from collarbone to top of screen.'
                  : 'Right-click scope and fire simultaneously in under 100ms.'}
              </p>
            </div>
          </div>

          {/* Weapon Attribute Progress Bars */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Official Weapon Attributes ({selectedWeapon.name})
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { label: 'Damage', value: selectedWeapon.damage, max: 100 },
                { label: 'Fire Rate', value: selectedWeapon.fireRate, max: 100 },
                { label: 'Range', value: selectedWeapon.range, max: 100 },
                { label: 'Armor Penetration', value: selectedWeapon.armorPenetration, max: 100 },
                { label: 'Accuracy', value: selectedWeapon.accuracy, max: 100 },
                { label: 'Reload Speed', value: selectedWeapon.reloadSpeed, max: 100 }
              ].map(stat => (
                <div key={stat.label} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">{stat.label}</span>
                    <span className="font-mono font-bold text-neutral-200">{stat.value} / {stat.max}</span>
                  </div>
                  <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="bg-gradient-to-r from-orange-600 to-red-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(stat.value / stat.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
