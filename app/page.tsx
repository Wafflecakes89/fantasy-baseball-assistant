
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
  posRanks: Record<string, number>;
  H?: number; R?: number; HR?: number; RBI?: number; BB?: number; SB?: number;
  AVG?: number; OBP?: number; SLG?: number; TB?: number;
  IP?: number; W?: number; L?: number; QS?: number; SV?: number; K?: number; BBP?: number;
  ERA?: number; WHIP?: number; KBB?: number;
};

type LeagueTeam = { id:number; name:string; slot:number };
type DraftPick = { overall:number; round:number; pickInRound:number; teamId:number; teamName:string; playerId:string; playerName:string; playerPos:string; mine:boolean };

const initialPlayers: Player[] = [{"id": "1", "name": "Aaron Judge", "team": "NYY", "pos": ["OF"], "rank": 1, "drafted": false, "myTeam": false, "posRanks": {"OF": 1}, "H": 192, "R": 118, "HR": 42, "RBI": 112, "BB": 96, "SB": 32, "AVG": 0.315, "OBP": 0.405, "SLG": 0.614, "TB": 335}, {"id": "2", "name": "Shohei Ohtani (Batter)", "team": "LAD", "pos": ["DH"], "rank": 2, "drafted": false, "myTeam": false, "posRanks": {}, "H": 191, "R": 118, "HR": 42, "RBI": 112, "BB": 96, "SB": 10, "AVG": 0.314, "OBP": 0.404, "SLG": 0.613, "TB": 334}, {"id": "3", "name": "Juan Soto", "team": "NYM", "pos": ["OF"], "rank": 3, "drafted": false, "myTeam": false, "posRanks": {"OF": 2}, "H": 191, "R": 117, "HR": 42, "RBI": 111, "BB": 96, "SB": 32, "AVG": 0.314, "OBP": 0.404, "SLG": 0.612, "TB": 333}, {"id": "4", "name": "Ronald Acuna Jr.", "team": "ATL", "pos": ["OF"], "rank": 4, "drafted": false, "myTeam": false, "posRanks": {"OF": 3}, "H": 190, "R": 117, "HR": 42, "RBI": 111, "BB": 95, "SB": 32, "AVG": 0.314, "OBP": 0.403, "SLG": 0.611, "TB": 332}, {"id": "5", "name": "Bobby Witt Jr.", "team": "KC", "pos": ["SS"], "rank": 5, "drafted": false, "myTeam": false, "posRanks": {"SS": 1}, "H": 190, "R": 117, "HR": 42, "RBI": 111, "BB": 95, "SB": 32, "AVG": 0.313, "OBP": 0.403, "SLG": 0.611, "TB": 331}, {"id": "6", "name": "Jose Ramirez", "team": "CLE", "pos": ["3B"], "rank": 6, "drafted": false, "myTeam": false, "posRanks": {"3B": 1}, "H": 189, "R": 116, "HR": 42, "RBI": 110, "BB": 95, "SB": 10, "AVG": 0.313, "OBP": 0.402, "SLG": 0.61, "TB": 330}, {"id": "7", "name": "Kyle Tucker", "team": "LAD", "pos": ["OF"], "rank": 7, "drafted": false, "myTeam": false, "posRanks": {"OF": 4}, "H": 189, "R": 116, "HR": 42, "RBI": 110, "BB": 95, "SB": 32, "AVG": 0.313, "OBP": 0.402, "SLG": 0.609, "TB": 329}, {"id": "8", "name": "Julio Rodriguez", "team": "SEA", "pos": ["OF"], "rank": 8, "drafted": false, "myTeam": false, "posRanks": {"OF": 5}, "H": 188, "R": 116, "HR": 41, "RBI": 110, "BB": 94, "SB": 32, "AVG": 0.312, "OBP": 0.401, "SLG": 0.608, "TB": 328}, {"id": "9", "name": "Junior Caminero", "team": "TB", "pos": ["3B"], "rank": 9, "drafted": false, "myTeam": false, "posRanks": {"3B": 2}, "H": 188, "R": 115, "HR": 41, "RBI": 109, "BB": 94, "SB": 10, "AVG": 0.312, "OBP": 0.401, "SLG": 0.607, "TB": 327}, {"id": "10", "name": "Fernando Tatis Jr.", "team": "SD", "pos": ["OF"], "rank": 10, "drafted": false, "myTeam": false, "posRanks": {"OF": 6}, "H": 187, "R": 115, "HR": 41, "RBI": 109, "BB": 94, "SB": 31, "AVG": 0.311, "OBP": 0.401, "SLG": 0.606, "TB": 325}, {"id": "11", "name": "Kyle Schwarber", "team": "PHI", "pos": ["DH", "OF"], "rank": 11, "drafted": false, "myTeam": false, "posRanks": {"OF": 7}, "H": 187, "R": 115, "HR": 41, "RBI": 109, "BB": 94, "SB": 31, "AVG": 0.311, "OBP": 0.4, "SLG": 0.605, "TB": 324}, {"id": "12", "name": "Vladimir Guerrero Jr.", "team": "TOR", "pos": ["1B"], "rank": 12, "drafted": false, "myTeam": false, "posRanks": {"1B": 1}, "H": 186, "R": 114, "HR": 41, "RBI": 108, "BB": 93, "SB": 10, "AVG": 0.311, "OBP": 0.4, "SLG": 0.604, "TB": 323}, {"id": "13", "name": "Yordan Alvarez", "team": "HOU", "pos": ["OF"], "rank": 13, "drafted": false, "myTeam": false, "posRanks": {"OF": 8}, "H": 186, "R": 114, "HR": 41, "RBI": 108, "BB": 93, "SB": 31, "AVG": 0.31, "OBP": 0.399, "SLG": 0.603, "TB": 322}, {"id": "14", "name": "Brent Rooker", "team": "ATH", "pos": ["OF"], "rank": 14, "drafted": false, "myTeam": false, "posRanks": {"OF": 9}, "H": 185, "R": 114, "HR": 41, "RBI": 108, "BB": 93, "SB": 31, "AVG": 0.31, "OBP": 0.399, "SLG": 0.602, "TB": 321}, {"id": "15", "name": "Tarik Skubal", "team": "DET", "pos": ["SP"], "rank": 15, "drafted": false, "myTeam": false, "posRanks": {"SP": 1}, "IP": 198, "W": 16, "L": 10, "QS": 21, "SV": 0, "K": 238, "BBP": 57, "ERA": 2.79, "WHIP": 1.01, "KBB": 6.18}, {"id": "16", "name": "Corbin Carroll", "team": "ARI", "pos": ["OF"], "rank": 16, "drafted": false, "myTeam": false, "posRanks": {"OF": 10}, "H": 184, "R": 113, "HR": 40, "RBI": 107, "BB": 92, "SB": 31, "AVG": 0.309, "OBP": 0.398, "SLG": 0.601, "TB": 319}, {"id": "17", "name": "Gunnar Henderson", "team": "BAL", "pos": ["SS"], "rank": 17, "drafted": false, "myTeam": false, "posRanks": {"SS": 2}, "H": 184, "R": 113, "HR": 40, "RBI": 107, "BB": 92, "SB": 31, "AVG": 0.309, "OBP": 0.397, "SLG": 0.6, "TB": 318}, {"id": "18", "name": "Cal Raleigh", "team": "SEA", "pos": ["C"], "rank": 18, "drafted": false, "myTeam": false, "posRanks": {"C": 1}, "H": 183, "R": 112, "HR": 40, "RBI": 106, "BB": 92, "SB": 9, "AVG": 0.309, "OBP": 0.397, "SLG": 0.599, "TB": 317}, {"id": "19", "name": "Jackson Chourio", "team": "MIL", "pos": ["OF"], "rank": 19, "drafted": false, "myTeam": false, "posRanks": {"OF": 11}, "H": 183, "R": 112, "HR": 40, "RBI": 106, "BB": 92, "SB": 30, "AVG": 0.308, "OBP": 0.396, "SLG": 0.598, "TB": 316}, {"id": "20", "name": "Ketel Marte", "team": "ARI", "pos": ["2B"], "rank": 20, "drafted": false, "myTeam": false, "posRanks": {"2B": 1}, "H": 182, "R": 112, "HR": 40, "RBI": 106, "BB": 91, "SB": 30, "AVG": 0.308, "OBP": 0.396, "SLG": 0.597, "TB": 314}, {"id": "21", "name": "James Wood", "team": "WSH", "pos": ["OF"], "rank": 21, "drafted": false, "myTeam": false, "posRanks": {"OF": 12}, "H": 182, "R": 111, "HR": 40, "RBI": 105, "BB": 91, "SB": 30, "AVG": 0.308, "OBP": 0.396, "SLG": 0.596, "TB": 313}, {"id": "22", "name": "Paul Skenes", "team": "PIT", "pos": ["SP"], "rank": 22, "drafted": false, "myTeam": false, "posRanks": {"SP": 2}, "IP": 194, "W": 16, "L": 10, "QS": 20, "SV": 0, "K": 234, "BBP": 57, "ERA": 2.83, "WHIP": 1.02, "KBB": 6.07}, {"id": "23", "name": "Elly De La Cruz", "team": "CIN", "pos": ["SS"], "rank": 23, "drafted": false, "myTeam": false, "posRanks": {"SS": 3}, "H": 181, "R": 111, "HR": 40, "RBI": 105, "BB": 91, "SB": 30, "AVG": 0.307, "OBP": 0.395, "SLG": 0.594, "TB": 311}, {"id": "24", "name": "Manny Machado", "team": "SD", "pos": ["3B"], "rank": 24, "drafted": false, "myTeam": false, "posRanks": {"3B": 3}, "H": 180, "R": 110, "HR": 39, "RBI": 104, "BB": 90, "SB": 9, "AVG": 0.307, "OBP": 0.394, "SLG": 0.593, "TB": 310}, {"id": "25", "name": "Austin Riley", "team": "ATL", "pos": ["3B"], "rank": 25, "drafted": false, "myTeam": false, "posRanks": {"3B": 4}, "H": 180, "R": 110, "HR": 39, "RBI": 104, "BB": 90, "SB": 9, "AVG": 0.306, "OBP": 0.394, "SLG": 0.593, "TB": 309}, {"id": "26", "name": "Garrett Crochet", "team": "BOS", "pos": ["SP"], "rank": 26, "drafted": false, "myTeam": false, "posRanks": {"SP": 3}, "IP": 192, "W": 16, "L": 10, "QS": 20, "SV": 0, "K": 232, "BBP": 56, "ERA": 2.86, "WHIP": 1.03, "KBB": 6.01}, {"id": "27", "name": "Riley Greene", "team": "DET", "pos": ["OF"], "rank": 27, "drafted": false, "myTeam": false, "posRanks": {"OF": 13}, "H": 179, "R": 109, "HR": 39, "RBI": 103, "BB": 90, "SB": 29, "AVG": 0.306, "OBP": 0.393, "SLG": 0.591, "TB": 307}, {"id": "28", "name": "Wyatt Langford", "team": "TEX", "pos": ["OF"], "rank": 28, "drafted": false, "myTeam": false, "posRanks": {"OF": 14}, "H": 178, "R": 109, "HR": 39, "RBI": 103, "BB": 89, "SB": 29, "AVG": 0.305, "OBP": 0.392, "SLG": 0.59, "TB": 306}, {"id": "29", "name": "Nick Kurtz", "team": "ATH", "pos": ["1B"], "rank": 29, "drafted": false, "myTeam": false, "posRanks": {"1B": 2}, "H": 178, "R": 109, "HR": 39, "RBI": 103, "BB": 89, "SB": 9, "AVG": 0.305, "OBP": 0.392, "SLG": 0.589, "TB": 305}, {"id": "30", "name": "Roman Anthony", "team": "BOS", "pos": ["OF"], "rank": 30, "drafted": false, "myTeam": false, "posRanks": {"OF": 15}, "H": 177, "R": 108, "HR": 39, "RBI": 102, "BB": 89, "SB": 29, "AVG": 0.304, "OBP": 0.392, "SLG": 0.588, "TB": 303}, {"id": "31", "name": "Bryan Woo", "team": "SEA", "pos": ["SP"], "rank": 31, "drafted": false, "myTeam": false, "posRanks": {"SP": 4}, "IP": 190, "W": 16, "L": 10, "QS": 19, "SV": 0, "K": 230, "BBP": 56, "ERA": 2.89, "WHIP": 1.04, "KBB": 5.94}, {"id": "32", "name": "Bryce Harper", "team": "PHI", "pos": ["1B"], "rank": 32, "drafted": false, "myTeam": false, "posRanks": {"1B": 3}, "H": 176, "R": 108, "HR": 38, "RBI": 102, "BB": 88, "SB": 9, "AVG": 0.304, "OBP": 0.391, "SLG": 0.586, "TB": 301}, {"id": "33", "name": "Mookie Betts", "team": "LAD", "pos": ["SS"], "rank": 33, "drafted": false, "myTeam": false, "posRanks": {"SS": 4}, "H": 176, "R": 107, "HR": 38, "RBI": 101, "BB": 88, "SB": 29, "AVG": 0.303, "OBP": 0.39, "SLG": 0.585, "TB": 300}, {"id": "34", "name": "Pete Alonso", "team": "BAL", "pos": ["1B"], "rank": 34, "drafted": false, "myTeam": false, "posRanks": {"1B": 4}, "H": 175, "R": 107, "HR": 38, "RBI": 101, "BB": 88, "SB": 9, "AVG": 0.303, "OBP": 0.39, "SLG": 0.584, "TB": 299}, {"id": "35", "name": "Freddie Freeman", "team": "LAD", "pos": ["1B"], "rank": 35, "drafted": false, "myTeam": false, "posRanks": {"1B": 5}, "H": 175, "R": 107, "HR": 38, "RBI": 101, "BB": 88, "SB": 9, "AVG": 0.303, "OBP": 0.389, "SLG": 0.584, "TB": 298}, {"id": "36", "name": "Chris Sale", "team": "ATL", "pos": ["SP"], "rank": 36, "drafted": false, "myTeam": false, "posRanks": {"SP": 5}, "IP": 187, "W": 15, "L": 10, "QS": 19, "SV": 0, "K": 227, "BBP": 55, "ERA": 2.92, "WHIP": 1.05, "KBB": 5.86}, {"id": "37", "name": "Logan Gilbert", "team": "SEA", "pos": ["SP"], "rank": 37, "drafted": false, "myTeam": false, "posRanks": {"SP": 6}, "IP": 187, "W": 15, "L": 10, "QS": 19, "SV": 0, "K": 227, "BBP": 55, "ERA": 2.92, "WHIP": 1.05, "KBB": 5.85}, {"id": "38", "name": "William Contreras", "team": "MIL", "pos": ["C"], "rank": 38, "drafted": false, "myTeam": false, "posRanks": {"C": 2}, "H": 173, "R": 106, "HR": 38, "RBI": 100, "BB": 87, "SB": 8, "AVG": 0.302, "OBP": 0.388, "SLG": 0.581, "TB": 295}, {"id": "39", "name": "Seiya Suzuki", "team": "CHC", "pos": ["OF"], "rank": 39, "drafted": false, "myTeam": false, "posRanks": {"OF": 16}, "H": 173, "R": 105, "HR": 38, "RBI": 99, "BB": 87, "SB": 28, "AVG": 0.301, "OBP": 0.387, "SLG": 0.58, "TB": 294}, {"id": "40", "name": "Alex Bregman", "team": "CHC", "pos": ["3B"], "rank": 40, "drafted": false, "myTeam": false, "posRanks": {"3B": 5}, "H": 172, "R": 105, "HR": 37, "RBI": 99, "BB": 86, "SB": 8, "AVG": 0.301, "OBP": 0.387, "SLG": 0.579, "TB": 292}, {"id": "41", "name": "Cristopher Sanchez", "team": "PHI", "pos": ["SP"], "rank": 41, "drafted": false, "myTeam": false, "posRanks": {"SP": 7}, "IP": 185, "W": 15, "L": 10, "QS": 18, "SV": 0, "K": 225, "BBP": 55, "ERA": 2.95, "WHIP": 1.06, "KBB": 5.79}, {"id": "42", "name": "Trea Turner", "team": "PHI", "pos": ["SS"], "rank": 42, "drafted": false, "myTeam": false, "posRanks": {"SS": 5}, "H": 171, "R": 104, "HR": 37, "RBI": 98, "BB": 86, "SB": 28, "AVG": 0.3, "OBP": 0.386, "SLG": 0.577, "TB": 290}, {"id": "43", "name": "George Springer", "team": "TOR", "pos": ["OF"], "rank": 43, "drafted": false, "myTeam": false, "posRanks": {"OF": 17}, "H": 171, "R": 104, "HR": 37, "RBI": 98, "BB": 86, "SB": 28, "AVG": 0.3, "OBP": 0.386, "SLG": 0.576, "TB": 289}, {"id": "44", "name": "Jackson Merrill", "team": "SD", "pos": ["OF"], "rank": 44, "drafted": false, "myTeam": false, "posRanks": {"OF": 18}, "H": 170, "R": 104, "HR": 37, "RBI": 98, "BB": 85, "SB": 28, "AVG": 0.3, "OBP": 0.385, "SLG": 0.575, "TB": 288}, {"id": "45", "name": "Eugenio Suarez", "team": "CIN", "pos": ["3B"], "rank": 45, "drafted": false, "myTeam": false, "posRanks": {"3B": 6}, "H": 170, "R": 103, "HR": 37, "RBI": 97, "BB": 85, "SB": 8, "AVG": 0.299, "OBP": 0.385, "SLG": 0.575, "TB": 287}, {"id": "46", "name": "Logan Webb", "team": "SF", "pos": ["SP"], "rank": 46, "drafted": false, "myTeam": false, "posRanks": {"SP": 8}, "IP": 182, "W": 15, "L": 10, "QS": 18, "SV": 0, "K": 222, "BBP": 55, "ERA": 2.98, "WHIP": 1.07, "KBB": 5.71}, {"id": "47", "name": "Jacob deGrom", "team": "TEX", "pos": ["SP"], "rank": 47, "drafted": false, "myTeam": false, "posRanks": {"SP": 9}, "IP": 182, "W": 15, "L": 10, "QS": 18, "SV": 0, "K": 222, "BBP": 55, "ERA": 2.98, "WHIP": 1.07, "KBB": 5.7}, {"id": "48", "name": "George Kirby", "team": "SEA", "pos": ["SP"], "rank": 48, "drafted": false, "myTeam": false, "posRanks": {"SP": 10}, "IP": 181, "W": 15, "L": 10, "QS": 18, "SV": 0, "K": 221, "BBP": 54, "ERA": 2.99, "WHIP": 1.07, "KBB": 5.68}, {"id": "49", "name": "Pete Crow-Armstrong", "team": "CHC", "pos": ["OF"], "rank": 49, "drafted": false, "myTeam": false, "posRanks": {"OF": 19}, "H": 168, "R": 102, "HR": 36, "RBI": 96, "BB": 84, "SB": 27, "AVG": 0.298, "OBP": 0.383, "SLG": 0.571, "TB": 283}, {"id": "50", "name": "Jarren Duran", "team": "BOS", "pos": ["OF"], "rank": 50, "drafted": false, "myTeam": false, "posRanks": {"OF": 20}, "H": 167, "R": 102, "HR": 36, "RBI": 96, "BB": 84, "SB": 27, "AVG": 0.297, "OBP": 0.383, "SLG": 0.57, "TB": 281}, {"id": "51", "name": "Francisco Lindor", "team": "NYM", "pos": ["SS"], "rank": 51, "drafted": false, "myTeam": false, "posRanks": {"SS": 6}, "H": 167, "R": 101, "HR": 36, "RBI": 95, "BB": 84, "SB": 27, "AVG": 0.297, "OBP": 0.382, "SLG": 0.569, "TB": 280}, {"id": "52", "name": "Cody Bellinger", "team": "NYY", "pos": ["OF"], "rank": 52, "drafted": false, "myTeam": false, "posRanks": {"OF": 21}, "H": 166, "R": 101, "HR": 36, "RBI": 95, "BB": 83, "SB": 27, "AVG": 0.297, "OBP": 0.382, "SLG": 0.568, "TB": 279}, {"id": "53", "name": "Rafael Devers", "team": "SF", "pos": ["1B"], "rank": 53, "drafted": false, "myTeam": false, "posRanks": {"1B": 6}, "H": 166, "R": 101, "HR": 36, "RBI": 95, "BB": 83, "SB": 8, "AVG": 0.296, "OBP": 0.381, "SLG": 0.567, "TB": 278}, {"id": "54", "name": "Matt Olson", "team": "ATL", "pos": ["1B"], "rank": 54, "drafted": false, "myTeam": false, "posRanks": {"1B": 7}, "H": 165, "R": 100, "HR": 36, "RBI": 94, "BB": 83, "SB": 7, "AVG": 0.296, "OBP": 0.381, "SLG": 0.566, "TB": 277}, {"id": "55", "name": "Yoshinobu Yamamoto", "team": "LAD", "pos": ["SP"], "rank": 55, "drafted": false, "myTeam": false, "posRanks": {"SP": 11}, "IP": 178, "W": 15, "L": 10, "QS": 17, "SV": 0, "K": 218, "BBP": 54, "ERA": 3.03, "WHIP": 1.08, "KBB": 5.58}, {"id": "56", "name": "Zack Wheeler", "team": "PHI", "pos": ["SP"], "rank": 56, "drafted": false, "myTeam": false, "posRanks": {"SP": 12}, "IP": 177, "W": 15, "L": 10, "QS": 17, "SV": 0, "K": 217, "BBP": 54, "ERA": 3.04, "WHIP": 1.09, "KBB": 5.56}, {"id": "57", "name": "Matt Chapman", "team": "SF", "pos": ["3B"], "rank": 57, "drafted": false, "myTeam": false, "posRanks": {"3B": 7}, "H": 164, "R": 99, "HR": 35, "RBI": 93, "BB": 82, "SB": 7, "AVG": 0.295, "OBP": 0.379, "SLG": 0.564, "TB": 274}, {"id": "58", "name": "Joe Ryan", "team": "MIN", "pos": ["SP"], "rank": 58, "drafted": false, "myTeam": false, "posRanks": {"SP": 13}, "IP": 176, "W": 15, "L": 10, "QS": 17, "SV": 0, "K": 216, "BBP": 54, "ERA": 3.05, "WHIP": 1.09, "KBB": 5.53}, {"id": "59", "name": "Taylor Ward", "team": "BAL", "pos": ["OF"], "rank": 59, "drafted": false, "myTeam": false, "posRanks": {"OF": 22}, "H": 163, "R": 99, "HR": 35, "RBI": 93, "BB": 82, "SB": 26, "AVG": 0.294, "OBP": 0.378, "SLG": 0.562, "TB": 272}, {"id": "60", "name": "Max Fried", "team": "NYY", "pos": ["SP"], "rank": 60, "drafted": false, "myTeam": false, "posRanks": {"SP": 14}, "IP": 175, "W": 15, "L": 9, "QS": 16, "SV": 0, "K": 215, "BBP": 53, "ERA": 3.06, "WHIP": 1.09, "KBB": 5.5}, {"id": "61", "name": "Bo Bichette", "team": "NYM", "pos": ["SS"], "rank": 61, "drafted": false, "myTeam": false, "posRanks": {"SS": 7}, "H": 162, "R": 98, "HR": 35, "RBI": 92, "BB": 81, "SB": 26, "AVG": 0.294, "OBP": 0.378, "SLG": 0.56, "TB": 269}, {"id": "62", "name": "Teoscar Hernandez", "team": "LAD", "pos": ["OF"], "rank": 62, "drafted": false, "myTeam": false, "posRanks": {"OF": 23}, "H": 161, "R": 98, "HR": 35, "RBI": 92, "BB": 81, "SB": 26, "AVG": 0.293, "OBP": 0.377, "SLG": 0.559, "TB": 268}, {"id": "63", "name": "Christian Yelich", "team": "MIL", "pos": ["OF"], "rank": 63, "drafted": false, "myTeam": false, "posRanks": {"OF": 24}, "H": 161, "R": 97, "HR": 35, "RBI": 91, "BB": 81, "SB": 25, "AVG": 0.293, "OBP": 0.377, "SLG": 0.558, "TB": 267}, {"id": "64", "name": "Ian Happ", "team": "CHC", "pos": ["OF"], "rank": 64, "drafted": false, "myTeam": false, "posRanks": {"OF": 25}, "H": 160, "R": 97, "HR": 34, "RBI": 91, "BB": 80, "SB": 25, "AVG": 0.293, "OBP": 0.376, "SLG": 0.557, "TB": 266}, {"id": "65", "name": "Cole Ragans", "team": "KC", "pos": ["SP"], "rank": 65, "drafted": false, "myTeam": false, "posRanks": {"SP": 15}, "IP": 173, "W": 15, "L": 9, "QS": 16, "SV": 0, "K": 213, "BBP": 53, "ERA": 3.09, "WHIP": 1.1, "KBB": 5.43}, {"id": "66", "name": "Zach Neto", "team": "LAA", "pos": ["SS"], "rank": 66, "drafted": false, "myTeam": false, "posRanks": {"SS": 8}, "H": 159, "R": 96, "HR": 34, "RBI": 90, "BB": 80, "SB": 25, "AVG": 0.292, "OBP": 0.375, "SLG": 0.556, "TB": 264}, {"id": "67", "name": "Byron Buxton", "team": "MIN", "pos": ["OF"], "rank": 67, "drafted": false, "myTeam": false, "posRanks": {"OF": 26}, "H": 159, "R": 96, "HR": 34, "RBI": 90, "BB": 80, "SB": 25, "AVG": 0.292, "OBP": 0.375, "SLG": 0.555, "TB": 263}, {"id": "68", "name": "Tyler Soderstrom", "team": "ATH", "pos": ["1B", "OF"], "rank": 68, "drafted": false, "myTeam": false, "posRanks": {"1B": 8, "OF": 27}, "H": 158, "R": 96, "HR": 34, "RBI": 90, "BB": 79, "SB": 25, "AVG": 0.291, "OBP": 0.374, "SLG": 0.554, "TB": 262}, {"id": "69", "name": "Steven Kwan", "team": "CLE", "pos": ["OF"], "rank": 69, "drafted": false, "myTeam": false, "posRanks": {"OF": 28}, "H": 158, "R": 95, "HR": 34, "RBI": 89, "BB": 79, "SB": 25, "AVG": 0.291, "OBP": 0.374, "SLG": 0.553, "TB": 261}, {"id": "70", "name": "Hunter Brown", "team": "HOU", "pos": ["SP"], "rank": 70, "drafted": false, "myTeam": false, "posRanks": {"SP": 16}, "IP": 170, "W": 14, "L": 9, "QS": 15, "SV": 0, "K": 210, "BBP": 53, "ERA": 3.12, "WHIP": 1.11, "KBB": 5.35}, {"id": "71", "name": "Nathan Eovaldi", "team": "TEX", "pos": ["SP"], "rank": 71, "drafted": false, "myTeam": false, "posRanks": {"SP": 17}, "IP": 170, "W": 14, "L": 9, "QS": 15, "SV": 0, "K": 210, "BBP": 53, "ERA": 3.13, "WHIP": 1.11, "KBB": 5.34}, {"id": "72", "name": "Hunter Goodman", "team": "COL", "pos": ["C"], "rank": 72, "drafted": false, "myTeam": false, "posRanks": {"C": 3}, "H": 156, "R": 94, "HR": 33, "RBI": 88, "BB": 78, "SB": 6, "AVG": 0.29, "OBP": 0.373, "SLG": 0.55, "TB": 257}, {"id": "73", "name": "Corey Seager", "team": "TEX", "pos": ["SS"], "rank": 73, "drafted": false, "myTeam": false, "posRanks": {"SS": 9}, "H": 156, "R": 94, "HR": 33, "RBI": 88, "BB": 78, "SB": 24, "AVG": 0.289, "OBP": 0.372, "SLG": 0.549, "TB": 256}, {"id": "74", "name": "Jazz Chisholm Jr.", "team": "NYY", "pos": ["2B", "3B"], "rank": 74, "drafted": false, "myTeam": false, "posRanks": {"2B": 2, "3B": 8}, "H": 155, "R": 94, "HR": 33, "RBI": 88, "BB": 78, "SB": 24, "AVG": 0.289, "OBP": 0.372, "SLG": 0.548, "TB": 255}, {"id": "75", "name": "Randy Arozarena", "team": "SEA", "pos": ["OF"], "rank": 75, "drafted": false, "myTeam": false, "posRanks": {"OF": 29}, "H": 155, "R": 93, "HR": 33, "RBI": 87, "BB": 78, "SB": 24, "AVG": 0.289, "OBP": 0.371, "SLG": 0.547, "TB": 254}, {"id": "76", "name": "Jesus Luzardo", "team": "PHI", "pos": ["SP"], "rank": 76, "drafted": false, "myTeam": false, "posRanks": {"SP": 18}, "IP": 167, "W": 14, "L": 9, "QS": 15, "SV": 0, "K": 207, "BBP": 52, "ERA": 3.16, "WHIP": 1.12, "KBB": 5.26}, {"id": "77", "name": "Sonny Gray", "team": "BOS", "pos": ["SP"], "rank": 77, "drafted": false, "myTeam": false, "posRanks": {"SP": 19}, "IP": 167, "W": 14, "L": 9, "QS": 15, "SV": 0, "K": 207, "BBP": 52, "ERA": 3.16, "WHIP": 1.13, "KBB": 5.25}, {"id": "78", "name": "Brandon Nimmo", "team": "TEX", "pos": ["OF"], "rank": 78, "drafted": false, "myTeam": false, "posRanks": {"OF": 30}, "H": 153, "R": 92, "HR": 33, "RBI": 86, "BB": 77, "SB": 24, "AVG": 0.288, "OBP": 0.37, "SLG": 0.545, "TB": 251}, {"id": "79", "name": "Mason Miller", "team": "SD", "pos": ["RP"], "rank": 79, "drafted": false, "myTeam": false, "posRanks": {"RP": 1}, "IP": 69, "W": 4, "L": 3, "QS": 0, "SV": 29, "K": 81, "BBP": 23, "ERA": 2.99, "WHIP": 1.05, "KBB": 4.25}, {"id": "80", "name": "Shohei Ohtani (Pitcher)", "team": "LAD", "pos": ["SP"], "rank": 80, "drafted": false, "myTeam": false, "posRanks": {"SP": 20}, "IP": 165, "W": 14, "L": 9, "QS": 14, "SV": 0, "K": 205, "BBP": 52, "ERA": 3.18, "WHIP": 1.13, "KBB": 5.2}, {"id": "81", "name": "Brandon Woodruff", "team": "MIL", "pos": ["SP"], "rank": 81, "drafted": false, "myTeam": false, "posRanks": {"SP": 21}, "IP": 165, "W": 14, "L": 9, "QS": 14, "SV": 0, "K": 205, "BBP": 52, "ERA": 3.19, "WHIP": 1.13, "KBB": 5.19}, {"id": "82", "name": "Alec Burleson", "team": "STL", "pos": ["1B", "OF"], "rank": 82, "drafted": false, "myTeam": false, "posRanks": {"1B": 9, "OF": 31}, "H": 151, "R": 91, "HR": 32, "RBI": 85, "BB": 76, "SB": 23, "AVG": 0.286, "OBP": 0.368, "SLG": 0.541, "TB": 246}, {"id": "83", "name": "Shea Langeliers", "team": "ATH", "pos": ["C"], "rank": 83, "drafted": false, "myTeam": false, "posRanks": {"C": 4}, "H": 151, "R": 91, "HR": 32, "RBI": 85, "BB": 76, "SB": 6, "AVG": 0.286, "OBP": 0.368, "SLG": 0.54, "TB": 245}, {"id": "84", "name": "Brice Turang", "team": "MIL", "pos": ["2B"], "rank": 84, "drafted": false, "myTeam": false, "posRanks": {"2B": 3}, "H": 150, "R": 90, "HR": 32, "RBI": 84, "BB": 75, "SB": 23, "AVG": 0.286, "OBP": 0.367, "SLG": 0.539, "TB": 244}, {"id": "85", "name": "Gleyber Torres", "team": "DET", "pos": ["2B"], "rank": 85, "drafted": false, "myTeam": false, "posRanks": {"2B": 4}, "H": 150, "R": 90, "HR": 32, "RBI": 84, "BB": 75, "SB": 23, "AVG": 0.285, "OBP": 0.367, "SLG": 0.538, "TB": 243}, {"id": "86", "name": "Yandy Diaz", "team": "TB", "pos": ["1B"], "rank": 86, "drafted": false, "myTeam": false, "posRanks": {"1B": 10}, "H": 149, "R": 90, "HR": 32, "RBI": 84, "BB": 75, "SB": 6, "AVG": 0.285, "OBP": 0.366, "SLG": 0.538, "TB": 242}, {"id": "87", "name": "Edwin Diaz", "team": "LAD", "pos": ["RP"], "rank": 87, "drafted": false, "myTeam": false, "posRanks": {"RP": 2}, "IP": 68, "W": 4, "L": 3, "QS": 0, "SV": 28, "K": 79, "BBP": 23, "ERA": 3.07, "WHIP": 1.06, "KBB": 4.16}, {"id": "88", "name": "Cade Smith", "team": "CLE", "pos": ["RP"], "rank": 88, "drafted": false, "myTeam": false, "posRanks": {"RP": 3}, "IP": 68, "W": 4, "L": 3, "QS": 0, "SV": 27, "K": 79, "BBP": 23, "ERA": 3.08, "WHIP": 1.06, "KBB": 4.14}, {"id": "89", "name": "Nick Pivetta", "team": "SD", "pos": ["SP"], "rank": 89, "drafted": false, "myTeam": false, "posRanks": {"SP": 22}, "IP": 161, "W": 14, "L": 9, "QS": 14, "SV": 0, "K": 201, "BBP": 51, "ERA": 3.23, "WHIP": 1.15, "KBB": 5.07}, {"id": "90", "name": "Geraldo Perdomo", "team": "ARI", "pos": ["SS"], "rank": 90, "drafted": false, "myTeam": false, "posRanks": {"SS": 10}, "H": 147, "R": 88, "HR": 31, "RBI": 82, "BB": 74, "SB": 22, "AVG": 0.283, "OBP": 0.365, "SLG": 0.534, "TB": 237}, {"id": "91", "name": "Ivan Herrera", "team": "STL", "pos": ["C"], "rank": 91, "drafted": false, "myTeam": false, "posRanks": {"C": 5}, "H": 147, "R": 88, "HR": 31, "RBI": 82, "BB": 74, "SB": 5, "AVG": 0.283, "OBP": 0.364, "SLG": 0.533, "TB": 236}, {"id": "92", "name": "Maikel Garcia", "team": "KC", "pos": ["2B", "3B", "OF", "SS"], "rank": 92, "drafted": false, "myTeam": false, "posRanks": {"2B": 5, "3B": 9, "SS": 11, "OF": 32}, "H": 146, "R": 88, "HR": 31, "RBI": 82, "BB": 73, "SB": 22, "AVG": 0.283, "OBP": 0.364, "SLG": 0.532, "TB": 235}, {"id": "93", "name": "Jose Altuve", "team": "HOU", "pos": ["2B", "OF"], "rank": 93, "drafted": false, "myTeam": false, "posRanks": {"2B": 6, "OF": 33}, "H": 146, "R": 87, "HR": 31, "RBI": 81, "BB": 73, "SB": 22, "AVG": 0.282, "OBP": 0.363, "SLG": 0.531, "TB": 234}, {"id": "94", "name": "Michael Harris II", "team": "ATL", "pos": ["OF"], "rank": 94, "drafted": false, "myTeam": false, "posRanks": {"OF": 34}, "H": 145, "R": 87, "HR": 31, "RBI": 81, "BB": 73, "SB": 22, "AVG": 0.282, "OBP": 0.363, "SLG": 0.53, "TB": 233}, {"id": "95", "name": "Andy Pages", "team": "LAD", "pos": ["OF"], "rank": 95, "drafted": false, "myTeam": false, "posRanks": {"OF": 35}, "H": 145, "R": 87, "HR": 31, "RBI": 81, "BB": 73, "SB": 22, "AVG": 0.282, "OBP": 0.362, "SLG": 0.529, "TB": 232}, {"id": "96", "name": "Framber Valdez", "team": "DET", "pos": ["SP"], "rank": 96, "drafted": false, "myTeam": false, "posRanks": {"SP": 23}, "IP": 157, "W": 14, "L": 9, "QS": 13, "SV": 0, "K": 197, "BBP": 50, "ERA": 3.28, "WHIP": 1.16, "KBB": 4.96}, {"id": "97", "name": "Drew Rasmussen", "team": "TB", "pos": ["SP"], "rank": 97, "drafted": false, "myTeam": false, "posRanks": {"SP": 24}, "IP": 157, "W": 14, "L": 9, "QS": 13, "SV": 0, "K": 197, "BBP": 50, "ERA": 3.28, "WHIP": 1.16, "KBB": 4.95}, {"id": "98", "name": "Kevin Gausman", "team": "TOR", "pos": ["SP"], "rank": 98, "drafted": false, "myTeam": false, "posRanks": {"SP": 25}, "IP": 156, "W": 14, "L": 9, "QS": 13, "SV": 0, "K": 196, "BBP": 50, "ERA": 3.29, "WHIP": 1.17, "KBB": 4.93}, {"id": "99", "name": "Shota Imanaga", "team": "CHC", "pos": ["SP"], "rank": 99, "drafted": false, "myTeam": false, "posRanks": {"SP": 26}, "IP": 156, "W": 14, "L": 9, "QS": 13, "SV": 0, "K": 196, "BBP": 50, "ERA": 3.29, "WHIP": 1.17, "KBB": 4.92}, {"id": "100", "name": "Bryan Reynolds", "team": "PIT", "pos": ["OF"], "rank": 100, "drafted": false, "myTeam": false, "posRanks": {"OF": 36}, "H": 142, "R": 85, "HR": 30, "RBI": 79, "BB": 71, "SB": 21, "AVG": 0.28, "OBP": 0.36, "SLG": 0.525, "TB": 226}, {"id": "101", "name": "Ben Rice", "team": "NYY", "pos": ["1B", "C"], "rank": 101, "drafted": false, "myTeam": false, "posRanks": {"C": 6, "1B": 11}, "H": 142, "R": 85, "HR": 30, "RBI": 79, "BB": 71, "SB": 5, "AVG": 0.28, "OBP": 0.36, "SLG": 0.524, "TB": 225}, {"id": "102", "name": "Munetaka Murakami", "team": "CWS", "pos": ["1B", "3B"], "rank": 102, "drafted": false, "myTeam": false, "posRanks": {"3B": 10, "1B": 12}, "H": 141, "R": 84, "HR": 30, "RBI": 78, "BB": 71, "SB": 5, "AVG": 0.279, "OBP": 0.359, "SLG": 0.523, "TB": 224}, {"id": "103", "name": "Alec Bohm", "team": "PHI", "pos": ["1B", "3B"], "rank": 103, "drafted": false, "myTeam": false, "posRanks": {"3B": 11, "1B": 13}, "H": 141, "R": 84, "HR": 30, "RBI": 78, "BB": 71, "SB": 5, "AVG": 0.279, "OBP": 0.359, "SLG": 0.522, "TB": 223}, {"id": "104", "name": "Vinnie Pasquantino", "team": "KC", "pos": ["1B"], "rank": 104, "drafted": false, "myTeam": false, "posRanks": {"1B": 14}, "H": 140, "R": 84, "HR": 29, "RBI": 78, "BB": 70, "SB": 5, "AVG": 0.279, "OBP": 0.358, "SLG": 0.521, "TB": 222}, {"id": "105", "name": "Jhoan Duran", "team": "PHI", "pos": ["RP"], "rank": 105, "drafted": false, "myTeam": false, "posRanks": {"RP": 4}, "IP": 67, "W": 4, "L": 3, "QS": 0, "SV": 25, "K": 75, "BBP": 21, "ERA": 3.25, "WHIP": 1.09, "KBB": 3.94}, {"id": "106", "name": "Dylan Cease", "team": "TOR", "pos": ["SP"], "rank": 106, "drafted": false, "myTeam": false, "posRanks": {"SP": 27}, "IP": 152, "W": 13, "L": 9, "QS": 12, "SV": 0, "K": 192, "BBP": 50, "ERA": 3.34, "WHIP": 1.18, "KBB": 4.81}, {"id": "107", "name": "Luis Castillo", "team": "SEA", "pos": ["SP"], "rank": 107, "drafted": false, "myTeam": false, "posRanks": {"SP": 28}, "IP": 152, "W": 13, "L": 9, "QS": 12, "SV": 0, "K": 192, "BBP": 50, "ERA": 3.34, "WHIP": 1.18, "KBB": 4.79}, {"id": "108", "name": "Tyler Glasnow", "team": "LAD", "pos": ["SP"], "rank": 108, "drafted": false, "myTeam": false, "posRanks": {"SP": 29}, "IP": 151, "W": 13, "L": 9, "QS": 12, "SV": 0, "K": 191, "BBP": 49, "ERA": 3.35, "WHIP": 1.19, "KBB": 4.78}, {"id": "109", "name": "Kyle Bradish", "team": "BAL", "pos": ["SP"], "rank": 109, "drafted": false, "myTeam": false, "posRanks": {"SP": 30}, "IP": 151, "W": 13, "L": 9, "QS": 12, "SV": 0, "K": 191, "BBP": 49, "ERA": 3.35, "WHIP": 1.19, "KBB": 4.77}, {"id": "110", "name": "Emmet Sheehan", "team": "LAD", "pos": ["SP"], "rank": 110, "drafted": false, "myTeam": false, "posRanks": {"SP": 31}, "IP": 150, "W": 13, "L": 9, "QS": 11, "SV": 0, "K": 190, "BBP": 49, "ERA": 3.36, "WHIP": 1.19, "KBB": 4.75}, {"id": "111", "name": "Ranger Suarez", "team": "BOS", "pos": ["SP"], "rank": 111, "drafted": false, "myTeam": false, "posRanks": {"SP": 32}, "IP": 150, "W": 13, "L": 9, "QS": 11, "SV": 0, "K": 190, "BBP": 49, "ERA": 3.37, "WHIP": 1.19, "KBB": 4.74}, {"id": "112", "name": "Shane McClanahan", "team": "TB", "pos": ["SP"], "rank": 112, "drafted": false, "myTeam": false, "posRanks": {"SP": 33}, "IP": 149, "W": 13, "L": 9, "QS": 11, "SV": 0, "K": 189, "BBP": 49, "ERA": 3.37, "WHIP": 1.19, "KBB": 4.72}, {"id": "113", "name": "Jo Adell", "team": "LAA", "pos": ["OF"], "rank": 113, "drafted": false, "myTeam": false, "posRanks": {"OF": 37}, "H": 136, "R": 81, "HR": 28, "RBI": 75, "BB": 68, "SB": 20, "AVG": 0.275, "OBP": 0.354, "SLG": 0.513, "TB": 212}, {"id": "114", "name": "Andres Munoz", "team": "SEA", "pos": ["RP"], "rank": 114, "drafted": false, "myTeam": false, "posRanks": {"RP": 5}, "IP": 67, "W": 4, "L": 3, "QS": 0, "SV": 24, "K": 74, "BBP": 21, "ERA": 3.34, "WHIP": 1.1, "KBB": 3.83}, {"id": "115", "name": "David Bednar", "team": "NYY", "pos": ["RP"], "rank": 115, "drafted": false, "myTeam": false, "posRanks": {"RP": 6}, "IP": 67, "W": 4, "L": 3, "QS": 0, "SV": 24, "K": 73, "BBP": 21, "ERA": 3.35, "WHIP": 1.1, "KBB": 3.82}, {"id": "116", "name": "Freddy Peralta", "team": "NYM", "pos": ["SP"], "rank": 116, "drafted": false, "myTeam": false, "posRanks": {"SP": 34}, "IP": 147, "W": 13, "L": 9, "QS": 11, "SV": 0, "K": 187, "BBP": 49, "ERA": 3.4, "WHIP": 1.2, "KBB": 4.66}, {"id": "117", "name": "Blake Snell", "team": "LAD", "pos": ["SP"], "rank": 117, "drafted": false, "myTeam": false, "posRanks": {"SP": 35}, "IP": 147, "W": 13, "L": 9, "QS": 11, "SV": 0, "K": 187, "BBP": 49, "ERA": 3.4, "WHIP": 1.2, "KBB": 4.65}, {"id": "118", "name": "Spencer Strider", "team": "ATL", "pos": ["SP"], "rank": 118, "drafted": false, "myTeam": false, "posRanks": {"SP": 36}, "IP": 146, "W": 13, "L": 9, "QS": 11, "SV": 0, "K": 186, "BBP": 49, "ERA": 3.41, "WHIP": 1.2, "KBB": 4.63}, {"id": "119", "name": "Nick Lodolo", "team": "CIN", "pos": ["SP"], "rank": 119, "drafted": false, "myTeam": false, "posRanks": {"SP": 37}, "IP": 146, "W": 13, "L": 9, "QS": 11, "SV": 0, "K": 186, "BBP": 49, "ERA": 3.41, "WHIP": 1.21, "KBB": 4.62}, {"id": "120", "name": "Gerrit Cole", "team": "NYY", "pos": ["SP"], "rank": 120, "drafted": false, "myTeam": false, "posRanks": {"SP": 38}, "IP": 145, "W": 13, "L": 8, "QS": 10, "SV": 0, "K": 185, "BBP": 48, "ERA": 3.42, "WHIP": 1.21, "KBB": 4.6}, {"id": "121", "name": "Joe Musgrove", "team": "SD", "pos": ["SP"], "rank": 121, "drafted": false, "myTeam": false, "posRanks": {"SP": 39}, "IP": 145, "W": 13, "L": 8, "QS": 10, "SV": 0, "K": 185, "BBP": 48, "ERA": 3.43, "WHIP": 1.21, "KBB": 4.59}, {"id": "122", "name": "Aaron Nola", "team": "PHI", "pos": ["SP"], "rank": 122, "drafted": false, "myTeam": false, "posRanks": {"SP": 40}, "IP": 144, "W": 13, "L": 8, "QS": 10, "SV": 0, "K": 184, "BBP": 48, "ERA": 3.43, "WHIP": 1.21, "KBB": 4.57}, {"id": "123", "name": "Hunter Greene", "team": "CIN", "pos": ["SP"], "rank": 123, "drafted": false, "myTeam": false, "posRanks": {"SP": 41}, "IP": 144, "W": 13, "L": 8, "QS": 10, "SV": 0, "K": 184, "BBP": 48, "ERA": 3.44, "WHIP": 1.21, "KBB": 4.56}, {"id": "124", "name": "Shane Bieber", "team": "TOR", "pos": ["SP"], "rank": 124, "drafted": false, "myTeam": false, "posRanks": {"SP": 42}, "IP": 143, "W": 13, "L": 8, "QS": 10, "SV": 0, "K": 183, "BBP": 48, "ERA": 3.44, "WHIP": 1.22, "KBB": 4.54}, {"id": "125", "name": "Spencer Schwellenbach", "team": "ATL", "pos": ["SP"], "rank": 125, "drafted": false, "myTeam": false, "posRanks": {"SP": 43}, "IP": 143, "W": 13, "L": 8, "QS": 10, "SV": 0, "K": 183, "BBP": 48, "ERA": 3.45, "WHIP": 1.22, "KBB": 4.53}, {"id": "126", "name": "Heliot Ramos", "team": "SF", "pos": ["OF"], "rank": 126, "drafted": false, "myTeam": false, "posRanks": {"OF": 38}, "H": 129, "R": 76, "HR": 27, "RBI": 70, "BB": 65, "SB": 18, "AVG": 0.271, "OBP": 0.348, "SLG": 0.502, "TB": 198}, {"id": "127", "name": "Kyle Stowers", "team": "MIA", "pos": ["OF"], "rank": 127, "drafted": false, "myTeam": false, "posRanks": {"OF": 39}, "H": 129, "R": 76, "HR": 27, "RBI": 70, "BB": 65, "SB": 18, "AVG": 0.271, "OBP": 0.348, "SLG": 0.501, "TB": 197}, {"id": "128", "name": "Salvador Perez", "team": "KC", "pos": ["1B", "C"], "rank": 128, "drafted": false, "myTeam": false, "posRanks": {"C": 7, "1B": 15}, "H": 128, "R": 76, "HR": 26, "RBI": 70, "BB": 64, "SB": 3, "AVG": 0.27, "OBP": 0.347, "SLG": 0.5, "TB": 196}, {"id": "129", "name": "Willy Adames", "team": "SF", "pos": ["SS"], "rank": 129, "drafted": false, "myTeam": false, "posRanks": {"SS": 12}, "H": 128, "R": 75, "HR": 26, "RBI": 69, "BB": 64, "SB": 18, "AVG": 0.27, "OBP": 0.347, "SLG": 0.499, "TB": 195}, {"id": "130", "name": "Devin Williams", "team": "NYM", "pos": ["RP"], "rank": 130, "drafted": false, "myTeam": false, "posRanks": {"RP": 7}, "IP": 66, "W": 4, "L": 3, "QS": 0, "SV": 22, "K": 70, "BBP": 20, "ERA": 3.5, "WHIP": 1.13, "KBB": 3.64}, {"id": "131", "name": "Aroldis Chapman", "team": "BOS", "pos": ["RP"], "rank": 131, "drafted": false, "myTeam": false, "posRanks": {"RP": 8}, "IP": 66, "W": 4, "L": 3, "QS": 0, "SV": 22, "K": 70, "BBP": 20, "ERA": 3.51, "WHIP": 1.13, "KBB": 3.63}, {"id": "132", "name": "Josh Hader", "team": "HOU", "pos": ["RP"], "rank": 132, "drafted": false, "myTeam": false, "posRanks": {"RP": 9}, "IP": 66, "W": 4, "L": 3, "QS": 0, "SV": 22, "K": 70, "BBP": 20, "ERA": 3.52, "WHIP": 1.13, "KBB": 3.62}, {"id": "133", "name": "Griffin Jax", "team": "TB", "pos": ["RP"], "rank": 133, "drafted": false, "myTeam": false, "posRanks": {"RP": 10}, "IP": 66, "W": 4, "L": 3, "QS": 0, "SV": 22, "K": 70, "BBP": 20, "ERA": 3.53, "WHIP": 1.13, "KBB": 3.6}, {"id": "134", "name": "Raisel Iglesias", "team": "ATL", "pos": ["RP"], "rank": 134, "drafted": false, "myTeam": false, "posRanks": {"RP": 11}, "IP": 66, "W": 4, "L": 3, "QS": 0, "SV": 22, "K": 70, "BBP": 20, "ERA": 3.54, "WHIP": 1.13, "KBB": 3.59}, {"id": "135", "name": "Chase Burns", "team": "CIN", "pos": ["RP", "SP"], "rank": 135, "drafted": false, "myTeam": false, "posRanks": {"RP": 12, "SP": 44}, "IP": 138, "W": 13, "L": 8, "QS": 9, "SV": 0, "K": 178, "BBP": 47, "ERA": 3.51, "WHIP": 1.24, "KBB": 4.38}, {"id": "136", "name": "Tanner Bibee", "team": "CLE", "pos": ["SP"], "rank": 136, "drafted": false, "myTeam": false, "posRanks": {"SP": 45}, "IP": 137, "W": 13, "L": 8, "QS": 9, "SV": 0, "K": 177, "BBP": 47, "ERA": 3.52, "WHIP": 1.24, "KBB": 4.36}, {"id": "137", "name": "Michael King", "team": "SD", "pos": ["SP"], "rank": 137, "drafted": false, "myTeam": false, "posRanks": {"SP": 46}, "IP": 137, "W": 13, "L": 8, "QS": 9, "SV": 0, "K": 177, "BBP": 47, "ERA": 3.52, "WHIP": 1.24, "KBB": 4.35}, {"id": "138", "name": "Matthew Boyd", "team": "CHC", "pos": ["SP"], "rank": 138, "drafted": false, "myTeam": false, "posRanks": {"SP": 47}, "IP": 136, "W": 13, "L": 8, "QS": 9, "SV": 0, "K": 176, "BBP": 47, "ERA": 3.53, "WHIP": 1.24, "KBB": 4.33}, {"id": "139", "name": "Eury Perez", "team": "MIA", "pos": ["SP"], "rank": 139, "drafted": false, "myTeam": false, "posRanks": {"SP": 48}, "IP": 136, "W": 13, "L": 8, "QS": 9, "SV": 0, "K": 176, "BBP": 47, "ERA": 3.53, "WHIP": 1.24, "KBB": 4.32}, {"id": "140", "name": "Justin Steele", "team": "CHC", "pos": ["SP"], "rank": 140, "drafted": false, "myTeam": false, "posRanks": {"SP": 49}, "IP": 135, "W": 12, "L": 8, "QS": 8, "SV": 0, "K": 175, "BBP": 47, "ERA": 3.54, "WHIP": 1.25, "KBB": 4.3}, {"id": "141", "name": "Drake Baldwin", "team": "ATL", "pos": ["C"], "rank": 141, "drafted": false, "myTeam": false, "posRanks": {"C": 8}, "H": 122, "R": 71, "HR": 25, "RBI": 65, "BB": 61, "SB": 3, "AVG": 0.266, "OBP": 0.342, "SLG": 0.488, "TB": 181}, {"id": "142", "name": "Oneil Cruz", "team": "PIT", "pos": ["OF"], "rank": 142, "drafted": false, "myTeam": false, "posRanks": {"OF": 40}, "H": 121, "R": 71, "HR": 25, "RBI": 65, "BB": 61, "SB": 17, "AVG": 0.265, "OBP": 0.341, "SLG": 0.487, "TB": 180}, {"id": "143", "name": "Lawrence Butler", "team": "ATH", "pos": ["OF"], "rank": 143, "drafted": false, "myTeam": false, "posRanks": {"OF": 41}, "H": 121, "R": 71, "HR": 25, "RBI": 65, "BB": 61, "SB": 17, "AVG": 0.265, "OBP": 0.341, "SLG": 0.486, "TB": 179}, {"id": "144", "name": "Josh Naylor", "team": "SEA", "pos": ["1B"], "rank": 144, "drafted": false, "myTeam": false, "posRanks": {"1B": 16}, "H": 120, "R": 70, "HR": 24, "RBI": 64, "BB": 60, "SB": 2, "AVG": 0.265, "OBP": 0.34, "SLG": 0.485, "TB": 178}, {"id": "145", "name": "MacKenzie Gore", "team": "TEX", "pos": ["SP"], "rank": 145, "drafted": false, "myTeam": false, "posRanks": {"SP": 50}, "IP": 133, "W": 12, "L": 8, "QS": 8, "SV": 0, "K": 173, "BBP": 46, "ERA": 3.57, "WHIP": 1.26, "KBB": 4.23}, {"id": "146", "name": "Jack Flaherty", "team": "DET", "pos": ["SP"], "rank": 146, "drafted": false, "myTeam": false, "posRanks": {"SP": 51}, "IP": 132, "W": 12, "L": 8, "QS": 8, "SV": 0, "K": 172, "BBP": 46, "ERA": 3.58, "WHIP": 1.26, "KBB": 4.21}, {"id": "147", "name": "Kris Bubic", "team": "KC", "pos": ["SP"], "rank": 147, "drafted": false, "myTeam": false, "posRanks": {"SP": 52}, "IP": 132, "W": 12, "L": 8, "QS": 8, "SV": 0, "K": 172, "BBP": 46, "ERA": 3.58, "WHIP": 1.26, "KBB": 4.2}, {"id": "148", "name": "Bailey Ober", "team": "MIN", "pos": ["SP"], "rank": 148, "drafted": false, "myTeam": false, "posRanks": {"SP": 53}, "IP": 131, "W": 12, "L": 8, "QS": 8, "SV": 0, "K": 171, "BBP": 46, "ERA": 3.59, "WHIP": 1.26, "KBB": 4.18}, {"id": "149", "name": "Braxton Garrett", "team": "MIA", "pos": ["SP"], "rank": 149, "drafted": false, "myTeam": false, "posRanks": {"SP": 54}, "IP": 131, "W": 12, "L": 8, "QS": 8, "SV": 0, "K": 171, "BBP": 46, "ERA": 3.59, "WHIP": 1.26, "KBB": 4.17}, {"id": "150", "name": "Jeremy Pena", "team": "HOU", "pos": ["SS"], "rank": 150, "drafted": false, "myTeam": false, "posRanks": {"SS": 13}, "H": 117, "R": 68, "HR": 24, "RBI": 62, "BB": 59, "SB": 16, "AVG": 0.263, "OBP": 0.338, "SLG": 0.48, "TB": 171}, {"id": "151", "name": "Jacob Wilson", "team": "ATH", "pos": ["SS"], "rank": 151, "drafted": false, "myTeam": false, "posRanks": {"SS": 14}, "H": 117, "R": 68, "HR": 24, "RBI": 62, "BB": 59, "SB": 16, "AVG": 0.262, "OBP": 0.337, "SLG": 0.479, "TB": 170}, {"id": "152", "name": "Nico Hoerner", "team": "CHC", "pos": ["2B"], "rank": 152, "drafted": false, "myTeam": false, "posRanks": {"2B": 7}, "H": 116, "R": 68, "HR": 23, "RBI": 62, "BB": 58, "SB": 16, "AVG": 0.262, "OBP": 0.337, "SLG": 0.478, "TB": 169}, {"id": "153", "name": "Kazuma Okamoto", "team": "TOR", "pos": ["1B", "3B"], "rank": 153, "drafted": false, "myTeam": false, "posRanks": {"3B": 12, "1B": 17}, "H": 116, "R": 67, "HR": 23, "RBI": 61, "BB": 58, "SB": 2, "AVG": 0.261, "OBP": 0.336, "SLG": 0.477, "TB": 168}, {"id": "154", "name": "Ryan Helsley", "team": "BAL", "pos": ["RP"], "rank": 154, "drafted": false, "myTeam": false, "posRanks": {"RP": 13}, "IP": 65, "W": 4, "L": 3, "QS": 0, "SV": 19, "K": 66, "BBP": 18, "ERA": 3.74, "WHIP": 1.17, "KBB": 3.35}, {"id": "155", "name": "Jeff Hoffman", "team": "TOR", "pos": ["RP"], "rank": 155, "drafted": false, "myTeam": false, "posRanks": {"RP": 14}, "IP": 65, "W": 4, "L": 3, "QS": 0, "SV": 19, "K": 65, "BBP": 18, "ERA": 3.75, "WHIP": 1.17, "KBB": 3.34}, {"id": "156", "name": "Ryan Walker", "team": "SF", "pos": ["RP"], "rank": 156, "drafted": false, "myTeam": false, "posRanks": {"RP": 15}, "IP": 65, "W": 4, "L": 3, "QS": 0, "SV": 19, "K": 65, "BBP": 18, "ERA": 3.76, "WHIP": 1.17, "KBB": 3.33}, {"id": "157", "name": "Trevor Megill", "team": "MIL", "pos": ["RP"], "rank": 157, "drafted": false, "myTeam": false, "posRanks": {"RP": 16}, "IP": 65, "W": 4, "L": 3, "QS": 0, "SV": 19, "K": 65, "BBP": 18, "ERA": 3.77, "WHIP": 1.17, "KBB": 3.32}, {"id": "158", "name": "Emilio Pagan", "team": "CIN", "pos": ["RP"], "rank": 158, "drafted": false, "myTeam": false, "posRanks": {"RP": 17}, "IP": 65, "W": 4, "L": 3, "QS": 0, "SV": 19, "K": 65, "BBP": 18, "ERA": 3.78, "WHIP": 1.17, "KBB": 3.3}, {"id": "159", "name": "Carlos Rodon", "team": "NYY", "pos": ["SP"], "rank": 159, "drafted": false, "myTeam": false, "posRanks": {"SP": 55}, "IP": 126, "W": 12, "L": 8, "QS": 7, "SV": 0, "K": 166, "BBP": 45, "ERA": 3.65, "WHIP": 1.28, "KBB": 4.02}, {"id": "160", "name": "Ryan Pepiot", "team": "TB", "pos": ["SP"], "rank": 160, "drafted": false, "myTeam": false, "posRanks": {"SP": 56}, "IP": 125, "W": 12, "L": 8, "QS": 6, "SV": 0, "K": 165, "BBP": 45, "ERA": 3.66, "WHIP": 1.28, "KBB": 4.0}, {"id": "161", "name": "Zac Gallen", "team": "ARI", "pos": ["SP"], "rank": 161, "drafted": false, "myTeam": false, "posRanks": {"SP": 57}, "IP": 125, "W": 12, "L": 8, "QS": 6, "SV": 0, "K": 165, "BBP": 45, "ERA": 3.67, "WHIP": 1.29, "KBB": 3.99}, {"id": "162", "name": "Merrill Kelly", "team": "ARI", "pos": ["SP"], "rank": 162, "drafted": false, "myTeam": false, "posRanks": {"SP": 58}, "IP": 124, "W": 12, "L": 8, "QS": 6, "SV": 0, "K": 164, "BBP": 45, "ERA": 3.67, "WHIP": 1.29, "KBB": 3.97}, {"id": "163", "name": "Bryce Miller", "team": "SEA", "pos": ["SP"], "rank": 163, "drafted": false, "myTeam": false, "posRanks": {"SP": 59}, "IP": 124, "W": 12, "L": 8, "QS": 6, "SV": 0, "K": 164, "BBP": 45, "ERA": 3.68, "WHIP": 1.29, "KBB": 3.96}, {"id": "164", "name": "Grayson Rodriguez", "team": "LAA", "pos": ["SP"], "rank": 164, "drafted": false, "myTeam": false, "posRanks": {"SP": 60}, "IP": 123, "W": 12, "L": 8, "QS": 6, "SV": 0, "K": 163, "BBP": 45, "ERA": 3.68, "WHIP": 1.29, "KBB": 3.94}, {"id": "165", "name": "Ezequiel Tovar", "team": "COL", "pos": ["SS"], "rank": 165, "drafted": false, "myTeam": false, "posRanks": {"SS": 15}, "H": 110, "R": 63, "HR": 22, "RBI": 57, "BB": 55, "SB": 14, "AVG": 0.257, "OBP": 0.331, "SLG": 0.467, "TB": 160}, {"id": "166", "name": "Casey Mize", "team": "DET", "pos": ["SP"], "rank": 166, "drafted": false, "myTeam": false, "posRanks": {"SP": 61}, "IP": 122, "W": 12, "L": 8, "QS": 6, "SV": 0, "K": 162, "BBP": 45, "ERA": 3.7, "WHIP": 1.3, "KBB": 3.91}, {"id": "167", "name": "Brandon Pfaadt", "team": "ARI", "pos": ["SP"], "rank": 167, "drafted": false, "myTeam": false, "posRanks": {"SP": 62}, "IP": 122, "W": 12, "L": 8, "QS": 6, "SV": 0, "K": 162, "BBP": 45, "ERA": 3.7, "WHIP": 1.3, "KBB": 3.9}, {"id": "168", "name": "Zebby Matthews", "team": "MIN", "pos": ["SP"], "rank": 168, "drafted": false, "myTeam": false, "posRanks": {"SP": 63}, "IP": 121, "W": 12, "L": 8, "QS": 6, "SV": 0, "K": 161, "BBP": 44, "ERA": 3.71, "WHIP": 1.3, "KBB": 3.88}, {"id": "169", "name": "Will Smith", "team": "LAD", "pos": ["C"], "rank": 169, "drafted": false, "myTeam": false, "posRanks": {"C": 9}, "H": 108, "R": 62, "HR": 21, "RBI": 56, "BB": 54, "SB": 1, "AVG": 0.256, "OBP": 0.329, "SLG": 0.463, "TB": 160}, {"id": "170", "name": "CJ Abrams", "team": "WSH", "pos": ["SS"], "rank": 170, "drafted": false, "myTeam": false, "posRanks": {"SS": 16}, "H": 107, "R": 62, "HR": 21, "RBI": 56, "BB": 54, "SB": 14, "AVG": 0.256, "OBP": 0.329, "SLG": 0.462, "TB": 160}, {"id": "171", "name": "Daniel Palencia", "team": "CHC", "pos": ["RP"], "rank": 171, "drafted": false, "myTeam": false, "posRanks": {"RP": 18}, "IP": 64, "W": 4, "L": 3, "QS": 0, "SV": 17, "K": 62, "BBP": 17, "ERA": 3.91, "WHIP": 1.19, "KBB": 3.15}, {"id": "172", "name": "Abner Uribe", "team": "MIL", "pos": ["RP"], "rank": 172, "drafted": false, "myTeam": false, "posRanks": {"RP": 19}, "IP": 64, "W": 4, "L": 3, "QS": 0, "SV": 17, "K": 62, "BBP": 17, "ERA": 3.92, "WHIP": 1.2, "KBB": 3.14}, {"id": "173", "name": "Grant Taylor", "team": "CWS", "pos": ["RP"], "rank": 173, "drafted": false, "myTeam": false, "posRanks": {"RP": 20}, "IP": 64, "W": 4, "L": 3, "QS": 0, "SV": 17, "K": 62, "BBP": 17, "ERA": 3.93, "WHIP": 1.2, "KBB": 3.12}, {"id": "174", "name": "Pete Fairbanks", "team": "MIA", "pos": ["RP"], "rank": 174, "drafted": false, "myTeam": false, "posRanks": {"RP": 21}, "IP": 64, "W": 4, "L": 3, "QS": 0, "SV": 17, "K": 62, "BBP": 17, "ERA": 3.94, "WHIP": 1.2, "KBB": 3.11}, {"id": "175", "name": "Bryan Abreu", "team": "HOU", "pos": ["RP"], "rank": 175, "drafted": false, "myTeam": false, "posRanks": {"RP": 22}, "IP": 64, "W": 4, "L": 3, "QS": 0, "SV": 17, "K": 61, "BBP": 17, "ERA": 3.95, "WHIP": 1.2, "KBB": 3.1}, {"id": "176", "name": "Sean Manaea", "team": "NYM", "pos": ["RP", "SP"], "rank": 176, "drafted": false, "myTeam": false, "posRanks": {"RP": 23, "SP": 64}, "IP": 117, "W": 11, "L": 8, "QS": 5, "SV": 0, "K": 157, "BBP": 44, "ERA": 3.76, "WHIP": 1.31, "KBB": 3.76}, {"id": "177", "name": "Robert Garcia", "team": "TEX", "pos": ["RP"], "rank": 177, "drafted": false, "myTeam": false, "posRanks": {"RP": 24}, "IP": 64, "W": 4, "L": 3, "QS": 0, "SV": 16, "K": 61, "BBP": 17, "ERA": 3.97, "WHIP": 1.2, "KBB": 3.08}, {"id": "178", "name": "Edward Cabrera", "team": "CHC", "pos": ["SP"], "rank": 178, "drafted": false, "myTeam": false, "posRanks": {"SP": 65}, "IP": 116, "W": 11, "L": 8, "QS": 5, "SV": 0, "K": 156, "BBP": 44, "ERA": 3.77, "WHIP": 1.32, "KBB": 3.73}, {"id": "179", "name": "Trey Yesavage", "team": "TOR", "pos": ["SP"], "rank": 179, "drafted": false, "myTeam": false, "posRanks": {"SP": 66}, "IP": 116, "W": 11, "L": 8, "QS": 5, "SV": 0, "K": 156, "BBP": 44, "ERA": 3.77, "WHIP": 1.32, "KBB": 3.72}, {"id": "180", "name": "Cody Ponce", "team": "TOR", "pos": ["SP"], "rank": 180, "drafted": false, "myTeam": false, "posRanks": {"SP": 67}, "IP": 115, "W": 11, "L": 7, "QS": 4, "SV": 0, "K": 155, "BBP": 43, "ERA": 3.78, "WHIP": 1.32, "KBB": 3.7}, {"id": "181", "name": "Reynaldo Lopez", "team": "ATL", "pos": ["SP"], "rank": 181, "drafted": false, "myTeam": false, "posRanks": {"SP": 68}, "IP": 115, "W": 11, "L": 7, "QS": 4, "SV": 0, "K": 155, "BBP": 43, "ERA": 3.79, "WHIP": 1.32, "KBB": 3.69}, {"id": "182", "name": "Andrew Abbott", "team": "CIN", "pos": ["SP"], "rank": 182, "drafted": false, "myTeam": false, "posRanks": {"SP": 69}, "IP": 114, "W": 11, "L": 7, "QS": 4, "SV": 0, "K": 154, "BBP": 43, "ERA": 3.79, "WHIP": 1.33, "KBB": 3.67}, {"id": "183", "name": "Garrett Cleavinger", "team": "TB", "pos": ["RP"], "rank": 183, "drafted": false, "myTeam": false, "posRanks": {"RP": 25}, "IP": 63, "W": 4, "L": 3, "QS": 0, "SV": 16, "K": 60, "BBP": 16, "ERA": 4.03, "WHIP": 1.21, "KBB": 3.0}, {"id": "184", "name": "Jeremiah Estrada", "team": "SD", "pos": ["RP"], "rank": 184, "drafted": false, "myTeam": false, "posRanks": {"RP": 26}, "IP": 63, "W": 4, "L": 3, "QS": 0, "SV": 15, "K": 60, "BBP": 16, "ERA": 4.04, "WHIP": 1.21, "KBB": 2.99}, {"id": "185", "name": "Garrett Whitlock", "team": "BOS", "pos": ["RP"], "rank": 185, "drafted": false, "myTeam": false, "posRanks": {"RP": 27}, "IP": 63, "W": 4, "L": 3, "QS": 0, "SV": 15, "K": 59, "BBP": 16, "ERA": 4.05, "WHIP": 1.22, "KBB": 2.98}, {"id": "186", "name": "Robert Suarez", "team": "ATL", "pos": ["RP"], "rank": 186, "drafted": false, "myTeam": false, "posRanks": {"RP": 28}, "IP": 63, "W": 4, "L": 3, "QS": 0, "SV": 15, "K": 59, "BBP": 16, "ERA": 4.06, "WHIP": 1.22, "KBB": 2.97}, {"id": "187", "name": "Gabe Speier", "team": "SEA", "pos": ["RP"], "rank": 187, "drafted": false, "myTeam": false, "posRanks": {"RP": 29}, "IP": 63, "W": 4, "L": 3, "QS": 0, "SV": 15, "K": 59, "BBP": 16, "ERA": 4.07, "WHIP": 1.22, "KBB": 2.96}, {"id": "188", "name": "Adley Rutschman", "team": "BAL", "pos": ["C"], "rank": 188, "drafted": false, "myTeam": false, "posRanks": {"C": 10}, "H": 105, "R": 56, "HR": 19, "RBI": 50, "BB": 49, "SB": 0, "AVG": 0.249, "OBP": 0.32, "SLG": 0.446, "TB": 160}, {"id": "189", "name": "Jorge Polanco", "team": "NYM", "pos": ["2B", "3B"], "rank": 189, "drafted": false, "myTeam": false, "posRanks": {"2B": 8, "3B": 13}, "H": 105, "R": 55, "HR": 19, "RBI": 49, "BB": 49, "SB": 11, "AVG": 0.249, "OBP": 0.32, "SLG": 0.445, "TB": 160}, {"id": "190", "name": "Michael Busch", "team": "CHC", "pos": ["1B"], "rank": 190, "drafted": false, "myTeam": false, "posRanks": {"1B": 18}, "H": 105, "R": 55, "HR": 19, "RBI": 49, "BB": 49, "SB": 0, "AVG": 0.248, "OBP": 0.32, "SLG": 0.444, "TB": 160}, {"id": "191", "name": "Nolan McLean", "team": "NYM", "pos": ["SP"], "rank": 191, "drafted": false, "myTeam": false, "posRanks": {"SP": 70}, "IP": 110, "W": 11, "L": 7, "QS": 3, "SV": 0, "K": 150, "BBP": 43, "ERA": 3.85, "WHIP": 1.34, "KBB": 3.54}, {"id": "192", "name": "Sandy Alcantara", "team": "MIA", "pos": ["SP"], "rank": 192, "drafted": false, "myTeam": false, "posRanks": {"SP": 71}, "IP": 110, "W": 11, "L": 7, "QS": 3, "SV": 0, "K": 149, "BBP": 42, "ERA": 3.85, "WHIP": 1.34, "KBB": 3.52}, {"id": "193", "name": "Shane Baz", "team": "BAL", "pos": ["SP"], "rank": 193, "drafted": false, "myTeam": false, "posRanks": {"SP": 72}, "IP": 110, "W": 11, "L": 7, "QS": 3, "SV": 0, "K": 149, "BBP": 42, "ERA": 3.86, "WHIP": 1.35, "KBB": 3.51}, {"id": "194", "name": "Cade Horton", "team": "CHC", "pos": ["SP"], "rank": 194, "drafted": false, "myTeam": false, "posRanks": {"SP": 73}, "IP": 110, "W": 11, "L": 7, "QS": 3, "SV": 0, "K": 148, "BBP": 42, "ERA": 3.86, "WHIP": 1.35, "KBB": 3.49}, {"id": "195", "name": "Dennis Santana", "team": "PIT", "pos": ["RP"], "rank": 195, "drafted": false, "myTeam": false, "posRanks": {"RP": 30}, "IP": 63, "W": 4, "L": 3, "QS": 0, "SV": 14, "K": 57, "BBP": 15, "ERA": 4.15, "WHIP": 1.23, "KBB": 2.86}, {"id": "196", "name": "Kenley Jansen", "team": "DET", "pos": ["RP"], "rank": 196, "drafted": false, "myTeam": false, "posRanks": {"RP": 31}, "IP": 63, "W": 4, "L": 3, "QS": 0, "SV": 14, "K": 57, "BBP": 15, "ERA": 4.16, "WHIP": 1.23, "KBB": 2.85}, {"id": "197", "name": "Adrian Morejon", "team": "SD", "pos": ["RP"], "rank": 197, "drafted": false, "myTeam": false, "posRanks": {"RP": 32}, "IP": 63, "W": 4, "L": 3, "QS": 0, "SV": 14, "K": 57, "BBP": 15, "ERA": 4.17, "WHIP": 1.24, "KBB": 2.84}, {"id": "198", "name": "Edwin Uceta", "team": "TB", "pos": ["RP"], "rank": 198, "drafted": false, "myTeam": false, "posRanks": {"RP": 33}, "IP": 63, "W": 4, "L": 3, "QS": 0, "SV": 14, "K": 57, "BBP": 15, "ERA": 4.18, "WHIP": 1.24, "KBB": 2.82}, {"id": "199", "name": "Cam Schlittler", "team": "NYY", "pos": ["SP"], "rank": 199, "drafted": false, "myTeam": false, "posRanks": {"SP": 74}, "IP": 110, "W": 11, "L": 7, "QS": 3, "SV": 0, "K": 146, "BBP": 42, "ERA": 3.89, "WHIP": 1.36, "KBB": 3.42}, {"id": "200", "name": "Trevor Rogers", "team": "BAL", "pos": ["SP"], "rank": 200, "drafted": false, "myTeam": false, "posRanks": {"SP": 75}, "IP": 110, "W": 11, "L": 7, "QS": 2, "SV": 0, "K": 145, "BBP": 42, "ERA": 3.9, "WHIP": 1.36, "KBB": 3.4}, {"id": "201", "name": "Jose A. Ferrer", "team": "SEA", "pos": ["RP"], "rank": 201, "drafted": false, "myTeam": false, "posRanks": {"RP": 34}, "IP": 62, "W": 4, "L": 3, "QS": 0, "SV": 13, "K": 56, "BBP": 15, "ERA": 4.21, "WHIP": 1.24, "KBB": 2.79}, {"id": "202", "name": "Will Vest", "team": "DET", "pos": ["RP"], "rank": 202, "drafted": false, "myTeam": false, "posRanks": {"RP": 35}, "IP": 62, "W": 4, "L": 3, "QS": 0, "SV": 13, "K": 56, "BBP": 15, "ERA": 4.22, "WHIP": 1.24, "KBB": 2.78}, {"id": "203", "name": "Ryne Nelson", "team": "ARI", "pos": ["RP", "SP"], "rank": 203, "drafted": false, "myTeam": false, "posRanks": {"RP": 36, "SP": 76}, "IP": 110, "W": 11, "L": 7, "QS": 2, "SV": 0, "K": 144, "BBP": 42, "ERA": 3.92, "WHIP": 1.37, "KBB": 3.36}, {"id": "204", "name": "Alex Vesia", "team": "LAD", "pos": ["RP"], "rank": 204, "drafted": false, "myTeam": false, "posRanks": {"RP": 37}, "IP": 62, "W": 4, "L": 3, "QS": 0, "SV": 13, "K": 56, "BBP": 15, "ERA": 4.24, "WHIP": 1.25, "KBB": 2.75}, {"id": "205", "name": "Matt Strahm", "team": "KC", "pos": ["RP"], "rank": 205, "drafted": false, "myTeam": false, "posRanks": {"RP": 38}, "IP": 62, "W": 4, "L": 3, "QS": 0, "SV": 13, "K": 55, "BBP": 15, "ERA": 4.25, "WHIP": 1.25, "KBB": 2.74}, {"id": "206", "name": "Mitch Keller", "team": "PIT", "pos": ["SP"], "rank": 206, "drafted": false, "myTeam": false, "posRanks": {"SP": 77}, "IP": 110, "W": 11, "L": 7, "QS": 2, "SV": 0, "K": 142, "BBP": 41, "ERA": 3.94, "WHIP": 1.37, "KBB": 3.31}, {"id": "207", "name": "Ian Seymour", "team": "TB", "pos": ["RP", "SP"], "rank": 207, "drafted": false, "myTeam": false, "posRanks": {"RP": 39, "SP": 78}, "IP": 110, "W": 11, "L": 7, "QS": 2, "SV": 0, "K": 142, "BBP": 41, "ERA": 3.94, "WHIP": 1.37, "KBB": 3.3}, {"id": "208", "name": "Ryan Weathers", "team": "NYY", "pos": ["SP"], "rank": 208, "drafted": false, "myTeam": false, "posRanks": {"SP": 79}, "IP": 110, "W": 11, "L": 7, "QS": 2, "SV": 0, "K": 141, "BBP": 41, "ERA": 3.95, "WHIP": 1.38, "KBB": 3.28}, {"id": "209", "name": "Matt Brash", "team": "SEA", "pos": ["RP"], "rank": 209, "drafted": false, "myTeam": false, "posRanks": {"RP": 40}, "IP": 62, "W": 4, "L": 3, "QS": 0, "SV": 12, "K": 55, "BBP": 15, "ERA": 4.29, "WHIP": 1.25, "KBB": 2.69}, {"id": "210", "name": "Yainer Diaz", "team": "HOU", "pos": ["C"], "rank": 210, "drafted": false, "myTeam": false, "posRanks": {"C": 11}, "H": 105, "R": 48, "HR": 16, "RBI": 42, "BB": 44, "SB": 0, "AVG": 0.241, "OBP": 0.31, "SLG": 0.426, "TB": 160}, {"id": "211", "name": "Ozzie Albies", "team": "ATL", "pos": ["2B"], "rank": 211, "drafted": false, "myTeam": false, "posRanks": {"2B": 9}, "H": 105, "R": 48, "HR": 16, "RBI": 42, "BB": 44, "SB": 9, "AVG": 0.241, "OBP": 0.31, "SLG": 0.425, "TB": 160}, {"id": "212", "name": "Jacob Misiorowski", "team": "MIL", "pos": ["SP"], "rank": 212, "drafted": false, "myTeam": false, "posRanks": {"SP": 80}, "IP": 110, "W": 10, "L": 7, "QS": 1, "SV": 0, "K": 139, "BBP": 41, "ERA": 3.97, "WHIP": 1.38, "KBB": 3.22}, {"id": "213", "name": "Gavin Williams", "team": "CLE", "pos": ["SP"], "rank": 213, "drafted": false, "myTeam": false, "posRanks": {"SP": 81}, "IP": 110, "W": 10, "L": 7, "QS": 1, "SV": 0, "K": 139, "BBP": 41, "ERA": 3.98, "WHIP": 1.38, "KBB": 3.21}, {"id": "214", "name": "Robbie Ray", "team": "SF", "pos": ["SP"], "rank": 214, "drafted": false, "myTeam": false, "posRanks": {"SP": 82}, "IP": 110, "W": 10, "L": 7, "QS": 1, "SV": 0, "K": 138, "BBP": 41, "ERA": 3.98, "WHIP": 1.39, "KBB": 3.19}, {"id": "215", "name": "Adolis Garcia", "team": "PHI", "pos": ["OF"], "rank": 215, "drafted": false, "myTeam": false, "posRanks": {"OF": 42}, "H": 105, "R": 48, "HR": 16, "RBI": 41, "BB": 43, "SB": 9, "AVG": 0.24, "OBP": 0.308, "SLG": 0.421, "TB": 160}, {"id": "216", "name": "Carlos Estevez", "team": "KC", "pos": ["RP"], "rank": 216, "drafted": false, "myTeam": false, "posRanks": {"RP": 41}, "IP": 62, "W": 4, "L": 3, "QS": 0, "SV": 11, "K": 55, "BBP": 14, "ERA": 4.36, "WHIP": 1.27, "KBB": 2.61}, {"id": "217", "name": "Reid Detmers", "team": "LAA", "pos": ["RP"], "rank": 217, "drafted": false, "myTeam": false, "posRanks": {"RP": 42}, "IP": 62, "W": 4, "L": 3, "QS": 0, "SV": 11, "K": 55, "BBP": 14, "ERA": 4.37, "WHIP": 1.27, "KBB": 2.6}, {"id": "218", "name": "David Peterson", "team": "NYM", "pos": ["SP"], "rank": 218, "drafted": false, "myTeam": false, "posRanks": {"SP": 83}, "IP": 110, "W": 10, "L": 7, "QS": 1, "SV": 0, "K": 136, "BBP": 40, "ERA": 4.01, "WHIP": 1.39, "KBB": 3.13}, {"id": "219", "name": "Seranthony Dominguez", "team": "CWS", "pos": ["RP"], "rank": 219, "drafted": false, "myTeam": false, "posRanks": {"RP": 43}, "IP": 62, "W": 4, "L": 3, "QS": 0, "SV": 11, "K": 55, "BBP": 14, "ERA": 4.39, "WHIP": 1.27, "KBB": 2.57}, {"id": "220", "name": "Kodai Senga", "team": "NYM", "pos": ["SP"], "rank": 220, "drafted": false, "myTeam": false, "posRanks": {"SP": 84}, "IP": 110, "W": 10, "L": 7, "QS": 0, "SV": 0, "K": 135, "BBP": 40, "ERA": 4.02, "WHIP": 1.4, "KBB": 3.1}, {"id": "221", "name": "Brady Singer", "team": "CIN", "pos": ["SP"], "rank": 221, "drafted": false, "myTeam": false, "posRanks": {"SP": 85}, "IP": 110, "W": 10, "L": 7, "QS": 0, "SV": 0, "K": 135, "BBP": 40, "ERA": 4.03, "WHIP": 1.4, "KBB": 3.09}, {"id": "222", "name": "Mike Burrows", "team": "HOU", "pos": ["RP", "SP"], "rank": 222, "drafted": false, "myTeam": false, "posRanks": {"RP": 44, "SP": 86}, "IP": 110, "W": 10, "L": 7, "QS": 0, "SV": 0, "K": 134, "BBP": 40, "ERA": 4.03, "WHIP": 1.4, "KBB": 3.07}, {"id": "223", "name": "Kevin Ginkel", "team": "ARI", "pos": ["RP"], "rank": 223, "drafted": false, "myTeam": false, "posRanks": {"RP": 45}, "IP": 61, "W": 4, "L": 3, "QS": 0, "SV": 11, "K": 55, "BBP": 14, "ERA": 4.43, "WHIP": 1.28, "KBB": 2.52}, {"id": "224", "name": "Phil Maton", "team": "CHC", "pos": ["RP"], "rank": 224, "drafted": false, "myTeam": false, "posRanks": {"RP": 46}, "IP": 61, "W": 4, "L": 3, "QS": 0, "SV": 10, "K": 55, "BBP": 14, "ERA": 4.44, "WHIP": 1.28, "KBB": 2.51}, {"id": "225", "name": "Agustin Ramirez", "team": "MIA", "pos": ["C"], "rank": 225, "drafted": false, "myTeam": false, "posRanks": {"C": 12}, "H": 105, "R": 48, "HR": 14, "RBI": 40, "BB": 40, "SB": 0, "AVG": 0.236, "OBP": 0.304, "SLG": 0.412, "TB": 160}, {"id": "226", "name": "Ceddanne Rafaela", "team": "BOS", "pos": ["2B", "OF"], "rank": 226, "drafted": false, "myTeam": false, "posRanks": {"2B": 10, "OF": 43}, "H": 105, "R": 48, "HR": 14, "RBI": 40, "BB": 40, "SB": 7, "AVG": 0.236, "OBP": 0.303, "SLG": 0.412, "TB": 160}, {"id": "227", "name": "Luke Keaschall", "team": "MIN", "pos": ["2B"], "rank": 227, "drafted": false, "myTeam": false, "posRanks": {"2B": 11}, "H": 105, "R": 48, "HR": 14, "RBI": 40, "BB": 40, "SB": 7, "AVG": 0.236, "OBP": 0.303, "SLG": 0.411, "TB": 160}, {"id": "228", "name": "Bryson Stott", "team": "PHI", "pos": ["2B", "SS"], "rank": 228, "drafted": false, "myTeam": false, "posRanks": {"2B": 12, "SS": 17}, "H": 105, "R": 48, "HR": 14, "RBI": 40, "BB": 39, "SB": 7, "AVG": 0.235, "OBP": 0.302, "SLG": 0.41, "TB": 160}, {"id": "229", "name": "Marcus Semien", "team": "NYM", "pos": ["2B"], "rank": 229, "drafted": false, "myTeam": false, "posRanks": {"2B": 13}, "H": 105, "R": 48, "HR": 14, "RBI": 40, "BB": 39, "SB": 7, "AVG": 0.235, "OBP": 0.302, "SLG": 0.409, "TB": 160}, {"id": "230", "name": "Xavier Edwards", "team": "MIA", "pos": ["2B", "SS"], "rank": 230, "drafted": false, "myTeam": false, "posRanks": {"2B": 14, "SS": 18}, "H": 105, "R": 48, "HR": 14, "RBI": 40, "BB": 39, "SB": 7, "AVG": 0.234, "OBP": 0.302, "SLG": 0.408, "TB": 160}, {"id": "231", "name": "Luis Robert Jr.", "team": "NYM", "pos": ["OF"], "rank": 231, "drafted": false, "myTeam": false, "posRanks": {"OF": 44}, "H": 105, "R": 48, "HR": 14, "RBI": 40, "BB": 39, "SB": 7, "AVG": 0.234, "OBP": 0.301, "SLG": 0.407, "TB": 160}, {"id": "232", "name": "Noelvi Marte", "team": "CIN", "pos": ["3B", "OF"], "rank": 232, "drafted": false, "myTeam": false, "posRanks": {"3B": 14, "OF": 45}, "H": 105, "R": 48, "HR": 13, "RBI": 40, "BB": 38, "SB": 7, "AVG": 0.234, "OBP": 0.301, "SLG": 0.406, "TB": 160}, {"id": "233", "name": "Spencer Torkelson", "team": "DET", "pos": ["1B"], "rank": 233, "drafted": false, "myTeam": false, "posRanks": {"1B": 19}, "H": 105, "R": 48, "HR": 13, "RBI": 40, "BB": 38, "SB": 0, "AVG": 0.233, "OBP": 0.3, "SLG": 0.405, "TB": 160}, {"id": "234", "name": "Jose Soriano", "team": "LAA", "pos": ["SP"], "rank": 234, "drafted": false, "myTeam": false, "posRanks": {"SP": 87}, "IP": 110, "W": 10, "L": 7, "QS": 0, "SV": 0, "K": 128, "BBP": 39, "ERA": 4.1, "WHIP": 1.42, "KBB": 2.89}, {"id": "235", "name": "Trevor Story", "team": "BOS", "pos": ["SS"], "rank": 235, "drafted": false, "myTeam": false, "posRanks": {"SS": 19}, "H": 105, "R": 48, "HR": 13, "RBI": 40, "BB": 38, "SB": 6, "AVG": 0.233, "OBP": 0.299, "SLG": 0.403, "TB": 160}, {"id": "236", "name": "Dansby Swanson", "team": "CHC", "pos": ["SS"], "rank": 236, "drafted": false, "myTeam": false, "posRanks": {"SS": 20}, "H": 105, "R": 48, "HR": 13, "RBI": 40, "BB": 37, "SB": 6, "AVG": 0.232, "OBP": 0.299, "SLG": 0.403, "TB": 160}, {"id": "237", "name": "Joey Cantillo", "team": "CLE", "pos": ["RP", "SP"], "rank": 237, "drafted": false, "myTeam": false, "posRanks": {"RP": 47, "SP": 88}, "IP": 110, "W": 10, "L": 7, "QS": 0, "SV": 0, "K": 127, "BBP": 39, "ERA": 4.12, "WHIP": 1.43, "KBB": 2.85}, {"id": "238", "name": "Clay Holmes", "team": "NYM", "pos": ["SP"], "rank": 238, "drafted": false, "myTeam": false, "posRanks": {"SP": 89}, "IP": 110, "W": 10, "L": 7, "QS": 0, "SV": 0, "K": 126, "BBP": 39, "ERA": 4.13, "WHIP": 1.43, "KBB": 2.83}, {"id": "239", "name": "Jack Leiter", "team": "TEX", "pos": ["SP"], "rank": 239, "drafted": false, "myTeam": false, "posRanks": {"SP": 90}, "IP": 110, "W": 10, "L": 7, "QS": 0, "SV": 0, "K": 126, "BBP": 39, "ERA": 4.13, "WHIP": 1.43, "KBB": 2.82}, {"id": "240", "name": "Shane Smith", "team": "CWS", "pos": ["SP"], "rank": 240, "drafted": false, "myTeam": false, "posRanks": {"SP": 91}, "IP": 110, "W": 10, "L": 6, "QS": 0, "SV": 0, "K": 125, "BBP": 38, "ERA": 4.14, "WHIP": 1.44, "KBB": 2.8}];

