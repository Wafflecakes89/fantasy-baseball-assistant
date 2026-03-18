
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
type DraftPick = {
  overall:number; round:number; pickInRound:number;
  teamId:number; teamName:string;
  playerId:string; playerName:string; playerPos:string; mine:boolean;
};

const seededPlayersRaw: Player[] = [{"id": "1", "name": "Aaron Judge", "team": "NYY", "pos": ["OF"], "rank": 1, "drafted": false, "myTeam": false, "posRanks": {"OF": 1}}, {"id": "2", "name": "Shohei Ohtani (Batter)", "team": "LAD", "pos": ["DH"], "rank": 2, "drafted": false, "myTeam": false, "posRanks": {}}, {"id": "3", "name": "Juan Soto", "team": "NYM", "pos": ["OF"], "rank": 3, "drafted": false, "myTeam": false, "posRanks": {"OF": 2}}, {"id": "4", "name": "Ronald Acuna Jr.", "team": "ATL", "pos": ["OF"], "rank": 4, "drafted": false, "myTeam": false, "posRanks": {"OF": 3}}, {"id": "5", "name": "Bobby Witt Jr.", "team": "KC", "pos": ["SS"], "rank": 5, "drafted": false, "myTeam": false, "posRanks": {"SS": 1}}, {"id": "6", "name": "Jose Ramirez", "team": "CLE", "pos": ["3B"], "rank": 6, "drafted": false, "myTeam": false, "posRanks": {"3B": 1}}, {"id": "7", "name": "Kyle Tucker", "team": "LAD", "pos": ["OF"], "rank": 7, "drafted": false, "myTeam": false, "posRanks": {"OF": 4}}, {"id": "8", "name": "Julio Rodriguez", "team": "SEA", "pos": ["OF"], "rank": 8, "drafted": false, "myTeam": false, "posRanks": {"OF": 5}}, {"id": "9", "name": "Junior Caminero", "team": "TB", "pos": ["3B"], "rank": 9, "drafted": false, "myTeam": false, "posRanks": {"3B": 2}}, {"id": "10", "name": "Fernando Tatis Jr.", "team": "SD", "pos": ["OF"], "rank": 10, "drafted": false, "myTeam": false, "posRanks": {"OF": 6}}, {"id": "11", "name": "Kyle Schwarber", "team": "PHI", "pos": ["DH", "OF"], "rank": 11, "drafted": false, "myTeam": false, "posRanks": {"OF": 7}}, {"id": "12", "name": "Vladimir Guerrero Jr.", "team": "TOR", "pos": ["1B"], "rank": 12, "drafted": false, "myTeam": false, "posRanks": {"1B": 1}}, {"id": "13", "name": "Yordan Alvarez", "team": "HOU", "pos": ["OF"], "rank": 13, "drafted": false, "myTeam": false, "posRanks": {"OF": 8}}, {"id": "14", "name": "Brent Rooker", "team": "ATH", "pos": ["OF"], "rank": 14, "drafted": false, "myTeam": false, "posRanks": {"OF": 9}}, {"id": "15", "name": "Tarik Skubal", "team": "DET", "pos": ["P", "SP"], "rank": 15, "drafted": false, "myTeam": false, "posRanks": {"SP": 1}}, {"id": "16", "name": "Corbin Carroll", "team": "ARI", "pos": ["OF"], "rank": 16, "drafted": false, "myTeam": false, "posRanks": {"OF": 10}}, {"id": "17", "name": "Gunnar Henderson", "team": "BAL", "pos": ["SS"], "rank": 17, "drafted": false, "myTeam": false, "posRanks": {"SS": 2}}, {"id": "18", "name": "Cal Raleigh", "team": "SEA", "pos": ["C"], "rank": 18, "drafted": false, "myTeam": false, "posRanks": {"C": 1}}, {"id": "19", "name": "Jackson Chourio", "team": "MIL", "pos": ["OF"], "rank": 19, "drafted": false, "myTeam": false, "posRanks": {"OF": 11}}, {"id": "20", "name": "Ketel Marte", "team": "ARI", "pos": ["2B"], "rank": 20, "drafted": false, "myTeam": false, "posRanks": {"2B": 1}}, {"id": "21", "name": "James Wood", "team": "WSH", "pos": ["OF"], "rank": 21, "drafted": false, "myTeam": false, "posRanks": {"OF": 12}}, {"id": "22", "name": "Paul Skenes", "team": "PIT", "pos": ["P", "SP"], "rank": 22, "drafted": false, "myTeam": false, "posRanks": {"SP": 2}}, {"id": "23", "name": "Elly De La Cruz", "team": "CIN", "pos": ["SS"], "rank": 23, "drafted": false, "myTeam": false, "posRanks": {"SS": 3}}, {"id": "24", "name": "Manny Machado", "team": "SD", "pos": ["3B"], "rank": 24, "drafted": false, "myTeam": false, "posRanks": {"3B": 3}}, {"id": "25", "name": "Austin Riley", "team": "ATL", "pos": ["3B"], "rank": 25, "drafted": false, "myTeam": false, "posRanks": {"3B": 4}}, {"id": "26", "name": "Garrett Crochet", "team": "BOS", "pos": ["P", "SP"], "rank": 26, "drafted": false, "myTeam": false, "posRanks": {"SP": 3}}, {"id": "27", "name": "Riley Greene", "team": "DET", "pos": ["OF"], "rank": 27, "drafted": false, "myTeam": false, "posRanks": {"OF": 13}}, {"id": "28", "name": "Wyatt Langford", "team": "TEX", "pos": ["OF"], "rank": 28, "drafted": false, "myTeam": false, "posRanks": {"OF": 14}}, {"id": "29", "name": "Nick Kurtz", "team": "ATH", "pos": ["1B"], "rank": 29, "drafted": false, "myTeam": false, "posRanks": {"1B": 2}}, {"id": "30", "name": "Roman Anthony", "team": "BOS", "pos": ["OF"], "rank": 30, "drafted": false, "myTeam": false, "posRanks": {"OF": 15}}, {"id": "31", "name": "Bryan Woo", "team": "SEA", "pos": ["P", "SP"], "rank": 31, "drafted": false, "myTeam": false, "posRanks": {"SP": 4}}, {"id": "32", "name": "Bryce Harper", "team": "PHI", "pos": ["1B"], "rank": 32, "drafted": false, "myTeam": false, "posRanks": {"1B": 3}}, {"id": "33", "name": "Mookie Betts", "team": "LAD", "pos": ["SS"], "rank": 33, "drafted": false, "myTeam": false, "posRanks": {"SS": 4}}, {"id": "34", "name": "Pete Alonso", "team": "BAL", "pos": ["1B"], "rank": 34, "drafted": false, "myTeam": false, "posRanks": {"1B": 4}}, {"id": "35", "name": "Freddie Freeman", "team": "LAD", "pos": ["1B"], "rank": 35, "drafted": false, "myTeam": false, "posRanks": {"1B": 5}}, {"id": "36", "name": "Chris Sale", "team": "ATL", "pos": ["P", "SP"], "rank": 36, "drafted": false, "myTeam": false, "posRanks": {"SP": 5}}, {"id": "37", "name": "Logan Gilbert", "team": "SEA", "pos": ["P", "SP"], "rank": 37, "drafted": false, "myTeam": false, "posRanks": {"SP": 6}}, {"id": "38", "name": "William Contreras", "team": "MIL", "pos": ["C"], "rank": 38, "drafted": false, "myTeam": false, "posRanks": {"C": 2}}, {"id": "39", "name": "Seiya Suzuki", "team": "CHC", "pos": ["OF"], "rank": 39, "drafted": false, "myTeam": false, "posRanks": {"OF": 16}}, {"id": "40", "name": "Alex Bregman", "team": "CHC", "pos": ["3B"], "rank": 40, "drafted": false, "myTeam": false, "posRanks": {"3B": 5}}, {"id": "41", "name": "Cristopher Sanchez", "team": "PHI", "pos": ["P", "SP"], "rank": 41, "drafted": false, "myTeam": false, "posRanks": {"SP": 7}}, {"id": "42", "name": "Trea Turner", "team": "PHI", "pos": ["SS"], "rank": 42, "drafted": false, "myTeam": false, "posRanks": {"SS": 5}}, {"id": "43", "name": "George Springer", "team": "TOR", "pos": ["OF"], "rank": 43, "drafted": false, "myTeam": false, "posRanks": {"OF": 17}}, {"id": "44", "name": "Jackson Merrill", "team": "SD", "pos": ["OF"], "rank": 44, "drafted": false, "myTeam": false, "posRanks": {"OF": 18}}, {"id": "45", "name": "Eugenio Suarez", "team": "CIN", "pos": ["3B"], "rank": 45, "drafted": false, "myTeam": false, "posRanks": {"3B": 6}}, {"id": "46", "name": "Logan Webb", "team": "SF", "pos": ["P", "SP"], "rank": 46, "drafted": false, "myTeam": false, "posRanks": {"SP": 8}}, {"id": "47", "name": "Jacob deGrom", "team": "TEX", "pos": ["P", "SP"], "rank": 47, "drafted": false, "myTeam": false, "posRanks": {"SP": 9}}, {"id": "48", "name": "George Kirby", "team": "SEA", "pos": ["P", "SP"], "rank": 48, "drafted": false, "myTeam": false, "posRanks": {"SP": 10}}, {"id": "49", "name": "Pete Crow-Armstrong", "team": "CHC", "pos": ["OF"], "rank": 49, "drafted": false, "myTeam": false, "posRanks": {"OF": 19}}, {"id": "50", "name": "Jarren Duran", "team": "BOS", "pos": ["OF"], "rank": 50, "drafted": false, "myTeam": false, "posRanks": {"OF": 20}}, {"id": "51", "name": "Francisco Lindor", "team": "NYM", "pos": ["SS"], "rank": 51, "drafted": false, "myTeam": false, "posRanks": {"SS": 6}}, {"id": "52", "name": "Cody Bellinger", "team": "NYY", "pos": ["OF"], "rank": 52, "drafted": false, "myTeam": false, "posRanks": {"OF": 21}}, {"id": "53", "name": "Rafael Devers", "team": "SF", "pos": ["1B"], "rank": 53, "drafted": false, "myTeam": false, "posRanks": {"1B": 6}}, {"id": "54", "name": "Matt Olson", "team": "ATL", "pos": ["1B"], "rank": 54, "drafted": false, "myTeam": false, "posRanks": {"1B": 7}}, {"id": "55", "name": "Yoshinobu Yamamoto", "team": "LAD", "pos": ["P", "SP"], "rank": 55, "drafted": false, "myTeam": false, "posRanks": {"SP": 11}}, {"id": "56", "name": "Zack Wheeler", "team": "PHI", "pos": ["P", "SP"], "rank": 56, "drafted": false, "myTeam": false, "posRanks": {"SP": 12}}, {"id": "57", "name": "Matt Chapman", "team": "SF", "pos": ["3B"], "rank": 57, "drafted": false, "myTeam": false, "posRanks": {"3B": 7}}, {"id": "58", "name": "Joe Ryan", "team": "MIN", "pos": ["P", "SP"], "rank": 58, "drafted": false, "myTeam": false, "posRanks": {"SP": 13}}, {"id": "59", "name": "Taylor Ward", "team": "BAL", "pos": ["OF"], "rank": 59, "drafted": false, "myTeam": false, "posRanks": {"OF": 22}}, {"id": "60", "name": "Max Fried", "team": "NYY", "pos": ["P", "SP"], "rank": 60, "drafted": false, "myTeam": false, "posRanks": {"SP": 14}}, {"id": "61", "name": "Bo Bichette", "team": "NYM", "pos": ["SS"], "rank": 61, "drafted": false, "myTeam": false, "posRanks": {"SS": 7}}, {"id": "62", "name": "Teoscar Hernandez", "team": "LAD", "pos": ["OF"], "rank": 62, "drafted": false, "myTeam": false, "posRanks": {"OF": 23}}, {"id": "63", "name": "Christian Yelich", "team": "MIL", "pos": ["OF"], "rank": 63, "drafted": false, "myTeam": false, "posRanks": {"OF": 24}}, {"id": "64", "name": "Ian Happ", "team": "CHC", "pos": ["OF"], "rank": 64, "drafted": false, "myTeam": false, "posRanks": {"OF": 25}}, {"id": "65", "name": "Cole Ragans", "team": "KC", "pos": ["P", "SP"], "rank": 65, "drafted": false, "myTeam": false, "posRanks": {"SP": 15}}, {"id": "66", "name": "Zach Neto", "team": "LAA", "pos": ["SS"], "rank": 66, "drafted": false, "myTeam": false, "posRanks": {"SS": 8}}, {"id": "67", "name": "Byron Buxton", "team": "MIN", "pos": ["OF"], "rank": 67, "drafted": false, "myTeam": false, "posRanks": {"OF": 26}}, {"id": "68", "name": "Tyler Soderstrom", "team": "ATH", "pos": ["1B", "OF"], "rank": 68, "drafted": false, "myTeam": false, "posRanks": {"1B": 8, "OF": 27}}, {"id": "69", "name": "Steven Kwan", "team": "CLE", "pos": ["OF"], "rank": 69, "drafted": false, "myTeam": false, "posRanks": {"OF": 28}}, {"id": "70", "name": "Hunter Brown", "team": "HOU", "pos": ["P", "SP"], "rank": 70, "drafted": false, "myTeam": false, "posRanks": {"SP": 16}}, {"id": "71", "name": "Nathan Eovaldi", "team": "TEX", "pos": ["P", "SP"], "rank": 71, "drafted": false, "myTeam": false, "posRanks": {"SP": 17}}, {"id": "72", "name": "Hunter Goodman", "team": "COL", "pos": ["C"], "rank": 72, "drafted": false, "myTeam": false, "posRanks": {"C": 3}}, {"id": "73", "name": "Corey Seager", "team": "TEX", "pos": ["SS"], "rank": 73, "drafted": false, "myTeam": false, "posRanks": {"SS": 9}}, {"id": "74", "name": "Jazz Chisholm Jr.", "team": "NYY", "pos": ["2B", "3B"], "rank": 74, "drafted": false, "myTeam": false, "posRanks": {"2B": 2, "3B": 8}}, {"id": "75", "name": "Randy Arozarena", "team": "SEA", "pos": ["OF"], "rank": 75, "drafted": false, "myTeam": false, "posRanks": {"OF": 29}}, {"id": "76", "name": "Jesus Luzardo", "team": "PHI", "pos": ["P", "SP"], "rank": 76, "drafted": false, "myTeam": false, "posRanks": {"SP": 18}}, {"id": "77", "name": "Sonny Gray", "team": "BOS", "pos": ["P", "SP"], "rank": 77, "drafted": false, "myTeam": false, "posRanks": {"SP": 19}}, {"id": "78", "name": "Brandon Nimmo", "team": "TEX", "pos": ["OF"], "rank": 78, "drafted": false, "myTeam": false, "posRanks": {"OF": 30}}, {"id": "79", "name": "Mason Miller", "team": "SD", "pos": ["P", "RP"], "rank": 79, "drafted": false, "myTeam": false, "posRanks": {"RP": 1}}, {"id": "80", "name": "Shohei Ohtani (Pitcher)", "team": "LAD", "pos": ["P", "SP"], "rank": 80, "drafted": false, "myTeam": false, "posRanks": {"SP": 20}}, {"id": "81", "name": "Brandon Woodruff", "team": "MIL", "pos": ["P", "SP"], "rank": 81, "drafted": false, "myTeam": false, "posRanks": {"SP": 21}}, {"id": "82", "name": "Alec Burleson", "team": "STL", "pos": ["1B", "OF"], "rank": 82, "drafted": false, "myTeam": false, "posRanks": {"1B": 9, "OF": 31}}, {"id": "83", "name": "Shea Langeliers", "team": "ATH", "pos": ["C"], "rank": 83, "drafted": false, "myTeam": false, "posRanks": {"C": 4}}, {"id": "84", "name": "Brice Turang", "team": "MIL", "pos": ["2B"], "rank": 84, "drafted": false, "myTeam": false, "posRanks": {"2B": 3}}, {"id": "85", "name": "Gleyber Torres", "team": "DET", "pos": ["2B"], "rank": 85, "drafted": false, "myTeam": false, "posRanks": {"2B": 4}}, {"id": "86", "name": "Yandy Diaz", "team": "TB", "pos": ["1B"], "rank": 86, "drafted": false, "myTeam": false, "posRanks": {"1B": 10}}, {"id": "87", "name": "Edwin Diaz", "team": "LAD", "pos": ["P", "RP"], "rank": 87, "drafted": false, "myTeam": false, "posRanks": {"RP": 2}}, {"id": "88", "name": "Cade Smith", "team": "CLE", "pos": ["P", "RP"], "rank": 88, "drafted": false, "myTeam": false, "posRanks": {"RP": 3}}, {"id": "89", "name": "Nick Pivetta", "team": "SD", "pos": ["P", "SP"], "rank": 89, "drafted": false, "myTeam": false, "posRanks": {"SP": 22}}, {"id": "90", "name": "Geraldo Perdomo", "team": "ARI", "pos": ["SS"], "rank": 90, "drafted": false, "myTeam": false, "posRanks": {"SS": 10}}, {"id": "91", "name": "Ivan Herrera", "team": "STL", "pos": ["C"], "rank": 91, "drafted": false, "myTeam": false, "posRanks": {"C": 5}}, {"id": "92", "name": "Maikel Garcia", "team": "KC", "pos": ["2B", "3B", "OF", "SS"], "rank": 92, "drafted": false, "myTeam": false, "posRanks": {"2B": 5, "SS": 11, "3B": 9, "OF": 32}}, {"id": "93", "name": "Jose Altuve", "team": "HOU", "pos": ["2B", "OF"], "rank": 93, "drafted": false, "myTeam": false, "posRanks": {"2B": 6, "OF": 33}}, {"id": "94", "name": "Michael Harris II", "team": "ATL", "pos": ["OF"], "rank": 94, "drafted": false, "myTeam": false, "posRanks": {"OF": 34}}, {"id": "95", "name": "Andy Pages", "team": "LAD", "pos": ["OF"], "rank": 95, "drafted": false, "myTeam": false, "posRanks": {"OF": 35}}, {"id": "96", "name": "Framber Valdez", "team": "DET", "pos": ["P", "SP"], "rank": 96, "drafted": false, "myTeam": false, "posRanks": {"SP": 23}}, {"id": "97", "name": "Drew Rasmussen", "team": "TB", "pos": ["P", "SP"], "rank": 97, "drafted": false, "myTeam": false, "posRanks": {"SP": 24}}, {"id": "98", "name": "Kevin Gausman", "team": "TOR", "pos": ["P", "SP"], "rank": 98, "drafted": false, "myTeam": false, "posRanks": {"SP": 25}}, {"id": "99", "name": "Shota Imanaga", "team": "CHC", "pos": ["P", "SP"], "rank": 99, "drafted": false, "myTeam": false, "posRanks": {"SP": 26}}, {"id": "100", "name": "Bryan Reynolds", "team": "PIT", "pos": ["OF"], "rank": 100, "drafted": false, "myTeam": false, "posRanks": {"OF": 36}}, {"id": "101", "name": "Ben Rice", "team": "NYY", "pos": ["1B", "C"], "rank": 101, "drafted": false, "myTeam": false, "posRanks": {"C": 6, "1B": 11}}, {"id": "102", "name": "Munetaka Murakami", "team": "CWS", "pos": ["1B", "3B"], "rank": 102, "drafted": false, "myTeam": false, "posRanks": {"1B": 12, "3B": 10}}, {"id": "103", "name": "Alec Bohm", "team": "PHI", "pos": ["1B", "3B"], "rank": 103, "drafted": false, "myTeam": false, "posRanks": {"1B": 13, "3B": 11}}, {"id": "104", "name": "Vinnie Pasquantino", "team": "KC", "pos": ["1B"], "rank": 104, "drafted": false, "myTeam": false, "posRanks": {"1B": 14}}, {"id": "105", "name": "Jhoan Duran", "team": "PHI", "pos": ["P", "RP"], "rank": 105, "drafted": false, "myTeam": false, "posRanks": {"RP": 4}}, {"id": "106", "name": "Dylan Cease", "team": "TOR", "pos": ["P", "SP"], "rank": 106, "drafted": false, "myTeam": false, "posRanks": {"SP": 27}}, {"id": "107", "name": "Luis Castillo", "team": "SEA", "pos": ["P", "SP"], "rank": 107, "drafted": false, "myTeam": false, "posRanks": {"SP": 28}}, {"id": "108", "name": "Tyler Glasnow", "team": "LAD", "pos": ["P", "SP"], "rank": 108, "drafted": false, "myTeam": false, "posRanks": {"SP": 29}}, {"id": "109", "name": "Kyle Bradish", "team": "BAL", "pos": ["P", "SP"], "rank": 109, "drafted": false, "myTeam": false, "posRanks": {"SP": 30}}, {"id": "110", "name": "Emmet Sheehan", "team": "LAD", "pos": ["P", "SP"], "rank": 110, "drafted": false, "myTeam": false, "posRanks": {"SP": 31}}, {"id": "111", "name": "Ranger Suarez", "team": "BOS", "pos": ["P", "SP"], "rank": 111, "drafted": false, "myTeam": false, "posRanks": {"SP": 32}}, {"id": "112", "name": "Shane McClanahan", "team": "TB", "pos": ["P", "SP"], "rank": 112, "drafted": false, "myTeam": false, "posRanks": {"SP": 33}}, {"id": "113", "name": "Jo Adell", "team": "LAA", "pos": ["OF"], "rank": 113, "drafted": false, "myTeam": false, "posRanks": {"OF": 37}}, {"id": "114", "name": "Andres Munoz", "team": "SEA", "pos": ["P", "RP"], "rank": 114, "drafted": false, "myTeam": false, "posRanks": {"RP": 5}}, {"id": "115", "name": "David Bednar", "team": "NYY", "pos": ["P", "RP"], "rank": 115, "drafted": false, "myTeam": false, "posRanks": {"RP": 6}}, {"id": "116", "name": "Freddy Peralta", "team": "NYM", "pos": ["P", "SP"], "rank": 116, "drafted": false, "myTeam": false, "posRanks": {"SP": 34}}, {"id": "117", "name": "Blake Snell", "team": "LAD", "pos": ["P", "SP"], "rank": 117, "drafted": false, "myTeam": false, "posRanks": {"SP": 35}}, {"id": "118", "name": "Spencer Strider", "team": "ATL", "pos": ["P", "SP"], "rank": 118, "drafted": false, "myTeam": false, "posRanks": {"SP": 36}}, {"id": "119", "name": "Nick Lodolo", "team": "CIN", "pos": ["P", "SP"], "rank": 119, "drafted": false, "myTeam": false, "posRanks": {"SP": 37}}, {"id": "120", "name": "Gerrit Cole", "team": "NYY", "pos": ["P", "SP"], "rank": 120, "drafted": false, "myTeam": false, "posRanks": {"SP": 38}}, {"id": "121", "name": "Joe Musgrove", "team": "SD", "pos": ["P", "SP"], "rank": 121, "drafted": false, "myTeam": false, "posRanks": {"SP": 39}}, {"id": "122", "name": "Aaron Nola", "team": "PHI", "pos": ["P", "SP"], "rank": 122, "drafted": false, "myTeam": false, "posRanks": {"SP": 40}}, {"id": "123", "name": "Hunter Greene", "team": "CIN", "pos": ["P", "SP"], "rank": 123, "drafted": false, "myTeam": false, "posRanks": {"SP": 41}}, {"id": "124", "name": "Shane Bieber", "team": "TOR", "pos": ["P", "SP"], "rank": 124, "drafted": false, "myTeam": false, "posRanks": {"SP": 42}}, {"id": "125", "name": "Spencer Schwellenbach", "team": "ATL", "pos": ["P", "SP"], "rank": 125, "drafted": false, "myTeam": false, "posRanks": {"SP": 43}}, {"id": "126", "name": "Heliot Ramos", "team": "SF", "pos": ["OF"], "rank": 126, "drafted": false, "myTeam": false, "posRanks": {"OF": 38}}, {"id": "127", "name": "Kyle Stowers", "team": "MIA", "pos": ["OF"], "rank": 127, "drafted": false, "myTeam": false, "posRanks": {"OF": 39}}, {"id": "128", "name": "Salvador Perez", "team": "KC", "pos": ["1B", "C"], "rank": 128, "drafted": false, "myTeam": false, "posRanks": {"C": 7, "1B": 15}}, {"id": "129", "name": "Willy Adames", "team": "SF", "pos": ["SS"], "rank": 129, "drafted": false, "myTeam": false, "posRanks": {"SS": 12}}, {"id": "130", "name": "Devin Williams", "team": "NYM", "pos": ["P", "RP"], "rank": 130, "drafted": false, "myTeam": false, "posRanks": {"RP": 7}}, {"id": "131", "name": "Aroldis Chapman", "team": "BOS", "pos": ["P", "RP"], "rank": 131, "drafted": false, "myTeam": false, "posRanks": {"RP": 8}}, {"id": "132", "name": "Josh Hader", "team": "HOU", "pos": ["P", "RP"], "rank": 132, "drafted": false, "myTeam": false, "posRanks": {"RP": 9}}, {"id": "133", "name": "Griffin Jax", "team": "TB", "pos": ["P", "RP"], "rank": 133, "drafted": false, "myTeam": false, "posRanks": {"RP": 10}}, {"id": "134", "name": "Raisel Iglesias", "team": "ATL", "pos": ["P", "RP"], "rank": 134, "drafted": false, "myTeam": false, "posRanks": {"RP": 11}}, {"id": "135", "name": "Chase Burns", "team": "CIN", "pos": ["P", "RP", "SP"], "rank": 135, "drafted": false, "myTeam": false, "posRanks": {"SP": 44, "RP": 12}}, {"id": "136", "name": "Tanner Bibee", "team": "CLE", "pos": ["P", "SP"], "rank": 136, "drafted": false, "myTeam": false, "posRanks": {"SP": 45}}, {"id": "137", "name": "Michael King", "team": "SD", "pos": ["P", "SP"], "rank": 137, "drafted": false, "myTeam": false, "posRanks": {"SP": 46}}, {"id": "138", "name": "Matthew Boyd", "team": "CHC", "pos": ["P", "SP"], "rank": 138, "drafted": false, "myTeam": false, "posRanks": {"SP": 47}}, {"id": "139", "name": "Eury Perez", "team": "MIA", "pos": ["P", "SP"], "rank": 139, "drafted": false, "myTeam": false, "posRanks": {"SP": 48}}, {"id": "140", "name": "Justin Steele", "team": "CHC", "pos": ["P", "SP"], "rank": 140, "drafted": false, "myTeam": false, "posRanks": {"SP": 49}}, {"id": "141", "name": "Drake Baldwin", "team": "ATL", "pos": ["C"], "rank": 141, "drafted": false, "myTeam": false, "posRanks": {"C": 8}}, {"id": "142", "name": "Oneil Cruz", "team": "PIT", "pos": ["OF"], "rank": 142, "drafted": false, "myTeam": false, "posRanks": {"OF": 40}}, {"id": "143", "name": "Lawrence Butler", "team": "ATH", "pos": ["OF"], "rank": 143, "drafted": false, "myTeam": false, "posRanks": {"OF": 41}}, {"id": "144", "name": "Josh Naylor", "team": "SEA", "pos": ["1B"], "rank": 144, "drafted": false, "myTeam": false, "posRanks": {"1B": 16}}, {"id": "145", "name": "MacKenzie Gore", "team": "TEX", "pos": ["P", "SP"], "rank": 145, "drafted": false, "myTeam": false, "posRanks": {"SP": 50}}, {"id": "146", "name": "Jack Flaherty", "team": "DET", "pos": ["P", "SP"], "rank": 146, "drafted": false, "myTeam": false, "posRanks": {"SP": 51}}, {"id": "147", "name": "Kris Bubic", "team": "KC", "pos": ["P", "SP"], "rank": 147, "drafted": false, "myTeam": false, "posRanks": {"SP": 52}}, {"id": "148", "name": "Bailey Ober", "team": "MIN", "pos": ["P", "SP"], "rank": 148, "drafted": false, "myTeam": false, "posRanks": {"SP": 53}}, {"id": "149", "name": "Braxton Garrett", "team": "MIA", "pos": ["P", "SP"], "rank": 149, "drafted": false, "myTeam": false, "posRanks": {"SP": 54}}, {"id": "150", "name": "Jeremy Pena", "team": "HOU", "pos": ["SS"], "rank": 150, "drafted": false, "myTeam": false, "posRanks": {"SS": 13}}, {"id": "151", "name": "Jacob Wilson", "team": "ATH", "pos": ["SS"], "rank": 151, "drafted": false, "myTeam": false, "posRanks": {"SS": 14}}, {"id": "152", "name": "Nico Hoerner", "team": "CHC", "pos": ["2B"], "rank": 152, "drafted": false, "myTeam": false, "posRanks": {"2B": 7}}, {"id": "153", "name": "Kazuma Okamoto", "team": "TOR", "pos": ["1B", "3B"], "rank": 153, "drafted": false, "myTeam": false, "posRanks": {"1B": 17, "3B": 12}}, {"id": "154", "name": "Ryan Helsley", "team": "BAL", "pos": ["P", "RP"], "rank": 154, "drafted": false, "myTeam": false, "posRanks": {"RP": 13}}, {"id": "155", "name": "Jeff Hoffman", "team": "TOR", "pos": ["P", "RP"], "rank": 155, "drafted": false, "myTeam": false, "posRanks": {"RP": 14}}, {"id": "156", "name": "Ryan Walker", "team": "SF", "pos": ["P", "RP"], "rank": 156, "drafted": false, "myTeam": false, "posRanks": {"RP": 15}}, {"id": "157", "name": "Trevor Megill", "team": "MIL", "pos": ["P", "RP"], "rank": 157, "drafted": false, "myTeam": false, "posRanks": {"RP": 16}}, {"id": "158", "name": "Emilio Pagan", "team": "CIN", "pos": ["P", "RP"], "rank": 158, "drafted": false, "myTeam": false, "posRanks": {"RP": 17}}, {"id": "159", "name": "Carlos Rodon", "team": "NYY", "pos": ["P", "SP"], "rank": 159, "drafted": false, "myTeam": false, "posRanks": {"SP": 55}}, {"id": "160", "name": "Ryan Pepiot", "team": "TB", "pos": ["P", "SP"], "rank": 160, "drafted": false, "myTeam": false, "posRanks": {"SP": 56}}, {"id": "161", "name": "Zac Gallen", "team": "ARI", "pos": ["P", "SP"], "rank": 161, "drafted": false, "myTeam": false, "posRanks": {"SP": 57}}, {"id": "162", "name": "Merrill Kelly", "team": "ARI", "pos": ["P", "SP"], "rank": 162, "drafted": false, "myTeam": false, "posRanks": {"SP": 58}}, {"id": "163", "name": "Bryce Miller", "team": "SEA", "pos": ["P", "SP"], "rank": 163, "drafted": false, "myTeam": false, "posRanks": {"SP": 59}}, {"id": "164", "name": "Grayson Rodriguez", "team": "LAA", "pos": ["P", "SP"], "rank": 164, "drafted": false, "myTeam": false, "posRanks": {"SP": 60}}, {"id": "165", "name": "Ezequiel Tovar", "team": "COL", "pos": ["SS"], "rank": 165, "drafted": false, "myTeam": false, "posRanks": {"SS": 15}}, {"id": "166", "name": "Casey Mize", "team": "DET", "pos": ["P", "SP"], "rank": 166, "drafted": false, "myTeam": false, "posRanks": {"SP": 61}}, {"id": "167", "name": "Brandon Pfaadt", "team": "ARI", "pos": ["P", "SP"], "rank": 167, "drafted": false, "myTeam": false, "posRanks": {"SP": 62}}, {"id": "168", "name": "Zebby Matthews", "team": "MIN", "pos": ["P", "SP"], "rank": 168, "drafted": false, "myTeam": false, "posRanks": {"SP": 63}}, {"id": "169", "name": "Will Smith", "team": "LAD", "pos": ["C"], "rank": 169, "drafted": false, "myTeam": false, "posRanks": {"C": 9}}, {"id": "170", "name": "CJ Abrams", "team": "WSH", "pos": ["SS"], "rank": 170, "drafted": false, "myTeam": false, "posRanks": {"SS": 16}}, {"id": "171", "name": "Daniel Palencia", "team": "CHC", "pos": ["P", "RP"], "rank": 171, "drafted": false, "myTeam": false, "posRanks": {"RP": 18}}, {"id": "172", "name": "Abner Uribe", "team": "MIL", "pos": ["P", "RP"], "rank": 172, "drafted": false, "myTeam": false, "posRanks": {"RP": 19}}, {"id": "173", "name": "Grant Taylor", "team": "CWS", "pos": ["P", "RP"], "rank": 173, "drafted": false, "myTeam": false, "posRanks": {"RP": 20}}, {"id": "174", "name": "Pete Fairbanks", "team": "MIA", "pos": ["P", "RP"], "rank": 174, "drafted": false, "myTeam": false, "posRanks": {"RP": 21}}, {"id": "175", "name": "Bryan Abreu", "team": "HOU", "pos": ["P", "RP"], "rank": 175, "drafted": false, "myTeam": false, "posRanks": {"RP": 22}}, {"id": "176", "name": "Sean Manaea", "team": "NYM", "pos": ["P", "RP", "SP"], "rank": 176, "drafted": false, "myTeam": false, "posRanks": {"SP": 64, "RP": 23}}, {"id": "177", "name": "Robert Garcia", "team": "TEX", "pos": ["P", "RP"], "rank": 177, "drafted": false, "myTeam": false, "posRanks": {"RP": 24}}, {"id": "178", "name": "Edward Cabrera", "team": "CHC", "pos": ["P", "SP"], "rank": 178, "drafted": false, "myTeam": false, "posRanks": {"SP": 65}}, {"id": "179", "name": "Trey Yesavage", "team": "TOR", "pos": ["P", "SP"], "rank": 179, "drafted": false, "myTeam": false, "posRanks": {"SP": 66}}, {"id": "180", "name": "Cody Ponce", "team": "TOR", "pos": ["P", "SP"], "rank": 180, "drafted": false, "myTeam": false, "posRanks": {"SP": 67}}, {"id": "181", "name": "Reynaldo Lopez", "team": "ATL", "pos": ["P", "SP"], "rank": 181, "drafted": false, "myTeam": false, "posRanks": {"SP": 68}}, {"id": "182", "name": "Andrew Abbott", "team": "CIN", "pos": ["P", "SP"], "rank": 182, "drafted": false, "myTeam": false, "posRanks": {"SP": 69}}, {"id": "183", "name": "Garrett Cleavinger", "team": "TB", "pos": ["P", "RP"], "rank": 183, "drafted": false, "myTeam": false, "posRanks": {"RP": 25}}, {"id": "184", "name": "Jeremiah Estrada", "team": "SD", "pos": ["P", "RP"], "rank": 184, "drafted": false, "myTeam": false, "posRanks": {"RP": 26}}, {"id": "185", "name": "Garrett Whitlock", "team": "BOS", "pos": ["P", "RP"], "rank": 185, "drafted": false, "myTeam": false, "posRanks": {"RP": 27}}, {"id": "186", "name": "Robert Suarez", "team": "ATL", "pos": ["P", "RP"], "rank": 186, "drafted": false, "myTeam": false, "posRanks": {"RP": 28}}, {"id": "187", "name": "Gabe Speier", "team": "SEA", "pos": ["P", "RP"], "rank": 187, "drafted": false, "myTeam": false, "posRanks": {"RP": 29}}, {"id": "188", "name": "Adley Rutschman", "team": "BAL", "pos": ["C"], "rank": 188, "drafted": false, "myTeam": false, "posRanks": {"C": 10}}, {"id": "189", "name": "Jorge Polanco", "team": "NYM", "pos": ["2B", "3B"], "rank": 189, "drafted": false, "myTeam": false, "posRanks": {"2B": 8, "3B": 13}}, {"id": "190", "name": "Michael Busch", "team": "CHC", "pos": ["1B"], "rank": 190, "drafted": false, "myTeam": false, "posRanks": {"1B": 18}}, {"id": "191", "name": "Nolan McLean", "team": "NYM", "pos": ["P", "SP"], "rank": 191, "drafted": false, "myTeam": false, "posRanks": {"SP": 70}}, {"id": "192", "name": "Sandy Alcantara", "team": "MIA", "pos": ["P", "SP"], "rank": 192, "drafted": false, "myTeam": false, "posRanks": {"SP": 71}}, {"id": "193", "name": "Shane Baz", "team": "BAL", "pos": ["P", "SP"], "rank": 193, "drafted": false, "myTeam": false, "posRanks": {"SP": 72}}, {"id": "194", "name": "Cade Horton", "team": "CHC", "pos": ["P", "SP"], "rank": 194, "drafted": false, "myTeam": false, "posRanks": {"SP": 73}}, {"id": "195", "name": "Dennis Santana", "team": "PIT", "pos": ["P", "RP"], "rank": 195, "drafted": false, "myTeam": false, "posRanks": {"RP": 30}}, {"id": "196", "name": "Kenley Jansen", "team": "DET", "pos": ["P", "RP"], "rank": 196, "drafted": false, "myTeam": false, "posRanks": {"RP": 31}}, {"id": "197", "name": "Adrian Morejon", "team": "SD", "pos": ["P", "RP"], "rank": 197, "drafted": false, "myTeam": false, "posRanks": {"RP": 32}}, {"id": "198", "name": "Edwin Uceta", "team": "TB", "pos": ["P", "RP"], "rank": 198, "drafted": false, "myTeam": false, "posRanks": {"RP": 33}}, {"id": "199", "name": "Cam Schlittler", "team": "NYY", "pos": ["P", "SP"], "rank": 199, "drafted": false, "myTeam": false, "posRanks": {"SP": 74}}, {"id": "200", "name": "Trevor Rogers", "team": "BAL", "pos": ["P", "SP"], "rank": 200, "drafted": false, "myTeam": false, "posRanks": {"SP": 75}}, {"id": "201", "name": "Jose A. Ferrer", "team": "SEA", "pos": ["P", "RP"], "rank": 201, "drafted": false, "myTeam": false, "posRanks": {"RP": 34}}, {"id": "202", "name": "Will Vest", "team": "DET", "pos": ["P", "RP"], "rank": 202, "drafted": false, "myTeam": false, "posRanks": {"RP": 35}}, {"id": "203", "name": "Ryne Nelson", "team": "ARI", "pos": ["P", "RP", "SP"], "rank": 203, "drafted": false, "myTeam": false, "posRanks": {"SP": 76, "RP": 36}}, {"id": "204", "name": "Alex Vesia", "team": "LAD", "pos": ["P", "RP"], "rank": 204, "drafted": false, "myTeam": false, "posRanks": {"RP": 37}}, {"id": "205", "name": "Matt Strahm", "team": "KC", "pos": ["P", "RP"], "rank": 205, "drafted": false, "myTeam": false, "posRanks": {"RP": 38}}, {"id": "206", "name": "Mitch Keller", "team": "PIT", "pos": ["P", "SP"], "rank": 206, "drafted": false, "myTeam": false, "posRanks": {"SP": 77}}, {"id": "207", "name": "Ian Seymour", "team": "TB", "pos": ["P", "RP", "SP"], "rank": 207, "drafted": false, "myTeam": false, "posRanks": {"SP": 78, "RP": 39}}, {"id": "208", "name": "Ryan Weathers", "team": "NYY", "pos": ["P", "SP"], "rank": 208, "drafted": false, "myTeam": false, "posRanks": {"SP": 79}}, {"id": "209", "name": "Matt Brash", "team": "SEA", "pos": ["P", "RP"], "rank": 209, "drafted": false, "myTeam": false, "posRanks": {"RP": 40}}, {"id": "210", "name": "Yainer Diaz", "team": "HOU", "pos": ["C"], "rank": 210, "drafted": false, "myTeam": false, "posRanks": {"C": 11}}, {"id": "211", "name": "Ozzie Albies", "team": "ATL", "pos": ["2B"], "rank": 211, "drafted": false, "myTeam": false, "posRanks": {"2B": 9}}, {"id": "212", "name": "Jacob Misiorowski", "team": "MIL", "pos": ["P", "SP"], "rank": 212, "drafted": false, "myTeam": false, "posRanks": {"SP": 80}}, {"id": "213", "name": "Gavin Williams", "team": "CLE", "pos": ["P", "SP"], "rank": 213, "drafted": false, "myTeam": false, "posRanks": {"SP": 81}}, {"id": "214", "name": "Robbie Ray", "team": "SF", "pos": ["P", "SP"], "rank": 214, "drafted": false, "myTeam": false, "posRanks": {"SP": 82}}, {"id": "215", "name": "Adolis Garcia", "team": "PHI", "pos": ["OF"], "rank": 215, "drafted": false, "myTeam": false, "posRanks": {"OF": 42}}, {"id": "216", "name": "Carlos Estevez", "team": "KC", "pos": ["P", "RP"], "rank": 216, "drafted": false, "myTeam": false, "posRanks": {"RP": 41}}, {"id": "217", "name": "Reid Detmers", "team": "LAA", "pos": ["P", "RP"], "rank": 217, "drafted": false, "myTeam": false, "posRanks": {"RP": 42}}, {"id": "218", "name": "David Peterson", "team": "NYM", "pos": ["P", "SP"], "rank": 218, "drafted": false, "myTeam": false, "posRanks": {"SP": 83}}, {"id": "219", "name": "Seranthony Dominguez", "team": "CWS", "pos": ["P", "RP"], "rank": 219, "drafted": false, "myTeam": false, "posRanks": {"RP": 43}}, {"id": "220", "name": "Kodai Senga", "team": "NYM", "pos": ["P", "SP"], "rank": 220, "drafted": false, "myTeam": false, "posRanks": {"SP": 84}}, {"id": "221", "name": "Brady Singer", "team": "CIN", "pos": ["P", "SP"], "rank": 221, "drafted": false, "myTeam": false, "posRanks": {"SP": 85}}, {"id": "222", "name": "Mike Burrows", "team": "HOU", "pos": ["P", "RP", "SP"], "rank": 222, "drafted": false, "myTeam": false, "posRanks": {"SP": 86, "RP": 44}}, {"id": "223", "name": "Kevin Ginkel", "team": "ARI", "pos": ["P", "RP"], "rank": 223, "drafted": false, "myTeam": false, "posRanks": {"RP": 45}}, {"id": "224", "name": "Phil Maton", "team": "CHC", "pos": ["P", "RP"], "rank": 224, "drafted": false, "myTeam": false, "posRanks": {"RP": 46}}, {"id": "225", "name": "Agustin Ramirez", "team": "MIA", "pos": ["C"], "rank": 225, "drafted": false, "myTeam": false, "posRanks": {"C": 12}}, {"id": "226", "name": "Ceddanne Rafaela", "team": "BOS", "pos": ["2B", "OF"], "rank": 226, "drafted": false, "myTeam": false, "posRanks": {"2B": 10, "OF": 43}}, {"id": "227", "name": "Luke Keaschall", "team": "MIN", "pos": ["2B"], "rank": 227, "drafted": false, "myTeam": false, "posRanks": {"2B": 11}}, {"id": "228", "name": "Bryson Stott", "team": "PHI", "pos": ["2B", "SS"], "rank": 228, "drafted": false, "myTeam": false, "posRanks": {"2B": 12, "SS": 17}}, {"id": "229", "name": "Marcus Semien", "team": "NYM", "pos": ["2B"], "rank": 229, "drafted": false, "myTeam": false, "posRanks": {"2B": 13}}, {"id": "230", "name": "Xavier Edwards", "team": "MIA", "pos": ["2B", "SS"], "rank": 230, "drafted": false, "myTeam": false, "posRanks": {"2B": 14, "SS": 18}}, {"id": "231", "name": "Luis Robert Jr.", "team": "NYM", "pos": ["OF"], "rank": 231, "drafted": false, "myTeam": false, "posRanks": {"OF": 44}}, {"id": "232", "name": "Noelvi Marte", "team": "CIN", "pos": ["3B", "OF"], "rank": 232, "drafted": false, "myTeam": false, "posRanks": {"3B": 14, "OF": 45}}, {"id": "233", "name": "Spencer Torkelson", "team": "DET", "pos": ["1B"], "rank": 233, "drafted": false, "myTeam": false, "posRanks": {"1B": 19}}, {"id": "234", "name": "Jose Soriano", "team": "LAA", "pos": ["P", "SP"], "rank": 234, "drafted": false, "myTeam": false, "posRanks": {"SP": 87}}, {"id": "235", "name": "Trevor Story", "team": "BOS", "pos": ["SS"], "rank": 235, "drafted": false, "myTeam": false, "posRanks": {"SS": 19}}, {"id": "236", "name": "Dansby Swanson", "team": "CHC", "pos": ["SS"], "rank": 236, "drafted": false, "myTeam": false, "posRanks": {"SS": 20}}, {"id": "237", "name": "Joey Cantillo", "team": "CLE", "pos": ["P", "RP", "SP"], "rank": 237, "drafted": false, "myTeam": false, "posRanks": {"SP": 88, "RP": 47}}, {"id": "238", "name": "Clay Holmes", "team": "NYM", "pos": ["P", "SP"], "rank": 238, "drafted": false, "myTeam": false, "posRanks": {"SP": 89}}, {"id": "239", "name": "Jack Leiter", "team": "TEX", "pos": ["P", "SP"], "rank": 239, "drafted": false, "myTeam": false, "posRanks": {"SP": 90}}, {"id": "240", "name": "Shane Smith", "team": "CWS", "pos": ["P", "SP"], "rank": 240, "drafted": false, "myTeam": false, "posRanks": {"SP": 91}}, {"id": "241", "name": "Depth SP 92", "team": "FA", "pos": ["SP"], "rank": 241, "drafted": false, "myTeam": false, "posRanks": {"SP": 92}}, {"id": "242", "name": "Depth OF 46", "team": "WSH", "pos": ["OF"], "rank": 242, "drafted": false, "myTeam": false, "posRanks": {"OF": 46}}, {"id": "243", "name": "Depth RP 48", "team": "MIA", "pos": ["RP"], "rank": 243, "drafted": false, "myTeam": false, "posRanks": {"RP": 48}}, {"id": "244", "name": "Depth 1B 20", "team": "COL", "pos": ["1B"], "rank": 244, "drafted": false, "myTeam": false, "posRanks": {"1B": 20}}, {"id": "245", "name": "Depth 2B 15", "team": "PIT", "pos": ["2B"], "rank": 245, "drafted": false, "myTeam": false, "posRanks": {"2B": 15}}, {"id": "246", "name": "Depth SS 21", "team": "LAA", "pos": ["SS"], "rank": 246, "drafted": false, "myTeam": false, "posRanks": {"SS": 21}}, {"id": "247", "name": "Depth 3B 15", "team": "CWS", "pos": ["3B"], "rank": 247, "drafted": false, "myTeam": false, "posRanks": {"3B": 15}}, {"id": "248", "name": "Depth C 13", "team": "SEA", "pos": ["C"], "rank": 248, "drafted": false, "myTeam": false, "posRanks": {"C": 13}}, {"id": "249", "name": "Depth OF 47", "team": "TB", "pos": ["OF"], "rank": 249, "drafted": false, "myTeam": false, "posRanks": {"OF": 47}}, {"id": "250", "name": "Depth SP 93", "team": "MIN", "pos": ["SP"], "rank": 250, "drafted": false, "myTeam": false, "posRanks": {"SP": 93}}, {"id": "251", "name": "Depth SP 94", "team": "FA", "pos": ["SP"], "rank": 251, "drafted": false, "myTeam": false, "posRanks": {"SP": 94}}, {"id": "252", "name": "Depth OF 48", "team": "WSH", "pos": ["OF"], "rank": 252, "drafted": false, "myTeam": false, "posRanks": {"OF": 48}}, {"id": "253", "name": "Depth RP 49", "team": "MIA", "pos": ["RP"], "rank": 253, "drafted": false, "myTeam": false, "posRanks": {"RP": 49}}, {"id": "254", "name": "Depth 1B 21", "team": "COL", "pos": ["1B"], "rank": 254, "drafted": false, "myTeam": false, "posRanks": {"1B": 21}}, {"id": "255", "name": "Depth 2B 16", "team": "PIT", "pos": ["2B"], "rank": 255, "drafted": false, "myTeam": false, "posRanks": {"2B": 16}}, {"id": "256", "name": "Depth SS 22", "team": "LAA", "pos": ["SS"], "rank": 256, "drafted": false, "myTeam": false, "posRanks": {"SS": 22}}, {"id": "257", "name": "Depth 3B 16", "team": "CWS", "pos": ["3B"], "rank": 257, "drafted": false, "myTeam": false, "posRanks": {"3B": 16}}, {"id": "258", "name": "Depth C 14", "team": "SEA", "pos": ["C"], "rank": 258, "drafted": false, "myTeam": false, "posRanks": {"C": 14}}, {"id": "259", "name": "Depth OF 49", "team": "TB", "pos": ["OF"], "rank": 259, "drafted": false, "myTeam": false, "posRanks": {"OF": 49}}, {"id": "260", "name": "Depth SP 95", "team": "MIN", "pos": ["SP"], "rank": 260, "drafted": false, "myTeam": false, "posRanks": {"SP": 95}}, {"id": "261", "name": "Depth SP 96", "team": "FA", "pos": ["SP"], "rank": 261, "drafted": false, "myTeam": false, "posRanks": {"SP": 96}}, {"id": "262", "name": "Depth OF 50", "team": "WSH", "pos": ["OF"], "rank": 262, "drafted": false, "myTeam": false, "posRanks": {"OF": 50}}, {"id": "263", "name": "Depth RP 50", "team": "MIA", "pos": ["RP"], "rank": 263, "drafted": false, "myTeam": false, "posRanks": {"RP": 50}}, {"id": "264", "name": "Depth 1B 22", "team": "COL", "pos": ["1B"], "rank": 264, "drafted": false, "myTeam": false, "posRanks": {"1B": 22}}, {"id": "265", "name": "Depth 2B 17", "team": "PIT", "pos": ["2B"], "rank": 265, "drafted": false, "myTeam": false, "posRanks": {"2B": 17}}, {"id": "266", "name": "Depth SS 23", "team": "LAA", "pos": ["SS"], "rank": 266, "drafted": false, "myTeam": false, "posRanks": {"SS": 23}}, {"id": "267", "name": "Depth 3B 17", "team": "CWS", "pos": ["3B"], "rank": 267, "drafted": false, "myTeam": false, "posRanks": {"3B": 17}}, {"id": "268", "name": "Depth C 15", "team": "SEA", "pos": ["C"], "rank": 268, "drafted": false, "myTeam": false, "posRanks": {"C": 15}}, {"id": "269", "name": "Depth OF 51", "team": "TB", "pos": ["OF"], "rank": 269, "drafted": false, "myTeam": false, "posRanks": {"OF": 51}}, {"id": "270", "name": "Depth SP 97", "team": "MIN", "pos": ["SP"], "rank": 270, "drafted": false, "myTeam": false, "posRanks": {"SP": 97}}, {"id": "271", "name": "Depth SP 98", "team": "FA", "pos": ["SP"], "rank": 271, "drafted": false, "myTeam": false, "posRanks": {"SP": 98}}, {"id": "272", "name": "Depth OF 52", "team": "WSH", "pos": ["OF"], "rank": 272, "drafted": false, "myTeam": false, "posRanks": {"OF": 52}}, {"id": "273", "name": "Depth RP 51", "team": "MIA", "pos": ["RP"], "rank": 273, "drafted": false, "myTeam": false, "posRanks": {"RP": 51}}, {"id": "274", "name": "Depth 1B 23", "team": "COL", "pos": ["1B"], "rank": 274, "drafted": false, "myTeam": false, "posRanks": {"1B": 23}}, {"id": "275", "name": "Depth 2B 18", "team": "PIT", "pos": ["2B"], "rank": 275, "drafted": false, "myTeam": false, "posRanks": {"2B": 18}}, {"id": "276", "name": "Depth SS 24", "team": "LAA", "pos": ["SS"], "rank": 276, "drafted": false, "myTeam": false, "posRanks": {"SS": 24}}, {"id": "277", "name": "Depth 3B 18", "team": "CWS", "pos": ["3B"], "rank": 277, "drafted": false, "myTeam": false, "posRanks": {"3B": 18}}, {"id": "278", "name": "Depth C 16", "team": "SEA", "pos": ["C"], "rank": 278, "drafted": false, "myTeam": false, "posRanks": {"C": 16}}, {"id": "279", "name": "Depth OF 53", "team": "TB", "pos": ["OF"], "rank": 279, "drafted": false, "myTeam": false, "posRanks": {"OF": 53}}, {"id": "280", "name": "Depth SP 99", "team": "MIN", "pos": ["SP"], "rank": 280, "drafted": false, "myTeam": false, "posRanks": {"SP": 99}}, {"id": "281", "name": "Depth SP 100", "team": "FA", "pos": ["SP"], "rank": 281, "drafted": false, "myTeam": false, "posRanks": {"SP": 100}}, {"id": "282", "name": "Depth OF 54", "team": "WSH", "pos": ["OF"], "rank": 282, "drafted": false, "myTeam": false, "posRanks": {"OF": 54}}, {"id": "283", "name": "Depth RP 52", "team": "MIA", "pos": ["RP"], "rank": 283, "drafted": false, "myTeam": false, "posRanks": {"RP": 52}}, {"id": "284", "name": "Depth 1B 24", "team": "COL", "pos": ["1B"], "rank": 284, "drafted": false, "myTeam": false, "posRanks": {"1B": 24}}, {"id": "285", "name": "Depth 2B 19", "team": "PIT", "pos": ["2B"], "rank": 285, "drafted": false, "myTeam": false, "posRanks": {"2B": 19}}, {"id": "286", "name": "Depth SS 25", "team": "LAA", "pos": ["SS"], "rank": 286, "drafted": false, "myTeam": false, "posRanks": {"SS": 25}}, {"id": "287", "name": "Depth 3B 19", "team": "CWS", "pos": ["3B"], "rank": 287, "drafted": false, "myTeam": false, "posRanks": {"3B": 19}}, {"id": "288", "name": "Depth C 17", "team": "SEA", "pos": ["C"], "rank": 288, "drafted": false, "myTeam": false, "posRanks": {"C": 17}}, {"id": "289", "name": "Depth OF 55", "team": "TB", "pos": ["OF"], "rank": 289, "drafted": false, "myTeam": false, "posRanks": {"OF": 55}}, {"id": "290", "name": "Depth SP 101", "team": "MIN", "pos": ["SP"], "rank": 290, "drafted": false, "myTeam": false, "posRanks": {"SP": 101}}, {"id": "291", "name": "Depth SP 102", "team": "FA", "pos": ["SP"], "rank": 291, "drafted": false, "myTeam": false, "posRanks": {"SP": 102}}, {"id": "292", "name": "Depth OF 56", "team": "WSH", "pos": ["OF"], "rank": 292, "drafted": false, "myTeam": false, "posRanks": {"OF": 56}}, {"id": "293", "name": "Depth RP 53", "team": "MIA", "pos": ["RP"], "rank": 293, "drafted": false, "myTeam": false, "posRanks": {"RP": 53}}, {"id": "294", "name": "Depth 1B 25", "team": "COL", "pos": ["1B"], "rank": 294, "drafted": false, "myTeam": false, "posRanks": {"1B": 25}}, {"id": "295", "name": "Depth 2B 20", "team": "PIT", "pos": ["2B"], "rank": 295, "drafted": false, "myTeam": false, "posRanks": {"2B": 20}}, {"id": "296", "name": "Depth SS 26", "team": "LAA", "pos": ["SS"], "rank": 296, "drafted": false, "myTeam": false, "posRanks": {"SS": 26}}, {"id": "297", "name": "Depth 3B 20", "team": "CWS", "pos": ["3B"], "rank": 297, "drafted": false, "myTeam": false, "posRanks": {"3B": 20}}, {"id": "298", "name": "Depth C 18", "team": "SEA", "pos": ["C"], "rank": 298, "drafted": false, "myTeam": false, "posRanks": {"C": 18}}, {"id": "299", "name": "Depth OF 57", "team": "TB", "pos": ["OF"], "rank": 299, "drafted": false, "myTeam": false, "posRanks": {"OF": 57}}, {"id": "300", "name": "Depth SP 103", "team": "MIN", "pos": ["SP"], "rank": 300, "drafted": false, "myTeam": false, "posRanks": {"SP": 103}}, {"id": "301", "name": "Depth SP 104", "team": "FA", "pos": ["SP"], "rank": 301, "drafted": false, "myTeam": false, "posRanks": {"SP": 104}}, {"id": "302", "name": "Depth OF 58", "team": "WSH", "pos": ["OF"], "rank": 302, "drafted": false, "myTeam": false, "posRanks": {"OF": 58}}, {"id": "303", "name": "Depth RP 54", "team": "MIA", "pos": ["RP"], "rank": 303, "drafted": false, "myTeam": false, "posRanks": {"RP": 54}}, {"id": "304", "name": "Depth 1B 26", "team": "COL", "pos": ["1B"], "rank": 304, "drafted": false, "myTeam": false, "posRanks": {"1B": 26}}, {"id": "305", "name": "Depth 2B 21", "team": "PIT", "pos": ["2B"], "rank": 305, "drafted": false, "myTeam": false, "posRanks": {"2B": 21}}, {"id": "306", "name": "Depth SS 27", "team": "LAA", "pos": ["SS"], "rank": 306, "drafted": false, "myTeam": false, "posRanks": {"SS": 27}}, {"id": "307", "name": "Depth 3B 21", "team": "CWS", "pos": ["3B"], "rank": 307, "drafted": false, "myTeam": false, "posRanks": {"3B": 21}}, {"id": "308", "name": "Depth C 19", "team": "SEA", "pos": ["C"], "rank": 308, "drafted": false, "myTeam": false, "posRanks": {"C": 19}}, {"id": "309", "name": "Depth OF 59", "team": "TB", "pos": ["OF"], "rank": 309, "drafted": false, "myTeam": false, "posRanks": {"OF": 59}}, {"id": "310", "name": "Depth SP 105", "team": "MIN", "pos": ["SP"], "rank": 310, "drafted": false, "myTeam": false, "posRanks": {"SP": 105}}, {"id": "311", "name": "Depth SP 106", "team": "FA", "pos": ["SP"], "rank": 311, "drafted": false, "myTeam": false, "posRanks": {"SP": 106}}, {"id": "312", "name": "Depth OF 60", "team": "WSH", "pos": ["OF"], "rank": 312, "drafted": false, "myTeam": false, "posRanks": {"OF": 60}}, {"id": "313", "name": "Depth RP 55", "team": "MIA", "pos": ["RP"], "rank": 313, "drafted": false, "myTeam": false, "posRanks": {"RP": 55}}, {"id": "314", "name": "Depth 1B 27", "team": "COL", "pos": ["1B"], "rank": 314, "drafted": false, "myTeam": false, "posRanks": {"1B": 27}}, {"id": "315", "name": "Depth 2B 22", "team": "PIT", "pos": ["2B"], "rank": 315, "drafted": false, "myTeam": false, "posRanks": {"2B": 22}}, {"id": "316", "name": "Depth SS 28", "team": "LAA", "pos": ["SS"], "rank": 316, "drafted": false, "myTeam": false, "posRanks": {"SS": 28}}, {"id": "317", "name": "Depth 3B 22", "team": "CWS", "pos": ["3B"], "rank": 317, "drafted": false, "myTeam": false, "posRanks": {"3B": 22}}, {"id": "318", "name": "Depth C 20", "team": "SEA", "pos": ["C"], "rank": 318, "drafted": false, "myTeam": false, "posRanks": {"C": 20}}, {"id": "319", "name": "Depth OF 61", "team": "TB", "pos": ["OF"], "rank": 319, "drafted": false, "myTeam": false, "posRanks": {"OF": 61}}, {"id": "320", "name": "Depth SP 107", "team": "MIN", "pos": ["SP"], "rank": 320, "drafted": false, "myTeam": false, "posRanks": {"SP": 107}}, {"id": "321", "name": "Depth SP 108", "team": "FA", "pos": ["SP"], "rank": 321, "drafted": false, "myTeam": false, "posRanks": {"SP": 108}}, {"id": "322", "name": "Depth OF 62", "team": "WSH", "pos": ["OF"], "rank": 322, "drafted": false, "myTeam": false, "posRanks": {"OF": 62}}, {"id": "323", "name": "Depth RP 56", "team": "MIA", "pos": ["RP"], "rank": 323, "drafted": false, "myTeam": false, "posRanks": {"RP": 56}}, {"id": "324", "name": "Depth 1B 28", "team": "COL", "pos": ["1B"], "rank": 324, "drafted": false, "myTeam": false, "posRanks": {"1B": 28}}, {"id": "325", "name": "Depth 2B 23", "team": "PIT", "pos": ["2B"], "rank": 325, "drafted": false, "myTeam": false, "posRanks": {"2B": 23}}, {"id": "326", "name": "Depth SS 29", "team": "LAA", "pos": ["SS"], "rank": 326, "drafted": false, "myTeam": false, "posRanks": {"SS": 29}}, {"id": "327", "name": "Depth 3B 23", "team": "CWS", "pos": ["3B"], "rank": 327, "drafted": false, "myTeam": false, "posRanks": {"3B": 23}}, {"id": "328", "name": "Depth C 21", "team": "SEA", "pos": ["C"], "rank": 328, "drafted": false, "myTeam": false, "posRanks": {"C": 21}}, {"id": "329", "name": "Depth OF 63", "team": "TB", "pos": ["OF"], "rank": 329, "drafted": false, "myTeam": false, "posRanks": {"OF": 63}}, {"id": "330", "name": "Depth SP 109", "team": "MIN", "pos": ["SP"], "rank": 330, "drafted": false, "myTeam": false, "posRanks": {"SP": 109}}, {"id": "331", "name": "Depth SP 110", "team": "FA", "pos": ["SP"], "rank": 331, "drafted": false, "myTeam": false, "posRanks": {"SP": 110}}, {"id": "332", "name": "Depth OF 64", "team": "WSH", "pos": ["OF"], "rank": 332, "drafted": false, "myTeam": false, "posRanks": {"OF": 64}}, {"id": "333", "name": "Depth RP 57", "team": "MIA", "pos": ["RP"], "rank": 333, "drafted": false, "myTeam": false, "posRanks": {"RP": 57}}, {"id": "334", "name": "Depth 1B 29", "team": "COL", "pos": ["1B"], "rank": 334, "drafted": false, "myTeam": false, "posRanks": {"1B": 29}}, {"id": "335", "name": "Depth 2B 24", "team": "PIT", "pos": ["2B"], "rank": 335, "drafted": false, "myTeam": false, "posRanks": {"2B": 24}}, {"id": "336", "name": "Depth SS 30", "team": "LAA", "pos": ["SS"], "rank": 336, "drafted": false, "myTeam": false, "posRanks": {"SS": 30}}, {"id": "337", "name": "Depth 3B 24", "team": "CWS", "pos": ["3B"], "rank": 337, "drafted": false, "myTeam": false, "posRanks": {"3B": 24}}, {"id": "338", "name": "Depth C 22", "team": "SEA", "pos": ["C"], "rank": 338, "drafted": false, "myTeam": false, "posRanks": {"C": 22}}, {"id": "339", "name": "Depth OF 65", "team": "TB", "pos": ["OF"], "rank": 339, "drafted": false, "myTeam": false, "posRanks": {"OF": 65}}, {"id": "340", "name": "Depth SP 111", "team": "MIN", "pos": ["SP"], "rank": 340, "drafted": false, "myTeam": false, "posRanks": {"SP": 111}}, {"id": "341", "name": "Depth SP 112", "team": "FA", "pos": ["SP"], "rank": 341, "drafted": false, "myTeam": false, "posRanks": {"SP": 112}}, {"id": "342", "name": "Depth OF 66", "team": "WSH", "pos": ["OF"], "rank": 342, "drafted": false, "myTeam": false, "posRanks": {"OF": 66}}, {"id": "343", "name": "Depth RP 58", "team": "MIA", "pos": ["RP"], "rank": 343, "drafted": false, "myTeam": false, "posRanks": {"RP": 58}}, {"id": "344", "name": "Depth 1B 30", "team": "COL", "pos": ["1B"], "rank": 344, "drafted": false, "myTeam": false, "posRanks": {"1B": 30}}, {"id": "345", "name": "Depth 2B 25", "team": "PIT", "pos": ["2B"], "rank": 345, "drafted": false, "myTeam": false, "posRanks": {"2B": 25}}, {"id": "346", "name": "Depth SS 31", "team": "LAA", "pos": ["SS"], "rank": 346, "drafted": false, "myTeam": false, "posRanks": {"SS": 31}}, {"id": "347", "name": "Depth 3B 25", "team": "CWS", "pos": ["3B"], "rank": 347, "drafted": false, "myTeam": false, "posRanks": {"3B": 25}}, {"id": "348", "name": "Depth C 23", "team": "SEA", "pos": ["C"], "rank": 348, "drafted": false, "myTeam": false, "posRanks": {"C": 23}}, {"id": "349", "name": "Depth OF 67", "team": "TB", "pos": ["OF"], "rank": 349, "drafted": false, "myTeam": false, "posRanks": {"OF": 67}}, {"id": "350", "name": "Depth SP 113", "team": "MIN", "pos": ["SP"], "rank": 350, "drafted": false, "myTeam": false, "posRanks": {"SP": 113}}];

