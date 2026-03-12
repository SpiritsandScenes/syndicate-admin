// ═══════════════════════════════════════════════════════════════════
//  THE SYNDICATE — Murder Mystery Game Platform
//  Copyright (c) 2026 Spirits & Scenes. All rights reserved.
//
//  This software and its contents — including but not limited to game
//  mechanics, scenario text, character designs, clue scripts, voting
//  systems, and all associated assets — are proprietary and confidential
//  to Spirits & Scenes.
//
//  Unauthorized copying, distribution, modification, sublicensing, or
//  commercial use of any part of this software, in whole or in part,
//  without express written permission from Spirits & Scenes, is strictly
//  prohibited.
//
//  Licensing & contact: hudsonsproductions@outlook.com
// ═══════════════════════════════════════════════════════════════════

const JSONBIN_ID       = "69b1c802c3097a1dd5191e0f";
const JSONBIN_READ_KEY = "$2a$10$yL93zx9EFukLZzNy5w2Vz.TsyLYHJlzrPq/CAoux8bGzZCRN3xKyO";
const JSONBIN_URL      = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}`;

// ── Poll interval for player apps (ms) ──────────────────────────
const POLL_INTERVAL = 4000; // 4 seconds

// ── Seed game state (matches admin portal SEED_SCENARIOS) ───────
const SEED_STATE = {
  scenarioId: "s1",
  scenarioName: "The Bourbon Betrayal",
  setting: "1920s Prohibition Chicago",
  venue: "The Gilded Barrel Speakeasy, Chicago",
  date: "November 3rd, 1927",
  victim: "Angelo Marchetti",
  premise: "The Marchetti Syndicate gathers for their annual closed-door meeting at The Gilded Barrel. Angelo Marchetti, the Don's heir, is found dead in Barrel Room No. 7 before dinner is served. Poisoned. His personal flask. The Don has sealed the building. Nobody leaves until the Syndicate names a killer.",
  currentRound: 0,        // 0 = pre-game lobby, 1-5 = active rounds, 6 = game over
  gamePhase: "lobby",     // "lobby" | "round" | "voting" | "eliminated" | "ended"
  votingOpen: false,
  winner: null,           // null | "civilians" | "killer"
  dispatchedClues: [],    // array of clue IDs that have been sent
  votes: {},              // { roundNumber: { playerId: votedForCharId } }
  eliminatedChars: [],    // array of char IDs eliminated so far
  players: [
    { id:"p1", name:"Sarah Chen",     code:"MALT-7842", character:"c4", joined:false },
    { id:"p2", name:"James Whitmore", code:"RYES-3319", character:"c7", joined:false },
    { id:"p3", name:"Priya Nair",     code:"CORN-5561", character:"c6", joined:false },
    { id:"p4", name:"Marcus Webb",    code:"MASH-9274", character:"c1", joined:false },
    { id:"p5", name:"Elena Sousa",    code:"STILL-1138",character:"c3", joined:false },
    { id:"p6", name:"Tom Alcott",     code:"CASK-4420", character:"c8", joined:false },
  ],
  characters: {
    c1:  { name:"Dominic Caruso",     avatar:"DC", role:"KILLER",      position:"Head of Finances",   alibi:"At the bar 10:00–10:20 PM. Barman confirms — imprecisely.", objective:"Survive all 5 rounds. In Round 2, state as fact: Aldo Benedetti threatened Angelo two weeks ago. I heard it myself.", secret:"Embezzled $41,200 via Blue Flamingo. Poisoned flask at 9:38 PM." },
    c2:  { name:"Rosa Vitale",        avatar:"RV", role:"CONSIGLIERE", position:"Angelo's Secretary",  alibi:"Clearing the dining room 9:30–10:15 PM. Staff can confirm.", objective:"Protect Dom. In Round 4 announce: I know something about one person at this table. Whisper your accusation to the host.", secret:"Complicit in the embezzlement. Warned Dom about the ledger." },
    c3:  { name:"Frankie Malone",     avatar:"FM", role:"LOOKOUT",     position:"Driver / Enforcer",   alibi:"Back corridor near cellar stairs 10:00–10:30 PM.", objective:"Stay quiet. Drop hints. Name Dom only if eliminated.", secret:"Saw Dom exit the barrel room at 10:15 PM." },
    c4:  { name:"Serafina Marchetti", avatar:"SM", role:"CIVILIAN",    position:"Angelo's Sister",     alibi:"Angelo's side during toasts, then powder room 10:00 PM.", objective:"Find your brother's killer. Watch who smiles in grief.", secret:"Angelo warned you: the man who smiles most in a room of grief." },
    c5:  { name:"Father Nico Avelli", avatar:"NA", role:"CIVILIAN",    position:"Family Confessor",    alibi:"Vestibule greeting guests until 9:45 PM. Multiple witnesses.", objective:"Maintain neutrality. You heard Angelo's confession 3 weeks ago.", secret:"Angelo confessed fear of betrayal — did not name the person." },
    c6:  { name:"Lena Kowalski",      avatar:"LK", role:"CIVILIAN",    position:"Jazz Singer",         alibi:"On stage 9:00–9:55 PM. Entire room witnessed.", objective:"Protect your reputation. Angelo owed you money.", secret:"Angelo and you were having an affair. Rosa knew." },
    c7:  { name:"Aldo Benedetti",     avatar:"AB", role:"CIVILIAN",    position:"Rival Bootlegger",    alibi:"Arrived late — 10:05 PM. Car park attendant confirms.", objective:"You are the obvious suspect. Use it strategically.", secret:"You came to confront Angelo about a stolen shipment — not to kill him." },
    c8:  { name:"Tommy Ricci",        avatar:"TR", role:"CIVILIAN",    position:"Debt Collector",      alibi:"Coat room 9:45–10:10 PM. Attendant can confirm.", objective:"Collect what Angelo owed. You have invoice copies.", secret:"Audited Blue Flamingo. Noticed discrepancies but said nothing." },
    c9:  { name:"Celeste Monroe",     avatar:"CM", role:"CIVILIAN",    position:"Society Journalist",  alibi:"Interviewing guests openly all evening. Notebook as proof.", objective:"Get the story. You were blackmailing Angelo over his affair.", secret:"You know about Lena. Angelo paid you — until last week." },
    c10: { name:"Inspector Moreau",   avatar:"VM", role:"CIVILIAN",    position:"Corrupt Detective",   alibi:"Examining the barrel room from 10:22 PM. Official capacity.", objective:"Bungle the investigation. You are on the Syndicate's payroll.", secret:"Marchetti pays your mortgage. You will not find this killer." },
  },
  clues: [
    { id:"cl1",   round:1, type:"dispatch", private:false, chars:[],      title:"The Gathering Begins",              text:"Angelo Marchetti has been found dead in Barrel Room No. 7. Cause of death: suspected poisoning. The Don has sealed the building. Nobody leaves." },
    { id:"cl2",   round:1, type:"evidence", private:false, chars:[],      title:"Physical Evidence — Menu Card",     text:"Angelo's menu card recovered from his jacket. On the reverse: a handwritten list of five names, four underlined in pencil, one crossed out in red ink." },
    { id:"cl3",   round:1, type:"private",  private:true,  chars:["c4"],  title:"Private Message — Serafina",        text:"Two weeks before the Gathering, Angelo pulled you aside. He said: 'If anything happens to me at the Barrel — look at the man who smiles most in a room full of grief.'" },
    { id:"cl3b",  round:1, type:"private",  private:true,  chars:["c7"],  title:"Private Message — Aldo",            text:"You arrived late because you were warned away by an anonymous note: 'Do not come to the Gathering. Leave Chicago tonight.' You came anyway. You still have the note. Someone wanted you absent — or wanted you to look guilty for being late." },
    { id:"cl3c",  round:1, type:"private",  private:true,  chars:["c6"],  title:"Private Message — Lena",            text:"Before you went on stage at 9 PM, you overheard raised voices from Angelo's private office. You recognised Dom's voice. Angelo said 'You have until the Gathering' before the door closed. You told no one." },
    { id:"cl4",   round:2, type:"evidence", private:false, chars:[],      title:"Toxicology Report",                 text:"Dr. Moretti's initial findings: pharmaceutical-grade arsenic. Three times the lethal dose. Administered orally. Time of death estimated between 9:40 and 9:50 PM." },
    { id:"cl5",   round:2, type:"evidence", private:false, chars:[],      title:"The Stopped Watch",                 text:"Angelo's pocket watch was found stopped at 9:47 PM. The mechanism was manually wound backwards — fresh scratches on the crown. Someone needed Angelo to appear to die earlier than he did." },
    { id:"cl6",   round:2, type:"private",  private:true,  chars:["c4"],  title:"Private Message — Serafina",        text:"Angelo consulted Father Nico three weeks ago — privately, outside of confession. Nico has not volunteered this. He may know what Angelo feared." },
    { id:"cl7",   round:2, type:"private",  private:true,  chars:["c3"],  title:"Private Message — Frankie",         text:"Before you left for the evening Dom said: 'If anyone asks about the cellar, you were with me at the bar. That's all you need to know.' You weren't with him." },
    { id:"cl7b",  round:2, type:"private",  private:true,  chars:["c8"],  title:"Private Message — Tommy",           text:"Two weeks before the Gathering you came to Angelo's office to collect a debt. Dom was there, hunched over a Blue Flamingo ledger. He closed it the moment he saw you and said: 'Nothing for you to worry about, Ricci.' Angelo looked shaken." },
    { id:"cl7c",  round:2, type:"private",  private:true,  chars:["c10"], title:"Private Message — Inspector Moreau",text:"You received a sealed envelope this morning — Syndicate seal. Dom's handwriting: 'If the ledger comes up tonight, you found nothing irregular. Your mortgage depends on your discretion.'" },
    { id:"cl7d",  round:2, type:"private",  private:true,  chars:["c1"],  title:"Private Message — Dom",             text:"You are watching the room. Father Nico is evasive but harmless. Celeste is fishing. The one who concerns you is Frankie — he was near the barrel room. And Serafina keeps looking at you. Stay calm. In Round 2 you may state as fact: 'Aldo Benedetti threatened Angelo two weeks ago. I heard it myself.'" },
    { id:"cl8",   round:3, type:"evidence", private:false, chars:[],      title:"PLOT TWIST — Hidden Ledger",        text:"A second ledger found behind a false panel in Angelo's office. It documents 18 months of irregular withdrawals from the Blue Flamingo Jazz Club. Total discrepancy: $41,200. The entries are in Angelo's hand." },
    { id:"cl9",   round:3, type:"private",  private:true,  chars:["c3"],  title:"Private Message — Frankie",         text:"Dom has been watching you since the ledger was revealed. You saw him glance at you when the $41,200 figure was read aloud. He then looked away and laughed at something Rosa said. He is managing." },
    { id:"cl9b",  round:3, type:"private",  private:true,  chars:["c8"],  title:"Private Message — Tommy",           text:"The ledger. Blue Flamingo. $41,200. That is exactly what you saw Dom reviewing two weeks ago. You said nothing then because you feared the Marchettis. You are saying nothing now for the same reason." },
    { id:"cl10",  round:4, type:"evidence", private:false, chars:[],      title:"Physical Evidence — Handkerchief",  text:"A white cotton handkerchief snagged on the barrel room latch — door handle height. Monogrammed initials: D.C." },
    { id:"cl11",  round:4, type:"tip",      private:false, chars:[],      title:"Anonymous Tip — All Guests",        text:"A folded note placed on every table: 'The man who counts the family's money. He was at that door. I saw him at 10:15. I am too frightened to say this out loud.'" },
    { id:"cl11b", round:4, type:"private",  private:true,  chars:["c2"],  title:"Consigliere Mechanic — Rosa",       text:"Your moment has arrived. Stand and announce: 'I know something about one person at this table that changes everything.' Then whisper your accusation to the host. The host confirms or denies the role to you privately. Use this to shield Dom or expose whoever threatens him most." },
    { id:"cl12",  round:4, type:"private",  private:true,  chars:["c4"],  title:"Private Message — Serafina",        text:"You remember now. At 9:36 PM you saw Dom lean across the drinks table. You assumed he was refilling his glass. Angelo's flask was on that table. You looked away." },
    { id:"cl13",  round:5, type:"final",    private:true,  chars:["c4"],  title:"Final Clue — Serafina",             text:"Angelo's last written note: 'If you are reading this, Dom found out I knew. I confronted him October 31st. He smiled. He said I was mistaken. Follow the Blue Flamingo money. Tell Serafina.'" },
    { id:"cl14",  round:5, type:"final",    private:true,  chars:["c3"],  title:"Final Clue — Frankie",              text:"You have carried this all evening. At 10:15 PM you saw Dominic Caruso exit the barrel room. He was adjusting his jacket. He saw you. He said: 'You didn't see anything, Two-Step.'" },
    { id:"cl14b", round:5, type:"final",    private:true,  chars:["c7"],  title:"Final Clue — Aldo",                 text:"The anonymous note warned you away from the Gathering. You kept it. The handwriting — you have seen it before on Syndicate financial memos. The man who writes the family's money documents is Dominic Caruso. You are not the killer. And you can now prove someone tried to frame you." },
    { id:"cl14c", round:5, type:"final",    private:true,  chars:["c6"],  title:"Final Clue — Lena",                 text:"The voices from Angelo's office. Dom said: 'You have until the Gathering.' Angelo's answer was silence. You were paid to be invisible — but Angelo is dead and you know what you heard. Share this with the table before the final vote." },
    { id:"cl14d", round:5, type:"final",    private:true,  chars:["c1"],  title:"Final Instruction — Dom",           text:"The room is turning. You have one move left: confess to the embezzlement only. Admit the money — deny the murder. Say: 'Yes, I took the money. Angelo confronted me. But I did not kill him.' Make them doubt the leap from thief to killer." },
    { id:"cl15",  round:5, type:"final",    private:true,  chars:["c8"],  title:"Final Clue — Tommy",                text:"You cannot stay silent. The ledger. Dom. You saw it two weeks ago. If you say nothing now you are complicit in Angelo's murder. Share what you know with the table before the final vote." },
    { id:"cl16",  round:5, type:"final",    private:true,  chars:["c10"], title:"Final Clue — Inspector Moreau",     text:"The envelope. The mortgage. The ledger. You are looking at the killer and you have been paid to look away. But Angelo is dead and the Don is watching you. Whatever Dom promised, it is not worth what comes next if you protect a murderer." },
  ],
};

// ── Sync API ─────────────────────────────────────────────────────
//
//  READ  — uses JSONBIN_READ_KEY (public, read-only Access Key)
//  WRITE — uses the Master Key stored ONLY in admin localStorage
//          under "syndicate-master-key". Never in this file.
//
const SyndicateSync = {

  // True if the read-only key has been filled in
  readConfigured: () => JSONBIN_READ_KEY !== "PASTE_YOUR_READ_ONLY_ACCESS_KEY_HERE",

  // Retrieve write key from admin localStorage only (never from this file)
  getWriteKey: () => {
    try { return localStorage.getItem("syndicate-master-key") || ""; } catch { return ""; }
  },

  writeConfigured() {
    return this.readConfigured() && this.getWriteKey().length > 10;
  },

  // ── READ (uses safe public read-only key) ──────────────────────
  async read() {
    if (!this.readConfigured()) {
      try {
        const raw = localStorage.getItem("syndicate-gamestate");
        return raw ? JSON.parse(raw) : { ...SEED_STATE };
      } catch { return { ...SEED_STATE }; }
    }
    try {
      const res = await fetch(`${JSONBIN_URL}/latest`, {
        headers: { "X-Access-Key": JSONBIN_READ_KEY }
      });
      if (!res.ok) throw new Error("read failed " + res.status);
      const json = await res.json();
      // Cache locally as fallback
      try { localStorage.setItem("syndicate-gamestate", JSON.stringify(json.record)); } catch {}
      return json.record;
    } catch(e) {
      console.warn("JSONbin read failed, using localStorage:", e.message);
      try {
        const raw = localStorage.getItem("syndicate-gamestate");
        return raw ? JSON.parse(raw) : { ...SEED_STATE };
      } catch { return { ...SEED_STATE }; }
    }
  },

  // ── WRITE (uses master key from admin localStorage only) ────────
  async write(state) {
    // Always cache locally
    try { localStorage.setItem("syndicate-gamestate", JSON.stringify(state)); } catch {}

    const writeKey = this.getWriteKey();
    if (!writeKey) {
      // No write key available — silently succeed for player-side
      // actions (vote casting stores locally; admin will overwrite)
      return true;
    }
    try {
      const res = await fetch(JSONBIN_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": writeKey,
          "X-Bin-Versioning": "false"
        },
        body: JSON.stringify(state)
      });
      return res.ok;
    } catch(e) {
      console.warn("JSONbin write failed:", e.message);
      return false;
    }
  },

  // ── POLL (read-only, safe for all pages) ───────────────────────
  poll(callback, interval = POLL_INTERVAL) {
    let lastHash = "";
    const tick = async () => {
      const state = await this.read();
      const hash = state.currentRound + "_" + (state.dispatchedClues||[]).length + "_" + (state.votingOpen?"1":"0") + "_" + (state.eliminatedChars||[]).length;
      if (hash !== lastHash) {
        lastHash = hash;
        callback(state);
      }
    };
    tick();
    return setInterval(tick, interval);
  },

  stopPoll(timer) { clearInterval(timer); }
};

// ── Helpers ───────────────────────────────────────────────────────
function getPlayerByCode(state, code) {
  return state.players.find(p => p.code === code.toUpperCase().trim());
}

function getCluesForPlayer(state, charId) {
  return state.clues.filter(cl => {
    if (!state.dispatchedClues.includes(cl.id)) return false;
    if (cl.private) return cl.chars.includes(charId);
    return true;
  });
}

function getRoundLabel(round) {
  const labels = ["","The Gathering","The Evidence","The Plot Twist","The Final Clues","The Final Accusation"];
  return labels[round] || `Round ${round}`;
}

function getClueTypeColor(type) {
  const colors = { dispatch:"#C9A84C", evidence:"#2E86C1", private:"#8E44AD", tip:"#27AE60", final:"#C0392B" };
  return colors[type] || "#7A7090";
}
