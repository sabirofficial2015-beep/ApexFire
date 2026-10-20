import React, { useState } from 'react';
import { Trophy, Users, Award, Copy, Check, RotateCcw, Plus, Trash2, ArrowUpDown } from 'lucide-react';
import { TournamentTeam } from '../types/index.ts';
import { soundEffects } from '../utils/audio.ts';

const PLACEMENT_POINTS: { [place: number]: number } = {
  1: 12,
  2: 9,
  3: 8,
  4: 7,
  5: 6,
  6: 5,
  7: 4,
  8: 3,
  9: 2,
  10: 1,
  11: 0,
  12: 0
};

const INITIAL_TEAMS: TournamentTeam[] = [
  { id: '1', slot: 1, name: 'Total Gaming Esports', tag: 'TG', match1Placement: 1, match1Kills: 14, match2Placement: 3, match2Kills: 8, match3Placement: 2, match3Kills: 9 },
  { id: '2', slot: 2, name: 'Fluxo Esports', tag: 'FX', match1Placement: 2, match1Kills: 9, match2Placement: 1, match2Kills: 12, match3Placement: 4, match3Kills: 6 },
  { id: '3', slot: 3, name: 'LOUD Esports', tag: 'LOUD', match1Placement: 3, match1Kills: 7, match2Placement: 4, match2Kills: 6, match3Placement: 1, match3Kills: 11 },
  { id: '4', slot: 4, name: 'EVOS Phoenix', tag: 'EVOS', match1Placement: 4, match1Kills: 8, match2Placement: 2, match2Kills: 10, match3Placement: 5, match3Kills: 5 },
  { id: '5', slot: 5, name: 'Magic Squad', tag: 'MS', match1Placement: 5, match1Kills: 5, match2Placement: 6, match2Kills: 4, match3Placement: 3, match3Kills: 7 },
  { id: '6', slot: 6, name: 'Buriram United', tag: 'BRU', match1Placement: 6, match1Kills: 6, match2Placement: 5, match2Kills: 5, match3Placement: 7, match3Kills: 4 },
  { id: '7', slot: 7, name: 'Team Flash', tag: 'TF', match1Placement: 7, match1Kills: 4, match2Placement: 7, match2Kills: 3, match3Placement: 6, match3Kills: 5 },
  { id: '8', slot: 8, name: 'Miners.gg', tag: 'MNR', match1Placement: 8, match1Kills: 3, match2Placement: 8, match2Kills: 4, match3Placement: 8, match3Kills: 2 },
  { id: '9', slot: 9, name: 'Waski Esports', tag: 'WSK', match1Placement: 9, match1Kills: 2, match2Placement: 10, match2Kills: 1, match3Placement: 9, match3Kills: 3 },
  { id: '10', slot: 10, name: 'All Gamers Global', tag: 'AG', match1Placement: 10, match1Kills: 1, match2Placement: 9, match2Kills: 2, match3Placement: 10, match3Kills: 2 },
  { id: '11', slot: 11, name: 'Alpha 7 Esports', tag: 'A7', match1Placement: 11, match1Kills: 2, match2Placement: 11, match2Kills: 0, match3Placement: 11, match3Kills: 1 },
  { id: '12', slot: 12, name: 'RRQ Kazu', tag: 'RRQ', match1Placement: 12, match1Kills: 0, match2Placement: 12, match2Kills: 1, match3Placement: 12, match3Kills: 0 }
];