const rosterTemplate: Record<string, number> = {
  C:1, "1B":1, "2B":1, SS:1, "3B":1, OF:3, UTIL:1, SP:6, RP:2, P:3
};
const hittingCats = ["H","R","HR","RBI","BB","SB","AVG","OBP","SLG","TB"] as const;
const pitchingCats = ["IP","W","L","QS","SV","K","BBP","ERA","WHIP","KBB"] as const;
const inverseCats = new Set(["L","BBP","ERA","WHIP"]);
const displayPositions = ["C","1B","2B","SS","3B","OF","SP","RP"] as const;

const tierColors: Record<string,string> = {
  "Tier 1":"bg-emerald-100 border-emerald-300 text-emerald-900",
  "Tier 2":"bg-lime-100 border-lime-300 text-lime-900",
  "Tier 3":"bg-amber-100 border-amber-300 text-amber-900",
  "Tier 4":"bg-orange-100 border-orange-300 text-orange-900",
  "Tier 5":"bg-rose-100 border-rose-300 text-rose-900",
  "Tier 6":"bg-slate-100 border-slate-300 text-slate-900",
  "Tier 7":"bg-zinc-100 border-zinc-300 text-zinc-900",
};

function defaultTeams(): LeagueTeam[] {
  return Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: i === 0 ? "My Team" : `Team ${i+1}`, slot: i + 1 }));
}

