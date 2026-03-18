"use client";

import React, { useMemo, useState } from "react";

type Player = {
  id: string;
  name: string;
  team: string;
  pos: string[];
  rank: number;
  drafted: boolean;
  myTeam: boolean;
  H?: number; R?: number; HR?: number; RBI?: number; BB?: number; SB?: number;
  AVG?: number; OBP?: number; SLG?: number; TB?: number;
  IP?: number; W?: number; L?: number; QS?: number; SV?: number; K?: number; BBP?: number;
  ERA?: number; WHIP?: number; KBB?: number;
};

type LeagueTeam = {
  id: number;
  name: string;
  slot: number;
};

type DraftPick = {
  overall: number;
  round: number;
  pickInRound: number;
  teamId: number;
  teamName: string;
  playerId: string;
  playerName: string;
  playerPos: string;
  mine: boolean;
};

const rosterTemplate: Record<string, number> = { C:1, "1B":1, "2B":1, SS:1, "3B":1, LF:1, CF:1, RF:1, UTIL:1, SP:6, RP:2, P:3 };
const hittingCats = ["H","R","HR","RBI","BB","SB","AVG","OBP","SLG","TB"] as const;
const pitchingCats = ["IP","W","L","QS","SV","K","BBP","ERA","WHIP","KBB"] as const;
const inverseCats = new Set(["L","BBP","ERA","WHIP"]);
const positionsForTierBoard = ["C","1B","2B","SS","3B","OF","DH","SP","RP"];
const tierColors: Record<string, string> = {
  "Tier 1": "bg-emerald-100 border-emerald-300 text-emerald-900",
  "Tier 2": "bg-lime-100 border-lime-300 text-lime-900",
  "Tier 3": "bg-amber-100 border-amber-300 text-amber-900",
  "Tier 4": "bg-orange-100 border-orange-300 text-orange-900",
  "Tier 5": "bg-rose-100 border-rose-300 text-rose-900",
  "Tier 6": "bg-slate-100 border-slate-300 text-slate-900",
  "Tier 7": "bg-zinc-100 border-zinc-300 text-zinc-900",
};

function mean(arr:number[]) { return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0; }
function std(arr:number[]) { const m=mean(arr); const v=mean(arr.map(x=>(x-m)**2)); return Math.sqrt(v || 1); }
function isPitcher(player:Player) { return player.pos.includes("SP") || player.pos.includes("RP"); }
function primaryPos(player:Player) {
  const order = ["C","1B","2B","SS","3B","LF","CF","RF","OF","DH","SP","RP","UTIL","P"];
  for (const pos of order) if (player.pos.includes(pos)) return pos;
  return player.pos[0] || "UTIL";
}
function displayPos(player:Player) { return player.pos.join("/"); }
function assignTier(rank:number) {
  if (rank <= 8) return "Tier 1";
  if (rank <= 20) return "Tier 2";
  if (rank <= 40) return "Tier 3";
  if (rank <= 70) return "Tier 4";
  if (rank <= 110) return "Tier 5";
  if (rank <= 170) return "Tier 6";
  return "Tier 7";
}

function snakeTeamForPick(overall:number, orderedTeams:LeagueTeam[]) {
  const teams = orderedTeams.length;
  const round = Math.ceil(overall / teams);
  const pickInRound = ((overall - 1) % teams) + 1;
  const zeroBased = pickInRound - 1;
  return round % 2 === 1 ? orderedTeams[zeroBased] : orderedTeams[teams - 1 - zeroBased];
}

function currentRound(overall:number, teams:number) { return Math.ceil(overall / teams); }
function pickInRound(overall:number, teams:number) { return ((overall - 1) % teams) + 1; }

function defaultTeams(): LeagueTeam[] {
  return Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: i === 0 ? "My Team" : `Team ${i + 1}`, slot: i + 1 }));
}

function makePlayer(id:number, name:string, team:string, pos:string[], rank:number): Player {
  const pitcher = pos.includes("SP") || pos.includes("RP");
  if (pitcher) {
    const rp = pos.includes("RP");
    return {
      id: String(id), name, team, pos, rank, drafted:false, myTeam:false,
      IP: rp ? Math.max(55, 72 - Math.floor(rank / 22)) : Math.max(120, 205 - Math.floor(rank / 2.5)),
      W: rp ? 4 : Math.max(7, 16 - Math.floor(rank / 35)),
      L: rp ? 3 : Math.max(4, 10 - Math.floor(rank / 60)),
      QS: rp ? 0 : Math.max(0, 21 - Math.floor(rank / 10)),
      SV: rp ? Math.max(3, 38 - Math.floor(rank / 8)) : 0,
      K: rp ? Math.max(55, 96 - Math.floor(rank / 6)) : Math.max(110, 245 - Math.floor(rank / 1.9)),
      BBP: rp ? Math.max(12, 28 - Math.floor(rank / 18)) : Math.max(28, 58 - Math.floor(rank / 12)),
      ERA: Number((rp ? 2.2 + rank * 0.01 : 2.7 + rank * 0.006).toFixed(2)),
      WHIP: Number((rp ? 0.92 + rank * 0.0016 : 0.98 + rank * 0.0019).toFixed(2)),
      KBB: Number((rp ? 5.2 - rank * 0.012 : 6.4 - rank * 0.015).toFixed(2)),
    };
  }
  return {
    id: String(id), name, team, pos, rank, drafted:false, myTeam:false,
    H: Math.max(108, 192 - Math.floor(rank / 2.2)),
    R: Math.max(52, 118 - Math.floor(rank / 3)),
    HR: Math.max(7, 42 - Math.floor(rank / 8)),
    RBI: Math.max(45, 112 - Math.floor(rank / 3.4)),
    BB: Math.max(24, 96 - Math.floor(rank / 4.2)),
    SB: pos.includes("SS") || pos.includes("OF") || pos.includes("2B") ? Math.max(2, 32 - Math.floor(rank / 9)) : Math.max(0, 10 - Math.floor(rank / 18)),
    AVG: Number((0.315 - rank * 0.00035).toFixed(3)),
    OBP: Number((0.405 - rank * 0.00045).toFixed(3)),
    SLG: Number((0.615 - rank * 0.0009).toFixed(3)),
    TB: Math.max(170, 336 - Math.floor(rank * 1.1)),
  };
}

