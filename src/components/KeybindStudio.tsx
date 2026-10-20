import React, { useState } from 'react';
import { Keyboard, MousePointer, Shield, Sparkles, Copy, Check, Info, Zap } from 'lucide-react';
import { soundEffects } from '../utils/audio.ts';

interface KeyConfig {
  key: string;
  action: string;
  category: 'Combat' | 'Movement' | 'Utility' | 'Macro';
}

const DEFAULT_KEYMAP: KeyConfig[] = [
  { key: 'W', action: 'Move Forward', category: 'Movement' },
  { key: 'A', action: 'Strafe Left', category: 'Movement' },
  { key: 'S', action: 'Move Backward', category: 'Movement' },
  { key: 'D', action: 'Strafe Right', category: 'Movement' },
  { key: 'SPACE', action: 'Jump', category: 'Movement' },
  { key: 'SHIFT', action: 'Sprint / Run', category: 'Movement' },
  { key: 'C', action: 'Crouch', category: 'Movement' },
  { key: 'Z', action: 'Prone (Lie Down)', category: 'Movement' },
  
  { key: 'L-CLICK', action: 'Fire Weapon (Left Click)', category: 'Combat' },
  { key: 'R-CLICK', action: 'Scope In / Aim (Right Click)', category: 'Combat' },
  { key: '1', action: 'Primary Weapon (Shotgun/AR)', category: 'Combat' },
  { key: '2', action: 'Secondary Weapon (SMG/Sniper)', category: 'Combat' },
  { key: '3', action: 'Melee / Katana / Fist', category: 'Combat' },
  { key: '4', action: 'Pistol / Desert Eagle', category: 'Combat' },
  { key: 'R', action: 'Reload Weapon', category: 'Combat' },
  { key: 'G', action: 'Grenade / Flashbang', category: 'Combat' },

  { key: 'Q', action: 'Fast Gloo Wall Deploy', category: 'Macro' },
  { key: 'E', action: 'Character Active Skill (Alok/Tatsuya)', category: 'Utility' },
  { key: 'F', action: 'Interact / Loot / Revive', category: 'Utility' },
  { key: 'TAB', action: 'Open Backpack', category: 'Utility' },
  { key: 'M', action: 'Open Mini-Map', category: 'Utility' },
  { key: '5', action: 'Use Medkit / Super Med', category: 'Utility' },
  { key: 'F1', action: 'Lock / Unlock Cursor (Suspend)', category: 'Macro' },
  { key: '~', action: 'Quick Cursor Suspend Toggle', category: 'Macro' }
];