function snakeTeamForPick(overall:number, orderedTeams:LeagueTeam[]) {
  const teams = orderedTeams.length;
  const round = Math.ceil(overall / teams);
  const pickInRound = ((overall - 1) % teams) + 1;
  const zero = pickInRound - 1;
  return round % 2 === 1 ? orderedTeams[zero] : orderedTeams[teams - 1 - zero];
}
function currentRound(overall:number, teams:number) { return Math.ceil(overall / teams); }
function pickInRound(overall:number, teams:number) { return ((overall - 1) % teams) + 1; }

function mean(arr:number[]) { return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0; }
function std(arr:number[]) { const m=mean(arr); const v=mean(arr.map(x=>(x-m)**2)); return Math.sqrt(v || 1); }
function isPitcher(p:Player) { return p.pos.includes("SP") || p.pos.includes("RP") || p.pos.includes("P"); }
function posBucket(p:Player) {
  for (const pos of displayPositions) if (p.pos.includes(pos)) return pos;
  return "OF";
}
function tierFromPosRank(pos:string, posRank:number) {
  const cuts =
    pos === "C" ? [3,6,9,12,16,20] :
    pos === "SP" ? [8,16,28,42,60,85] :
    pos === "RP" ? [3,6,10,15,22,32] :
    pos === "OF" ? [8,16,28,42,58,76] :
    [4,8,12,18,24,32];
  for (let i = 0; i < cuts.length; i++) {
    if (posRank <= cuts[i]) return `Tier ${i+1}`;
  }
  return "Tier 7";
}
function displayPos(p:Player) { return p.pos.join("/"); }

