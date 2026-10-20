export interface EmulatorSettingGuide {
  id: string;
  name: string;
  version: string;
  recommendedInstance: string;
  fpsBypassGuide: string[];
  optimalSettings: {
    cpuCores: string;
    ram: string;
    graphicsEngine: string;
    renderer: string;
    astcTexture: string;
    gpuPreference: string;
    resolution: string;
    dpi: string;
    deviceModel: string;
  };
  tweaksExplained: {
    tweak: number;
    name: string;
    characteristics: string;
    bestFor: string;
  }[];
}

export const EMULATOR_GUIDES: EmulatorSettingGuide[] = [
  {
    id: 'bluestacks5',
    name: 'BlueStacks 5',
    version: '5.21+ (Nougat 32-bit / Pie 64-bit)',
    recommendedInstance: 'Pie 64-bit or Nougat 32-bit for lowest input lag',
    fpsBypassGuide: [
      'Open BlueStacks Settings -> Performance.',
      'Check "Enable high frame rate" and slide FPS slider to 60 FPS.',
      'Launch Free Fire and wait until you reach the main lobby.',
      'Without closing the game, open BlueStacks Settings -> Performance again.',
      'Slide FPS slider all the way to 240 FPS and click "Save changes".',
      'Look at your in-game FPS counter: it will now unlock to 90 FPS or 120 FPS smoothly!'
    ],
    optimalSettings: {
      cpuCores: '4 Cores (or 50% of your total CPU cores)',
      ram: '4 GB / High (Memory Allocation: Balanced or High Performance)',
      graphicsEngine: 'Compatibility / Performance Mode',
      renderer: 'OpenGL (NVIDIA) or Vulkan (AMD Radeon)',
      astcTexture: 'Hardware decoding (reduces CPU usage by 35%)',
      gpuPreference: 'Prefer dedicated GPU (NVIDIA GeForce / AMD Radeon) -> ON',
      resolution: '1920x1080 (Landscape) or 1600x900 for weaker GPUs',
      dpi: '240 DPI or 320 DPI (Custom)',
      deviceModel: 'ASUS ROG 2 (ASUS_Z01QD) - mandatory for 90/120 FPS'
    },
    tweaksExplained: [
      {
        tweak: 16450,
        name: 'The Golden Standard (16450)',
        characteristics: 'Smooth vertical drag, zero mouse acceleration, consistent 1-tap flicking.',
        bestFor: 'Shotgun one-taps (M1887) and Desert Eagle flicks.'
      },
      {
        tweak: 21058,
        name: 'Anti-Jitter Low Sensi (21058)',
        characteristics: 'Locks vertical trajectory tightly, prevents reticle bouncing above enemy head.',
        bestFor: 'SMG (MP40, UMP) continuous spray headshots.'
      },
      {
        tweak: 2,
        name: 'Default Raw Direct (2)',
        characteristics: 'Raw mouse cursor input with zero smoothing algorithms.',
        bestFor: 'Players with high-end esports mice (1000Hz polling rate).'
      },
      {
        tweak: 808016466,
        name: 'High Precision Tournament Tweak (808016466)',
        characteristics: 'Eliminates micro-stutter when rotating mouse rapidly at high FPS.',
        bestFor: 'Esports competitive scrims and tournament rooms.'
      }
    ]
  },
  {
    id: 'ldplayer9',
    name: 'LDPlayer 9',
    version: '9.0.68+ (Android 9 Kernel)',
    recommendedInstance: '64-bit Default Android 9 (Low CPU usage)',
    fpsBypassGuide: [
      'Open LDPlayer Settings -> Model -> Select "120 High Frame Rate" model (ROG Phone 5).',
      'Under Game Settings, check "120 FPS High Frame Rate" and enable Vertical Sync.',
      'Launch Free Fire, go to In-game Display settings, set Graphics to Ultra and High FPS to High.',
      'Restart the emulator to stabilize frame times.'
    ],
    optimalSettings: {
      cpuCores: '4 Cores (Recommended)',
      ram: '4096M (4 GB)',
      graphicsEngine: 'DirectX (Intel) or OpenGL (NVIDIA)',
      renderer: 'OpenGL 3.0+ Compatible',
      astcTexture: 'Enabled (High quality cache)',
      gpuPreference: 'High Performance GPU profile',
      resolution: '1920x1080 (dpi 280)',
      dpi: '280 DPI',
      deviceModel: 'ASUS ROG Phone 5'
    },
    tweaksExplained: [
      {
        tweak: 0,
        name: 'LDPlayer Native Smoothing',
        characteristics: 'Optimized internal X/Y mapping without external registry tweaks.',
        bestFor: 'All-around gameplay on modern multi-core PCs.'
      }
    ]
  },
  {
    id: 'msiplayer',
    name: 'MSI App Player',
    version: '4.280 / 5.12',
    recommendedInstance: 'MSI 64-bit with custom Dragon Center optimization',
    fpsBypassGuide: [
      'Navigate to Engine settings.',
      'Set frame rate slider to 60 FPS.',
      'Open Free Fire to the character select screen.',
      'Alt-Tab back to Settings and drag FPS slider to 240 FPS.',
      'Ensure "Display FPS during gameplay" is checked to monitor stability.'
    ],
    optimalSettings: {
      cpuCores: '4 Cores',
      ram: '4 GB',
      graphicsEngine: 'Performance (Legacy)',
      renderer: 'OpenGL',
      astcTexture: 'Hardware decoding',
      gpuPreference: 'NVIDIA Dedicated GPU',
      resolution: '1920x1080 (240 DPI)',
      dpi: '240 DPI',
      deviceModel: 'ASUS_Z01QD'
    },
    tweaksExplained: [
      {
        tweak: 16450,
        name: 'MSI Ultra Flick (16450)',
        characteristics: 'Renowned for the highest one-tap consistency in South American & Asian pro scenes.',
        bestFor: 'DMR (Woodpecker, SVD, AC80) and Desert Eagle.'
      }
    ]
  }
];