export const KeybindStudio: React.FC = () => {
  const [keymap, setKeymap] = useState<KeyConfig[]>(DEFAULT_KEYMAP);
  const [selectedKey, setSelectedKey] = useState<KeyConfig>(DEFAULT_KEYMAP[8]); // L-CLICK default
  const [activePreset, setActivePreset] = useState<'standard' | 'brazilian' | 'fastwall'>('standard');
  const [copied, setCopied] = useState(false);

  const handleApplyPreset = (preset: 'standard' | 'brazilian' | 'fastwall') => {
    setActivePreset(preset);
    soundEffects.playClick();
    if (preset === 'brazilian') {
      setKeymap(prev => prev.map(k => {
        if (k.action.includes('Gloo Wall')) return { ...k, key: 'CAPS' };
        if (k.action.includes('Cursor')) return { ...k, key: 'X' };
        if (k.action.includes('Skill')) return { ...k, key: 'F' };
        return k;
      }));
    } else if (preset === 'fastwall') {
      setKeymap(prev => prev.map(k => {
        if (k.action.includes('Gloo Wall')) return { ...k, key: 'Q' };
        if (k.action.includes('Cursor')) return { ...k, key: 'MOUSE-4' };
        return k;
      }));
    } else {
      setKeymap(DEFAULT_KEYMAP);
    }
  };

  const handleCopyKeymap = () => {
    const text = keymap.map(k => `${k.key.padEnd(8)} -> ${k.action} (${k.category})`).join('\n');
    navigator.clipboard.writeText(`🔥 ApexFire Pro Free Fire PC Keymap:\n${text}`);
    setCopied(true);
    soundEffects.playClick();
    setTimeout(() => setCopied(false), 2500);
  };

  const categoryColor = (cat: KeyConfig['category']) => {
    switch (cat) {
      case 'Combat': return 'text-red-400 bg-red-950/40 border-red-800/40';
      case 'Movement': return 'text-blue-400 bg-blue-950/40 border-blue-800/40';
      case 'Macro': return 'text-orange-400 bg-orange-950/40 border-orange-800/40';
      case 'Utility': return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
    }
  };

  // Keyboard Rows simulation
  const keyboardRows = [
    ['ESC', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
    ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACK'],
    ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
    ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENTER'],
    ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'SHIFT'],
    ['CTRL', 'WIN', 'ALT', 'SPACE', 'ALT', 'WIN', 'FN', 'CTRL']
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Free Fire PC Keymapping & HUD Studio</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Pro layout for BlueStacks, LDPlayer and MSI. Prevent keyboard ghosting and master the instant Gloo Wall macro.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyKeymap}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white transition-all whitespace-nowrap"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
            <span>{copied ? 'Copied' : 'Export Keymap'}</span>
          </button>
        </div>
      </div>

      {/* Preset Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-900/60 border border-neutral-800 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-neutral-400">Layout Presets:</span>
          {[
            { id: 'standard', label: 'Standard BlueStacks Smart' },
            { id: 'brazilian', label: 'Brazilian Pro Flick (White444 / Nobru)' },
            { id: 'fastwall', label: 'Instant Mouse-4 Fast Gloo Wall' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p.id as 'standard' | 'brazilian' | 'fastwall')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activePreset === p.id
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500/80 inline-block" /> Combat</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500/80 inline-block" /> Movement</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500/80 inline-block" /> Fast Gloo / Macro</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80 inline-block" /> Utility</span>
        </div>
      </div>

      {/* Visual Keyboard & Gaming Mouse Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visual Mechanical Keyboard Layout (8 cols) */}
        <div className="lg:col-span-8 bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-orange-500" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Interactive Keyboard Visualizer</h2>
            </div>
            <span className="text-xs text-neutral-500 font-mono">Click any highlighted key</span>
          </div>

          {/* Keyboard Container */}
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl overflow-x-auto">
            <div className="min-w-[580px] space-y-1.5">
              {keyboardRows.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-1.5 justify-center">
                  {row.map((k, colIdx) => {
                    const mapped = keymap.find(m => m.key.toUpperCase() === k.toUpperCase());
                    const isSelected = selectedKey?.key.toUpperCase() === k.toUpperCase();

                    let keyStyle = 'bg-neutral-900 border-neutral-800 text-neutral-500';
                    if (mapped) {
                      if (mapped.category === 'Combat') keyStyle = 'bg-red-950/60 border-red-600/70 text-red-300 font-bold';
                      else if (mapped.category === 'Movement') keyStyle = 'bg-blue-950/60 border-blue-600/70 text-blue-300 font-bold';
                      else if (mapped.category === 'Macro') keyStyle = 'bg-orange-950/70 border-orange-500 text-orange-300 font-extrabold';
                      else keyStyle = 'bg-emerald-950/60 border-emerald-600/70 text-emerald-300 font-bold';
                    }

                    if (isSelected) {
                      keyStyle += ' ring-2 ring-white shadow-md';
                    }

                    const widthClass =
                      k === 'SPACE' ? 'w-48' :
                      k === 'SHIFT' || k === 'ENTER' || k === 'BACK' ? 'w-16' :
                      k === 'CAPS' || k === 'TAB' ? 'w-14' :
                      'w-9';

                    return (
                      <button
                        key={colIdx}
                        onClick={() => {
                          if (mapped) {
                            setSelectedKey(mapped);
                            soundEffects.playClick();
                          }
                        }}
                        className={`h-9 ${widthClass} rounded flex flex-col items-center justify-center text-[11px] font-mono border transition-all ${keyStyle}`}
                      >
                        <span>{k}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Mouse Affordance Box */}
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-16 rounded-2xl bg-neutral-900 border border-neutral-700 flex flex-col items-center justify-between p-1 shadow-inner">
                <div className="w-full flex gap-0.5">
                  <div className="w-1/2 h-5 bg-red-950/80 border border-red-500/80 rounded-tl-lg flex items-center justify-center text-[8px] font-bold text-red-400">L</div>
                  <div className="w-1/2 h-5 bg-blue-950/80 border border-blue-500/80 rounded-tr-lg flex items-center justify-center text-[8px] font-bold text-blue-400">R</div>
                </div>
                <div className="w-1 h-3 bg-neutral-600 rounded-full" />
                <div className="text-[7px] text-neutral-500 font-mono">1000Hz</div>
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="font-semibold text-neutral-200">Esports Mouse Bindings</div>
                <div className="text-[11px] text-neutral-400">
                  <span className="text-red-400 font-semibold">Left Click</span>: Fire Weapon (Automatic Drag detection)
                </div>
                <div className="text-[11px] text-neutral-400">
                  <span className="text-blue-400 font-semibold">Right Click</span>: Aim Down Sight (Scope In)
                </div>
                <div className="text-[11px] text-neutral-400">
                  <span className="text-orange-400 font-semibold">Side Button 4/5</span>: Optional Fast Gloo Wall or Suspend
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const lClick = keymap.find(k => k.key === 'L-CLICK');
                  if (lClick) setSelectedKey(lClick);
                  soundEffects.playClick();
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-lg"
              >
                Inspect Left-Click Fire
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Key Details & Fast Gloo Wall Secrets (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Selected Key Details */}
          {selectedKey && (
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Key Details</span>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${categoryColor(selectedKey.category)}`}>
                  {selectedKey.category}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-700 flex items-center justify-center text-base font-bold font-mono text-orange-400 shadow-inner">
                  {selectedKey.key}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedKey.action}</h3>
                  <span className="text-xs text-neutral-500">Free Fire PC Action</span>
                </div>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed pt-1">
                {selectedKey.category === 'Macro'
                  ? 'High priority keybind. Keep it near your WASD resting fingers (e.g., Q or CapsLock or Thumb Mouse Button) for zero-latency execution.'
                  : selectedKey.category === 'Combat'
                  ? 'Main offensive trigger. Ensure your emulator polling rate matches 1000Hz to prevent dropped clicks.'
                  : selectedKey.category === 'Movement'
                  ? 'Fluid movement key. Position your hand so your pinky rests comfortably on Shift and thumb rests on Spacebar.'
                  : 'Tactical utility action for high-pressure tournament situations.'}
              </p>
            </div>
          )}

          {/* Brazilian Instant Gloo Wall Macro Technique */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-3.5">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Instant Gloo Wall Secret</h2>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Top PC players like White444 and Ruok deploy gloo walls in under <strong>0.15 seconds</strong> while sliding. Here is the exact finger sequence:
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 bg-neutral-950 border border-neutral-800 rounded flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-orange-600 text-white font-bold flex items-center justify-center text-[10px]">1</span>
                <span className="text-neutral-300">Fire shot & pull drag down immediately</span>
              </div>
              <div className="p-2 bg-neutral-950 border border-neutral-800 rounded flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-orange-600 text-white font-bold flex items-center justify-center text-[10px]">2</span>
                <span className="text-neutral-300">Tap <strong className="text-orange-400">C</strong> (Crouch) while pulling down</span>
              </div>
              <div className="p-2 bg-neutral-950 border border-neutral-800 rounded flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-orange-600 text-white font-bold flex items-center justify-center text-[10px]">3</span>
                <span className="text-neutral-300">Tap <strong className="text-orange-400">Q</strong> (Gloo Wall) + Left Click</span>
              </div>
            </div>

            <div className="p-2.5 bg-orange-950/30 border border-orange-900/40 rounded-lg text-[11px] text-orange-300/90">
              💡 <em>Pro Tip:</em> Do not use external third-party macro apps that inject DLLs—they trigger anti-cheat bans. Use the emulator's native key combination or clean finger muscle memory!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