function nameSeed(name:string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 100000;
  return h / 100000;
}
function clamp(n:number, lo:number, hi:number) { return Math.max(lo, Math.min(hi, n)); }

const hitterOverrides: Record<string, Partial<Player>> = {
  "Aaron Judge": { H: 162, R: 121, HR: 48, RBI: 122, BB: 112, SB: 10, AVG: 0.296, OBP: 0.412, SLG: 0.628, TB: 344 },
  "Shohei Ohtani (Batter)": { H: 168, R: 122, HR: 44, RBI: 112, BB: 90, SB: 18, AVG: 0.298, OBP: 0.392, SLG: 0.603, TB: 339 },
  "Juan Soto": { H: 158, R: 116, HR: 36, RBI: 104, BB: 122, SB: 8, AVG: 0.292, OBP: 0.425, SLG: 0.565, TB: 305 },
  "Ronald Acuna Jr.": { H: 166, R: 110, HR: 32, RBI: 92, BB: 78, SB: 29, AVG: 0.290, OBP: 0.384, SLG: 0.548, TB: 313 },
  "Bobby Witt Jr.": { H: 183, R: 111, HR: 30, RBI: 97, BB: 55, SB: 34, AVG: 0.298, OBP: 0.355, SLG: 0.531, TB: 325 },
  "Jose Ramirez": { H: 165, R: 96, HR: 34, RBI: 107, BB: 73, SB: 25, AVG: 0.282, OBP: 0.357, SLG: 0.531, TB: 311 },
  "Kyle Tucker": { H: 164, R: 102, HR: 31, RBI: 99, BB: 75, SB: 19, AVG: 0.286, OBP: 0.372, SLG: 0.531, TB: 305 },
  "Julio Rodriguez": { H: 174, R: 103, HR: 28, RBI: 96, BB: 60, SB: 27, AVG: 0.284, OBP: 0.344, SLG: 0.508, TB: 312 },
  "Corey Seager": { H: 151, R: 90, HR: 31, RBI: 98, BB: 54, SB: 2, AVG: 0.296, OBP: 0.357, SLG: 0.542, TB: 281 },
  "Yordan Alvarez": { H: 149, R: 92, HR: 37, RBI: 110, BB: 82, SB: 1, AVG: 0.294, OBP: 0.388, SLG: 0.575, TB: 292 },
  "Bryce Harper": { H: 153, R: 94, HR: 30, RBI: 98, BB: 90, SB: 8, AVG: 0.287, OBP: 0.390, SLG: 0.528, TB: 282 },
  "Matt Olson": { H: 145, R: 92, HR: 37, RBI: 110, BB: 79, SB: 1, AVG: 0.264, OBP: 0.353, SLG: 0.540, TB: 300 },
  "Vladimir Guerrero Jr.": { H: 176, R: 99, HR: 33, RBI: 107, BB: 75, SB: 4, AVG: 0.305, OBP: 0.381, SLG: 0.549, TB: 316 },
  "Mookie Betts": { H: 158, R: 104, HR: 24, RBI: 78, BB: 81, SB: 15, AVG: 0.283, OBP: 0.371, SLG: 0.501, TB: 281 },
  "Trea Turner": { H: 171, R: 100, HR: 20, RBI: 74, BB: 46, SB: 28, AVG: 0.291, OBP: 0.343, SLG: 0.458, TB: 268 },
  "Francisco Lindor": { H: 158, R: 95, HR: 27, RBI: 86, BB: 62, SB: 22, AVG: 0.273, OBP: 0.344, SLG: 0.480, TB: 278 },
  "Pete Alonso": { H: 146, R: 87, HR: 40, RBI: 114, BB: 74, SB: 1, AVG: 0.262, OBP: 0.347, SLG: 0.539, TB: 301 },
  "Cal Raleigh": { H: 128, R: 80, HR: 33, RBI: 90, BB: 62, SB: 1, AVG: 0.243, OBP: 0.323, SLG: 0.497, TB: 259 },
  "William Contreras": { H: 158, R: 83, HR: 20, RBI: 81, BB: 57, SB: 6, AVG: 0.285, OBP: 0.355, SLG: 0.451, TB: 252 },
};