export const WINDOWS_TWEAKS = [
  {
    title: 'Disable "Enhance Pointer Precision" (Raw Input)',
    category: 'Mouse Physics',
    importance: 'CRITICAL',
    description: 'Windows adds artificial mouse acceleration by default. If you move your mouse fast, it travels further than if you move it slowly. This ruins muscle memory for Free Fire drag headshots!',
    instruction: 'Press Win + R -> type "main.cpl" -> Pointer Options tab -> Uncheck "Enhance pointer precision" -> Keep slider at 6/11 (exact 1:1 hardware multiplier).'
  },
  {
    title: 'Hardware-Accelerated GPU Scheduling (HAGS)',
    category: 'Display & Latency',
    importance: 'HIGH',
    description: 'Allows your graphics card to manage its own video memory directly, cutting 4ms to 8ms of emulator frame latency.',
    instruction: 'Windows Settings -> System -> Display -> Graphics Settings -> Turn ON "Hardware-accelerated GPU scheduling" -> Restart PC.'
  },
  {
    title: 'Set High Performance Graphics for HD-Player.exe',
    category: 'GPU Allocation',
    importance: 'HIGH',
    description: 'Forces Windows to route BlueStacks/LDPlayer rendering strictly through your discrete NVIDIA or AMD GPU rather than integrated Intel graphics.',
    instruction: 'Windows Settings -> Graphics -> Browse -> Navigate to "C:\\Program Files\\BlueStacks_nxt\\HD-Player.exe" -> Options -> Select "High performance (Dedicated GPU)".'
  },
  {
    title: 'Disable Xbox Game Bar & Background Recording',
    category: 'System Performance',
    importance: 'MEDIUM',
    description: 'Background DVR constantly records emulator frames to disk, causing micro-stutter and sudden FPS drops during gunfights.',
    instruction: 'Windows Settings -> Gaming -> Captures -> Turn OFF "Record what happened" and "Capture audio when recording".'
  }
];
