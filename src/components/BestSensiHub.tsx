import React, { useState } from 'react';
import { DeviceSensiPreset, DeviceType, SensiProfile } from '../types/index.ts';
import { ALL_DEVICE_SENSITIVITIES } from '../data/deviceSensitivities.ts';
import { soundEffects } from '../utils/audio.ts';
import { 
  Smartphone, 
  Monitor, 
  Search, 
  Check, 
  Copy, 
  Sliders, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Star,
  Info,
  X
} from 'lucide-react';

interface BestSensiHubProps {
  onApplyPreset: (preset: DeviceSensiPreset) => void;
  onJumpToTrainer: () => void;
}

export const BestSensiHub: React.FC<BestSensiHubProps> = ({
  onApplyPreset,
  onJumpToTrainer
}) => {
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<DeviceType | 'all'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  // Extract unique brands based on current type
  const availableBrands = Array.from(
    new Set(
      ALL_DEVICE_SENSITIVITIES
        .filter(d => deviceTypeFilter === 'all' || d.deviceType === deviceTypeFilter)
        .map(d => d.brand)
    )
  );

  const filteredPresets = ALL_DEVICE_SENSITIVITIES.filter(preset => {
    if (deviceTypeFilter !== 'all' && preset.deviceType !== deviceTypeFilter) {
      return false;
    }
    if (selectedBrand !== 'all' && preset.brand !== selectedBrand) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = preset.name.toLowerCase().includes(q);
      const matchBrand = preset.brand.toLowerCase().includes(q);
      const matchBadge = preset.modelBadge.toLowerCase().includes(q);
      const matchTrick = preset.headshotTrick.toLowerCase().includes(q);
      return matchName || matchBrand || matchBadge || matchTrick;
    }
    return true;
  });

  const handleCopyPreset = (preset: DeviceSensiPreset) => {
    let text = `🔥 [ApexFire Pro] Best Free Fire Headshot Sensi for ${preset.name}:\n`;
    text += `• In-Game Sensi: General: ${preset.general} | Red Dot: ${preset.redDot} | 2x: ${preset.scope2x} | 4x: ${preset.scope4x} | Sniper: ${preset.sniperScope} | Free Look: ${preset.freeLook}\n`;
    
    if (preset.deviceType === 'emulator') {
      text += `• Emulator Settings: Mouse DPI: ${preset.mouseDpi} DPI | X-Axis: ${preset.emulatorX} | Y-Axis (Drag): ${preset.emulatorY} | Tweak: ${preset.tweaks}\n`;
    } else {
      text += `• Phone Setup: DPI (Smallest Width): ${preset.phoneDpi || 'Default iOS'} | Pointer Speed: ${preset.pointerSpeed} | Fire Button: ${preset.fireButtonSize}% (${preset.fireButtonPosition}) | Graphics: ${preset.graphicSetting}\n`;
    }
    text += `• Headshot Secret: "${preset.headshotTrick}"\nGenerated via ApexFire Pro`;

    navigator.clipboard.writeText(text);
    setCopiedId(preset.id);
    soundEffects.playClick();
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleApply = (preset: DeviceSensiPreset) => {
    onApplyPreset(preset);
    setAppliedId(preset.id);
    soundEffects.playHeadshot();
    setTimeout(() => setAppliedId(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>All Emulator & Phone Best Headshot Sensi</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Verified one-tap and drag headshot sensitivities for every major PC emulator and Android/iOS phone brand.
          </p>
        </div>

        <button
          onClick={onJumpToTrainer}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition-all whitespace-nowrap"
        >
          <span>Test in Drag Trainer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Emulator vs Phone Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-neutral-950 border border-neutral-800 rounded-lg">
            <button
              onClick={() => {
                setDeviceTypeFilter('all');
                setSelectedBrand('all');
                soundEffects.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                deviceTypeFilter === 'all'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>All ({ALL_DEVICE_SENSITIVITIES.length})</span>
            </button>
            <button
              onClick={() => {
                setDeviceTypeFilter('emulator');
                setSelectedBrand('all');
                soundEffects.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                deviceTypeFilter === 'emulator'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-orange-400" />
              <span>Emulators (PC)</span>
            </button>
            <button
              onClick={() => {
                setDeviceTypeFilter('phone');
                setSelectedBrand('all');
                soundEffects.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                deviceTypeFilter === 'phone'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-orange-400" />
              <span>Phones (iOS/Android)</span>
            </button>
          </div>

          {/* Search Field */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search emulator or phone model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-8 pr-8 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-neutral-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Brand Badges Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
          <span className="text-[11px] text-neutral-500 shrink-0 mr-1">Brand:</span>
          <button
            onClick={() => {
              setSelectedBrand('all');
              soundEffects.playClick();
            }}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedBrand === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            All Brands
          </button>
          {availableBrands.map(brand => (
            <button
              key={brand}
              onClick={() => {
                setSelectedBrand(brand);
                soundEffects.playClick();
              }}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedBrand === brand
                  ? 'bg-orange-600 text-white'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Cards Grid */}
      {filteredPresets.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl space-y-3">
          <p className="text-sm text-neutral-400">
            No devices or emulators found matching <span className="text-white font-semibold">"{searchQuery}"</span>
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedBrand('all');
              setDeviceTypeFilter('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-orange-400 hover:text-orange-300"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPresets.map(preset => {
            const isEmulator = preset.deviceType === 'emulator';
            const isCopied = copiedId === preset.id;
            const isApplied = appliedId === preset.id;

            return (
              <div
                key={preset.id}
                className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between hover:border-neutral-700 transition-all space-y-4 group"
              >
                {/* Header */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
                      {isEmulator ? (
                        <Monitor className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span>{preset.brand}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{preset.rating.toFixed(1)}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors leading-snug">
                    {preset.name}
                  </h3>
                  <div className="text-[11px] font-mono text-neutral-400">
                    {preset.modelBadge}
                  </div>
                </div>

                {/* In-Game Sensitivity Sliders Breakdown */}
                <div className="p-3 bg-neutral-950/80 border border-neutral-800/80 rounded-lg space-y-2">
                  <div className="text-[11px] font-semibold text-neutral-300 flex items-center justify-between">
                    <span>In-Game Sensitivity:</span>
                    <span className="text-[10px] text-orange-400 font-mono">Headshot Calibrated</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-1.5 bg-neutral-900 border border-neutral-800 rounded">
                      <div className="text-[9px] text-neutral-500 uppercase">General</div>
                      <div className="font-mono font-bold text-orange-400 text-sm">{preset.general}</div>
                    </div>
                    <div className="p-1.5 bg-neutral-900 border border-neutral-800 rounded">
                      <div className="text-[9px] text-neutral-500 uppercase">Red Dot</div>
                      <div className="font-mono font-bold text-red-400 text-sm">{preset.redDot}</div>
                    </div>
                    <div className="p-1.5 bg-neutral-900 border border-neutral-800 rounded">
                      <div className="text-[9px] text-neutral-500 uppercase">2x Scope</div>
                      <div className="font-mono font-bold text-neutral-200 text-sm">{preset.scope2x}</div>
                    </div>
                    <div className="p-1.5 bg-neutral-900 border border-neutral-800 rounded">
                      <div className="text-[9px] text-neutral-500 uppercase">4x Scope</div>
                      <div className="font-mono font-bold text-neutral-200 text-sm">{preset.scope4x}</div>
                    </div>
                    <div className="p-1.5 bg-neutral-900 border border-neutral-800 rounded">
                      <div className="text-[9px] text-neutral-500 uppercase">AWM Sniper</div>
                      <div className="font-mono font-bold text-neutral-300 text-sm">{preset.sniperScope}</div>
                    </div>
                    <div className="p-1.5 bg-neutral-900 border border-neutral-800 rounded">
                      <div className="text-[9px] text-neutral-500 uppercase">Free Look</div>
                      <div className="font-mono font-bold text-neutral-400 text-sm">{preset.freeLook}</div>
                    </div>
                  </div>
                </div>

                {/* Device Hardware Spec Highlights */}
                <div className="text-xs space-y-1.5">
                  {isEmulator ? (
                    <div className="p-2.5 bg-blue-950/20 border border-blue-900/30 rounded-lg space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Mouse DPI:</span>
                        <strong className="text-white">{preset.mouseDpi} DPI</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">X / Y Sensitivity:</span>
                        <strong className="text-orange-400">X: {preset.emulatorX} · Y: {preset.emulatorY}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Tweak Code:</span>
                        <strong className="text-amber-400">{preset.tweaks}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-emerald-950/20 border border-emerald-900/30 rounded-lg space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Phone DPI:</span>
                        <strong className="text-white">{preset.phoneDpi ? `${preset.phoneDpi} (Dev Options)` : 'Default 120Hz'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Fire Button:</span>
                        <strong className="text-orange-400">{preset.fireButtonSize}% ({preset.fireButtonPosition})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Pointer Speed:</span>
                        <strong className="text-neutral-200">{preset.pointerSpeed}</strong>
                      </div>
                      {preset.graphicSetting && (
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Graphics:</span>
                          <strong className="text-neutral-300 truncate max-w-[170px]">{preset.graphicSetting}</strong>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pro Headshot Secret */}
                  <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-[11px] text-neutral-400 leading-relaxed">
                    <span className="text-orange-400 font-semibold block mb-0.5">Headshot Secret:</span>
                    "{preset.headshotTrick}"
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-neutral-800">
                  <button
                    onClick={() => handleApply(preset)}
                    className="flex-1 py-2 text-xs font-semibold rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    {isApplied ? <Check className="w-3.5 h-3.5" /> : <Sliders className="w-3.5 h-3.5" />}
                    <span>{isApplied ? 'Applied to Active' : 'Apply Sensi'}</span>
                  </button>
                  <button
                    onClick={() => handleCopyPreset(preset)}
                    className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                    title="Copy Sensi"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
