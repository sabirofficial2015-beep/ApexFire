/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, NavTab } from './components/Header.tsx';
import { SensiLab } from './components/SensiLab.tsx';
import { AimTrainer } from './components/AimTrainer.tsx';
import { PCOptimizer } from './components/PCOptimizer.tsx';
import { KeybindStudio } from './components/KeybindStudio.tsx';
import { WeaponLab } from './components/WeaponLab.tsx';
import { TournamentRoom } from './components/TournamentRoom.tsx';
import { BestSensiHub } from './components/BestSensiHub.tsx';
import { SensiProfile, ProPlayer, DeviceSensiPreset } from './types/index.ts';
import { PRO_PLAYERS } from './data/proPlayers.ts';
import { ALL_DEVICE_SENSITIVITIES } from './data/deviceSensitivities.ts';
import { soundEffects } from './utils/audio.ts';
import { Sliders, Target, Cpu, Keyboard, ShieldAlert, Trophy, Sparkles, X, Check, Search, Smartphone, Monitor, Flame } from 'lucide-react';

const DEFAULT_PROFILE: SensiProfile = {
  id: 'white444-default',
  name: 'WHITE444 Pro Setup',
  emulator: 'BlueStacks 5 (Nougat 32-bit)',
  mouseDpi: 800,
  pollingRate: 1000,
  windowsPointerSpeed: 6,
  enhancePointerPrecision: false,
  emulatorX: 1.25,
  emulatorY: 0.62,
  tweaks: 16450,
  general: 98,
  redDot: 95,
  scope2x: 90,
  scope4x: 88,
  sniperScope: 45,
  freeLook: 65,
  author: 'White444',
  notes: 'Ultra-fast flick one-taps with M1887 and Desert Eagle.'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('sensi');
  const [currentProfile, setCurrentProfile] = useState<SensiProfile>(DEFAULT_PROFILE);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showProModal, setShowProModal] = useState<boolean>(false);
  const [modalCategory, setModalCategory] = useState<'pro' | 'emulator' | 'phone'>('pro');
  const [proSearchQuery, setProSearchQuery] = useState<string>('');

  const handleSelectProFromModal = (pro: ProPlayer) => {
    setCurrentProfile({
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
    setShowProModal(false);
    setProSearchQuery('');
    soundEffects.playHeadshot();
  };

  const handleApplyDevicePreset = (preset: DeviceSensiPreset) => {
    setCurrentProfile({
      id: `preset-${preset.id}`,
      name: preset.name,
      emulator: preset.deviceType === 'emulator' ? preset.name : `Mobile (${preset.brand})`,
      mouseDpi: preset.mouseDpi || 800,
      pollingRate: 1000,
      windowsPointerSpeed: 6,
      enhancePointerPrecision: false,
      emulatorX: preset.emulatorX || 1.25,
      emulatorY: preset.emulatorY || 0.65,
      tweaks: preset.tweaks || 16450,
      general: preset.general,
      redDot: preset.redDot,
      scope2x: preset.scope2x,
      scope4x: preset.scope4x,
      sniperScope: preset.sniperScope,
      freeLook: preset.freeLook,
      author: preset.brand,
      notes: preset.headshotTrick
    });
    setShowProModal(false);
    setProSearchQuery('');
    soundEffects.playHeadshot();
  };

  const filteredProPlayers = PRO_PLAYERS.filter(pro => {
    const q = proSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      pro.name.toLowerCase().includes(q) ||
      pro.realName.toLowerCase().includes(q) ||
      pro.signatureWeapon.toLowerCase().includes(q) ||
      pro.team.toLowerCase().includes(q) ||
      pro.country.toLowerCase().includes(q)
    );
  });

  const filteredDevicePresets = ALL_DEVICE_SENSITIVITIES.filter(device => {
    if (modalCategory !== 'pro' && device.deviceType !== modalCategory) return false;
    const q = proSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      device.name.toLowerCase().includes(q) ||
      device.brand.toLowerCase().includes(q) ||
      device.modelBadge.toLowerCase().includes(q) ||
      device.headshotTrick.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-orange-600 selection:text-white">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        onQuickPreset={() => setShowProModal(true)}
      />

      {/* Hero Overview Strip */}
      <section className="border-b border-neutral-900 bg-gradient-to-b from-neutral-900/40 via-neutral-950 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
            {/* Left Column: Brand Context & Real Stats */}
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span className="text-orange-400 font-bold">Free Fire PC Control Panel</span>
                <span aria-hidden="true">·</span>
                <span>BlueStacks / LDPlayer / MSI</span>
                <span aria-hidden="true">·</span>
                <span>Raw 1:1 Input Ready</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Master PC Sensitivity, 120 FPS & Drag Headshots
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Tune vertical Y-axis drag response, simulate one-tap Desert Eagle flick physics in real-time, remove Windows mouse acceleration, and coordinate custom tournament rooms.
              </p>
            </div>

            {/* Right Column: Hero Graphic Banner with Fallback */}
            <div className="shrink-0 w-full lg:w-96 h-36 rounded-xl overflow-hidden relative border border-neutral-800 shadow-xl group">
              <img
                src="/src/assets/images/esports_pc_setup_1792429713171.jpg"
                alt="Free Fire PC Gaming Setup"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end p-3.5">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-orange-400 font-bold">Active Setup</span>
                    <div className="text-xs font-bold text-white truncate">{currentProfile.name}</div>
                  </div>
                  <div className="text-right text-[11px] font-mono text-neutral-300">
                    <span className="text-orange-400 font-bold">{currentProfile.mouseDpi}</span> DPI · Y: <span className="text-orange-400 font-bold">{currentProfile.emulatorY}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Workstation Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'sensi' && (
          <SensiLab
            currentProfile={currentProfile}
            onChangeProfile={setCurrentProfile}
            onJumpToTrainer={() => setActiveTab('aim')}
            onBrowseAllDevices={() => setActiveTab('bestsensi')}
          />
        )}

        {activeTab === 'bestsensi' && (
          <BestSensiHub
            onApplyPreset={handleApplyDevicePreset}
            onJumpToTrainer={() => setActiveTab('aim')}
          />
        )}

        {activeTab === 'aim' && (
          <AimTrainer
            currentProfile={currentProfile}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'optimizer' && (
          <PCOptimizer />
        )}

        {activeTab === 'keybinds' && (
          <KeybindStudio />
        )}

        {activeTab === 'weapons' && (
          <WeaponLab />
        )}

        {activeTab === 'tournament' && (
          <TournamentRoom />
        )}
      </main>

      {/* Pro Preset Quick Modal */}
      {showProModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h2 className="text-base font-bold text-white">Select Headshot Sensitivity</h2>
              </div>
              <button
                onClick={() => setShowProModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Category Switcher */}
            <div className="flex items-center gap-1 p-1 bg-neutral-950 border border-neutral-800 rounded-lg">
              <button
                onClick={() => {
                  setModalCategory('pro');
                  soundEffects.playClick();
                }}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  modalCategory === 'pro'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>Pro Players ({PRO_PLAYERS.length})</span>
              </button>
              <button
                onClick={() => {
                  setModalCategory('emulator');
                  soundEffects.playClick();
                }}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  modalCategory === 'emulator'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span>Emulators ({ALL_DEVICE_SENSITIVITIES.filter(d => d.deviceType === 'emulator').length})</span>
              </button>
              <button
                onClick={() => {
                  setModalCategory('phone');
                  soundEffects.playClick();
                }}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  modalCategory === 'phone'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Phones ({ALL_DEVICE_SENSITIVITIES.filter(d => d.deviceType === 'phone').length})</span>
              </button>
            </div>

            {/* Search Input Field */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={
                  modalCategory === 'pro'
                    ? 'Search pro players by name or weapon (e.g. Ruok, M1887)...'
                    : modalCategory === 'emulator'
                    ? 'Search emulators (e.g. BlueStacks, LDPlayer, MSI, SmartGaGa)...'
                    : 'Search phone brands (e.g. iPhone, Samsung, POCO, Redmi, OnePlus)...'
                }
                value={proSearchQuery}
                onChange={(e) => setProSearchQuery(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
                autoFocus
              />
              {proSearchQuery && (
                <button
                  onClick={() => setProSearchQuery('')}
                  title="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-neutral-500 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category: Pro Players */}
            {modalCategory === 'pro' && (
              filteredProPlayers.length === 0 ? (
                <div className="p-8 text-center bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-2">
                  <p className="text-xs text-neutral-400">
                    No professional players found matching <span className="text-white font-semibold">"{proSearchQuery}"</span>
                  </p>
                  <button
                    onClick={() => setProSearchQuery('')}
                    className="px-3 py-1.5 text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors"
                  >
                    Clear search filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {filteredProPlayers.map((pro) => (
                    <button
                      key={pro.id}
                      onClick={() => handleSelectProFromModal(pro)}
                      className="p-3 bg-neutral-950 border border-neutral-800 hover:border-orange-500 rounded-xl text-left transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors">
                          {pro.name}
                        </span>
                        <span className="text-xs">{pro.country.split(' ')[1]}</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        {pro.mouseDpi} DPI · X: {pro.emulatorX} · Y: {pro.emulatorY}
                      </div>
                      <div className="text-[10px] text-orange-400 mt-1 truncate">
                        {pro.signatureWeapon}
                      </div>
                    </button>
                  ))}
                </div>
              )
            )}

            {/* Category: Emulators or Phones */}
            {modalCategory !== 'pro' && (
              filteredDevicePresets.length === 0 ? (
                <div className="p-8 text-center bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-2">
                  <p className="text-xs text-neutral-400">
                    No presets found matching <span className="text-white font-semibold">"{proSearchQuery}"</span>
                  </p>
                  <button
                    onClick={() => setProSearchQuery('')}
                    className="px-3 py-1.5 text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors"
                  >
                    Clear search filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {filteredDevicePresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyDevicePreset(preset)}
                      className="p-3 bg-neutral-950 border border-neutral-800 hover:border-orange-500 rounded-xl text-left transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors truncate max-w-[190px]">
                          {preset.name}
                        </span>
                        <span className="text-[10px] font-mono text-amber-400">
                          ★ {preset.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        {preset.deviceType === 'emulator'
                          ? `${preset.mouseDpi} DPI · Y: ${preset.emulatorY}`
                          : `Fire Btn: ${preset.fireButtonSize}% · DPI: ${preset.phoneDpi || 'iOS'}`}
                      </div>
                      <div className="text-[10px] text-orange-400 mt-1 truncate">
                        General: {preset.general} · Red Dot: {preset.redDot}
                      </div>
                    </button>
                  ))}
                </div>
              )
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowProModal(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-300">ApexFire Pro</span>
            <span aria-hidden="true">·</span>
            <span>Free Fire PC Optimization & Esports Companion</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>BlueStacks 5</span>
            <span aria-hidden="true">·</span>
            <span>LDPlayer 9</span>
            <span aria-hidden="true">·</span>
            <span>MSI App Player</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