function seededPlayers(): Player[] {
  const seedList: Array<[string,string,string[]]> = [
    ["Shohei Ohtani (DH)","LAD",["DH"]],["Aaron Judge","NYY",["LF","CF","RF","DH"]],["Bobby Witt Jr.","KC",["SS"]],["Juan Soto","NYM",["LF","RF"]],["Ronald Acuna Jr.","ATL",["RF"]],["Tarik Skubal","DET",["SP"]],["Paul Skenes","PIT",["SP"]],["Elly De La Cruz","CIN",["SS"]],["Julio Rodriguez","SEA",["CF"]],["Kyle Tucker","CHC",["RF"]],
    ["Zack Wheeler","PHI",["SP"]],["Mookie Betts","LAD",["2B","OF"]],["Corey Seager","TEX",["SS"]],["Yordan Alvarez","HOU",["LF","DH"]],["Bryce Harper","PHI",["1B"]],["Emmanuel Clase","CLE",["RP"]],["George Kirby","SEA",["SP"]],["Cal Raleigh","SEA",["C"]],["William Contreras","MIL",["C"]],["Matt Olson","ATL",["1B"]],
    ["Logan Webb","SF",["SP"]],["Francisco Lindor","NYM",["SS"]],["Austin Riley","ATL",["3B"]],["Trea Turner","PHI",["SS"]],["Josh Hader","HOU",["RP"]],["Vladimir Guerrero Jr.","TOR",["1B"]],["Gunnar Henderson","BAL",["SS","3B"]],["Bryson Stott","PHI",["2B"]],["Will Smith","LAD",["C"]],["Pete Alonso","NYM",["1B"]],
    ["Jose Ramirez","CLE",["3B"]],["Freddie Freeman","LAD",["1B"]],["Corbin Carroll","ARI",["LF","RF"]],["Fernando Tatis Jr.","SD",["RF"]],["Spencer Strider","ATL",["SP"]],["Logan Gilbert","SEA",["SP"]],["Rafael Devers","SF",["1B","3B"]],["Manny Machado","SD",["3B"]],["Jackson Chourio","MIL",["LF","CF","RF"]],["Junior Caminero","TB",["3B"]],
    ["Garrett Crochet","BOS",["SP"]],["Brenton Doyle","COL",["CF"]],["Pablo Lopez","MIN",["SP"]],["Corbin Burnes","ARI",["SP"]],["Dylan Cease","SD",["SP"]],["Blake Snell","LAD",["SP"]],["Tyler Glasnow","LAD",["SP"]],["Framber Valdez","HOU",["SP"]],["Chris Sale","ATL",["SP"]],["Michael King","SD",["SP"]],
    ["Cole Ragans","KC",["SP"]],["Hunter Greene","CIN",["SP"]],["Yoshinobu Yamamoto","LAD",["SP"]],["Seth Lugo","KC",["SP"]],["Shota Imanaga","CHC",["SP"]],["Max Fried","NYY",["SP"]],["Luis Castillo","SEA",["SP"]],["Sonny Gray","STL",["SP"]],["Cristopher Sanchez","PHI",["SP"]],["Joe Ryan","MIN",["SP"]],
    ["Robert Suarez","SD",["RP"]],["Ryan Helsley","STL",["RP"]],["Edwin Diaz","NYM",["RP"]],["Devin Williams","NYY",["RP"]],["Ryan Walker","SF",["RP"]],["Mason Miller","ATH",["RP"]],["Camilo Doval","SF",["RP"]],["Jhoan Duran","MIN",["RP"]],["Andres Munoz","SEA",["RP"]],["Raisel Iglesias","ATL",["RP"]],
    ["Adley Rutschman","BAL",["C"]],["Salvador Perez","KC",["C"]],["Sean Murphy","ATL",["C"]],["Tyler Stephenson","CIN",["C"]],["Yainer Diaz","HOU",["C"]],["Keibert Ruiz","WSH",["C"]],["Logan O'Hoppe","LAA",["C"]],["Gabriel Moreno","ARI",["C"]],["Bo Naylor","CLE",["C"]],["JT Realmuto","PHI",["C"]],
    ["Christian Walker","HOU",["1B"]],["Triston Casas","BOS",["1B"]],["Spencer Steer","CIN",["1B","LF"]],["Nathaniel Lowe","WSH",["1B"]],["Paul Goldschmidt","NYY",["1B"]],["Alec Bohm","PHI",["1B","3B"]],["Rhys Hoskins","MIL",["1B"]],["Ryan Mountcastle","BAL",["1B"]],["Josh Naylor","ARI",["1B"]],["Jake Burger","TEX",["1B","3B"]],
    ["Ozzie Albies","ATL",["2B"]],["Ketel Marte","ARI",["2B"]],["Marcus Semien","TEX",["2B"]],["Jose Altuve","HOU",["2B","LF"]],["Nico Hoerner","CHC",["2B"]],["Xander Bogaerts","SD",["2B","SS"]],["Luis Garcia Jr.","WSH",["2B"]],["Matt McLain","CIN",["2B","SS"]],["Brandon Lowe","TB",["2B"]],["Gleyber Torres","DET",["2B"]],
    ["Oneil Cruz","PIT",["SS","CF"]],["CJ Abrams","WSH",["SS"]],["Bo Bichette","TOR",["SS"]],["Dansby Swanson","CHC",["SS"]],["Willy Adames","SF",["SS"]],["Anthony Volpe","NYY",["SS"]],["Masyn Winn","STL",["SS"]],["Jeremy Pena","HOU",["SS"]],["Tommy Edman","LAD",["2B","SS","CF"]],["Ezequiel Tovar","COL",["SS"]],
    ["Alex Bregman","BOS",["3B"]],["Jordan Westburg","BAL",["2B","3B"]],["Matt Chapman","SF",["3B"]],["Nolan Arenado","STL",["3B"]],["Isaac Paredes","HOU",["3B"]],["Max Muncy","LAD",["3B"]],["Mark Vientos","NYM",["3B"]],["Noelvi Marte","CIN",["3B"]],["Alec Burleson","STL",["1B","OF"]],["Royce Lewis","MIN",["3B"]],
    ["Jarren Duran","BOS",["LF","CF"]],["Wyatt Langford","TEX",["LF","RF"]],["Lawrence Butler","ATH",["RF"]],["Brandon Nimmo","NYM",["LF","CF"]],["Teoscar Hernandez","LAD",["RF"]],["Seiya Suzuki","CHC",["RF","DH"]],["Randy Arozarena","SEA",["LF","RF"]],["Adolis Garcia","TEX",["RF"]],["James Wood","WSH",["LF","RF"]],["Mike Trout","LAA",["CF"]],
    ["Cody Bellinger","NYY",["1B","CF","RF"]],["Byron Buxton","MIN",["CF"]],["Pete Crow-Armstrong","CHC",["CF"]],["Ian Happ","CHC",["LF"]],["Steven Kwan","CLE",["LF"]],["Anthony Santander","TOR",["LF","RF"]],["George Springer","TOR",["RF"]],["Heliot Ramos","SF",["LF","RF"]],["Nick Castellanos","PHI",["RF"]],["Bryan Reynolds","PIT",["LF","RF"]],
    ["Lars Nootbaar","STL",["LF","CF"]],["Jazz Chisholm Jr.","NYY",["2B","CF"]],["Jackson Merrill","SD",["CF"]],["Jung Hoo Lee","SF",["CF"]],["TJ Friedl","CIN",["CF"]],["Cedric Mullins","BAL",["CF"]],["Daulton Varsho","TOR",["LF","CF"]],["Lane Thomas","CLE",["CF"]],["Michael Harris II","ATL",["CF"]],["Taylor Ward","LAA",["LF","RF"]],
    ["Geraldo Perdomo","ARI",["SS"]],["Ha-Seong Kim","TB",["SS","2B"]],["Victor Scott II","STL",["CF"]],["Merrill Kelly","ARI",["SP"]],["Bryce Miller","SEA",["SP"]],["Taj Bradley","TB",["SP"]],["Tanner Bibee","CLE",["SP"]],["Nick Pivetta","SD",["SP"]],["Bailey Ober","MIN",["SP"]],["Kevin Gausman","TOR",["SP"]],
    ["Zac Gallen","ARI",["SP"]],["Sandy Alcantara","MIA",["SP"]],["Justin Steele","CHC",["SP"]],["Luis Severino","ATH",["SP"]],["Kodai Senga","NYM",["SP"]],["Freddy Peralta","MIL",["SP"]],["Roki Sasaki","LAD",["SP"]],["Brandon Pfaadt","ARI",["SP"]],["Jacob deGrom","TEX",["SP"]],["Reynaldo Lopez","ATL",["SP"]],
    ["Clay Holmes","NYM",["RP"]],["Justin Martinez","ARI",["RP"]],["A.J. Puk","ARI",["RP"]],["Alexis Diaz","CIN",["RP"]],["Kyle Finnegan","WSH",["RP"]],["Carlos Estevez","KC",["RP"]],["Jason Adam","SD",["RP"]],["Pete Fairbanks","TB",["RP"]],["Kenley Jansen","LAA",["RP"]],["Trevor Megill","MIL",["RP"]],
  ];

  const players = seedList.map((row, idx) => makePlayer(idx + 1, row[0], row[1], row[2], idx + 1));

  let nextId = players.length + 1;
  while (players.length < 340) {
    const n = players.length + 1;
    const posCycle = n % 9;
    let pos:string[] = ["OF"];
    if (posCycle === 0) pos = ["SP"];
    else if (posCycle === 1) pos = ["RP"];
    else if (posCycle === 2) pos = ["C"];
    else if (posCycle === 3) pos = ["1B"];
    else if (posCycle === 4) pos = ["2B"];
    else if (posCycle === 5) pos = ["SS"];
    else if (posCycle === 6) pos = ["3B"];
    else if (posCycle === 7) pos = ["OF"];
    players.push(makePlayer(nextId, `Depth Player ${nextId}`, "FA", pos, nextId));
    nextId += 1;
  }
  return players;
}