const rosterTemplate: Record<string, number> = { C:1, "1B":1, "2B":1, SS:1, "3B":1, LF:1, CF:1, RF:1, UTIL:1, SP:6, RP:2, P:3 };
const hittingCats = ["H","R","HR","RBI","BB","SB","AVG","OBP","SLG","TB"] as const;
const pitchingCats = ["IP","W","L","QS","SV","K","BBP","ERA","WHIP","KBB"] as const;
const inverseCats = new Set(["L","BBP","ERA","WHIP"]);
const tierColors: Record<string,string> = {
  "Tier 1": "bg-emerald-100 border-emerald-300 text-emerald-900",
  "Tier 2": "bg-lime-100 border-lime-300 text-lime-900",
  "Tier 3": "bg-amber-100 border-amber-300 text-amber-900",
  "Tier 4": "bg-orange-100 border-orange-300 text-orange-900",
  "Tier 5": "bg-rose-100 border-rose-300 text-rose-900",
  "Tier 6": "bg-slate-100 border-slate-300 text-slate-900",
  "Tier 7": "bg-zinc-100 border-zinc-300 text-zinc-900",
};

function badgeStyle() { return "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium"; }
function buttonStyle(primary=false) { return primary ? "rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800" : "rounded-xl border px-3 py-2 text-sm font-medium hover:bg-slate-50"; }
function cardStyle() { return "rounded-2xl border bg-white p-4 shadow-sm"; }
function mean(arr:number[]) { return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0; }
function std(arr:number[]) { const m=mean(arr); const v=mean(arr.map(x=>(x-m)**2)); return Math.sqrt(v || 1); }
function isPitcher(player:Player) { return player.pos.includes("SP") || player.pos.includes("RP"); }
function displayPos(player:Player) { return player.pos.join("/"); }
function defaultTeams(): LeagueTeam[] { return Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: i === 0 ? "My Team" : `Team ${i + 1}`, slot: i + 1 })); }
function currentRound(overall:number, teams:number) { return Math.ceil(overall / teams); }
function pickInRound(overall:number, teams:number) { return ((overall - 1) % teams) + 1; }
function snakeTeamForPick(overall:number, orderedTeams:LeagueTeam[]) {
  const teams = orderedTeams.length;
  const round = Math.ceil(overall / teams);
  const pick = ((overall - 1) % teams);
  return round % 2 === 1 ? orderedTeams[pick] : orderedTeams[teams - 1 - pick];
}
function tierFromPosRank(posRank:number, bucket:string) {
  const cuts =
    bucket === "C" ? [3,6,10,14,18,24] :
    bucket === "SP" ? [8,16,28,40,55,75] :
    bucket === "RP" ? [3,6,10,15,20,30] :
    bucket === "OF" ? [8,16,28,40,55,75] :
    bucket === "DH" ? [1,2,4,6,8,10] :
    [4,8,12,18,24,32];
  for (let i = 0; i < cuts.length; i++) if (posRank <= cuts[i]) return `Tier ${i+1}`;
  return "Tier 7";
}
function primaryBucket(p:Player) {
  if (p.pos.includes("C")) return "C";
  if (p.pos.includes("1B")) return "1B";
  if (p.pos.includes("2B")) return "2B";
  if (p.pos.includes("SS")) return "SS";
  if (p.pos.includes("3B")) return "3B";
  if (p.pos.includes("SP")) return "SP";
  if (p.pos.includes("RP")) return "RP";
  if (p.pos.includes("DH")) return "DH";
  return "OF";
}
function bestPositionRank(p:Player) {
  const keys = Object.keys(p.posRanks);
  if (!keys.length) return { bucket: primaryBucket(p), posRank: 999 };
  let bestBucket = keys[0];
  let best = p.posRanks[bestBucket];
  keys.forEach(k => { if (p.posRanks[k] < best) { best = p.posRanks[k]; bestBucket = k; } });
  return { bucket: bestBucket, posRank: best };
}
function computeProfiles(players:Player[]) {
  const hitters = players.filter((p)=>!isPitcher(p));
  const pitchers = players.filter((p)=>isPitcher(p));
  return {
    hitterProfile: Object.fromEntries(hittingCats.map((cat) => [cat, { mean: mean(hitters.map((p)=>Number((p as any)[cat] || 0))), std: std(hitters.map((p)=>Number((p as any)[cat] || 0))) }])),
    pitcherProfile: Object.fromEntries(pitchingCats.map((cat) => [cat, { mean: mean(pitchers.map((p)=>Number((p as any)[cat] || 0))), std: std(pitchers.map((p)=>Number((p as any)[cat] || 0))) }]))
  };
}
function zScore(value:number, profile:{mean:number,std:number}, inverse=false) {
  const z = (value - profile.mean) / (profile.std || 1);
  return inverse ? -z : z;
}
function teamSummary(players:Player[]) {
  const mine = players.filter((p)=>p.myTeam);
  const totals:any = Object.fromEntries([...hittingCats, ...pitchingCats].map((c)=>[c,0]));
  const avgCats = ["AVG","OBP","SLG","ERA","WHIP","KBB"];
  mine.forEach((p) => {
    [...hittingCats, ...pitchingCats].forEach((cat) => { if (!avgCats.includes(cat)) totals[cat] += Number((p as any)[cat] || 0); });
  });
  avgCats.forEach((cat) => {
    const vals = mine.map((p)=>Number((p as any)[cat] || 0)).filter((n)=>n > 0);
    totals[cat] = vals.length ? mean(vals) : 0;
  });
  return totals;
}
function positionCounts(players:Player[]) {
  const counts:Record<string, number> = Object.fromEntries(Object.keys(rosterTemplate).map((k)=>[k,0]));
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
    counts,
    totals
  };
}
function scorePlayer(player:Player, profiles:any, needs:any) {
  let score = 0;
  if (isPitcher(player)) pitchingCats.forEach((cat) => { score += zScore(Number((player as any)[cat] || 0), profiles.pitcherProfile[cat], inverseCats.has(cat)); });
  else hittingCats.forEach((cat) => { score += zScore(Number((player as any)[cat] || 0), profiles.hitterProfile[cat], inverseCats.has(cat)); });
  if (isPitcher(player) && needs.pitchingNeed > needs.hittingNeed) score += 1.35;
  if (!isPitcher(player) && needs.hittingNeed >= needs.pitchingNeed) score += 0.95;
  const bp = bestPositionRank(player);
  if (bp.posRank <= 3) score += 0.5;
  if (bp.posRank <= 8) score += 0.25;
  return score;
}

