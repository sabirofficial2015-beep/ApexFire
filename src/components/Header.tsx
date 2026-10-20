import React from 'react';
import { Crosshair, Sliders, Target, Cpu, Keyboard, ShieldAlert, Trophy, Volume2, VolumeX, Flame } from 'lucide-react';
import { soundEffects } from '../utils/audio.ts';

export type NavTab = 'sensi' | 'bestsensi' | 'aim' | 'optimizer' | 'keybinds' | 'weapons' | 'tournament';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onQuickPreset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  soundEnabled,
  onToggleSound,
  onQuickPreset
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'sensi', label: 'Sensi Lab', icon: Sliders },
    { id: 'bestsensi', label: 'Best Sensi (All)', icon: Flame },
    { id: 'aim', label: 'Drag Aim Trainer', icon: Target },
    { id: 'optimizer', label: '120 FPS Optimizer', icon: Cpu },
    { id: 'keybinds', label: 'Keybind Studio', icon: Keyboard },
    { id: 'weapons', label: 'Weapon Lab', icon: ShieldAlert },
    { id: 'tournament', label: 'Tourney Room', icon: Trophy }
  ];

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single-element Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-950/50">
            <Crosshair className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
              ApexFire <span className="text-orange-500 font-extrabold text-xs uppercase px-1.5 py-0.5 bg-orange-950/80 border border-orange-500/30 rounded">PC Pro</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-line whitespace-nowrap) */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundEffects.playClick();
                  onTabChange(item.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : 'text-neutral-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action & Sound Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              onToggleSound();
              soundEffects.playClick();
            }}
            title={soundEnabled ? 'Mute Game Sounds' : 'Enable Game Sounds'}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-orange-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
          </button>
          
          <button
            onClick={() => {
              soundEffects.playClick();
              onQuickPreset();
            }}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-lg shadow-sm shadow-orange-950/40 transition-all whitespace-nowrap"
          >
            Load Pro Sensi
          </button>
        </div>
      </div>

      {/* Mobile Nav Scroller */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-neutral-900 bg-neutral-950/95">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundEffects.playClick();
                onTabChange(item.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon className={`w-3 h-3 ${isActive ? 'text-orange-400' : 'text-neutral-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