function teamSummary(players:Player[]) {
  const mine = players.filter((p)=>p.myTeam);
  const totals:any = {};
  [...hittingCats, ...pitchingCats].forEach((cat)=> totals[cat] = 0);
  const avgCats = ["AVG","OBP","SLG","ERA","WHIP","KBB"];
  mine.forEach((p) => {
    [...hittingCats, ...pitchingCats].forEach((cat) => {
      if (!avgCats.includes(cat)) totals[cat] += Number((p as any)[cat] || 0);
    });
  });
  avgCats.forEach((cat) => {
    const vals = mine.map((p)=>Number((p as any)[cat] || 0)).filter((n)=>n > 0);
    totals[cat] = vals.length ? mean(vals) : 0;
  });
  return totals;
}

function computeProfiles(players:Player[]) {
  const hitters = players.filter((p)=>!isPitcher(p));
  const pitchers = players.filter((p)=>isPitcher(p));
  const hitterProfile = Object.fromEntries(hittingCats.map((cat) => [cat, { mean: mean(hitters.map((p)=>Number((p as any)[cat] || 0))), std: std(hitters.map((p)=>Number((p as any)[cat] || 0))) }]));
  const pitcherProfile = Object.fromEntries(pitchingCats.map((cat) => [cat, { mean: mean(pitchers.map((p)=>Number((p as any)[cat] || 0))), std: std(pitchers.map((p)=>Number((p as any)[cat] || 0))) }]));
  return { hitterProfile, pitcherProfile };
}