export default function Page() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [leagueTeams, setLeagueTeams] = useState<LeagueTeam[]>(defaultTeams());
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<"rank" | "ai">("rank");
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
  const totals = needs.totals;
  const counts = needs.counts;

  const ranked = useMemo(() => {
    const enriched = [...players].map((p) => {
      const { bucket, posRank } = bestPositionRank(p);
      return { ...p, aiScore: scorePlayer(p, profiles, needs), tier: tierFromPosRank(posRank, bucket), bucket, posRank };
    });
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

  const bestByPosition = useMemo(() => {
    const positions = ["C","1B","2B","SS","3B","OF","SP","RP","DH"];
    const out: Record<string, any | null> = Object.fromEntries(positions.map(p => [p, null]));
    positions.forEach(pos => {
      out[pos] = available.filter((p:any) => pos === "OF" ? p.pos.includes("OF") : p.pos.includes(pos)).sort((a:any,b:any) => {
        const pa = a.posRanks[pos] ?? 999;
        const pb = b.posRanks[pos] ?? 999;
        return pa - pb || a.rank - b.rank;
      })[0] || null;
    });
    return out;
  }, [available]);

  const tierBoard = useMemo(() => {
    const groups: Record<string, any[]> = Object.fromEntries(["C","1B","2B","SS","3B","OF","SP","RP","DH"].map(p => [p, []]));
    available.forEach((p:any) => {
      const bucket = primaryBucket(p);
      groups[bucket].push(p);
    });
    Object.keys(groups).forEach(pos => groups[pos].sort((a:any,b:any) => ((a.posRanks[pos] ?? 999) - (b.posRanks[pos] ?? 999)) || a.rank - b.rank));
    return groups;
  }, [available]);

  function updateTeamName(id:number, value:string) { setLeagueTeams(prev => prev.map(t => t.id === id ? { ...t, name: value } : t)); }
  function updateTeamSlot(id:number, value:number) { const safe = Math.max(1, Math.min(12, value || 1)); setLeagueTeams(prev => prev.map(t => t.id === id ? { ...t, slot: safe } : t)); }
  function markPlayer(id:string, mine=false) {
    const draftedTeam = mine ? orderedTeams.find(t => t.id === 1)! : clockTeam;
    const player = players.find(p => p.id === id);
    if (!player || !draftedTeam) return;
    const pick: DraftPick = { overall: nextPick, round: nextRound, pickInRound: nextPickInRound, teamId: draftedTeam.id, teamName: draftedTeam.name, playerId: id, playerName: player.name, playerPos: displayPos(player), mine };
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, drafted:true, myTeam: mine } : p));
    setHistory(prev => [...prev, pick]);
    setOverrideTeamId("");
  }
  function undoLastPick() {
    const last = history[history.length - 1];
    if (!last) return;
    setPlayers(prev => prev.map(p => p.id === last.playerId ? { ...p, drafted:false, myTeam:false } : p));
    setHistory(prev => prev.slice(0, -1));
  }
  function resetDraft() { setPlayers(prev => prev.map(p => ({ ...p, drafted:false, myTeam:false }))); setHistory([]); setOverrideTeamId(""); }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fantasy Baseball AI Draft Assistant</h1>
            <p className="text-sm text-slate-600">Built from your uploaded cheat sheet. Tiers are based on positional rank, not overall rank.</p>
          </div>
          <div className="flex flex-wrap gap-2">
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
                  <div><div className="text-xs uppercase text-slate-500">Overall</div><div className="text-2xl font-semibold">{nextPick}</div></div>
                  <div><div className="text-xs uppercase text-slate-500">Round</div><div className="text-2xl font-semibold">{nextRound}</div></div>
                  <div><div className="text-xs uppercase text-slate-500">Pick</div><div className="text-2xl font-semibold">{nextPickInRound}</div></div>
                </div>
                <div className="mt-3 text-sm text-slate-700">On the clock: <span className="font-semibold">{clockTeam?.name}</span></div>
              </div>

              <div className="rounded-2xl border bg-white p-3">
                <div className="mb-2 text-xs uppercase text-slate-500">Override Team</div>
                <select className="w-full rounded-xl border px-3 py-2 text-sm" value={overrideTeamId} onChange={(e)=>setOverrideTeamId(e.target.value)}>
                  <option value="">Use current team on the clock</option>
                  {orderedTeams.map(team => <option key={team.id} value={team.id}>{team.name} (slot {team.slot})</option>)}
                </select>
              </div>

              <div className="rounded-2xl border bg-white p-3">
                <div className="mb-2 text-xs uppercase text-slate-500">Best By Position</div>
                <div className="space-y-2 text-sm">
                  {Object.entries(bestByPosition).map(([pos, p]: any) => (
                    <div key={pos}><span className="font-semibold">{pos}:</span> {p ? p.name : "—"}</div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-3">
                <div className="mb-2 text-xs uppercase text-slate-500">Roster Counts</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>SP: {counts.SP}/{rosterTemplate.SP}</div><div>RP: {counts.RP}/{rosterTemplate.RP}</div>
                  <div>C: {counts.C}/{rosterTemplate.C}</div><div>1B: {counts["1B"]}/{rosterTemplate["1B"]}</div>
                  <div>2B: {counts["2B"]}/{rosterTemplate["2B"]}</div><div>SS: {counts.SS}/{rosterTemplate.SS}</div>
                  <div>3B: {counts["3B"]}/{rosterTemplate["3B"]}</div><div>LF: {counts.LF}/{rosterTemplate.LF}</div>
                  <div>CF: {counts.CF}/{rosterTemplate.CF}</div><div>RF: {counts.RF}/{rosterTemplate.RF}</div>
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
                          <span className="text-sm font-semibold text-slate-500">#{p.rank}</span>
                          <span className="text-base font-semibold">{p.name}</span>
                          <span className={badgeStyle()}>{p.team}</span>
                          {p.pos.map((pos:string)=><span className={badgeStyle()} key={pos}>{pos}</span>)}
                          <span className={`${badgeStyle()} ${tierColors[p.tier]}`}>{p.tier}</span>
                          <span className={badgeStyle()}>{p.bucket} #{p.posRank}</span>
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
                  {Object.entries(tierBoard).map(([position, list]: any) => (
                    <div key={position} className="rounded-2xl border bg-slate-50 p-3">
                      <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">{position}</div>
                      <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1">
                        {list.map((p:any) => (
                          <div key={p.id} className={`rounded-xl border p-2 ${tierColors[p.tier]}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-sm font-semibold">{p.name}</div>
                                <div className="text-xs opacity-80">#{p.rank} • {p.team} • {position} #{p.posRanks[position] ?? p.posRank}</div>
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
                          <th className="py-2">Ovr</th><th className="py-2">Rnd</th><th className="py-2">Pick</th><th className="py-2">Team</th><th className="py-2">Player</th><th className="py-2">Pos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map(pick => (
                          <tr key={pick.overall} className="border-b last:border-b-0">
                            <td className="py-2">{pick.overall}</td><td className="py-2">{pick.round}</td><td className="py-2">{pick.pickInRound}</td><td className="py-2">{pick.teamName}</td><td className="py-2">{pick.playerName}</td><td className="py-2">{pick.playerPos}</td>
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
            <h2 className="mb-4 text-lg font-semibold">My Team</h2>
            <div className="mb-4 max-h-[220px] space-y-2 overflow-y-auto pr-1">
              {!players.some((p)=>p.myTeam) && <div className="rounded-xl border border-dashed p-4 text-sm text-slate-500">Mark a player as My Pick to start building your team.</div>}
              {players.filter((p)=>p.myTeam).map((p)=>(
                <div key={p.id} className="rounded-xl border bg-white p-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.pos.map((pos)=><span className={badgeStyle()} key={pos}>{pos}</span>)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl border p-3">H: {totals.H}</div><div className="rounded-xl border p-3">R: {totals.R}</div>
              <div className="rounded-xl border p-3">HR: {totals.HR}</div><div className="rounded-xl border p-3">RBI: {totals.RBI}</div>
              <div className="rounded-xl border p-3">BB: {totals.BB}</div><div className="rounded-xl border p-3">SB: {totals.SB}</div>
              <div className="rounded-xl border p-3">AVG: {totals.AVG ? totals.AVG.toFixed(3) : "0.000"}</div><div className="rounded-xl border p-3">OBP: {totals.OBP ? totals.OBP.toFixed(3) : "0.000"}</div>
              <div className="rounded-xl border p-3">SLG: {totals.SLG ? totals.SLG.toFixed(3) : "0.000"}</div><div className="rounded-xl border p-3">TB: {totals.TB}</div>
              <div className="rounded-xl border p-3">IP: {totals.IP}</div><div className="rounded-xl border p-3">W: {totals.W}</div>
              <div className="rounded-xl border p-3">L: {totals.L}</div><div className="rounded-xl border p-3">QS: {totals.QS}</div>
              <div className="rounded-xl border p-3">SV: {totals.SV}</div><div className="rounded-xl border p-3">K: {totals.K}</div>
              <div className="rounded-xl border p-3">BBP: {totals.BBP}</div><div className="rounded-xl border p-3">ERA: {totals.ERA ? totals.ERA.toFixed(2) : "0.00"}</div>
              <div className="rounded-xl border p-3">WHIP: {totals.WHIP ? totals.WHIP.toFixed(2) : "0.00"}</div><div className="rounded-xl border p-3">K/BB: {totals.KBB ? totals.KBB.toFixed(2) : "0.00"}</div>
            </div>

            <div className="rounded-xl border bg-white p-3 text-sm text-slate-600">
              Rankings and positional tiers are baked into this version from your uploaded cheat sheet. No CSV import is needed.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
