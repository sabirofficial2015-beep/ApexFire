import React, { useState, useEffect } from 'react';
import { SensiProfile, ProPlayer } from '../types/index.ts';
import { PRO_PLAYERS } from '../data/proPlayers.ts';
import { soundEffects } from '../utils/audio.ts';
import { 
  Sliders, 
  MousePointer, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Bookmark, 
  Trash2, 
  Share2, 
  Info,
  Layers,
  ArrowRight,
  Smartphone,
  Monitor
} from 'lucide-react';

interface SensiLabProps {
  currentProfile: SensiProfile;
  onChangeProfile: (profile: SensiProfile) => void;
  onJumpToTrainer: () => void;
  onBrowseAllDevices?: () => void;
}

export const SensiLab: React.FC<SensiLabProps> = ({
  currentProfile,
  onChangeProfile,
  onJumpToTrainer,
  onBrowseAllDevices
}) => {
  const [copied, setCopied] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState('');
  const [savedProfiles, setSavedProfiles] = useState<SensiProfile[]>([]);
  const [selectedPro, setSelectedPro] = useState<ProPlayer | null>(PRO_PLAYERS[0]);
  
  // DPI Converter state
  const [convertOldDpi, setConvertOldDpi] = useState<number>(800);
  const [convertNewDpi, setConvertNewDpi] = useState<number>(1200);

  // Load saved profiles from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('apexfire_saved_profiles');
      if (stored) {
        setSavedProfiles(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToLocalStorage = (profiles: SensiProfile[]) => {
    setSavedProfiles(profiles);
    localStorage.setItem('apexfire_saved_profiles', JSON.stringify(profiles));
  };

  const handleSaveProfile = () => {
    if (!profileNameInput.trim()) return;
    const newProfile: SensiProfile = {
      ...currentProfile,
      id: Date.now().toString(),
      name: profileNameInput.trim(),
      notes: `Saved on ${new Date().toLocaleDateString()}`
    };
    const updated = [newProfile, ...savedProfiles];
    saveToLocalStorage(updated);
    setProfileNameInput('');
    soundEffects.playClick();
  };

  const handleDeleteProfile = (id: string) => {
    const updated = savedProfiles.filter(p => p.id !== id);
    saveToLocalStorage(updated);
    soundEffects.playClick();
  };

  const handleApplyPro = (pro: ProPlayer) => {
    setSelectedPro(pro);
    onChangeProfile({
      id: `pro-${pro.id}`,
      name: `${pro.name} Pro Setup`,
      emulator: pro.emulator,
      mouseDpi: pro.mouseDpi,
      pollingRate: pro.pollingRate,
      windowsPointerSpeed: pro.windowsPointerSpeed,
      enhancePointerPrecision: false,
      emulatorX: pro.emulatorX,
      emulatorY: pro.emulatorY,
      tweaks: pro.tweaks,
      general: pro.general,
      redDot: pro.redDot,
      scope2x: pro.scope2x,
      scope4x: pro.scope4x,
      sniperScope: pro.sniperScope,
      freeLook: pro.freeLook,
      author: pro.name,
      notes: pro.playstyle
    });
    soundEffects.playHeadshot();
  };

  const handleConvertDpi = () => {
    if (convertOldDpi <= 0 || convertNewDpi <= 0) return;
    const ratio = convertOldDpi / convertNewDpi;
    const newX = Number((currentProfile.emulatorX * ratio).toFixed(2));
    const newY = Number((currentProfile.emulatorY * ratio).toFixed(2));
    
    onChangeProfile({
      ...currentProfile,
      mouseDpi: convertNewDpi,
      emulatorX: newX,
      emulatorY: newY
    });
    soundEffects.playClick();
  };

  const handleCopyConfig = () => {
    const text = `🔥 [ApexFire Pro] Free Fire PC Sensi Settings:
• Emulator: ${currentProfile.emulator}
• Mouse DPI: ${currentProfile.mouseDpi} DPI | Polling Rate: ${currentProfile.pollingRate}Hz
• Windows Pointer: ${currentProfile.windowsPointerSpeed}/11 (Raw Input: ON)
• Emulator X (Horizontal): ${currentProfile.emulatorX}
• Emulator Y (Vertical Drag): ${currentProfile.emulatorY}
• BlueStacks Tweak: ${currentProfile.tweaks}

In-Game Sensitivity:
- General: ${currentProfile.general}
- Red Dot: ${currentProfile.redDot}
- 2x Scope: ${currentProfile.scope2x}
- 4x Scope: ${currentProfile.scope4x}
- Sniper Scope: ${currentProfile.sniperScope}
- Free Look: ${currentProfile.freeLook}
Generated via ApexFire PC Control Panel`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    soundEffects.playClick();
    setTimeout(() => setCopied(false), 2500);
  };

  // eDPI Calculations
  const edpiX = Math.round(currentProfile.mouseDpi * currentProfile.emulatorX);
  const edpiY = Math.round(currentProfile.mouseDpi * currentProfile.emulatorY);

  return (
    <div className="space-y-8">
      {/* Top Bar Summary & Quick Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Free Fire Emulator Sensitivity & X/Y Lab</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Fine-tune emulator X/Y axis drag sensitivity, calculate eDPI, manage tweaks, and adopt verified pro configs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onBrowseAllDevices && (
            <button
              onClick={onBrowseAllDevices}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-neutral-900 border border-neutral-800 text-orange-400 hover:bg-neutral-800 hover:text-orange-300 transition-all whitespace-nowrap"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>All Device & Phone Sensi</span>
            </button>
          )}
          <button
            onClick={handleCopyConfig}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white transition-all whitespace-nowrap"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Sensi Summary'}</span>
          </button>
          <button
            onClick={onJumpToTrainer}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition-all whitespace-nowrap"
          >
            <span>Test in Aim Trainer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Emulator & Hardware Parameters (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Emulator & Mouse Physics */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MousePointer className="w-4 h-4 text-orange-500" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Emulator & Mouse Hardware</h2>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                eDPI X: <span className="text-orange-400 font-bold">{edpiX}</span> · eDPI Y: <span className="text-orange-400 font-bold">{edpiY}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Target Emulator</label>
                <select
                  value={currentProfile.emulator}
                  onChange={(e) => onChangeProfile({ ...currentProfile, emulator: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-medium text-neutral-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="BlueStacks 5 (Nougat 32-bit)">BlueStacks 5 (Nougat 32-bit)</option>
                  <option value="BlueStacks 5 (Pie 64-bit)">BlueStacks 5 (Pie 64-bit)</option>
                  <option value="LDPlayer 9">LDPlayer 9</option>
                  <option value="MSI App Player 4.280">MSI App Player 4.280</option>
                  <option value="SmartGaGa 1.1">SmartGaGa 1.1</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-medium text-neutral-400">Mouse DPI</label>
                  <span className="text-xs font-mono text-orange-400 font-semibold">{currentProfile.mouseDpi} DPI</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="400"
                    max="2400"
                    step="100"
                    value={currentProfile.mouseDpi}
                    onChange={(e) => onChangeProfile({ ...currentProfile, mouseDpi: Number(e.target.value) })}
                    className="w-full accent-orange-500 bg-neutral-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex gap-1 shrink-0">
                    {[400, 800, 1000, 1200, 1600].map(val => (
                      <button
                        key={val}
                        onClick={() => onChangeProfile({ ...currentProfile, mouseDpi: val })}
                        className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                          currentProfile.mouseDpi === val ? 'bg-orange-600 text-white font-bold' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* X-Axis and Y-Axis Drag Sensitivities */}
            <div className="p-4 bg-neutral-950/80 border border-neutral-800/80 rounded-lg space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-200">X-Axis Sensitivity (Horizontal Turn)</span>
                    <span className="text-[11px] text-neutral-500">Left-Right 360° Movement</span>
                  </div>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="5.0"
                    value={currentProfile.emulatorX}
                    onChange={(e) => onChangeProfile({ ...currentProfile, emulatorX: Number(e.target.value) || 0.1 })}
                    className="w-16 px-2 py-1 text-xs text-right font-mono font-bold text-orange-400 bg-neutral-900 border border-neutral-700 rounded focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.01"
                  value={currentProfile.emulatorX}
                  onChange={(e) => onChangeProfile({ ...currentProfile, emulatorX: Number(e.target.value) })}
                  className="w-full accent-orange-500 bg-neutral-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-orange-400">Y-Axis Sensitivity (Vertical Drag)</span>
                    <span className="text-[11px] text-neutral-400">Crucial for One-Tap Headshots</span>
                  </div>
                  <input
                    type="number"
                    step="0.02"
                    min="0.1"
                    max="3.0"
                    value={currentProfile.emulatorY}
                    onChange={(e) => onChangeProfile({ ...currentProfile, emulatorY: Number(e.target.value) || 0.1 })}
                    className="w-16 px-2 py-1 text-xs text-right font-mono font-bold text-orange-400 bg-neutral-900 border border-neutral-700 rounded focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.01"
                  value={currentProfile.emulatorY}
                  onChange={(e) => onChangeProfile({ ...currentProfile, emulatorY: Number(e.target.value) })}
                  className="w-full accent-orange-500 bg-neutral-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Tip: A ratio of X:Y around 2:1 (e.g. X=1.20, Y=0.60) prevents the reticle from flying wildly above enemy heads while maintaining fast 360° rotation.
                </p>
              </div>
            </div>

            {/* Tweaks Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <span>Emulator Tweak Code</span>
                  <span className="text-neutral-500 font-normal">(Controls mouse cursor lock & raw input)</span>
                </label>
                <span className="text-xs font-mono font-bold text-orange-400">{currentProfile.tweaks}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { code: 16450, label: '16450 (Golden)' },
                  { code: 21058, label: '21058 (No-Jitter)' },
                  { code: 2, label: '2 (Direct Raw)' },
                  { code: 808016466, label: '808016466 (Esports)' }
                ].map(twk => (
                  <button
                    key={twk.code}
                    onClick={() => {
                      soundEffects.playClick();
                      onChangeProfile({ ...currentProfile, tweaks: twk.code });
                    }}
                    className={`p-2 rounded-lg text-left text-xs transition-colors border ${
                      currentProfile.tweaks === twk.code
                        ? 'bg-orange-950/60 border-orange-500/50 text-orange-300 font-medium'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <div className="font-mono font-bold text-xs">{twk.code}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5 truncate">{twk.label.split('(')[1]?.replace(')', '') || 'Custom'}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* DPI Converter Box */}
            <div className="p-3.5 bg-neutral-950 border border-neutral-800/80 rounded-lg space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
                <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
                <span>Instant DPI Converter (Keep Same Muscle Memory)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
                <div>
                  <span className="block text-[11px] text-neutral-500 mb-1">Old Mouse DPI</span>
                  <input
                    type="number"
                    value={convertOldDpi}
                    onChange={(e) => setConvertOldDpi(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-neutral-500 mb-1">New Mouse DPI</span>
                  <input
                    type="number"
                    value={convertNewDpi}
                    onChange={(e) => setConvertNewDpi(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs font-mono text-white"
                  />
                </div>
                <div className="sm:pt-4">
                  <button
                    onClick={handleConvertDpi}
                    className="w-full py-1.5 px-3 text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-700 rounded border border-neutral-700 transition-colors"
                  >
                    Recalculate X/Y
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Save Profile to LocalStorage */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-orange-500" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Save Custom Profile</h2>
              </div>
              <span className="text-xs text-neutral-500">Stored in your browser</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. My Ultra 1-Tap Desert Eagle"
                value={profileNameInput}
                onChange={(e) => setProfileNameInput(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleSaveProfile}
                disabled={!profileNameInput.trim()}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white transition-all whitespace-nowrap"
              >
                Save Preset
              </button>
            </div>

            {savedProfiles.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="text-xs font-medium text-neutral-400">Saved Presets ({savedProfiles.length})</div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {savedProfiles.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 bg-neutral-950 border border-neutral-800/80 rounded-lg text-xs">
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-200">{p.name}</span>
                        <span className="text-[11px] text-neutral-500 font-mono">
                          {p.mouseDpi} DPI · X:{p.emulatorX} · Y:{p.emulatorY} · Tweak:{p.tweaks}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            onChangeProfile(p);
                            soundEffects.playClick();
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDeleteProfile(p.id)}
                          className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: In-Game Sensitivity Sliders & Pro Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* In-Game Sensitivity Box */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-500" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">In-Game Free Fire Sensi</h2>
              </div>
              <button
                onClick={() => {
                  onChangeProfile({
                    ...currentProfile,
                    general: 100,
                    redDot: 95,
                    scope2x: 90,
                    scope4x: 85,
                    sniperScope: 45,
                    freeLook: 65
                  });
                  soundEffects.playClick();
                }}
                className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to 100</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {[
                { key: 'general', label: 'General (Movement)', value: currentProfile.general, desc: 'Overall crosshair movement speed' },
                { key: 'redDot', label: 'Red Dot', value: currentProfile.redDot, desc: 'Unscoped crosshair & iron sights' },
                { key: 'scope2x', label: '2x Scope', value: currentProfile.scope2x, desc: 'Assault rifles medium distance' },
                { key: 'scope4x', label: '4x Scope', value: currentProfile.scope4x, desc: 'Long range tracking' },
                { key: 'sniperScope', label: 'Sniper Scope (AWM)', value: currentProfile.sniperScope, desc: 'High-power bolt-action precision' },
                { key: 'freeLook', label: 'Free Look (Eye Button)', value: currentProfile.freeLook, desc: 'Quick 360 camera inspection' }
              ].map(item => (
                <div key={item.key} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-neutral-300">{item.label}</span>
                    <span className="font-mono font-bold text-orange-400">{item.value}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={item.value}
                    onChange={(e) => onChangeProfile({
                      ...currentProfile,
                      [item.key]: Number(e.target.value)
                    })}
                    className="w-full accent-orange-500 bg-neutral-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pro Players Presets Selector */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Verified Pro Presets</h2>
              </div>
              <span className="text-xs text-neutral-500">Official PC Tournament Stars</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PRO_PLAYERS.map(pro => {
                const isSelected = selectedPro?.id === pro.id;
                return (
                  <button
                    key={pro.id}
                    onClick={() => handleApplyPro(pro)}
                    className={`p-2.5 rounded-lg text-left transition-all border ${
                      isSelected
                        ? 'bg-neutral-800/90 border-orange-500 text-white shadow-sm'
                        : 'bg-neutral-950/80 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{pro.name}</span>
                      <span className="text-[10px]">{pro.country.split(' ')[1]}</span>
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate">
                      {pro.mouseDpi} DPI · Y: {pro.emulatorY}
                    </div>
                    <div className="text-[9px] text-orange-400 truncate mt-1">
                      {pro.signatureWeapon}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedPro && (
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-neutral-200">
                  <span>{selectedPro.name} Setup Breakdown</span>
                  <span className="text-[11px] text-neutral-500">{selectedPro.emulator}</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  "{selectedPro.tips}"
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>Mouse: {selectedPro.mouse}</span>
                  <span className="text-orange-400">Tweak: {selectedPro.tweaks}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