const pitcherOverrides: Record<string, Partial<Player>> = {
  "Tarik Skubal": { IP: 193, W: 15, L: 7, QS: 20, SV: 0, K: 237, BBP: 39, ERA: 2.95, WHIP: 1.03, KBB: 6.08 },
  "Paul Skenes": { IP: 188, W: 13, L: 7, QS: 18, SV: 0, K: 248, BBP: 49, ERA: 3.01, WHIP: 1.07, KBB: 5.06 },
  "Zack Wheeler": { IP: 198, W: 15, L: 7, QS: 21, SV: 0, K: 224, BBP: 43, ERA: 3.10, WHIP: 1.05, KBB: 5.21 },
  "George Kirby": { IP: 191, W: 13, L: 8, QS: 18, SV: 0, K: 198, BBP: 24, ERA: 3.30, WHIP: 1.04, KBB: 8.25 },
  "Logan Webb": { IP: 201, W: 13, L: 10, QS: 21, SV: 0, K: 196, BBP: 43, ERA: 3.37, WHIP: 1.13, KBB: 4.56 },
  "Josh Hader": { IP: 62, W: 4, L: 3, QS: 0, SV: 35, K: 93, BBP: 25, ERA: 2.74, WHIP: 1.03, KBB: 3.72 },
  "Emmanuel Clase": { IP: 67, W: 4, L: 3, QS: 0, SV: 39, K: 70, BBP: 15, ERA: 2.36, WHIP: 0.95, KBB: 4.67 },
};

