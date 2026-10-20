import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Target, Zap, RotateCcw, Volume2, Shield, Crosshair, Award, Flame } from 'lucide-react';
import { soundEffects } from '../utils/audio.ts';
import { SensiProfile } from '../types/index.ts';

interface AimTrainerProps {
  currentProfile: SensiProfile;
  soundEnabled: boolean;
}

interface DamagePop {
  id: number;
  x: number;
  y: number;
  damage: number;
  isHeadshot: boolean;
  text?: string;
}

type WeaponType = 'deagle' | 'm1887' | 'mp40' | 'woodpecker';

export const AimTrainer: React.FC<AimTrainerProps> = ({ currentProfile, soundEnabled }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [weapon, setWeapon] = useState<WeaponType>('deagle');
  const [targetMode, setTargetMode] = useState<'static' | 'moving' | 'peek'>('static');
  
  // Game stats
  const [totalShots, setTotalShots] = useState(0);
  const [headshots, setHeadshots] = useState(0);
  const [bodyshots, setBodyshots] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [feedback, setFeedback] = useState<string>('Drag your mouse upward quickly to hit a red headshot!');
  const [feedbackColor, setFeedbackColor] = useState<string>('text-neutral-400');
  
  // Drag detection state
  const isMouseDown = useRef(false);
  const dragStartPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const [dragTrace, setDragTrace] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);

  // Target coordinates in percentages
  const [targetPos, setTargetPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [targetDirection, setTargetDirection] = useState<number>(1);
  const [isPeeking, setIsPeeking] = useState(true);

  // Floating damage numbers
  const [damagePops, setDamagePops] = useState<DamagePop[]>([]);

  // Moving target loop
  useEffect(() => {
    if (targetMode === 'moving') {
      const interval = setInterval(() => {
        setTargetPos(prev => {
          let newX = prev.x + targetDirection * 0.4;
          let newDir = targetDirection;
          if (newX > 75) {
            newX = 75;
            newDir = -1;
          } else if (newX < 25) {
            newX = 25;
            newDir = 1;
          }
          setTargetDirection(newDir);
          return { ...prev, x: newX };
        });
      }, 20);
      return () => clearInterval(interval);
    } else if (targetMode === 'peek') {
      const interval = setInterval(() => {
        setIsPeeking(p => !p);
        if (!isPeeking) {
          // Relocate randomly
          setTargetPos({
            x: 25 + Math.random() * 50,
            y: 40 + Math.random() * 20
          });
        }
      }, 1400);
      return () => clearInterval(interval);
    } else {
      setTargetPos({ x: 50, y: 50 });
      setIsPeeking(true);
    }
  }, [targetMode, targetDirection, isPeeking]);

  // Clean up old damage pops
  useEffect(() => {
    if (damagePops.length === 0) return;
    const timer = setTimeout(() => {
      setDamagePops(prev => prev.slice(1));
    }, 900);
    return () => clearTimeout(timer);
  }, [damagePops]);

  const resetStats = () => {
    setTotalShots(0);
    setHeadshots(0);
    setBodyshots(0);
    setStreak(0);
    setFeedback('Stats reset. Ready for drag headshot practice.');
    setFeedbackColor('text-neutral-400');
    soundEffects.playClick();
  };

  // Process shot hit detection based on drag vector
  const evaluateShot = useCallback((endX: number, endY: number, startX: number, startY: number, dragDurationMs: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Convert target to screen pixels
    const targetPixelX = rect.left + (rect.width * targetPos.x) / 100;
    const targetPixelY = rect.top + (rect.height * targetPos.y) / 100;

    // Free Fire bot dimensions
    const headRadius = 24;
    const headCenterY = targetPixelY - 45;
    const chestCenterY = targetPixelY + 5;
    const bodyRadiusX = 35;
    const bodyHeight = 90;

    // Vertical drag calculation
    // In Free Fire, mouse Y sensitivity scales how much vertical drag registers
    const verticalDragDistance = (startY - endY); // positive = dragged UP
    const effectiveDrag = verticalDragDistance * (currentProfile.emulatorY * 1.6);
    const dragSpeed = verticalDragDistance / Math.max(1, dragDurationMs); // px per ms

    setTotalShots(prev => prev + 1);

    // Gunshot audio
    if (soundEnabled) {
      if (weapon === 'm1887') soundEffects.playGunshot('shotgun');
      else if (weapon === 'mp40') soundEffects.playGunshot('smg');
      else if (weapon === 'woodpecker') soundEffects.playGunshot('sniper');
      else soundEffects.playGunshot('pistol');
    }

    // Distance of click from target horizontal center
    const horizontalDist = Math.abs(startX - targetPixelX);

    // Did the player start on the enemy?
    const startedOnEnemy = horizontalDist < bodyRadiusX + 25 && startY > (headCenterY - 30) && startY < (chestCenterY + bodyHeight);

    let isHead = false;
    let isBody = false;
    let damage = 0;

    if (startedOnEnemy) {
      // Check drag physics
      // If dragged upward sufficiently with good velocity
      if (effectiveDrag > 28 && effectiveDrag < 220) {
        // Successful headshot!
        isHead = true;
        if (weapon === 'deagle') damage = 495;
        else if (weapon === 'm1887') damage = 350;
        else if (weapon === 'woodpecker') damage = 275;
        else damage = 142; // MP40 headshot

        setHeadshots(prev => {
          const next = prev + 1;
          return next;
        });
        setStreak(prev => {
          const next = prev + 1;
          setMaxStreak(m => Math.max(m, next));
          return next;
        });

        if (soundEnabled) soundEffects.playHeadshot();

        setFeedback('🔥 PERFECT DRAG! Clean Red Headshot!');
        setFeedbackColor('text-red-500');
      } else if (effectiveDrag >= 220) {
        // Over-dragged: went flying above head
        setStreak(0);
        setFeedback('⚠️ OVER-DRAG: You dragged too hard! Reticle flew above target.');
        setFeedbackColor('text-amber-400');
      } else {
        // Too little drag or dragged down: stuck on chest
        isBody = true;
        if (weapon === 'deagle') damage = 90;
        else if (weapon === 'm1887') damage = 110;
        else if (weapon === 'woodpecker') damage = 72;
        else damage = 36;

        setBodyshots(prev => prev + 1);
        setStreak(0);
        if (soundEnabled) soundEffects.playBodyHit();

        setFeedback('⚠️ STUCK ON CHEST: Drag faster upward to reach the head.');
        setFeedbackColor('text-yellow-400');
      }
    } else {
      // Clicked outside target
      setStreak(0);
      setFeedback('❌ MISS: Initial crosshair was off-target.');
      setFeedbackColor('text-neutral-500');
    }

    // Add damage pop
    if (damage > 0) {
      const popX = targetPixelX - rect.left + (Math.random() * 20 - 10);
      const popY = (isHead ? headCenterY : chestCenterY) - rect.top;
      setDamagePops(prev => [
        ...prev,
        { id: Date.now() + Math.random(), x: popX, y: popY, damage, isHeadshot: isHead }
      ]);
    }
  }, [currentProfile.emulatorY, soundEnabled, targetPos, weapon]);

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isMouseDown.current = true;
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now()
    };
    setDragTrace({
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown.current || !dragStartPos.current) return;
    setDragTrace({
      startX: dragStartPos.current.x,
      startY: dragStartPos.current.y,
      currentX: e.clientX,
      currentY: e.clientY
    });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown.current || !dragStartPos.current) return;
    const now = performance.now();
    const duration = Math.max(10, now - dragStartPos.current.time);
    
    evaluateShot(
      e.clientX,
      e.clientY,
      dragStartPos.current.x,
      dragStartPos.current.y,
      duration
    );

    isMouseDown.current = false;
    dragStartPos.current = null;
    setDragTrace(null);
  };

  const hsRate = totalShots > 0 ? Math.round((headshots / totalShots) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner and Stats Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Free Fire One-Tap Drag Headshot Trainer</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Simulates the authentic Free Fire upward mouse drag mechanic. Hold click on the chest and flick upward!
          </p>
        </div>

        {/* Live Metrics Row */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800">
            <span className="text-neutral-500">Shots: </span>
            <span className="text-white font-bold tabular-nums">{totalShots}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/40">
            <span className="text-neutral-400">Headshots: </span>
            <span className="text-red-400 font-bold tabular-nums">{headshots}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-orange-950/40 border border-orange-900/40">
            <span className="text-neutral-400">HS Rate: </span>
            <span className="text-orange-400 font-bold tabular-nums">{hsRate}%</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800">
            <span className="text-neutral-500">Streak: </span>
            <span className="text-amber-400 font-bold tabular-nums">{streak} (Best: {maxStreak})</span>
          </div>
          <button
            onClick={resetStats}
            title="Reset Scoreboard"
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Control Bar: Weapon Selection & Target Mode */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-900/60 border border-neutral-800 rounded-xl">
        {/* Weapon Tabs */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-neutral-400 mr-1.5">Weapon:</span>
          {[
            { id: 'deagle', label: 'Desert Eagle (One-Tap 495)' },
            { id: 'm1887', label: 'M1887 (Shotgun Drag)' },
            { id: 'mp40', label: 'MP40 (Rapid Spray)' },
            { id: 'woodpecker', label: 'Woodpecker (DMR)' }
          ].map(w => (
            <button
              key={w.id}
              onClick={() => {
                setWeapon(w.id as WeaponType);
                soundEffects.playClick();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                weapon === w.id
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>

        {/* Target Movement Modes */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-neutral-400 mr-1.5">Target:</span>
          {[
            { id: 'static', label: 'Standing Bot' },
            { id: 'moving', label: 'Strafing Bot' },
            { id: 'peek', label: 'Peeking Dummy' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => {
                setTargetMode(m.id as 'static' | 'moving' | 'peek');
                soundEffects.playClick();
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                targetMode === m.id
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Drag Shooting Sandbox */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative w-full h-[520px] bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden cursor-crosshair select-none shadow-inner"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.04) 0%, transparent 60%),
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px'
        }}
      >
        {/* Subtle Practice Grid Center Marker */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-48 h-48 border border-neutral-800/40 rounded-full" />
        </div>

        {/* The Free Fire Character Dummy */}
        {isPeeking && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 pointer-events-none"
            style={{
              left: `${targetPos.x}%`,
              top: `${targetPos.y}%`
            }}
          >
            {/* Visual Headhit Zone */}
            <div className="relative flex flex-col items-center">
              {/* Head with Level 3 Helmet style */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-b from-neutral-700 via-neutral-800 to-red-950/80 border-2 border-red-500/80 shadow-lg shadow-red-950/50 flex items-center justify-center">
                <span className="text-[10px] font-bold text-red-400 font-mono tracking-tighter">HEAD</span>
              </div>

              {/* Neck & Chest Body Armor */}
              <div className="w-20 h-28 mt-1 rounded-xl bg-gradient-to-b from-neutral-800 to-neutral-900 border border-neutral-700/80 flex flex-col items-center justify-center p-2 shadow-md">
                <Shield className="w-5 h-5 text-neutral-500 mb-0.5" />
                <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider">CHEST</span>
                <span className="text-[8px] text-neutral-600 font-mono">DRAG FROM HERE</span>
              </div>

              {/* Legs */}
              <div className="flex gap-2 mt-1">
                <div className="w-7 h-16 bg-neutral-900 border border-neutral-800 rounded-b-md" />
                <div className="w-7 h-16 bg-neutral-900 border border-neutral-800 rounded-b-md" />
              </div>
            </div>
          </div>
        )}

        {/* Live Drag Vector Arrow during click & drag */}
        {dragTrace && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {/* Starting click circle */}
            <circle
              cx={dragTrace.startX - (containerRef.current?.getBoundingClientRect().left || 0)}
              cy={dragTrace.startY - (containerRef.current?.getBoundingClientRect().top || 0)}
              r="6"
              fill="#f97316"
              opacity="0.8"
            />
            {/* Drag Line */}
            <line
              x1={dragTrace.startX - (containerRef.current?.getBoundingClientRect().left || 0)}
              y1={dragTrace.startY - (containerRef.current?.getBoundingClientRect().top || 0)}
              x2={dragTrace.currentX - (containerRef.current?.getBoundingClientRect().left || 0)}
              y2={dragTrace.currentY - (containerRef.current?.getBoundingClientRect().top || 0)}
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="4 2"
            />
          </svg>
        )}

        {/* Floating Damage Numbers */}
        {damagePops.map(pop => (
          <div
            key={pop.id}
            className={`absolute pointer-events-none font-extrabold select-none animate-bounce z-30 ${
              pop.isHeadshot
                ? 'text-red-500 text-3xl drop-shadow-[0_2px_10px_rgba(239,68,68,0.9)] font-mono tracking-wider'
                : 'text-amber-300 text-xl drop-shadow-[0_2px_6px_rgba(245,158,11,0.6)] font-mono'
            }`}
            style={{
              left: `${pop.x}px`,
              top: `${pop.y}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            {pop.damage}
          </div>
        ))}

        {/* Bottom Instruction & Real-Time Feedback Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-xl z-10 pointer-events-none">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500 shrink-0" />
            <span className={`text-xs font-semibold ${feedbackColor}`}>
              {feedback}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono">
            <span>Sensi Y: <strong className="text-white">{currentProfile.emulatorY}</strong></span>
            <span>·</span>
            <span>DPI: <strong className="text-white">{currentProfile.mouseDpi}</strong></span>
            <span>·</span>
            <span>Tweak: <strong className="text-white">{currentProfile.tweaks}</strong></span>
          </div>
        </div>
      </div>

      {/* Pro Drag Headshot Technique Manual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400">1. Straight Fast Drag</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Used for enemies standing still or running straight towards you. Place red dot on upper chest, flick straight up smoothly, then let go.
          </p>
        </div>

        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400">2. The "J-Drag" Rotation</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Used when the enemy is running sideways to the right. Curve your mouse down slightly then sweep upward into a letter "J" shape to lock onto their sprinting head.
          </p>
        </div>

        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400">3. Jump Shot One-Tap</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Jump with Spacebar, un-holster weapon in mid-air, wait for peak height, and flick as your character touches the ground for instant recoil reset.
          </p>
        </div>
      </div>
    </div>
  );
};
