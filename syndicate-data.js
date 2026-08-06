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

// ── Player write key ─────────────────────────────────────────────
// A JSONbin Access Key scoped to Read + Update only (NOT Delete, NOT
// scoped to other bins). This lets player devices (join/play pages)
// persist their own join status and votes to the shared bin without
// ever holding the full admin Master Key. Safe to keep public — the
// worst a holder of this key can do is overwrite bin contents, never
// delete the bin or read/write other bins on the account.
//
// Create it in the JSONbin dashboard: Access Keys → New Key → grant
// this bin's Find + Update permissions only → paste the value below.
const JSONBIN_PLAYER_KEY = "$2a$10$QTGGTLCqNZE0pExx./YqgugqxH/4ljZifQc3H/t8N.nzKcj3mNfNK";

// ── Poll interval for player apps (ms) ──────────────────────────
const POLL_INTERVAL = 4000; // 4 seconds

// ── Interrogation Question Bank ──────────────────────────────────
// Same 10 questions for every character; each unlocks at a fixed round
// (matches the existing round/clue-dispatch gating — no separate timer).
// Shared by index.html (admin) and play/index.html (player) so the
// question text and round assignment live in exactly one place.
const QUESTION_BANK = [
  { id:"q1",  round:1, question:"Where were you between 9:30 and 10:30 PM tonight, and who can confirm it?" },
  { id:"q2",  round:1, question:"What was your relationship with Angelo Marchetti?" },
  { id:"q3",  round:1, question:"Did you see anyone near Barrel 7, the cellar stairs, or the back corridor tonight?" },
  { id:"q4",  round:2, question:"Angelo's pocket watch was found stopped at 9:47 PM. Where were you at that exact time?" },
  { id:"q5",  round:2, question:"Have you heard anything about how the poison might have gotten into Angelo's flask?" },
  { id:"q6",  round:3, question:"Angelo was building a ledger before he died. Do you know what it was about?" },
  { id:"q7",  round:3, question:"What's your connection to the Blue Flamingo?" },
  { id:"q8",  round:3, question:"Did Angelo ever say he felt threatened by anyone in this family?" },
  { id:"q9",  round:4, question:"A handkerchief monogrammed \"D.C.\" was found snagged on the barrel room door. Do those initials mean anything to you?" },
  { id:"q10", round:5, question:"If you had to name one person in this room as the killer right now — who, and why?" },
];