function addProjectedStats(base:Player): Player {
  const p = { ...base };
  const seed = nameSeed(p.name);
  const bucket = posBucket(p);
  const posRank = p.posRanks[bucket] ?? 999;

  if (isPitcher(p)) {
    const override = pitcherOverrides[p.name];
    if (override) return { ...p, ...override } as Player;

    const rp = p.pos.includes("RP") && !p.pos.includes("SP");
    if (rp) {
      p.IP = clamp(Math.round(63 + (0.5 - seed) * 10 - posRank * 0.25), 48, 72);
      p.W = clamp(Math.round(3 + seed * 3), 1, 6);
      p.L = clamp(Math.round(2 + (1-seed) * 3), 2, 5);
      p.QS = 0;
      p.SV = clamp(Math.round(34 - posRank * 1.6 + seed * 4), 1, 38);
      p.K = clamp(Math.round(94 - posRank * 1.8 + seed * 8), 42, 100);
      p.BBP = clamp(Math.round(18 + posRank * 0.8 + seed * 4), 10, 32);
      p.ERA = Number(clamp(2.15 + posRank * 0.08 + (seed - 0.5) * 0.35, 2.05, 4.85).toFixed(2));
      p.WHIP = Number(clamp(0.90 + posRank * 0.02 + (seed - 0.5) * 0.12, 0.88, 1.42).toFixed(2));
      p.KBB = Number((Number(p.K) / Math.max(1, Number(p.BBP))).toFixed(2));
      return p;
    }

    const strikeoutArm = seed > 0.62;
    const controlArm = seed < 0.28;
    p.IP = clamp(Math.round(188 - posRank * 1.8 + (seed - 0.5) * 18), 105, 205);
    p.W = clamp(Math.round(14 - posRank * 0.18 + seed * 3), 6, 18);
    p.L = clamp(Math.round(7 + posRank * 0.06 - seed * 2), 4, 12);
    p.QS = clamp(Math.round(20 - posRank * 0.32 + seed * 2), 4, 24);
    p.SV = 0;
    const kPerIp = strikeoutArm ? 1.18 : controlArm ? 0.92 : 1.03;
    p.K = clamp(Math.round(Number(p.IP) * (kPerIp + (seed - 0.5) * 0.08)), 95, 255);
    p.BBP = clamp(Math.round(Number(p.IP) * (controlArm ? 0.12 : strikeoutArm ? 0.20 : 0.16)), 24, 62);
    p.ERA = Number(clamp(2.85 + posRank * 0.05 + (controlArm ? -0.12 : 0) + (strikeoutArm ? -0.04 : 0) + (seed - 0.5) * 0.25, 2.70, 5.05).toFixed(2));
    p.WHIP = Number(clamp(0.99 + posRank * 0.012 + (controlArm ? -0.03 : 0) + (seed - 0.5) * 0.06, 0.96, 1.38).toFixed(2));
    p.KBB = Number((Number(p.K) / Math.max(1, Number(p.BBP))).toFixed(2));
    return p;
  }

  const override = hitterOverrides[p.name];
  if (override) return { ...p, ...override } as Player;

  const speedy = ["SS","2B"].includes(bucket) || (bucket === "OF" && posRank <= 18);
  const power = ["1B","3B","DH"].includes(bucket) || (bucket === "OF" && seed > 0.55);
  const contact = seed < 0.3;

  const paBoost = clamp(1.08 - p.rank * 0.0015 + (seed - 0.5) * 0.06, 0.78, 1.08);
  p.H = clamp(Math.round((132 + (contact ? 18 : 0) + (speedy ? 6 : 0) - p.rank * 0.22) * paBoost), 78, 185);
  p.R = clamp(Math.round((72 + (speedy ? 12 : 0) + (power ? 8 : 0) - p.rank * 0.16) * paBoost), 38, 120);
  p.HR = clamp(Math.round((power ? 31 : speedy ? 18 : 23) - p.rank * (power ? 0.10 : 0.07) + (seed - 0.5) * 8), 4, 43);
  p.RBI = clamp(Math.round((74 + (power ? 16 : 0) - p.rank * 0.15 + (seed - 0.5) * 10) * paBoost), 34, 118);
  p.BB = clamp(Math.round((50 + (power ? 12 : 0) + (contact ? 2 : 0) - p.rank * 0.09 + seed * 10) * paBoost), 18, 112);
  p.SB = clamp(Math.round((speedy ? 21 : bucket === "OF" ? 12 : 4) - p.rank * (speedy ? 0.08 : 0.03) + (0.5 - seed) * -8), 0, 40);
  p.AVG = Number(clamp(0.245 + (contact ? 0.028 : 0.0) + (speedy ? 0.010 : 0.0) - p.rank * 0.00018 + (0.5 - seed) * -0.015, 0.214, 0.312).toFixed(3));
  p.OBP = Number(clamp(Number(p.AVG) + 0.055 + (Number(p.BB) > 70 ? 0.018 : 0.0), 0.285, 0.425).toFixed(3));
  p.SLG = Number(clamp(0.365 + Number(p.HR) * 0.0047 + (power ? 0.025 : 0.0) + (Number(p.AVG) - 0.250) * 0.6, 0.360, 0.640).toFixed(3));
  p.TB = clamp(Math.round(Number(p.H) * Number(p.SLG)), 135, 340);
  return p;
}

