import React, { useState } from 'react';
import { Cpu, Monitor, Zap, Download, CheckCircle2, AlertCircle, Copy, Check, Sliders, ShieldCheck } from 'lucide-react';
import { EMULATOR_GUIDES, WINDOWS_TWEAKS } from '../data/emulatorGuides.ts';
import { soundEffects } from '../utils/audio.ts';

export const PCOptimizer: React.FC = () => {
  const [selectedEmulatorId, setSelectedEmulatorId] = useState<string>('bluestacks5');
  const [userRam, setUserRam] = useState<number>(16);
  const [userCores, setUserCores] = useState<number>(8);
  const [gpuBrand, setGpuBrand] = useState<'nvidia' | 'amd' | 'intel'>('nvidia');
  const [checkedSteps, setCheckedSteps] = useState<{ [key: string]: boolean }>({});
  const [copiedScript, setCopiedScript] = useState(false);

  const currentGuide = EMULATOR_GUIDES.find(g => g.id === selectedEmulatorId) || EMULATOR_GUIDES[0];

  const toggleStep = (stepIdx: number) => {
    setCheckedSteps(prev => ({ ...prev, [stepIdx]: !prev[stepIdx] }));
    soundEffects.playClick();
  };

  // Safe Mouse 1:1 Raw Registry contents
  const mouseRegContent = `Windows Registry Editor Version 5.00

; ApexFire Pro 1:1 Raw Mouse Precision (Disables Windows Pointer Acceleration)
[HKEY_CURRENT_USER\\Control Panel\\Mouse]
"MouseSpeed"="0"
"MouseThreshold1"="0"
"MouseThreshold2"="0"
"MouseSensitivity"="10"
`;

  const handleCopyMouseReg = () => {
    navigator.clipboard.writeText(mouseRegContent);
    setCopiedScript(true);
    soundEffects.playClick();
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleDownloadReg = () => {
    const blob = new Blob([mouseRegContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ApexFire_Raw_Mouse_1to1.reg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    soundEffects.playClick();
  };

  // Hardware Recommendation Calculation
  const recommendedAllocCores = Math.min(4, Math.max(2, Math.floor(userCores / 2)));
  const recommendedAllocRam = userRam >= 16 ? 4096 : 3072;
  const recommendedRenderer = gpuBrand === 'nvidia' ? 'OpenGL (NVIDIA Dedicated)' : gpuBrand === 'amd' ? 'Vulkan / DirectX' : 'DirectX';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>PC & Emulator 120 FPS Performance Optimizer</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Unlock smooth 90 FPS/120 FPS in Free Fire, eliminate emulator micro-stutter, and configure 1:1 raw mouse physics.
          </p>
        </div>

        {/* Emulator Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
          {EMULATOR_GUIDES.map(guide => (
            <button
              key={guide.id}
              onClick={() => {
                setSelectedEmulatorId(guide.id);
                soundEffects.playClick();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                selectedEmulatorId === guide.id
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {guide.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 120 FPS Unlocker & Step-by-Step Guide (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: 120 FPS Bypass Checklist */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                  {currentGuide.name} 90/120 FPS Bypass Technique
                </h2>
              </div>
              <span className="text-xs text-orange-400 font-mono font-medium">Bypass Method</span>
            </div>

            <p className="text-xs text-neutral-400">
              Free Fire caps standard mobile devices at 60 FPS. Follow this verified sequence to force the emulator display refresh to 120 FPS:
            </p>

            <div className="space-y-2.5 pt-1">
              {currentGuide.fpsBypassGuide.map((step, idx) => {
                const isChecked = !!checkedSteps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-orange-950/20 border-orange-500/40 text-neutral-200'
                        : 'bg-neutral-950 border-neutral-800/80 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-orange-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-neutral-700 flex items-center justify-center text-[10px] text-neutral-500 font-mono">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <span className={`text-xs leading-relaxed ${isChecked ? 'line-through text-neutral-400' : ''}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Optimal Emulator Settings Table */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-orange-500" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Recommended Internal Settings ({currentGuide.name})
                </h2>
              </div>
              <span className="text-xs text-neutral-500 font-mono">{currentGuide.version}</span>
            </div>

            <div className="divide-y divide-neutral-800 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-neutral-400">CPU Allocation</span>
                <span className="font-mono text-white font-medium">{currentGuide.optimalSettings.cpuCores}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-neutral-400">RAM Allocation</span>
                <span className="font-mono text-white font-medium">{currentGuide.optimalSettings.ram}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-neutral-400">Graphics Engine</span>
                <span className="font-mono text-white font-medium">{currentGuide.optimalSettings.graphicsEngine}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-neutral-400">Graphics Renderer</span>
                <span className="font-mono text-orange-400 font-bold">{currentGuide.optimalSettings.renderer}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-neutral-400">ASTC Textures</span>
                <span className="font-mono text-white font-medium">{currentGuide.optimalSettings.astcTexture}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-neutral-400">Device Model Profile</span>
                <span className="font-mono text-amber-400 font-bold">{currentGuide.optimalSettings.deviceModel}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-neutral-400">Display Resolution & DPI</span>
                <span className="font-mono text-white font-medium">{currentGuide.optimalSettings.resolution} ({currentGuide.optimalSettings.dpi})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: PC Spec Calculator & Windows Optimization (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* PC Spec Tuner */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-orange-500" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Your PC Specifications</h2>
              </div>
              <span className="text-xs text-neutral-500">Auto-Tune</span>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-400">Total System RAM:</span>
                  <span className="text-white font-mono font-bold">{userRam} GB</span>
                </div>
                <div className="flex gap-2">
                  {[8, 16, 32, 64].map(ram => (
                    <button
                      key={ram}
                      onClick={() => {
                        setUserRam(ram);
                        soundEffects.playClick();
                      }}
                      className={`flex-1 py-1.5 text-xs font-mono rounded ${
                        userRam === ram
                          ? 'bg-orange-600 text-white font-bold'
                          : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
                      }`}
                    >
                      {ram}GB
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-400">Total CPU Cores:</span>
                  <span className="text-white font-mono font-bold">{userCores} Cores</span>
                </div>
                <div className="flex gap-2">
                  {[4, 6, 8, 12, 16].map(cores => (
                    <button
                      key={cores}
                      onClick={() => {
                        setUserCores(cores);
                        soundEffects.playClick();
                      }}
                      className={`flex-1 py-1.5 text-xs font-mono rounded ${
                        userCores === cores
                          ? 'bg-orange-600 text-white font-bold'
                          : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
                      }`}
                    >
                      {cores}C
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs text-neutral-400 mb-1">Graphics Card (GPU):</span>
                <div className="flex gap-2">
                  {[
                    { id: 'nvidia', label: 'NVIDIA GeForce' },
                    { id: 'amd', label: 'AMD Radeon' },
                    { id: 'intel', label: 'Intel Arc / Iris' }
                  ].map(gpu => (
                    <button
                      key={gpu.id}
                      onClick={() => {
                        setGpuBrand(gpu.id as 'nvidia' | 'amd' | 'intel');
                        soundEffects.playClick();
                      }}
                      className={`flex-1 py-1.5 text-xs rounded transition-colors ${
                        gpuBrand === gpu.id
                          ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                          : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
                      }`}
                    >
                      {gpu.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Allocation Recommendation */}
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg space-y-1.5 text-xs">
              <div className="font-semibold text-orange-400">Optimal Emulator Allocation for Your Rig:</div>
              <div className="grid grid-cols-2 gap-2 text-neutral-300 font-mono text-[11px] pt-1">
                <div>• Allocate Cores: <strong className="text-white">{recommendedAllocCores} Cores</strong></div>
                <div>• Allocate RAM: <strong className="text-white">{recommendedAllocRam} MB</strong></div>
                <div className="col-span-2">• Recommended Renderer: <strong className="text-white">{recommendedRenderer}</strong></div>
              </div>
            </div>
          </div>

          {/* Windows Raw Input & Mouse Acceleration Tweak */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Windows 1:1 Raw Mouse Fix</h2>
              </div>
              <span className="text-[11px] text-red-400 font-bold uppercase">Critical</span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Windows "Enhance Pointer Precision" introduces non-linear mouse acceleration. Fast wrist flicks will overshoot, while slow micro-adjustments will freeze.
            </p>

            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg space-y-2">
              <div className="text-[11px] font-mono text-neutral-300 leading-relaxed">
                Step 1: Press <code className="text-orange-400 font-bold bg-neutral-900 px-1 py-0.5 rounded">Win + R</code> &gt; type <code className="text-orange-400 font-bold bg-neutral-900 px-1 py-0.5 rounded">main.cpl</code><br />
                Step 2: Pointer Options &gt; Uncheck <strong>Enhance pointer precision</strong><br />
                Step 3: Keep Pointer Speed at exact <strong>6/11 (Center)</strong>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
                <button
                  onClick={handleCopyMouseReg}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 rounded transition-colors"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
                  <span>{copiedScript ? 'Copied .reg Script' : 'Copy 1:1 Registry Script'}</span>
                </button>
                <button
                  onClick={handleDownloadReg}
                  className="flex items-center justify-center gap-1 py-1.5 px-3 text-xs font-medium bg-orange-600 hover:bg-orange-500 text-white rounded transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .reg</span>
                </button>
              </div>
            </div>

            {/* Windows System Tweaks list */}
            <div className="space-y-2 pt-1">
              {WINDOWS_TWEAKS.map((twk, i) => (
                <div key={i} className="p-2.5 bg-neutral-950/70 border border-neutral-800/80 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-200">{twk.title}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">{twk.category}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">{twk.description}</p>
                  <div className="text-[10px] text-orange-400/90 font-mono pt-0.5">{twk.instruction}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