// ── Seed game state (matches admin portal SEED_SCENARIOS) ───────
const SEED_STATE = {
  scenarioId: "s1",
  scenarioName: "The Bourbon Betrayal",
  setting: "1920s Prohibition Chicago",
  venue: "The Gilded Barrel Speakeasy, Chicago",
  date: "November 3rd, 1927",
  victim: "Angelo Marchetti",
  premise: "The Marchetti Syndicate gathers for their annual closed-door meeting at The Gilded Barrel. Angelo Marchetti, the Don's heir, is found dead in Barrel Room No. 7 before dinner is served. Poisoned. His personal flask. The Don has sealed the building. Nobody leaves until the Syndicate names a killer.",
  questionBank: QUESTION_BANK,
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
    c1:  { name:"Dominic Caruso",     avatar:"DC", role:"KILLER",      position:"Head of Finances",   alibi:"At the bar 10:00–10:20 PM. Barman confirms — imprecisely.", objective:"Survive all 5 rounds. In Round 2, state as fact: Aldo Benedetti threatened Angelo two weeks ago. I heard it myself.", secret:"Embezzled $41,200 via Blue Flamingo. Poisoned flask at 9:38 PM.",
      answers: {
        q1:"Bar, getting a double bourbon, ten to ten-twenty. The barman will vouch for me — busy night, though, so don't expect a stopwatch.",
        q2:"Twelve years running this family's books. I respected Angelo. Meticulous man. We didn't always agree, but I never doubted his loyalty to his father.",
        q3:"No — I was at the bar most of that window. You'd want to ask whoever was actually back there.",
        q4:"Bar. Bourbon in hand. Same answer.",
        q5:"I wouldn't know the first thing about arsenic, pharmaceutical or otherwise. That's not exactly a finance skill.",
        q6:"I understand why it's alarming. But Angelo was building a case against a rival, from what I gather. Couldn't this have been planted — a rival family trying to frame someone inside ours?",
        q7:"My wife runs that club. I help with the books occasionally, like I help with everyone's books. I'd want to see these 'records' myself before I take them at face value.",
        q8:"If he did, he never said so to me. We spoke plenty, but not about fear.",
        q9:"Delia. Delia Corsetti — my cousin. She was here the first hour, you may not have crossed paths. The handkerchief's hers, I'd imagine.",
        q10:"I've been with this family twelve years. If I wanted to steal — or worse — I'd have done it smarter than whatever's being described here tonight.",
      } },
    c2:  { name:"Rosa Vitale",        avatar:"RV", role:"CONSIGLIERE", position:"Angelo's Secretary",  alibi:"Clearing the dining room 9:30–10:15 PM. Staff can confirm.", objective:"Protect Dom. In Round 4 announce: I know something about one person at this table. Whisper your accusation to the host.", secret:"Complicit in the embezzlement. Warned Dom about the ledger.",
      answers: {
        q1:"Private dining room, arranging Angelo's presentation materials, 9:30 to 10:30. Two waiters passed through — they can place me there, though not every minute.",
        q2:"Seven years as his secretary. His calendar, his correspondence, his confidence. He was like family to me.",
        q3:"I wasn't anywhere near there myself. I couldn't say who else was.",
        q4:"Still in the dining room, I believe. It's a blur — that whole hour is a blur now.",
        q5:"I have no idea. I handle correspondence, not chemistry.",
        q6:"I've seen that ledger. I handled Angelo's correspondence for seven years — I know his handwriting. Those final entries are wrong. That document has been tampered with.",
        q7:"I don't manage the club's books. You'd have to ask someone closer to that operation.",
        q8:"He was tense in his final weeks, yes. He didn't confide the specifics in me — or if he did, I've chosen to let him keep that privacy, even now.",
        q9:"No idea. Doesn't match anyone I know well.",
        q10:"With respect — look at who benefits from chaos in this family. Aldo Benedetti walked in uninvited, and now the heir is dead. Think about that.",
      } },
    c3:  { name:"Frankie Malone",     avatar:"FM", role:"LOOKOUT",     position:"Driver / Enforcer",   alibi:"Back corridor near cellar stairs 10:00–10:30 PM.", objective:"Stay quiet. Drop hints. Name Dom only if eliminated.", secret:"Saw Dom exit the barrel room at 10:15 PM.",
      answers: {
        q1:"Back corridor, near the cellar stairs. Ten to ten-thirty. Needed some air.",
        q2:"Angelo was good to me. Treated me like a person, not just muscle. That's all I'm gonna say. Angelo was good to me.",
        q3:"Look — there's things in this building tonight that are above my pay grade, all right? I'm not saying I saw nothing. I'm saying I'm not stupid enough to say what I saw in a room full of people I don't trust.",
        q4:"...I was already back there by then. Can't say more.",
        q5:"No idea. Wish I did.",
        q6:"Angelo mentioned things to me sometimes. I keep those to myself.",
        q7:"Not my business, that club.",
        q8:"He was careful the last few days. More careful than usual. Didn't say why.",
        q9:"Couldn't tell you whose that is.",
        q10:"I can't. You don't understand what they'd do to me. (If eliminated, this unlocks full testimony naming Dom — per app design.)",
      } },
    c4:  { name:"Serafina Marchetti", avatar:"SM", role:"CIVILIAN",    position:"Angelo's Sister",     alibi:"Angelo's side during toasts, then powder room 10:00 PM.", objective:"Find your brother's killer. Watch who smiles in grief.", secret:"Angelo warned you: the man who smiles most in a room of grief.",
      answers: {
        q1:"At Angelo's side during the toasts, then the powder room from about 10:00 until Pietro raised the alarm. I have no reason to hurt my own brother.",
        q2:"He was my protector. My confidant. The only person in this family who ever made me feel safe.",
        q3:"I wasn't near there — I was in the powder room, falling apart.",
        q4:"Still with Angelo during the toasts, or just after. I can't be exact.",
        q5:"I don't know anything about that.",
        q6:"I know he kept one. He mentioned it obliquely back in October — never showed me what was in it.",
        q7:"I don't involve myself in the club's business.",
        q8:"He was troubled in the weeks before tonight — watchful, guarded in a way that wasn't like him. He told me once that if anything ever happened to him, I should watch for whoever seemed calmest about it. Grief makes people careless. He didn't trust calm.",
        q9:"No. Doesn't mean anything to me.",
        q10:"My brother told me who to watch, and I've been watching. Dom, you've barely shed a tear tonight. You knew him twelve years. Doesn't that strike anyone else as strange?",
      } },
    c5:  { name:"Father Nico Avelli", avatar:"NA", role:"CIVILIAN",    position:"Family Confessor",    alibi:"Vestibule greeting guests until 9:45 PM. Multiple witnesses.", objective:"Maintain neutrality. You heard Angelo's confession 3 weeks ago.", secret:"Angelo confessed fear of betrayal — did not name the person.",
      answers: {
        q1:"The chapel, from a quarter past nine onward. Multiple guests can place me there — I was receiving anyone who wanted a quiet moment.",
        q2:"He came to confession regularly. Not a good man by most measures, but he had a conscience. I'll miss him.",
        q3:"I didn't leave the chapel, so I can't say.",
        q4:"Still in the chapel, with witnesses.",
        q5:"That's not knowledge I'd have.",
        q6:"I can't speak to its contents. But I'll say this — not everyone in this room is as surprised by Angelo's death as they appear.",
        q7:"None that I know of.",
        q8:"Three weeks ago, someone came to me — not in confession — and asked, hypothetically, whether stopping a man from destroying everything the family built could be called protection. I told him no. I'm telling you now.",
        q9:"That cologne is bergamot. Italian import, uncommon. Someone at this gathering wears it. I have a very good memory for such things.",
        q10:"I cannot speak of what I've heard in confidence. But justice and truth aren't always the same thing here — and I believe I know which one this room needs.",
      } },
    c6:  { name:"Lena Kowalski",      avatar:"LK", role:"CIVILIAN",    position:"Jazz Singer",         alibi:"On stage 9:00–9:55 PM. Entire room witnessed.", objective:"Protect your reputation. Angelo owed you money.", secret:"Angelo and you were having an affair. Rosa knew.",
      answers: {
        q1:"Dressing room, preparing for my second set. Nine-forty onward.",
        q2:"I knew Angelo. Better than most people in this room realize. He was afraid, the last few weeks. I noticed.",
        q3:"Not from the dressing room, no.",
        q4:"Still getting ready. The walls are thin back there, if that matters.",
        q5:"No idea.",
        q6:"I don't know what was in it.",
        q7:"I sing there three nights a week. That's the extent of it.",
        q8:"I know things about Angelo nobody else in this room knows. And yes — he was afraid, in the weeks before tonight. I'm not ready to say more than that.",
        q9:"I was in the dressing room at 9:40. I heard two men arguing in the corridor outside. One of them was Angelo. He said, 'You had your chance, Dom. Tonight it ends. Papa will know by midnight.' I heard the name clearly. It was Dom.",
        q10:"He said a name, in that corridor, right before he died. The name was Dom. I've been afraid to say it all night. I'm saying it now.",
      } },
    c7:  { name:"Aldo Benedetti",     avatar:"AB", role:"CIVILIAN",    position:"Rival Bootlegger",    alibi:"Arrived late — 10:05 PM. Car park attendant confirms.", objective:"You are the obvious suspect. Use it strategically.", secret:"You came to confront Angelo about a stolen shipment — not to kill him.",
      answers: {
        q1:"I arrived twelve minutes late to the toasts. I was in the car park — an argument, nothing to do with the murder.",
        q2:"I hated Angelo. Professional rivalry — he burned my warehouse, I bribed his contacts. I didn't know him well enough to want him personally dead.",
        q3:"I wasn't even in the building yet — ask anyone.",
        q4:"Still outside. That argument ran long.",
        q5:"Wouldn't know.",
        q6:"No idea what's in it.",
        q7:"None of my business, that club.",
        q8:"Someone pulled me aside before I even walked in tonight and told me to keep my head down, stay quiet, not ask questions. I didn't understand why at the time. I'm starting to.",
        q9:"Doesn't mean anything to me. I just got here twelve minutes late to my own humiliation.",
        q10:"Dom Caruso pulled me aside in the car park. Before the body was even found. He said keep my head down. Then he said — after tonight there'd be 'an opening in the Family,' and he intended to make sure it got filled by the right person. Who says that about a man who isn't dead yet?",
      } },
    c8:  { name:"Tommy Ricci",        avatar:"TR", role:"CIVILIAN",    position:"Debt Collector",      alibi:"Coat room 9:45–10:10 PM. Attendant can confirm.", objective:"Collect what Angelo owed. You have invoice copies.", secret:"Audited Blue Flamingo. Noticed discrepancies but said nothing.",
      answers: {
        q1:"Main bar, all night. Plenty of people can confirm it. Had a conversation with Inspector Moreau around 9:50. Never went near the cellar.",
        q2:"Respected him more than most bosses I've worked for. He was straight with me.",
        q3:"Not from where I was standing. The bar's a good distance from the cellar.",
        q4:"At the bar, talking with Moreau. Solid on that one.",
        q5:"Not my department. I collect debts, I don't mix chemicals.",
        q6:"I know Angelo was building something. He asked me to sit on some numbers back in June — told me he was putting together a bigger case. I did what he asked.",
        q7:"I audited those accounts in June, at Angelo's request. Found invoices — real money, no real suppliers behind them. Whoever's running that skim, it's someone with signing authority close to the family. I'm not naming names yet — I want to see the documents on the table first.",
        q8:"He was watchful, careful with what he said. He trusted me enough to hand me a job he didn't want traced back to him. That tells you something.",
        q9:"Doesn't ring a bell by itself. But since we're laying evidence side by side — those Blue Flamingo invoices I mentioned? All three signed by Dom Caruso. Draw your own line from there.",
        q10:"I deal in facts, not speculation. The invoices are signed by Dom Caruso. That's not circumstantial. That's a signature.",
      } },
    c9:  { name:"Celeste Monroe",     avatar:"CM", role:"CIVILIAN",    position:"Society Journalist",  alibi:"Interviewing guests openly all evening. Notebook as proof.", objective:"Get the story. You were blackmailing Angelo over his affair.", secret:"You know about Lena. Angelo paid you — until last week.",
      answers: {
        q1:"Circulating the main hall all evening, champagne in hand, observing. Spoke with Inspector Moreau around 9:55 — he doesn't know I'm press.",
        q2:"I was investigating a separate story about Angelo — an allegation involving payments to Alderman Krebs. That's now considerably more complicated.",
        q3:"I watch rooms carefully — habit of the trade. Dom Caruso left the main hall around 9:50 and didn't return until roughly 10:18. Twenty-eight minutes. I noticed because it's exactly the kind of gap a story needs.",
        q4:"Right in the middle of Dom's absence, by my count.",
        q5:"Not my area of expertise.",
        q6:"I noted that Rosa Vitale was one of the last people to speak privately with Angelo before he disappeared. Make of that what you will.",
        q7:"No direct knowledge — but I'd be very interested to see those records myself.",
        q8:"He was paying off Alderman Krebs to keep this place running — two thousand a month. Unrelated to the murder, but it tells you the kind of pressure he was under generally.",
        q9:"I didn't see who it belongs to. But it's exactly the kind of detail a good notebook would already have noted.",
        q10:"Twenty-eight unaccounted-for minutes, an inspector whose investigation is designed to protect this family rather than solve anything, and a woman who spoke to the victim privately right before he vanished. I know where I'd look.",
      } },
    c10: { name:"Inspector Moreau",   avatar:"VM", role:"CIVILIAN",    position:"Corrupt Detective",   alibi:"Examining the barrel room from 10:22 PM. Official capacity.", objective:"Bungle the investigation. You are on the Syndicate's payroll.", secret:"Marchetti pays your mortgage. You will not find this killer.",
      answers: {
        q1:"I've been 'investigating' all evening — talked to nearly every guest in this room. Ask any of them. I was never out of sight for long.",
        q2:"Met him twice at family functions. Polite man. Knew exactly what I was and didn't hold it against me — which somehow made it worse.",
        q3:"No one specific. I was circulating, not watching the cellar.",
        q4:"Talking to Aldo Benedetti, if memory serves — around then, at least.",
        q5:"The toxicology report is genuine, for what it's worth — Dr. Faust doesn't adjust his findings for anyone. Pharmaceutical grade arsenic. That's not something you pick up on a street corner. Someone with money and the right connections got their hands on it.",
        q6:"I've heard whispers Angelo was building something. Wasn't briefed on details.",
        q7:"There's a pharmacist — Sal Greco — with a flagged history of irregular arsenic dispensing. And there's an account at the Blue Flamingo under the name 'Greco Medical.' I flagged that account eighteen months ago and was told to drop it. I'm not dropping it tonight.",
        q8:"Not that he told me directly. But I clocked something odd earlier — that reporter, Celeste Monroe, isn't who she says she is. I've been sitting on that.",
        q9:"Doesn't ring a bell. But I'd want to know who was near that door between nine and ten-thirty.",
        q10:"I was told before tonight to point this at Aldo Benedetti. I'm done doing that. The evidence — the toxicology, the account, the timeline — it all sits on one man. Dom Caruso.",
      } },
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

  // True if the scoped player (read+update) key has been filled in
  playerKeyConfigured: () => JSONBIN_PLAYER_KEY !== "PASTE_YOUR_PLAYER_UPDATE_KEY_HERE",

  // Retrieve write key from admin localStorage only (never from this file)
  getWriteKey: () => {
    try { return localStorage.getItem("syndicate-master-key") || ""; } catch { return ""; }
  },

  writeConfigured() {
    return this.readConfigured() && this.getWriteKey().length > 10;
  },

  // ── READ (uses safe public read-only key, falls back to cache) ──
  async read() {
    if (!this.readConfigured()) {
      try {
        const raw = localStorage.getItem("syndicate-gamestate");
        return raw ? JSON.parse(raw) : { ...SEED_STATE };
      } catch { return { ...SEED_STATE }; }
    }
    const record = await this.tryReadRemote();
    if (record) {
      try { localStorage.setItem("syndicate-gamestate", JSON.stringify(record)); } catch {}
      return record;
    }
    console.warn("JSONbin read failed, using localStorage");
    try {
      const raw = localStorage.getItem("syndicate-gamestate");
      return raw ? JSON.parse(raw) : { ...SEED_STATE };
    } catch { return { ...SEED_STATE }; }
  },

  // ── READ, no fallback — returns null on any failure. Use this when
  //    silently substituting seed/cached data would be actively wrong
  //    (e.g. the admin portal deciding whether real progress exists). ──
  async tryReadRemote() {
    if (!this.readConfigured()) return null;
    try {
      const res = await fetch(`${JSONBIN_URL}/latest`, {
        headers: { "X-Access-Key": JSONBIN_READ_KEY }
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.record || null;
    } catch { return null; }
  },

  // ── WRITE (uses master key from admin localStorage only) ─────────
  //    Full-state overwrite. Only the admin portal should call this —
  //    it has no merge logic, so it will stomp on concurrent changes.
  async write(state) {
    // Always cache locally
    try { localStorage.setItem("syndicate-gamestate", JSON.stringify(state)); } catch {}

    const writeKey = this.getWriteKey();
    if (!writeKey) return true; // no admin key on this device — local cache only

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

  // ── PLAYER-SIDE MUTATIONS ─────────────────────────────────────────
  //    Player devices never hold the Master Key. Instead these re-fetch
  //    the latest remote record (shrinking the window for two players'
  //    writes to race each other), apply a small mutation, and PUT with
  //    the scoped player key (X-Access-Key, Update permission only).
  async _mutateRemote(mutator) {
    let state = (await this.tryReadRemote()) || (await this.read());
    state = mutator(state) || state;
    try { localStorage.setItem("syndicate-gamestate", JSON.stringify(state)); } catch {}

    if (!this.playerKeyConfigured()) {
      console.warn("JSONBIN_PLAYER_KEY not configured — change is cached locally only and will not reach other devices.");
      return true;
    }
    try {
      const res = await fetch(JSONBIN_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Key": JSONBIN_PLAYER_KEY,
          "X-Bin-Versioning": "false"
        },
        body: JSON.stringify(state)
      });
      return res.ok;
    } catch(e) {
      console.warn("Player write failed:", e.message);
      return false;
    }
  },

  // Marks a player joined (by their game code) in the shared state.
  async markJoined(code) {
    return this._mutateRemote(state => {
      const p = getPlayerByCode(state, code);
      if (p) { p.joined = true; p.lastSeen = new Date().toISOString(); }
      return state;
    });
  },

  // Records one player's vote for the current round in the shared state.
  async submitVote(code, round, charId) {
    return this._mutateRemote(state => {
      const p = getPlayerByCode(state, code);
      if (!p) return state;
      if (!state.votes) state.votes = {};
      if (!state.votes[round]) state.votes[round] = {};
      state.votes[round][p.id] = charId;
      return state;
    });
  },

  // ── POLL (read-only, safe for all pages) ───────────────────────
  poll(callback, interval = POLL_INTERVAL) {
    let lastHash = "";
    const tick = async () => {
      const state = await this.read();
      // Hash the whole record — a partial field list (round/clues/voting/
      // eliminated) previously missed gamePhase/winner, so the Round 5
      // game-over reveal could go out with nothing to trigger a re-render.
      const hash = JSON.stringify(state);
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

// Interrogation questions for a character, in bank order, each tagged with
// whether it's unlocked yet (round <= current round) and, only if so, this
// character's answer. Locked questions come back with answer:null so the UI
// can show the prompt greyed out without ever leaking the answer early.
function getQuestionsForCharacter(state, charId) {
  const round = state.currentRound || 0;
  const char = state.characters[charId];
  return (state.questionBank || []).map(q => {
    const unlocked = round >= q.round;
    return { ...q, unlocked, answer: unlocked ? (char?.answers?.[q.id] || "") : null };
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

// ── Pure-JS QR Code generator (no external library) ──────────────
// Implements full QR spec: Reed-Solomon ECC, byte mode encoding,
// finder/timing/alignment/format patterns, zigzag placement, masking.
// Shared by the admin portal (invite cards) and the screen page (lobby
// join QR) — kept in one place so both stay byte-for-byte identical.
function buildQRMatrix(text) {
  // GF(256) lookup tables
  const EXP=new Uint8Array(512), LOG=new Uint8Array(256);
  let gx=1;
  for(let i=0;i<255;i++){ EXP[i]=gx; LOG[gx]=i; gx<<=1; if(gx&256)gx^=285; }
  for(let i=255;i<512;i++) EXP[i]=EXP[i-255];
  const gmul=(a,b)=>a&&b?EXP[LOG[a]+LOG[b]]:0;

  function genpoly(n){ let p=[1]; for(let i=0;i<n;i++){ const q=[1,EXP[i]]; const r=new Array(p.length+q.length-1).fill(0); for(let a=0;a<p.length;a++) for(let b=0;b<q.length;b++) r[a+b]^=gmul(p[a],q[b]); p=r; } return p; }
  function rsencode(data,n){ const gen=genpoly(n); const d=new Uint8Array(data.length+n); d.set(data); for(let i=0;i<data.length;i++){ const c=d[i]; if(c) for(let j=0;j<gen.length;j++) d[i+j]^=gmul(gen[j],c); } return d.slice(data.length); }

  // Byte-mode data
  const bytes=[]; for(let i=0;i<text.length;i++) bytes.push(text.charCodeAt(i)&0xFF);
  const len=bytes.length;

  // Version config (ECC level M): N=matrix size, totalDC=data codewords,
  // ecpb=ECC codewords/block, nb1/dc1=blocks of size dc1, nb2/dc2=blocks of size dc2
  const VCFG=[null,
    {N:21,totalDC:16,ecpb:10,nb1:1,dc1:16,nb2:0,dc2:0},
    {N:25,totalDC:28,ecpb:16,nb1:1,dc1:28,nb2:0,dc2:0},
    {N:29,totalDC:44,ecpb:26,nb1:1,dc1:44,nb2:0,dc2:0},
    {N:33,totalDC:64,ecpb:18,nb1:2,dc1:32,nb2:0,dc2:0},
    {N:37,totalDC:86,ecpb:24,nb1:2,dc1:43,nb2:0,dc2:0},
    {N:41,totalDC:108,ecpb:16,nb1:4,dc1:27,nb2:0,dc2:0},
    {N:45,totalDC:124,ecpb:18,nb1:4,dc1:31,nb2:0,dc2:0},
  ];
  // Max data bytes per version at ECC-M
  const CAPS=[0,6,11,22,36,50,66,81];
  let version=1; while(version<7 && CAPS[version]<len+3) version++;
  if(version>7) throw new Error("Text too long");
  const cfg=VCFG[version];

  // Build bit stream
  const bits=[];
  const pn=(v,l)=>{ for(let i=l-1;i>=0;i--) bits.push((v>>i)&1); };
  pn(0b0100,4); pn(len,8); bytes.forEach(b=>pn(b,8));
  for(let i=0;i<4&&bits.length<cfg.totalDC*8;i++) bits.push(0);
  while(bits.length%8) bits.push(0);
  const dc=[]; for(let i=0;i<bits.length;i+=8){ let b=0; for(let j=0;j<8;j++) b=(b<<1)|(bits[i+j]||0); dc.push(b); }
  const PAD=[236,17]; let pi=0; while(dc.length<cfg.totalDC) dc.push(PAD[pi++%2]);

  // Build data/ECC blocks and interleave
  const dataBlocks=[], eccBlocks=[]; let pos=0;
  for(let i=0;i<cfg.nb1;i++){ dataBlocks.push(dc.slice(pos,pos+cfg.dc1)); pos+=cfg.dc1; }
  for(let i=0;i<cfg.nb2;i++){ dataBlocks.push(dc.slice(pos,pos+cfg.dc2)); pos+=cfg.dc2; }
  dataBlocks.forEach(b=>eccBlocks.push(rsencode(new Uint8Array(b),cfg.ecpb)));
  const final=[]; const maxDC=Math.max(cfg.dc1,cfg.dc2||0);
  for(let i=0;i<maxDC;i++) dataBlocks.forEach(b=>{ if(i<b.length) final.push(b[i]); });
  for(let i=0;i<cfg.ecpb;i++) eccBlocks.forEach(b=>final.push(b[i]));
  const finalBits=[]; final.forEach(b=>{ for(let i=7;i>=0;i--) finalBits.push((b>>i)&1); });
  const REM=[0,0,7,7,7,7,7,0]; for(let i=0;i<(REM[version]||0);i++) finalBits.push(0);

  // Build matrix (null=empty, -1=reserved format, 0=light, 1=dark)
  const SZ=cfg.N;
  const MAT=Array.from({length:SZ},()=>new Array(SZ).fill(null));
  const setM=(r,c,v)=>{ if(r>=0&&r<SZ&&c>=0&&c<SZ&&MAT[r][c]===null) MAT[r][c]=v; };
  const setF=(r,c,v)=>{ if(r>=0&&r<SZ&&c>=0&&c<SZ) MAT[r][c]=v; };

  // Finder pattern + separator
  function drawFinder(tr,tc){
    for(let r=0;r<7;r++) for(let c=0;c<7;c++)
      setF(tr+r,tc+c,(r===0||r===6||c===0||c===6||(r>=2&&r<=4&&c>=2&&c<=4))?1:0);
    for(let k=-1;k<=7;k++){ setM(tr+7,tc+k,0); setM(tr-1,tc+k,0); setM(tr+k,tc+7,0); setM(tr+k,tc-1,0); }
  }
  drawFinder(0,0); drawFinder(0,SZ-7); drawFinder(SZ-7,0);

  // Timing strips
  for(let i=8;i<SZ-8;i++){ setM(6,i,i%2===0?1:0); setM(i,6,i%2===0?1:0); }

  // Dark module
  setM(SZ-8,8,1);

  // Alignment patterns
  const APOS={2:[6,18],3:[6,22],4:[6,26],5:[6,30],6:[6,34],7:[6,22,38]};
  // Skip a candidate center only if it genuinely overlaps a FINDER pattern's
  // footprint — not merely "already occupied", since the timing pattern
  // (drawn above) also occupies row/col 6, which every alignment pattern's
  // first coordinate always equals. Alignment patterns are meant to override
  // the timing pattern where they legitimately fall on it.
  const FINDER_CORNERS=[[0,0],[0,SZ-7],[SZ-7,0]];
  function overlapsFinder(r,c){
    return FINDER_CORNERS.some(([tr,tc])=>r>=tr-1&&r<=tr+7&&c>=tc-1&&c<=tc+7);
  }
  if(version>=2){
    const pts=APOS[version];
    for(let ai=0;ai<pts.length;ai++) for(let aj=0;aj<pts.length;aj++){
      const r=pts[ai],c=pts[aj];
      if(overlapsFinder(r,c)) continue;
      for(let dr=-2;dr<=2;dr++) for(let dc2=-2;dc2<=2;dc2++)
        setF(r+dr,c+dc2,(Math.abs(dr)===2||Math.abs(dc2)===2||(dr===0&&dc2===0))?1:0);
    }
  }

  // Reserve format info areas
  for(let i=0;i<=8;i++){ if(MAT[8][i]===null) MAT[8][i]=-1; if(MAT[i][8]===null) MAT[i][8]=-1; }
  for(let i=0;i<8;i++){ if(MAT[SZ-1-i][8]===null) MAT[SZ-1-i][8]=-1; if(MAT[8][SZ-1-i]===null) MAT[8][SZ-1-i]=-1; }

  // Reserve version info areas (required version >= 7 — two 6x3 blocks,
  // one left of the top-right finder, one above the bottom-left finder)
  if(version>=7){
    for(let i=0;i<18;i++){
      const row=Math.floor(i/3), col=(i%3)+SZ-11;
      setF(row,col,-1); setF(col,row,-1);
    }
  }

  // Mask functions
  const MASKS=[
    (r,c)=>(r+c)%2===0,(r,c)=>r%2===0,(r,c)=>c%3===0,(r,c)=>(r+c)%3===0,
    (r,c)=>(Math.floor(r/2)+Math.floor(c/3))%2===0,(r,c)=>(r*c)%2+(r*c)%3===0,
    (r,c)=>((r*c)%2+(r*c)%3)%2===0,(r,c)=>((r+c)%2+(r*c)%3)%2===0,
  ];

  // Zigzag data placement (correct upward/downward direction per column pair)
  function placeData(maskFn){
    const tmp=MAT.map(r=>[...r]);
    let bi=0, goUp=true, col=SZ-1;
    while(col>=1){
      if(col===6) col--;
      for(let vi=0;vi<SZ;vi++){
        const r=goUp?SZ-1-vi:vi;
        for(let dx=0;dx<2;dx++){
          const c=col-dx;
          if(c<0||c>=SZ||tmp[r][c]!==null) continue;
          const bit=bi<finalBits.length?finalBits[bi++]:0;
          tmp[r][c]=bit^(maskFn(r,c)?1:0);
        }
      }
      goUp=!goUp; col-=2;
    }
    return tmp;
  }

  // Penalty scoring
  function penalty(mat){
    let p=0;
    for(let r=0;r<SZ;r++){ let run=1; for(let c=1;c<SZ;c++){ if(mat[r][c]===mat[r][c-1]&&mat[r][c]!==null){run++;if(run===5)p+=3;else if(run>5)p++;}else run=1; }}
    for(let c=0;c<SZ;c++){ let run=1; for(let r=1;r<SZ;r++){ if(mat[r][c]===mat[r-1][c]&&mat[r][c]!==null){run++;if(run===5)p+=3;else if(run>5)p++;}else run=1; }}
    for(let r=0;r<SZ-1;r++) for(let c=0;c<SZ-1;c++) if(mat[r][c]!==null&&mat[r][c]===mat[r+1][c]&&mat[r][c]===mat[r][c+1]&&mat[r][c]===mat[r+1][c+1]) p+=3;
    return p;
  }

  let bestMat=null, bestPen=Infinity, bestMaskIdx=0;
  for(let m=0;m<8;m++){ const mat=placeData(MASKS[m]); const pen=penalty(mat); if(pen<bestPen){bestPen=pen;bestMat=mat;bestMaskIdx=m;} }

  // Format info (ECC level indicator bits: L=01, M=00, Q=11, H=10 — this
  // generator always uses ECC level M, so the indicator is 00, not 01).
  const fmtRaw=(0b00<<3)|bestMaskIdx;
  let fmtRem=fmtRaw<<10;
  const FMTPOLY=0b10100110111;
  for(let i=14;i>=10;i--) if(fmtRem&(1<<i)) fmtRem^=FMTPOLY<<(i-10);
  const fmtFull=((fmtRaw<<10)|(fmtRem&0x3FF))^0b101010000010010;
  const fb=(i)=>(fmtFull>>i)&1;
  const FC1=[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]];
  FC1.forEach(([r,c],i)=>bestMat[r][c]=fb(14-i));
  for(let i=0;i<7;i++) bestMat[SZ-1-i][8]=fb(i);
  for(let i=7;i<15;i++) bestMat[8][SZ-15+i]=fb(i);
  bestMat[SZ-8][8]=1;

  // Version info (required version >= 7): 6 data bits (version number) +
  // 12 BCH error-correction bits, written into the two reserved blocks.
  if(version>=7){
    let verRem=version<<12;
    const VERPOLY=0b1111100100101; // degree-12 generator
    for(let i=17;i>=12;i--) if(verRem&(1<<i)) verRem^=VERPOLY<<(i-12);
    const verBits=(version<<12)|(verRem&0xFFF);
    for(let i=0;i<18;i++){
      const row=Math.floor(i/3), col=(i%3)+SZ-11;
      const v=(verBits>>i)&1;
      bestMat[row][col]=v; bestMat[col][row]=v;
    }
  }

  return {matrix:bestMat, size:SZ};
}

// Renders a QR matrix straight to an SVG markup string — for the plain
// vanilla-JS pages (join/play/screen) that don't have React available.
function qrMatrixToSvg(text, { size=120, fgColor="#000000", bgColor="#FFFFFF" } = {}) {
  let result;
  try { result = buildQRMatrix(text); } catch(e) { return null; }
  const { matrix, size: N } = result;
  const cell = size / N;
  let rects = "";
  for (let r=0; r<N; r++) for (let c=0; c<N; c++) {
    if (matrix[r][c] === 1) rects += `<rect x="${c*cell}" y="${r*cell}" width="${cell+0.5}" height="${cell+0.5}" fill="${fgColor}"/>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="${bgColor}"/>${rects}</svg>`;
}