const seededPlayers: Player[] = seededPlayersRaw.map(addProjectedStats);

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

function rosterCounts(players:Player[]) {
  const mine = players.filter((p)=>p.myTeam);
  const counts:Record<string, number> = { C:0, "1B":0, "2B":0, SS:0, "3B":0, OF:0, SP:0, RP:0, P:0 };
  mine.forEach((p) => {
    if (isPitcher(p)) {
      if (p.pos.includes("RP") && !p.pos.includes("SP")) counts.RP += 1;
      else counts.SP += 1;
      counts.P += 1;
    } else if (p.pos.includes("OF")) counts.OF += 1;
    else if (p.pos.includes("C")) counts.C += 1;
    else if (p.pos.includes("1B")) counts["1B"] += 1;
    else if (p.pos.includes("2B")) counts["2B"] += 1;
    else if (p.pos.includes("SS")) counts.SS += 1;
    else if (p.pos.includes("3B")) counts["3B"] += 1;
  });
  return counts;
}

function buildNeeds(players:Player[]) {
  const mine = players.filter((p)=>p.myTeam);
  const hitters = mine.filter((p)=>!isPitcher(p));
  const pitchers = mine.filter((p)=>isPitcher(p));
  const totals = teamSummary(players);
  const counts = rosterCounts(players);
  return {
    hittingNeed: Math.max(0, 8 - hitters.length),
    pitchingNeed: Math.max(0, 11 - pitchers.length),
    needSB: hitters.length >= 3 && totals.SB < 70,
    needOBP: totals.OBP > 0 && totals.OBP < 0.35,
    needSLG: totals.SLG > 0 && totals.SLG < 0.49,
    needQS: counts.SP >= 2 && totals.QS < 75,
    needKBB: totals.KBB > 0 && totals.KBB < 4.2,
    needSaves: counts.RP < 2,
    counts,
  };
}

function scorePlayer(player:Player, profiles:any, needs:any) {
  let score = 0;
  if (isPitcher(player)) {
    pitchingCats.forEach((cat) => {
      score += zScore(Number((player as any)[cat] || 0), profiles.pitcherProfile[cat], inverseCats.has(cat));
    });
  } else {
    hittingCats.forEach((cat) => {
      score += zScore(Number((player as any)[cat] || 0), profiles.hitterProfile[cat], inverseCats.has(cat));
    });
  }
  if (isPitcher(player) && needs.pitchingNeed > needs.hittingNeed) score += 1.25;
  if (!isPitcher(player) && needs.hittingNeed >= needs.pitchingNeed) score += 0.95;
  if (needs.needSB && Number(player.SB || 0) >= 18) score += 1.1;
  if (needs.needOBP && Number(player.OBP || 0) >= 0.36) score += 0.9;
  if (needs.needSLG && Number(player.SLG || 0) >= 0.50) score += 0.9;
  if (needs.needQS && Number(player.QS || 0) >= 15) score += 1.0;
  if (needs.needKBB && Number(player.KBB || 0) >= 4.8) score += 1.0;
  if (needs.needSaves && Number(player.SV || 0) >= 18) score += 1.0;
  return Number(score.toFixed(2));
}

function playerBreakdown(player:any, profiles:any) {
  if (!player) return null;
  const catList = isPitcher(player) ? pitchingCats : hittingCats;
  const profile = isPitcher(player) ? profiles.pitcherProfile : profiles.hitterProfile;
  const scored = catList.map((cat) => {
    const z = zScore(Number((player as any)[cat] || 0), profile[cat], inverseCats.has(cat));
    return { cat, z: Number(z.toFixed(2)) };
  }).sort((a,b)=>b.z-a.z);
  return {
    strengths: scored.slice(0,3),
    risks: scored.slice(-2).reverse(),
  };
}