function zScore(value:number, profile:{mean:number,std:number}, inverse=false) {
  const z = (value - profile.mean) / (profile.std || 1);
  return inverse ? -z : z;
}

function positionCounts(players:Player[]) {
  const counts:Record<string, number> = {};
  Object.keys(rosterTemplate).forEach((k)=> counts[k]=0);
  players.filter((p)=>p.myTeam).forEach((p)=> p.pos.forEach((pos)=> { if (counts[pos] !== undefined) counts[pos] += 1; }));
  return counts;
}

function buildNeeds(players:Player[]) {
  const mine = players.filter((p)=>p.myTeam);
  const hitters = mine.filter((p)=>!isPitcher(p));
  const pitchers = mine.filter((p)=>isPitcher(p));
  const totals = teamSummary(players);
  const counts = positionCounts(players);
  return {
    hittingNeed: Math.max(0, 9 - hitters.length),
    pitchingNeed: Math.max(0, 11 - pitchers.length),
    needSB: hitters.length >= 3 && totals.SB < 80,
    needOBP: totals.OBP > 0 && totals.OBP < 0.35,
    needSLG: totals.SLG > 0 && totals.SLG < 0.49,
    needQS: counts.SP >= 2 && totals.QS < 85,
    needKBB: totals.KBB > 0 && totals.KBB < 4.3,
    needSaves: counts.RP < 2,
    counts,
  };
}

function scorePlayer(player:Player, profiles:any, needs:any) {
  let score = 0;
  if (isPitcher(player)) pitchingCats.forEach((cat) => { score += zScore(Number((player as any)[cat] || 0), profiles.pitcherProfile[cat], inverseCats.has(cat)); });
  else hittingCats.forEach((cat) => { score += zScore(Number((player as any)[cat] || 0), profiles.hitterProfile[cat], inverseCats.has(cat)); });
  if (isPitcher(player) && needs.pitchingNeed > needs.hittingNeed) score += 1.35;
  if (!isPitcher(player) && needs.hittingNeed >= needs.pitchingNeed) score += 0.95;
  if (needs.needSB && Number(player.SB || 0) >= 18) score += 1.2;
  if (needs.needOBP && Number(player.OBP || 0) >= 0.36) score += 1.05;
  if (needs.needSLG && Number(player.SLG || 0) >= 0.50) score += 1.05;
  if (needs.needQS && Number(player.QS || 0) >= 16) score += 1.1;
  if (needs.needKBB && Number(player.KBB || 0) >= 4.8) score += 1.1;
  if (needs.needSaves && Number(player.SV || 0) >= 20) score += 1.0;
  if (player.pos.some((pos)=>rosterTemplate[pos] && needs.counts[pos] < rosterTemplate[pos])) score += 0.35;
  return score;
}

function recommendationText(best:Player | null, needs:any) {
  if (!best) return ["No recommendation available."];
  const reasons:string[] = [];
  if (isPitcher(best) && needs.pitchingNeed > needs.hittingNeed) reasons.push("Your roster still needs more pitching volume for this format.");
  if (needs.needSB && Number(best.SB || 0) >= 18) reasons.push("This pick helps restore your stolen base pace.");
  if (needs.needOBP && Number(best.OBP || 0) >= 0.36) reasons.push("This player improves OBP, which matters a lot in your categories.");
  if (needs.needSLG && Number(best.SLG || 0) >= 0.5) reasons.push("This player raises your slugging baseline.");
  if (needs.needQS && Number(best.QS || 0) >= 16) reasons.push("This arm boosts projected QS output.");
  if (needs.needKBB && Number(best.KBB || 0) >= 4.8) reasons.push("This arm helps stabilize K/BB.");
  if (needs.needSaves && Number(best.SV || 0) >= 20) reasons.push("You still need dedicated saves production.");
  if (!reasons.length) reasons.push("You are balanced enough to take the best value on the board.");
  return reasons;
}