export const TournamentRoom: React.FC = () => {
  const [teams, setTeams] = useState<TournamentTeam[]>(INITIAL_TEAMS);
  const [copied, setCopied] = useState(false);
  const [activeMatchView, setActiveMatchView] = useState<'all' | 'm1' | 'm2' | 'm3'>('all');

  const calculateTeamStats = (team: TournamentTeam) => {
    let placePoints = 0;
    let killPoints = 0;

    if (activeMatchView === 'all' || activeMatchView === 'm1') {
      placePoints += PLACEMENT_POINTS[team.match1Placement] || 0;
      killPoints += team.match1Kills;
    }
    if (activeMatchView === 'all' || activeMatchView === 'm2') {
      placePoints += PLACEMENT_POINTS[team.match2Placement] || 0;
      killPoints += team.match2Kills;
    }
    if (activeMatchView === 'all' || activeMatchView === 'm3') {
      placePoints += PLACEMENT_POINTS[team.match3Placement] || 0;
      killPoints += team.match3Kills;
    }

    const totalPoints = placePoints + killPoints;
    return { placePoints, killPoints, totalPoints };
  };

  // Sort teams by total points descending, then placement points
  const sortedTeams = [...teams].sort((a, b) => {
    const statsA = calculateTeamStats(a);
    const statsB = calculateTeamStats(b);
    if (statsB.totalPoints !== statsA.totalPoints) {
      return statsB.totalPoints - statsA.totalPoints;
    }
    return statsB.placePoints - statsA.placePoints;
  });

  const handleUpdateTeam = (id: string, field: keyof TournamentTeam, val: string | number) => {
    setTeams(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, [field]: val };
      }
      return t;
    }));
  };

  const handleResetScores = () => {
    setTeams(prev => prev.map(t => ({
      ...t,
      match1Placement: 12,
      match1Kills: 0,
      match2Placement: 12,
      match2Kills: 0,
      match3Placement: 12,
      match3Kills: 0
    })));
    soundEffects.playClick();
  };

  const handleCopyStandings = () => {
    let text = `🏆 FREE FIRE TOURNAMENT STANDINGS (FFWS Scoring Rules)\n`;
    text += `Scoring: 1st=12p, 2nd=9p, 3rd=8p, 4th=7p, 5th=6p, 6th=5p... + 1pt/Kill\n`;
    text += `════════════════════════════════════════════════\n`;

    sortedTeams.forEach((team, idx) => {
      const stats = calculateTeamStats(team);
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`.padEnd(3);
      text += `${medal} [${team.tag}] ${team.name} — Total: ${stats.totalPoints} PTS (Placement: ${stats.placePoints} | Kills: ${stats.killPoints})\n`;
    });

    text += `════════════════════════════════════════════════\nGenerated via ApexFire PC Tournament Panel`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    soundEffects.playClick();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Free Fire Custom Room & Esports Tournament Manager</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Official Free Fire World Series (FFWS) point system with live placement & kill calculations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyStandings}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition-all whitespace-nowrap shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Leaderboard' : 'Copy Standings for Discord'}</span>
          </button>
          <button
            onClick={handleResetScores}
            className="p-2 text-xs text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg"
            title="Reset All Scores"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scoring Rules Strip & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-900/60 border border-neutral-800 rounded-xl">
        <div className="flex items-center gap-1 text-xs">
          <span className="text-neutral-400 font-medium mr-2">Filter Match:</span>
          {[
            { id: 'all', label: 'Overall Standings' },
            { id: 'm1', label: 'Match 1 (Bermuda)' },
            { id: 'm2', label: 'Match 2 (Purgatory)' },
            { id: 'm3', label: 'Match 3 (Kalahari)' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => {
                setActiveMatchView(m.id as 'all' | 'm1' | 'm2' | 'm3');
                soundEffects.playClick();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeMatchView === m.id
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-neutral-400 font-mono">
          Booyah: <strong className="text-orange-400">12 PTS</strong> · 2nd: 9 PTS · 3rd: 8 PTS · 4th: 7 PTS · Kill: <strong className="text-red-400">+1 PT</strong>
        </div>
      </div>

      {/* Tournament Leaderboard Table */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl overflow-hidden shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950 text-neutral-400 font-semibold uppercase tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4 w-14 text-center">Rank</th>
                <th className="py-3 px-4">Squad Name</th>
                <th className="py-3 px-3 text-center">Tag</th>
                <th className="py-3 px-3 text-center">M1 (Pl/K)</th>
                <th className="py-3 px-3 text-center">M2 (Pl/K)</th>
                <th className="py-3 px-3 text-center">M3 (Pl/K)</th>
                <th className="py-3 px-4 text-right">Place Pts</th>
                <th className="py-3 px-4 text-right">Kill Pts</th>
                <th className="py-3 px-5 text-right font-bold text-white">Total Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {sortedTeams.map((team, rank) => {
                const stats = calculateTeamStats(team);
                const isTop3 = rank < 3;

                return (
                  <tr
                    key={team.id}
                    className={`transition-colors ${
                      rank === 0
                        ? 'bg-amber-950/20 hover:bg-amber-950/30'
                        : isTop3
                        ? 'bg-neutral-900/40 hover:bg-neutral-800/40'
                        : 'hover:bg-neutral-900/40'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      {rank === 0 ? (
                        <span className="text-base text-amber-400">🥇</span>
                      ) : rank === 1 ? (
                        <span className="text-base text-neutral-300">🥈</span>
                      ) : rank === 2 ? (
                        <span className="text-base text-amber-600">🥉</span>
                      ) : (
                        <span className="text-neutral-500 tabular-nums">#{rank + 1}</span>
                      )}
                    </td>

                    {/* Team Name Editable */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={team.name}
                        onChange={(e) => handleUpdateTeam(team.id, 'name', e.target.value)}
                        className="w-full bg-transparent text-white font-medium focus:bg-neutral-950 focus:px-2 focus:py-1 rounded outline-none border border-transparent focus:border-neutral-700"
                      />
                    </td>

                    {/* Team Tag */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="text"
                        value={team.tag}
                        onChange={(e) => handleUpdateTeam(team.id, 'tag', e.target.value)}
                        className="w-12 text-center bg-transparent text-neutral-400 font-mono focus:bg-neutral-950 rounded outline-none border border-transparent focus:border-neutral-700 uppercase"
                      />
                    </td>

                    {/* Match 1 Inputs */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 font-mono">
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={team.match1Placement}
                          onChange={(e) => handleUpdateTeam(team.id, 'match1Placement', Number(e.target.value) || 12)}
                          className="w-9 px-1 py-0.5 text-center bg-neutral-950 border border-neutral-800 rounded text-neutral-200"
                          title="Placement (1-12)"
                        />
                        <span className="text-neutral-600">/</span>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={team.match1Kills}
                          onChange={(e) => handleUpdateTeam(team.id, 'match1Kills', Number(e.target.value) || 0)}
                          className="w-9 px-1 py-0.5 text-center bg-neutral-950 border border-neutral-800 rounded text-red-400"
                          title="Kills"
                        />
                      </div>
                    </td>

                    {/* Match 2 Inputs */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 font-mono">
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={team.match2Placement}
                          onChange={(e) => handleUpdateTeam(team.id, 'match2Placement', Number(e.target.value) || 12)}
                          className="w-9 px-1 py-0.5 text-center bg-neutral-950 border border-neutral-800 rounded text-neutral-200"
                          title="Placement (1-12)"
                        />
                        <span className="text-neutral-600">/</span>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={team.match2Kills}
                          onChange={(e) => handleUpdateTeam(team.id, 'match2Kills', Number(e.target.value) || 0)}
                          className="w-9 px-1 py-0.5 text-center bg-neutral-950 border border-neutral-800 rounded text-red-400"
                          title="Kills"
                        />
                      </div>
                    </td>

                    {/* Match 3 Inputs */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 font-mono">
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={team.match3Placement}
                          onChange={(e) => handleUpdateTeam(team.id, 'match3Placement', Number(e.target.value) || 12)}
                          className="w-9 px-1 py-0.5 text-center bg-neutral-950 border border-neutral-800 rounded text-neutral-200"
                          title="Placement (1-12)"
                        />
                        <span className="text-neutral-600">/</span>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={team.match3Kills}
                          onChange={(e) => handleUpdateTeam(team.id, 'match3Kills', Number(e.target.value) || 0)}
                          className="w-9 px-1 py-0.5 text-center bg-neutral-950 border border-neutral-800 rounded text-red-400"
                          title="Kills"
                        />
                      </div>
                    </td>

                    {/* Placement Points */}
                    <td className="py-3 px-4 text-right font-mono text-neutral-300 tabular-nums">
                      {stats.placePoints}
                    </td>

                    {/* Kill Points */}
                    <td className="py-3 px-4 text-right font-mono text-red-400 tabular-nums font-semibold">
                      {stats.killPoints}
                    </td>

                    {/* Total Points */}
                    <td className="py-3 px-5 text-right font-mono font-bold text-orange-400 text-sm tabular-nums">
                      {stats.totalPoints}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