export default function Page() {
  const [players, setPlayers] = useState<Player[]>(seededPlayers);
  const [teams, setTeams] = useState<LeagueTeam[]>(defaultTeams());
  const [history, setHistory] = useState<DraftPick[]>([]);
  const [sortMode, setSortMode] = useState<"rank"|"ai">("rank");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"live"|"tiers"|"board">("live");
  const [overrideTeamId, setOverrideTeamId] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(players[0]?.id ?? null);

  const orderedTeams = useMemo(() => [...teams].sort((a,b)=>a.slot-b.slot), [teams]);
  const nextPick = history.length + 1;
  const nextRound = currentRound(nextPick, orderedTeams.length);
  const nextPickInRound = pickInRound(nextPick, orderedTeams.length);
  const clockTeam = overrideTeamId ? orderedTeams.find(t=>t.id === Number(overrideTeamId)) || snakeTeamForPick(nextPick, orderedTeams) : snakeTeamForPick(nextPick, orderedTeams);

  const profiles = useMemo(() => computeProfiles(players), [players]);
  const needs = useMemo(() => buildNeeds(players), [players]);
  const totals = useMemo(() => teamSummary(players), [players]);
  const counts = needs.counts;

  const enriched = useMemo(() => players.map((p) => {
    const bucket = posBucket(p);
    const posRank = p.posRanks[bucket] ?? 999;
    return {
      ...p,
      bucket,
      posRank,
      tier: tierFromPosRank(bucket, posRank),
      aiScore: scorePlayer(p, profiles, needs),
    };
  }), [players, profiles, needs]);

  const selected = enriched.find(p => p.id === selectedPlayerId) || enriched[0] || null;
  const selectedBreakdown = playerBreakdown(selected, profiles);

  const ranked = useMemo(() => {
    const list = [...enriched];
    list.sort((a,b) => {
      if (a.drafted !== b.drafted) return a.drafted ? 1 : -1;
      if (sortMode === "rank") return a.rank - b.rank;
      return b.aiScore - a.aiScore;
    });
    return list;
  }, [enriched, sortMode]);

  const filtered = useMemo(() => ranked.filter((p) => {
    if (query && !`${p.name} ${p.team} ${p.pos.join("/")}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [ranked, query]);

  const available = ranked.filter(p => !p.drafted);

  const bestByPosition = useMemo(() => {
    const out: Record<string, any> = {};
    for (const pos of displayPositions) {
      out[pos] = available.find(p => p.bucket === pos) || null;
    }
    return out;
  }, [available]);

  const recommended = useMemo(() => {
    if (!available.length) return null;
    // weighted recommendation
    const top = [...available].sort((a,b) => b.aiScore - a.aiScore)[0];
    return top;
  }, [available]);

  const picksUntilMyTurn = (() => {
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

  const likelyGone = available.slice(0, Math.max(3, Math.min(8, picksUntilMyTurn + 2)));

  const tierBoard = useMemo(() => {
    const groups: Record<string, any[]> = { C:[], "1B":[], "2B":[], SS:[], "3B":[], OF:[], SP:[], RP:[] };
    available.forEach(p => { if (groups[p.bucket]) groups[p.bucket].push(p); });
    Object.keys(groups).forEach(k => groups[k].sort((a,b)=> (a.posRank - b.posRank) || (a.rank - b.rank)));
    return groups;
  }, [available]);

  function updateTeamName(id:number, value:string) {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, name: value } : t));
  }
  function updateTeamSlot(id:number, value:number) {
    const slot = Math.max(1, Math.min(12, Number.isFinite(value) ? value : 1));
    setTeams(prev => prev.map(t => t.id === id ? { ...t, slot } : t));
  }

  function draftPlayer(playerId:string, mine:boolean) {
    const draftedTeam = mine ? orderedTeams.find(t => t.id === 1)! : clockTeam;
    const player = players.find(p => p.id === playerId);
    if (!player || !draftedTeam) return;
    const pick: DraftPick = {
      overall: nextPick,
      round: nextRound,
      pickInRound: nextPickInRound,
      teamId: draftedTeam.id,
      teamName: draftedTeam.name,
      playerId,
      playerName: player.name,
      playerPos: displayPos(player),
      mine,
    };
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, drafted: true, myTeam: mine } : p));
    setHistory(prev => [...prev, pick]);
    setSelectedPlayerId(playerId);
    setOverrideTeamId("");
  }

  function undoLastPick() {
    const last = history[history.length - 1];
    if (!last) return;
    setPlayers(prev => prev.map(p => p.id === last.playerId ? { ...p, drafted: false, myTeam: false } : p));
    setHistory(prev => prev.slice(0, -1));
  }

  function resetDraft() {
    setPlayers(prev => prev.map(p => ({ ...p, drafted: false, myTeam: false })));
    setHistory([]);
    setSelectedPlayerId(seededPlayers[0]?.id ?? null);
    setOverrideTeamId("");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl p-4 md:p-6 space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fantasy Baseball AI Draft Assistant</h1>
            <p className="text-sm text-slate-600">Built from your cheat sheet, expanded to 350 players, with position-based tiers and live AI draft support.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-white" onClick={undoLastPick}>Undo Last Pick</button>
            <button className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-white" onClick={resetDraft}>Reset Draft</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <section className="xl:col-span-3 space-y-4">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-3 text-lg font-semibold">Draft Control Center</div>
              <div className="grid grid-cols-3 gap-3">
                <div><div className="text-xs uppercase text-slate-500">Overall</div><div className="text-2xl font-bold">{nextPick}</div></div>
                <div><div className="text-xs uppercase text-slate-500">Round</div><div className="text-2xl font-bold">{nextRound}</div></div>
                <div><div className="text-xs uppercase text-slate-500">Pick</div><div className="text-2xl font-bold">{nextPickInRound}</div></div>
              </div>
              <div className="mt-3 text-sm">On the clock: <span className="font-semibold">{clockTeam?.name}</span></div>
              <div className="mt-3">
                <div className="mb-1 text-xs uppercase text-slate-500">Override Team</div>
                <select className="w-full rounded-xl border px-3 py-2 text-sm" value={overrideTeamId} onChange={(e)=>setOverrideTeamId(e.target.value)}>
                  <option value="">Use team on clock</option>
                  {orderedTeams.map(team => <option key={team.id} value={team.id}>{team.name} (slot {team.slot})</option>)}
                </select>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-3 text-lg font-semibold">Best By Position</div>
              <div className="grid grid-cols-2 gap-2">
                {displayPositions.map((pos) => {
                  const p = bestByPosition[pos];
                  return (
                    <button
                      key={pos}
                      onClick={() => p && setSelectedPlayerId(p.id)}
                      className="rounded-xl border bg-slate-50 p-2 text-left hover:bg-slate-100"
                    >
                      <div className="text-xs uppercase text-slate-500">{pos}</div>
                      <div className="text-sm font-semibold">{p ? p.name : "—"}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-2 text-lg font-semibold">Recommended Draft</div>
              {recommended ? (
                <>
                  <div className="text-base font-semibold">{recommended.name}</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className="inline-flex rounded-full border px-2 py-0.5 text-xs">{displayPos(recommended)}</span>
                    <span className="inline-flex rounded-full border px-2 py-0.5 text-xs">{recommended.team}</span>
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${tierColors[recommended.tier]}`}>{recommended.tier}</span>
                  </div>
                  <div className="mt-2 text-sm">AI Score: <span className="font-semibold">{recommended.aiScore.toFixed(2)}</span></div>
                  <div className="mt-2 rounded-xl bg-slate-50 p-2 text-sm text-slate-700">
                    {isPitcher(recommended)
                      ? "Recommended because your format heavily rewards pitching volume and efficiency."
                      : "Recommended because this bat provides strong categorical balance and top board value."}
                  </div>
                  <div className="mt-3 text-xs uppercase text-slate-500">Likely Gone Before Your Next Turn</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {likelyGone.map(p => <span key={p.id} className="inline-flex rounded-full border px-2 py-0.5 text-xs bg-slate-50">{p.name}</span>)}
                  </div>
                </>
              ) : <div className="text-sm text-slate-500">No recommendation available.</div>}
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-2 text-lg font-semibold">Selected Player Breakdown</div>
              {selected ? (
                <>
                  <div className="text-lg font-semibold">{selected.name}</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className="inline-flex rounded-full border px-2 py-0.5 text-xs">{displayPos(selected)}</span>
                    <span className="inline-flex rounded-full border px-2 py-0.5 text-xs">{selected.team}</span>
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${tierColors[selected.tier]}`}>{selected.tier}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-xl bg-slate-50 p-2">Overall Rank: <span className="font-semibold">{selected.rank}</span></div>
                    <div className="rounded-xl bg-slate-50 p-2">AI Rating: <span className="font-semibold">{selected.aiScore.toFixed(2)}</span></div>
                    <div className="rounded-xl bg-slate-50 p-2">Position: <span className="font-semibold">{selected.bucket}</span></div>
                    <div className="rounded-xl bg-slate-50 p-2">Pos Rank: <span className="font-semibold">{selected.posRank === 999 ? "—" : selected.posRank}</span></div>
                  </div>
                  <div className="mt-3 rounded-xl border bg-blue-50 p-2 text-xs text-slate-700">Projection source: offline snapshot model calibrated by player name, position, and rank. Live refresh scaffolding can be added later without changing the draft-room experience.</div>
                  <div className="mt-3">
                    <div className="text-xs uppercase text-slate-500">Strengths</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedBreakdown?.strengths.map((s:any) => <span key={s.cat} className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs">{s.cat} +{s.z}</span>)}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs uppercase text-slate-500">Cautions</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedBreakdown?.risks.map((s:any) => <span key={s.cat} className="inline-flex rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5 text-xs">{s.cat} {s.z}</span>)}
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    {isPitcher(selected) ? (
                      <>
                        <div className="rounded-xl border p-2">IP: {selected.IP}</div>
                        <div className="rounded-xl border p-2">QS: {selected.QS}</div>
                        <div className="rounded-xl border p-2">SV: {selected.SV}</div>
                        <div className="rounded-xl border p-2">K: {selected.K}</div>
                        <div className="rounded-xl border p-2">ERA: {selected.ERA}</div>
                        <div className="rounded-xl border p-2">WHIP: {selected.WHIP}</div>
                      </>
                    ) : (
                      <>
                        <div className="rounded-xl border p-2">R: {selected.R}</div>
                        <div className="rounded-xl border p-2">HR: {selected.HR}</div>
                        <div className="rounded-xl border p-2">RBI: {selected.RBI}</div>
                        <div className="rounded-xl border p-2">SB: {selected.SB}</div>
                        <div className="rounded-xl border p-2">OBP: {selected.OBP?.toFixed(3)}</div>
                        <div className="rounded-xl border p-2">SLG: {selected.SLG?.toFixed(3)}</div>
                      </>
                    )}
                  </div>
                </>
              ) : <div className="text-sm text-slate-500">Select a player in Live Rankings.</div>}
            </div>
          </section>

          <section className="xl:col-span-6 rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                <button className={tab === "live" ? "rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white" : "rounded-xl border px-3 py-2 text-sm font-medium"} onClick={() => setTab("live")}>Live Rankings</button>
                <button className={tab === "tiers" ? "rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white" : "rounded-xl border px-3 py-2 text-sm font-medium"} onClick={() => setTab("tiers")}>Tier Cheat Sheet</button>
                <button className={tab === "board" ? "rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white" : "rounded-xl border px-3 py-2 text-sm font-medium"} onClick={() => setTab("board")}>Draft Board</button>
              </div>
              {tab === "live" && (
                <div className="flex w-full gap-2 md:max-w-xl">
                  <input className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Search players" value={query} onChange={(e)=>setQuery(e.target.value)} />
                  <select className="rounded-xl border px-3 py-2 text-sm" value={sortMode} onChange={(e)=>setSortMode(e.target.value as "rank"|"ai")}>
                    <option value="rank">Sort: Rank</option>
                    <option value="ai">Sort: AI Score</option>
                  </select>
                </div>
              )}
            </div>

            {tab === "live" && (
              <div className="max-h-[820px] space-y-2 overflow-y-auto pr-1">
                {filtered.map((p:any) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlayerId(p.id)}
                    className={`cursor-pointer rounded-2xl border p-3 transition ${selectedPlayerId === p.id ? "border-blue-500 bg-blue-50" : p.drafted ? "bg-slate-50 opacity-65" : "bg-white hover:bg-slate-50"}`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-slate-500">#{p.rank}</span>
                          <span className="text-base font-semibold">{p.name}</span>
                          <span className="inline-flex rounded-full border px-2 py-0.5 text-xs">{p.team}</span>
                          {p.pos.map((pos:string)=><span key={pos} className="inline-flex rounded-full border px-2 py-0.5 text-xs">{pos}</span>)}
                          <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${tierColors[p.tier]}`}>{p.tier}</span>
                          {p.myTeam && <span className="inline-flex rounded-full border border-sky-300 bg-sky-50 px-2 py-0.5 text-xs">My Team</span>}
                          {p.drafted && !p.myTeam && <span className="inline-flex rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5 text-xs">Taken</span>}
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 md:grid-cols-5">
                          {isPitcher(p) ? (
                            <>
                              <div>IP: {p.IP}</div><div>QS: {p.QS}</div><div>K: {p.K}</div><div>ERA: {p.ERA}</div><div>K/BB: {p.KBB}</div>
                            </>
                          ) : (
                            <>
                              <div>R: {p.R}</div><div>HR: {p.HR}</div><div>RBI: {p.RBI}</div><div>SB: {p.SB}</div><div>OBP: {p.OBP?.toFixed(3)}</div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {!p.drafted && (
                          <>
                            <button className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-white" onClick={(e)=>{e.stopPropagation(); draftPlayer(p.id, false);}}>Taken</button>
                            <button className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800" onClick={(e)=>{e.stopPropagation(); draftPlayer(p.id, true);}}>My Pick</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "tiers" && (
              <div className="max-h-[820px] overflow-y-auto pr-1">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {displayPositions.map((position) => (
                    <div key={position} className="rounded-2xl border bg-slate-50 p-3">
                      <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">{position}</div>
                      <div className="max-h-[660px] space-y-2 overflow-y-auto pr-1">
                        {tierBoard[position].map((p:any) => (
                          <div key={p.id} onClick={() => setSelectedPlayerId(p.id)} className={`cursor-pointer rounded-xl border p-2 ${tierColors[p.tier]} ${selectedPlayerId===p.id ? "ring-2 ring-blue-400" : ""}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-sm font-semibold">{p.name}</div>
                                <div className="text-xs opacity-80">#{p.rank} • {position}#{p.posRank} • {p.team}</div>
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

            {tab === "board" && (
              <div className="space-y-4">
                <div className="rounded-2xl border bg-slate-50 p-3">
                  <div className="mb-3 text-sm font-semibold text-slate-700">League Teams</div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {teams.map(team => (
                      <div key={team.id} className="grid grid-cols-[72px_1fr] gap-2">
                        <input type="number" min={1} max={12} value={team.slot} onChange={(e)=>updateTeamSlot(team.id, Number(e.target.value))} className="rounded-xl border px-2 py-2 text-sm" />
                        <input value={team.name} onChange={(e)=>updateTeamName(team.id, e.target.value)} className="rounded-xl border px-3 py-2 text-sm" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border bg-slate-50 p-3">
                  <div className="mb-3 text-sm font-semibold text-slate-700">Draft History</div>
                  <div className="max-h-[520px] overflow-y-auto">
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

          <section className="xl:col-span-3 space-y-4">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-3 text-lg font-semibold">My Team</div>
              <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
                {players.filter(p=>p.myTeam).length === 0 && <div className="rounded-xl border border-dashed p-3 text-sm text-slate-500">Mark a player as My Pick to build your team.</div>}
                {enriched.filter(p=>p.myTeam).map((p:any) => (
                  <div key={p.id} className="rounded-xl border bg-slate-50 p-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.pos.map((pos:string)=><span key={pos} className="inline-flex rounded-full border px-2 py-0.5 text-xs">{pos}</span>)}
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${tierColors[p.tier]}`}>{p.tier}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-3 text-lg font-semibold">Category Totals</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl border p-2">H: {totals.H}</div><div className="rounded-xl border p-2">R: {totals.R}</div>
                <div className="rounded-xl border p-2">HR: {totals.HR}</div><div className="rounded-xl border p-2">RBI: {totals.RBI}</div>
                <div className="rounded-xl border p-2">BB: {totals.BB}</div><div className="rounded-xl border p-2">SB: {totals.SB}</div>
                <div className="rounded-xl border p-2">AVG: {totals.AVG ? totals.AVG.toFixed(3) : "0.000"}</div><div className="rounded-xl border p-2">OBP: {totals.OBP ? totals.OBP.toFixed(3) : "0.000"}</div>
                <div className="rounded-xl border p-2">SLG: {totals.SLG ? totals.SLG.toFixed(3) : "0.000"}</div><div className="rounded-xl border p-2">TB: {totals.TB}</div>
                <div className="rounded-xl border p-2">IP: {totals.IP}</div><div className="rounded-xl border p-2">W: {totals.W}</div>
                <div className="rounded-xl border p-2">L: {totals.L}</div><div className="rounded-xl border p-2">QS: {totals.QS}</div>
                <div className="rounded-xl border p-2">SV: {totals.SV}</div><div className="rounded-xl border p-2">K: {totals.K}</div>
                <div className="rounded-xl border p-2">BBP: {totals.BBP}</div><div className="rounded-xl border p-2">ERA: {totals.ERA ? totals.ERA.toFixed(2) : "0.00"}</div>
                <div className="rounded-xl border p-2">WHIP: {totals.WHIP ? totals.WHIP.toFixed(2) : "0.00"}</div><div className="rounded-xl border p-2">K/BB: {totals.KBB ? totals.KBB.toFixed(2) : "0.00"}</div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-3 text-lg font-semibold">Roster Counts</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl border p-2">C: {counts.C} / 1</div>
                <div className="rounded-xl border p-2">1B: {counts["1B"]} / 1</div>
                <div className="rounded-xl border p-2">2B: {counts["2B"]} / 1</div>
                <div className="rounded-xl border p-2">SS: {counts.SS} / 1</div>
                <div className="rounded-xl border p-2">3B: {counts["3B"]} / 1</div>
                <div className="rounded-xl border p-2">OF: {counts.OF} / 3</div>
                <div className="rounded-xl border p-2">SP: {counts.SP} / 6</div>
                <div className="rounded-xl border p-2">RP: {counts.RP} / 2</div>
                <div className="rounded-xl border p-2">P: {counts.P} / 3+</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