function badgeStyle() { return "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium"; }
function buttonStyle(primary=false) { return primary ? "rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800" : "rounded-xl border px-3 py-2 text-sm font-medium hover:bg-slate-50"; }
function cardStyle() { return "rounded-2xl border bg-white p-4 shadow-sm"; }

export default function Page() {
  const [players, setPlayers] = useState<Player[]>(seededPlayers());
  const [leagueTeams, setLeagueTeams] = useState<LeagueTeam[]>(defaultTeams());
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<"rank" | "ai">("rank");
  const [assistantMode, setAssistantMode] = useState<"balanced" | "aggressive">("balanced");
  const [csvText, setCsvText] = useState("");
  const [history, setHistory] = useState<DraftPick[]>([]);
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [activeTab, setActiveTab] = useState<"live" | "tiers" | "board">("live");
  const [overrideTeamId, setOverrideTeamId] = useState<string>("");

  const orderedTeams = useMemo(() => [...leagueTeams].sort((a,b)=>a.slot-b.slot), [leagueTeams]);
  const nextPick = history.length + 1;
  const nextRound = currentRound(nextPick, orderedTeams.length);
  const nextPickInRound = pickInRound(nextPick, orderedTeams.length);
  const clockTeam = overrideTeamId ? orderedTeams.find(t => t.id === Number(overrideTeamId)) || snakeTeamForPick(nextPick, orderedTeams) : snakeTeamForPick(nextPick, orderedTeams);

  const profiles = useMemo(() => computeProfiles(players), [players]);
  const needs = useMemo(() => buildNeeds(players), [players]);
  const totals = useMemo(() => teamSummary(players), [players]);
  const counts = needs.counts;

  const ranked = useMemo(() => {
    const enriched = [...players].map((p) => ({ ...p, aiScore: scorePlayer(p, profiles, needs), tier: assignTier(p.rank) }));
    return enriched.sort((a:any, b:any) => {
      if (a.drafted !== b.drafted) return a.drafted ? 1 : -1;
      if (sortMode === "rank") return a.rank - b.rank;
      return b.aiScore - a.aiScore;
    });
  }, [players, profiles, needs, sortMode]);

  const filtered = useMemo(() => ranked.filter((p:any) => {
    if (showOnlyMine && !p.myTeam) return false;
    if (query && !`${p.name} ${p.team} ${p.pos.join("/")}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [ranked, query, showOnlyMine]);

  const available = ranked.filter((p:any)=>!p.drafted);
  const bestPick = available[0] || null;
  const reasons = recommendationText(bestPick, needs);

  const bestHitter = available.find((p:any) => !isPitcher(p)) || null;
  const bestSP = available.find((p:any) => p.pos.includes("SP")) || null;
  const bestRP = available.find((p:any) => p.pos.includes("RP")) || null;

  const mySlot = orderedTeams.find(t => t.id === 1)?.slot || 1;
  const currentClockSlot = clockTeam?.slot || 1;
  const picksUntilMyNextTurn = (() => {
    if (history.length === 0) return Math.abs(mySlot - currentClockSlot);
    let count = 0;
    let probe = nextPick;
    while (count < 60) {
      const t = snakeTeamForPick(probe, orderedTeams);
      if (t.id === 1) return count;
      probe += 1;
      count += 1;
    }
    return 0;
  })();

  const likelyGoneNextTurn = available
    .filter((p:any) => p.rank <= (bestPick?.rank || 999) + picksUntilMyNextTurn + 6)
    .slice(0, Math.max(3, Math.min(8, picksUntilMyNextTurn + 2)));

  const nextLevelRecommendation = (() => {
    if (!bestPick) return "No recommendation available.";
    if (assistantMode === "aggressive") {
      if (bestSP && needs.pitchingNeed >= needs.hittingNeed) return `Attack pitching now: ${bestSP.name}`;
      if (bestHitter && needs.needSB) return `Push category leverage now: ${bestHitter.name}`;
    }
    if (needs.needSaves && bestRP) return `You can wait on hitters here and stabilize saves with ${bestRP.name}.`;
    if (needs.pitchingNeed > needs.hittingNeed && bestSP) return `Best structural move: ${bestSP.name} to support your heavy-pitching format.`;
    if (bestHitter) return `Best overall bat right now: ${bestHitter.name}.`;
    return `Best overall value: ${bestPick.name}.`;
  })();

  const tierBoard = useMemo(() => {
    const groups: Record<string, any[]> = { C: [], "1B": [], "2B": [], SS: [], "3B": [], OF: [], DH: [], SP: [], RP: [] };
    available.forEach((p:any) => {
      const primary = primaryPos(p);
      if (["C","1B","2B","SS","3B","DH","SP","RP"].includes(primary)) groups[primary].push(p);
      else groups.OF.push(p);
    });
    return groups;
  }, [available]);

  function updateTeamName(id:number, value:string) {
    setLeagueTeams(prev => prev.map(t => t.id === id ? { ...t, name: value } : t));
  }
  function updateTeamSlot(id:number, value:number) {
    const safe = Math.max(1, Math.min(12, value || 1));
    setLeagueTeams(prev => prev.map(t => t.id === id ? { ...t, slot: safe } : t));
  }

  function markPlayer(id:string, mine=false) {
    const draftedTeam = mine ? orderedTeams.find(t => t.id === 1)! : clockTeam;
    const player = players.find(p => p.id === id);
    if (!player || !draftedTeam) return;

    const pick: DraftPick = {
      overall: nextPick,
      round: nextRound,
      pickInRound: nextPickInRound,
      teamId: draftedTeam.id,
      teamName: draftedTeam.name,
      playerId: id,
      playerName: player.name,
      playerPos: displayPos(player),
      mine,
    };

    setPlayers(prev => prev.map(p => p.id === id ? { ...p, drafted:true, myTeam: mine } : p));
    setHistory(prev => [...prev, pick]);
    setOverrideTeamId("");
  }

  function undoLastPick() {
    const last = history[history.length - 1];
    if (!last) return;
    setPlayers(prev => prev.map(p => p.id === last.playerId ? { ...p, drafted:false, myTeam:false } : p));
    setHistory(prev => prev.slice(0, -1));
    setOverrideTeamId("");
  }

  function resetDraft() {
    setPlayers(prev => prev.map(p => ({ ...p, drafted:false, myTeam:false })));
    setHistory([]);
    setOverrideTeamId("");
  }

  function parseCsv(text:string): Player[] {
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    if (!lines.length) return [];
    const split = (line:string) => line.split(",").map((s)=>s.trim());
    const headers = split(lines[0]);
    return lines.slice(1).map((line, idx) => {
      const cols = split(line);
      const obj:any = { id:`csv-${idx+1}`, drafted:false, myTeam:false };
      headers.forEach((header, i) => {
        const key = header.trim();
        const raw = cols[i] ?? "";
        if (key === "pos") obj.pos = raw.split("/").map((x:string)=>x.trim());
        else if (["rank", ...hittingCats, ...pitchingCats].includes(key as any)) obj[key] = Number(raw || 0);
        else obj[key] = raw;
      });
      if (!obj.pos) obj.pos = ["UTIL"];
      return obj as Player;
    });
  }

  function importCsv() {
    const parsed = parseCsv(csvText);
    if (!parsed.length) return;
    setPlayers(parsed.map((p, i) => ({ ...p, id: p.id || `csv-${i+1}`, drafted:false, myTeam:false })));
    setHistory([]);
    setShowOnlyMine(false);
    setOverrideTeamId("");
  }

  function downloadTemplate() {
    const header = ["name","team","pos","rank","H","R","HR","RBI","BB","SB","AVG","OBP","SLG","TB","IP","W","L","QS","SV","K","BBP","ERA","WHIP","KBB"];
    const exampleRows = [
      ["Shohei Ohtani (DH)","LAD","DH",1,165,123,44,111,92,19,0.302,0.397,0.611,334,0,0,0,0,0,0,0,0,0,0],
      ["Tarik Skubal","DET","SP",6,0,0,0,0,0,0,0,0,0,0,196,15,7,20,0,242,38,2.91,1.03,6.37],
      ["Bobby Witt Jr.","KC","SS",3,188,109,31,95,51,38,0.301,0.354,0.533,333,0,0,0,0,0,0,0,0,0,0],
    ];
    const csv = [header.join(","), ...exampleRows.map((row)=>row.join(","))].join("\n");
    const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "draft_assistant_projection_template.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fantasy Baseball AI Draft Assistant</h1>
            <p className="text-sm text-slate-600">Expanded player pool, editable league teams, full draft history, round tracking, larger tier board, and live sorting by rank or AI score.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={buttonStyle(false)} onClick={downloadTemplate}>CSV Template</button>
            <button className={buttonStyle(false)} onClick={undoLastPick}>Undo Last Pick</button>
            <button className={buttonStyle(false)} onClick={resetDraft}>Reset Draft</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <section className={`${cardStyle()} xl:col-span-3`}>
            <h2 className="mb-4 text-lg font-semibold">Draft Control Center</h2>
            <div className="space-y-4">
              <div className="rounded-2xl border bg-white p-3">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-xs uppercase text-slate-500">Overall</div>
                    <div className="text-2xl font-semibold">{nextPick}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-slate-500">Round</div>
                    <div className="text-2xl font-semibold">{nextRound}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-slate-500">Pick</div>
                    <div className="text-2xl font-semibold">{nextPickInRound}</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-slate-700">On the clock: <span className="font-semibold">{clockTeam?.name}</span></div>
              </div>

              <div className="rounded-2xl border bg-white p-3">
                <div className="mb-2 text-xs uppercase text-slate-500">Fix Mistakes / Override Team</div>
                <select className="w-full rounded-xl border px-3 py-2 text-sm" value={overrideTeamId} onChange={(e)=>setOverrideTeamId(e.target.value)}>
                  <option value="">Use current team on the clock</option>
                  {orderedTeams.map(team => <option key={team.id} value={team.id}>{team.name} (slot {team.slot})</option>)}
                </select>
              </div>

              <div className="rounded-2xl border bg-white p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="text-xs uppercase text-slate-500">Best Pick Right Now</div>
                  <select className="rounded-xl border px-2 py-1 text-xs" value={assistantMode} onChange={(e)=>setAssistantMode(e.target.value as "balanced" | "aggressive")}>
                    <option value="balanced">Balanced AI</option>
                    <option value="aggressive">Aggressive AI</option>
                  </select>
                </div>
                {bestPick ? (
                  <>
                    <div className="text-lg font-semibold">{bestPick.name}</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {bestPick.pos.map((p:string) => <span className={badgeStyle()} key={p}>{p}</span>)}
                      <span className={badgeStyle()}>{bestPick.team}</span>
                      <span className={`${badgeStyle()} ${tierColors[(bestPick as any).tier]}`}>{(bestPick as any).tier}</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-700">AI Score: {(bestPick as any).aiScore.toFixed(2)}</div>
                    <div className="mt-3 rounded-xl border bg-slate-50 p-2 text-sm font-medium text-slate-800">{nextLevelRecommendation}</div>
                  </>
                ) : <div className="text-sm text-slate-500">No players available.</div>}
              </div>

              <div className="rounded-2xl border bg-white p-3">
                <div className="mb-2 text-xs uppercase text-slate-500">Best By Role</div>
                <div className="space-y-2 text-sm">
                  <div><span className="font-semibold">Best Hitter:</span> {bestHitter ? bestHitter.name : "—"}</div>
                  <div><span className="font-semibold">Best SP:</span> {bestSP ? bestSP.name : "—"}</div>
                  <div><span className="font-semibold">Best RP:</span> {bestRP ? bestRP.name : "—"}</div>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-3">
                <div className="mb-2 text-xs uppercase text-slate-500">Likely Gone Before Your Next Turn</div>
                <div className="text-xs text-slate-500">Estimated picks until your next turn: {picksUntilMyNextTurn}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {likelyGoneNextTurn.map((p:any) => (
                    <span key={p.id} className={`${badgeStyle()} ${tierColors[p.tier]}`}>{p.name}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-3">
                <div className="mb-2 text-xs uppercase text-slate-500">Recommendation Reasons</div>
                <ul className="space-y-2 text-sm text-slate-700">{reasons.map((r:string) => <li key={r}>• {r}</li>)}</ul>
              </div>

              <div className="rounded-2xl border bg-white p-3">
                <div className="mb-2 text-xs uppercase text-slate-500">Roster Counts</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>SP: {counts.SP}/{rosterTemplate.SP}</div>
                  <div>RP: {counts.RP}/{rosterTemplate.RP}</div>
                  <div>C: {counts.C}/{rosterTemplate.C}</div>
                  <div>1B: {counts["1B"]}/{rosterTemplate["1B"]}</div>
                  <div>2B: {counts["2B"]}/{rosterTemplate["2B"]}</div>
                  <div>SS: {counts.SS}/{rosterTemplate.SS}</div>
                  <div>3B: {counts["3B"]}/{rosterTemplate["3B"]}</div>
                  <div>LF: {counts.LF}/{rosterTemplate.LF}</div>
                  <div>CF: {counts.CF}/{rosterTemplate.CF}</div>
                  <div>RF: {counts.RF}/{rosterTemplate.RF}</div>
                </div>
              </div>
            </div>
          </section>

          <section className={`${cardStyle()} xl:col-span-6`}>
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                <button className={activeTab === "live" ? buttonStyle(true) : buttonStyle(false)} onClick={() => setActiveTab("live")}>Live Rankings</button>
                <button className={activeTab === "tiers" ? buttonStyle(true) : buttonStyle(false)} onClick={() => setActiveTab("tiers")}>Tier Cheat Sheet</button>
                <button className={activeTab === "board" ? buttonStyle(true) : buttonStyle(false)} onClick={() => setActiveTab("board")}>Draft Board</button>
              </div>
              {activeTab === "live" && (
                <div className="flex w-full gap-2 md:max-w-xl">
                  <input className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Search players" value={query} onChange={(e)=>setQuery(e.target.value)} />
                  <select className="rounded-xl border px-3 py-2 text-sm" value={sortMode} onChange={(e)=>setSortMode(e.target.value as "rank" | "ai")}>
                    <option value="rank">Sort: Rank</option>
                    <option value="ai">Sort: AI Score</option>
                  </select>
                  <button className={showOnlyMine ? buttonStyle(true) : buttonStyle(false)} onClick={()=>setShowOnlyMine((v)=>!v)}>Mine</button>
                </div>
              )}
            </div>

            {activeTab === "live" && (
              <div className="max-h-[760px] space-y-2 overflow-y-auto pr-1">
                {filtered.map((p:any, idx:number) => (
                  <div key={p.id} className={`rounded-2xl border p-3 ${!p.drafted && idx === 0 && !showOnlyMine ? "border-slate-900 bg-slate-50" : "bg-white"} ${p.drafted ? "opacity-60" : ""}`}>
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-slate-500">#{p.rank || idx + 1}</span>
                          <span className="text-base font-semibold">{p.name}</span>
                          <span className={badgeStyle()}>{p.team}</span>
                          {p.pos.map((pos:string)=><span className={badgeStyle()} key={pos}>{pos}</span>)}
                          <span className={`${badgeStyle()} ${tierColors[p.tier]}`}>{p.tier}</span>
                          {p.myTeam && <span className={badgeStyle()}>My Team</span>}
                          {p.drafted && !p.myTeam && <span className={`${badgeStyle()} border-red-200 bg-red-50 text-red-700`}>Taken</span>}
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 md:grid-cols-5">
                          {isPitcher(p) ? (
                            <><div>IP: {p.IP}</div><div>QS: {p.QS}</div><div>K: {p.K}</div><div>ERA: {p.ERA}</div><div>K/BB: {p.KBB}</div></>
                          ) : (
                            <><div>R: {p.R}</div><div>HR: {p.HR}</div><div>RBI: {p.RBI}</div><div>SB: {p.SB}</div><div>OBP: {p.OBP?.toFixed(3)}</div></>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {!p.drafted ? (
                          <>
                            <button className={buttonStyle(false)} onClick={()=>markPlayer(p.id, false)}>Taken</button>
                            <button className={buttonStyle(true)} onClick={()=>markPlayer(p.id, true)}>My Pick</button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "tiers" && (
              <div className="max-h-[760px] overflow-y-auto pr-1">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {positionsForTierBoard.map((position) => (
                    <div key={position} className="rounded-2xl border bg-slate-50 p-3">
                      <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">{position}</div>
                      <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1">
                        {tierBoard[position].map((p:any) => (
                          <div key={p.id} className={`rounded-xl border p-2 ${tierColors[p.tier]}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-sm font-semibold">{p.name}</div>
                                <div className="text-xs opacity-80">#{p.rank} • {p.team}</div>
                              </div>
                              <span className="rounded-full border px-2 py-0.5 text-[11px] font-medium">{p.tier}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "board" && (
              <div className="space-y-4">
                <div className="rounded-2xl border bg-white p-3">
                  <div className="mb-3 text-sm font-semibold text-slate-700">League Teams</div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {leagueTeams.map(team => (
                      <div key={team.id} className="grid grid-cols-[72px_1fr] gap-2">
                        <input type="number" min={1} max={12} value={team.slot} onChange={(e)=>updateTeamSlot(team.id, Number(e.target.value))} className="rounded-xl border px-2 py-2 text-sm" />
                        <input value={team.name} onChange={(e)=>updateTeamName(team.id, e.target.value)} className="rounded-xl border px-3 py-2 text-sm" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border bg-white p-3">
                  <div className="mb-3 text-sm font-semibold text-slate-700">Draft History</div>
                  <div className="max-h-[500px] overflow-y-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b text-left text-slate-500">
                          <th className="py-2">Ovr</th>
                          <th className="py-2">Rnd</th>
                          <th className="py-2">Pick</th>
                          <th className="py-2">Team</th>
                          <th className="py-2">Player</th>
                          <th className="py-2">Pos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map(pick => (
                          <tr key={pick.overall} className="border-b last:border-b-0">
                            <td className="py-2">{pick.overall}</td>
                            <td className="py-2">{pick.round}</td>
                            <td className="py-2">{pick.pickInRound}</td>
                            <td className="py-2">{pick.teamName}</td>
                            <td className="py-2">{pick.playerName}</td>
                            <td className="py-2">{pick.playerPos}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className={`${cardStyle()} xl:col-span-3`}>
            <h2 className="mb-4 text-lg font-semibold">My Team + Import</h2>
            <div className="mb-4 max-h-[220px] space-y-2 overflow-y-auto pr-1">
              {!players.some((p)=>p.myTeam) && <div className="rounded-xl border border-dashed p-4 text-sm text-slate-500">Mark a player as My Pick to start building your team.</div>}
              {players.filter((p)=>p.myTeam).map((p)=>(
                <div key={p.id} className="rounded-xl border bg-white p-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.pos.map((pos)=><span className={badgeStyle()} key={pos}>{pos}</span>)}
                    <span className={`${badgeStyle()} ${tierColors[assignTier(p.rank)]}`}>{assignTier(p.rank)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl border p-3">H: {totals.H}</div>
              <div className="rounded-xl border p-3">R: {totals.R}</div>
              <div className="rounded-xl border p-3">HR: {totals.HR}</div>
              <div className="rounded-xl border p-3">RBI: {totals.RBI}</div>
              <div className="rounded-xl border p-3">BB: {totals.BB}</div>
              <div className="rounded-xl border p-3">SB: {totals.SB}</div>
              <div className="rounded-xl border p-3">AVG: {totals.AVG ? totals.AVG.toFixed(3) : "0.000"}</div>
              <div className="rounded-xl border p-3">OBP: {totals.OBP ? totals.OBP.toFixed(3) : "0.000"}</div>
              <div className="rounded-xl border p-3">SLG: {totals.SLG ? totals.SLG.toFixed(3) : "0.000"}</div>
              <div className="rounded-xl border p-3">TB: {totals.TB}</div>
              <div className="rounded-xl border p-3">IP: {totals.IP}</div>
              <div className="rounded-xl border p-3">W: {totals.W}</div>
              <div className="rounded-xl border p-3">L: {totals.L}</div>
              <div className="rounded-xl border p-3">QS: {totals.QS}</div>
              <div className="rounded-xl border p-3">SV: {totals.SV}</div>
              <div className="rounded-xl border p-3">K: {totals.K}</div>
              <div className="rounded-xl border p-3">BBP: {totals.BBP}</div>
              <div className="rounded-xl border p-3">ERA: {totals.ERA ? totals.ERA.toFixed(2) : "0.00"}</div>
              <div className="rounded-xl border p-3">WHIP: {totals.WHIP ? totals.WHIP.toFixed(2) : "0.00"}</div>
              <div className="rounded-xl border p-3">K/BB: {totals.KBB ? totals.KBB.toFixed(2) : "0.00"}</div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-slate-600">Paste your projection CSV below if you want to replace the seeded player pool.</div>
              <textarea rows={12} className="w-full rounded-xl border p-3 text-sm" placeholder="Paste CSV here" value={csvText} onChange={(e)=>setCsvText(e.target.value)} />
              <div className="grid grid-cols-1 gap-2">
                <button className={buttonStyle(true)} onClick={importCsv}>Import Projection CSV</button>
                <button className={buttonStyle(false)} onClick={downloadTemplate}>Download CSV Template</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
