(function () {
  const KEY = "dominion-meta-v1";
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function save(meta) { localStorage.setItem(KEY, JSON.stringify(meta)); }
  function meta() {
    const m = load();
    if (!m.cards) m.cards = { "forge-lookout": 2 };
    if (!m.nfts) m.nfts = [];
    if (!m.redeemed) m.redeemed = [];
    if (!m.requests) m.requests = [];
    if (!m.utilities) m.utilities = 1;
    for (let i = 0; i < m.utilities; i++) {
      const id = utilities[i][0];
      if (m.cards[id] == null) m.cards[id] = 1;
    }
    if (!m.captures) m.captures = 0;
    if (!m.missions) m.missions = {};
    save(m);
    return m;
  }

  const decks = [
    {
      id: "forge", name: "Frontline Forge", intro: true,
      story: "Valenreach is shattered by the Iron Accord. You lead a battered vanguard, scavenging gear and rallying broken battalions.",
      prize: "Grand Coalition Seal",
      collections: [
        { id: "scout-regiment", name: "Scout Regiment", prize: "Recon Vanguard", cards: [
          ["forge-lookout", "Lookout", "Watches the border."],
          ["forge-outrider", "Outrider", "Rides ahead of the line."],
          ["forge-signal", "Signal Runner", "Carries the next order."],
          ["forge-trap", "Trapmaker", "Leaves the path unsafe.", true, "relay"]
        ]},
        { id: "artillery", name: "Artillery Battery", prize: "Bombardment Deck", cards: [
          ["forge-spotter", "Spotter", "Marks the far hex."],
          ["forge-powder", "Powder Cart", "Keeps the guns fed."],
          ["forge-mortar", "Mortar Crew", "Lobs over the wall."],
          ["forge-siege", "Siege Captain", "Calls the volley.", true, "fifteen"]
        ]},
        { id: "shieldwall", name: "Ironclad Shieldwall", prize: "Bastion Deck", cards: [
          ["forge-squire", "Squire", "Holds the spare shield."],
          ["forge-tower", "Tower Shield", "Stops one clean hit."],
          ["forge-banner", "Banner Bearer", "Keeps the line facing."],
          ["forge-knight", "Vanguard Knight", "Will not yield the hex.", true, "win"]
        ]}
      ]
    },
    {
      id: "ash", name: "Ashriver Crossing",
      story: "The ford is on fire. You build a way across while the bank archers keep the Accord off the rope.",
      prize: "Ashriver Banner",
      collections: [
        { id: "ford", name: "Ford Wardens", prize: "Ford Rights", cards: [
          ["ash-wader", "Wader", "Finds the shallow."],
          ["ash-rope", "Ropehand", "Holds the guide line."],
          ["ash-keel", "Keel Guard", "Walks the deep side."],
          ["ash-captain", "Ford Captain", "Decides when to cross.", true, "relay"]
        ]},
        { id: "raft", name: "Raftwrights", prize: "Current Rights", cards: [
          ["ash-tar", "Tar Barrel", "Seals the seams."],
          ["ash-plank", "Plank Bearer", "Lays the next board."],
          ["ash-current", "Current Reader", "Reads the black water."],
          ["ash-raft", "Raft Master", "Launches at dusk.", true, "fifteen"]
        ]},
        { id: "bank", name: "Bank Fire", prize: "Ember Standard", cards: [
          ["ash-bow", "Ember Bow", "Shoots from the reeds."],
          ["ash-smoke", "Smoke Pot", "Hides the crossing."],
          ["ash-archer", "Bank Archer", "Owns the near shore."],
          ["ash-sergeant", "Ash Sergeant", "Keeps the volley even.", true, "wipe"]
        ]}
      ]
    },
    {
      id: "night", name: "Night Signal",
      story: "After dark the column follows a glass beacon. Do not light the ridge.",
      prize: "Black Frequency",
      collections: [
        { id: "lantern", name: "Lantern Line", prize: "Beacon Charter", cards: [
          ["night-wick", "Wick", "A small, covered flame."],
          ["night-shade", "Glass Shade", "Keeps the light off the sky."],
          ["night-oil", "Oil Runner", "Feeds the next post."],
          ["night-lamp", "Lantern Captain", "Sets the path.", true, "relay"]
        ]},
        { id: "knives", name: "Quiet Knives", prize: "Night Major's Knot", cards: [
          ["night-shadeknife", "Shade", "Moves when the hex is empty."],
          ["night-wire", "Wire", "Closes a path behind you."],
          ["night-listener", "Listener", "Hears the next patrol."],
          ["night-major", "Night Major", "Calls the silent advance.", true, "win"]
        ]},
        { id: "cipher", name: "Cipher Tent", prize: "Cryptarch Page", cards: [
          ["night-ink", "Ink", "Writes what the scouts saw."],
          ["night-code", "Code Strip", "A line only your side reads."],
          ["night-runner", "Cipher Runner", "Carries it to camp."],
          ["night-crypt", "Cryptarch", "Breaks the Accord marks.", true, "fifteen"]
        ]}
      ]
    },
    {
      id: "glass", name: "Glass Foundry",
      story: "Futuret3Ch cuts relay glass in a midnight forge. Filament, gold wire, then the vault seal.",
      prize: "Foundry Seal",
      collections: [
        { id: "crucible", name: "Crucible Shift", prize: "Heat Mark", cards: [
          ["glass-sand", "Sandhand", "Feeds the melt."],
          ["glass-bellows", "Bellows", "Keeps the crucible awake."],
          ["glass-mold", "Mold", "Shapes the next hex."],
          ["glass-warden", "Furnace Warden", "Owns the heat.", true, "relay"]
        ]},
        { id: "relay", name: "Relay Cutters", prize: "Gold Wire Spool", cards: [
          ["glass-filament", "Filament", "A thread of teal light."],
          ["glass-spool", "Spool", "Holds the spare length."],
          ["glass-wire", "Gold Wire", "Pays the relay."],
          ["glass-smith", "Relay Smith", "Sets the diamond.", true, "fifteen"]
        ]},
        { id: "vault", name: "Vault Glass", prize: "Vault Keeper Key", cards: [
          ["glass-shard", "Shard", "One pane of the seal."],
          ["glass-seal", "Seal", "Closes the chest."],
          ["glass-ledger", "Ledger", "Writes what was earned."],
          ["glass-keeper", "Vault Keeper", "Opens it for T3X.", true, "win"]
        ]}
      ]
    },
    {
      id: "crimson", name: "Crimson March",
      story: "You take Accord steel and turn it around. Shock troops, a siege train, then their own standard.",
      prize: "Broken Accord",
      collections: [
        { id: "shock", name: "Shock Troop", prize: "Shock Colors", cards: [
          ["red-pike", "Pike", "The first step into a hex."],
          ["red-drum", "Drum", "Sets the pace."],
          ["red-breaker", "Breaker", "Hits for the gap."],
          ["red-captain", "Shock Captain", "Spends the unit.", true, "wipe"]
        ]},
        { id: "train", name: "Siege Train", prize: "Ram Rights", cards: [
          ["red-wheel", "Wheel", "The gun moves one hex."],
          ["red-ram", "Ram", "Asks the wall to move."],
          ["red-oil", "Oil", "A mean, bright answer."],
          ["red-master", "Train Master", "Keeps the column straight.", true, "fifteen"]
        ]},
        { id: "accord", name: "Accord Standard", prize: "Claw Banner", cards: [
          ["red-claw", "Claw", "Their mark, now yours."],
          ["red-banner", "Accord Banner", "Turned to face them."],
          ["red-oath", "Oath", "A promise you did not make."],
          ["red-marshal", "Accord Marshal", "The officer who stayed.", true, "win"]
        ]}
      ]
    },
    {
      id: "crown", name: "Crown of Highgate",
      story: "The fortress at the end of the road. Gate ghosts, the Dread Legion, then the last watch.",
      prize: "Highgate Crown",
      collections: [
        { id: "gate", name: "Gate Ghosts", prize: "Portcullis Key", cards: [
          ["crown-hinge", "Hinge", "The gate still swings."],
          ["crown-hole", "Murder Hole", "They shoot straight down."],
          ["crown-port", "Portcullis", "Iron between you and the yard."],
          ["crown-wraith", "Gate Wraith", "The guard who never left.", true, "relay"]
        ]},
        { id: "dread", name: "Dread Legion", prize: "Silence Horn", cards: [
          ["crown-bone", "Bone Standard", "Their answer to a banner."],
          ["crown-pike", "Dread Pike", "Longer than your line."],
          ["crown-horn", "Silence Horn", "Ends the shout."],
          ["crown-lord", "Legion Lord", "Holds the inner ward.", true, "wipe"]
        ]},
        { id: "watch", name: "Last Watch", prize: "Crown Bearer", cards: [
          ["crown-bell", "Dawn Bell", "The siege is almost over."],
          ["crown-cloak", "White Cloak", "The watch that stayed."],
          ["crown-stone", "Oathstone", "Say the line, take the fort."],
          ["crown-bearer", "Crown Bearer", "Walks the last hex.", true, "win"]
        ]}
      ]
    }
  ];

  const utilities = [
    ["power-ration", "Field Ration", "A meal for the line."],
    ["power-scrap", "Scrap Charge", "Enough Energy for a scout."],
    ["power-relay", "Relay Tap", "The diamond pays early."],
    ["power-oil", "Night Oil", "Data for one repair."],
    ["power-barrel", "Spare Barrel", "Powder you did not spend."],
    ["power-map", "Map Scrap", "Shows the next open hex."],
    ["power-cloth", "Banner Cloth", "The line holds shape."],
    ["power-coal", "Forge Coal", "Heat for the foundry."],
    ["power-flare", "Signal Flare", "One bright, honest mark."],
    ["power-medic", "Medic Kit", "Puts health back on a unit."],
    ["power-pin", "Siege Pin", "Keeps a gun where you set it."],
    ["power-coin", "Oath Coin", "A promise worth 1 T3X later."]
  ];

  function allCards() {
    const out = [];
    decks.forEach(d => d.collections.forEach(c => c.cards.forEach(card => {
      out.push({ id: card[0], name: card[1], line: card[2], gold: !!card[3], mission: card[4] || "", deck: d.name, collection: c.name, collectionId: c.id, prize: c.prize });
    })));
    return out;
  }
  function cardById(id) { return allCards().find(c => c.id === id); }

  function missionReady(key) {
    const m = meta();
    if (m.missions && m.missions[key]) return true;
    const S = window.Game && Game.S;
    if (!S) return false;
    const tiles = Object.values(S.tiles);
    const mine = tiles.filter(t => t.owner === "player").length;
    const relays = tiles.filter(t => t.relay && t.owner === "player").length;
    const enemyUnits = Object.values(S.units).filter(u => u.side === "enemy").length;
    if (key === "fifteen" && mine >= 15) return true;
    if (key === "relay" && relays > 0) return true;
    if (key === "wipe" && enemyUnits === 0 && S.turn > 1) return true;
    if (key === "win" && S.winner === "player") return true;
    return false;
  }
  function stampMissions() {
    const m = meta();
    ["fifteen", "relay", "wipe", "win"].forEach(k => { if (missionReady(k)) m.missions[k] = true; });
    save(m);
  }

  function grantNext() {
    const m = meta();
    const next = allCards().find(c => !c.gold && !(m.cards[c.id] > 0));
    if (!next) return null;
    m.cards[next.id] = (m.cards[next.id] || 0) + 1;
    save(m);
    checkPrizes();
    return next;
  }

  function checkPrizes() {
    const m = meta();
    decks.forEach(d => {
      d.collections.forEach(c => {
        const done = c.cards.every(card => (m.cards[card[0]] || 0) > 0);
        const id = "nft-" + c.id;
        if (done && !m.nfts.some(n => n.id === id)) m.nfts.push({ id, name: c.prize, deck: d.name, kind: "collection" });
      });
      const deckDone = d.collections.every(c => c.cards.every(card => (m.cards[card[0]] || 0) > 0));
      const id = "nft-deck-" + d.id;
      if (deckDone && !m.nfts.some(n => n.id === id)) m.nfts.push({ id, name: d.prize, deck: d.name, kind: "deck" });
    });
    save(m);
  }

  function onCapture() {
    const m = meta();
    m.captures = (m.captures || 0) + 1;
    if (m.utilities < utilities.length && m.captures % 3 === 0) {
      m.utilities += 1;
      const u = utilities[m.utilities - 1];
      m.cards[u[0]] = (m.cards[u[0]] || 0) + 1;
    }
    save(m);
    stampMissions();
    let got = null;
    if (m.captures % 2 === 0) got = grantNext();
    checkPrizes();
    if (got && Game.S) {
      Game.S.flash = "Salvaged " + got.name + ". It is in your " + got.collection + ".";
    }
  }
  function onWin() { stampMissions(); checkPrizes(); }

  function buy(id) {
    const card = cardById(id); if (!card) return "Missing card.";
    const m = meta();
    const cost = card.gold ? 10 : 3;
    if ((m.t3xHeld || 0) < cost) return "You need " + cost + " T3X. The earn bar is still filling.";
    m.t3xHeld -= cost;
    m.cards[id] = (m.cards[id] || 0) + 1;
    save(m);
    checkPrizes();
    if (window.paintEarn) paintEarn();
    return "Bought " + card.name + " for " + cost + " T3X.";
  }
  function send(id) {
    const m = meta();
    if ((m.cards[id] || 0) <= 1) return null;
    m.cards[id] -= 1;
    const code = "T3X-" + id + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    save(m);
    return code;
  }
  function receive(code) {
    const m = meta();
    const clean = (code || "").trim().toUpperCase();
    const match = clean.match(/^T3X-(.+)-([A-Z0-9]{4})$/);
    if (!match) return "That code is not a card.";
    if (m.redeemed.indexOf(clean) >= 0) return "This device already took that card.";
    const card = cardById(match[1].toLowerCase());
    if (!card) return "Unknown card.";
    m.redeemed.push(clean);
    m.cards[card.id] = (m.cards[card.id] || 0) + 1;
    save(m);
    checkPrizes();
    return "Received " + card.name + ".";
  }

  function mount(root) {
    if (!root) return;
    const m = meta();
    const held = m.t3xHeld || 0;
    root.innerHTML = '<p class="muted">Intro collection is Frontline Forge. Normal cards are 3 T3X. Gold cards are 10 T3X, or a mission. Send a card only when you hold more than one. A finished collection reserves an exclusive NFT until the vault can mint it.</p>'
      + '<p class="muted">You hold <b>' + held + '</b> T3X on this device.</p>'
      + '<div class="row"><input id="recvCode" placeholder="T3X code" style="flex:1;min-height:44px;border-radius:12px;border:1px solid var(--line);background:#07090c;color:inherit;padding:0 10px"><button type="button" id="recvBtn">Receive</button></div>'
      + '<p class="muted" id="recvNote"></p>'
      + '<div class="stack" id="deckList"></div>'
      + (m.nfts.length ? '<h3>Prizes</h3><div class="stack">' + m.nfts.map(n => '<article class="box"><b>' + n.name + '</b><p class="muted">Exclusive NFT · ' + n.deck + ' · reserved on this device</p></article>').join("") + '</div>' : '');
    root.querySelector("#recvBtn").onclick = () => {
      root.querySelector("#recvNote").textContent = receive(root.querySelector("#recvCode").value);
      mount(root);
    };
    const list = root.querySelector("#deckList");
    decks.forEach(d => {
      const owned = d.collections.reduce((n, c) => n + c.cards.filter(card => (m.cards[card[0]] || 0) > 0).length, 0);
      const total = d.collections.reduce((n, c) => n + c.cards.length, 0);
      const el = document.createElement("article");
      el.className = "box";
      el.innerHTML = '<button type="button" class="wide" style="border:0;background:transparent;padding:0;text-align:left"><b>' + d.name + (d.intro ? ' · intro' : '') + '</b><span class="muted" style="display:block">' + owned + ' / ' + total + ' cards · prize ' + d.prize + '</span></button><div class="colbody" hidden></div>';
      const body = el.querySelector(".colbody");
      el.querySelector("button").onclick = () => {
        body.hidden = !body.hidden;
        if (!body.hidden && !body.childElementCount) paintDeck(body, d);
      };
      list.appendChild(el);
    });
    const reqTitle = document.createElement("h3");
    reqTitle.textContent = "Friend requests";
    root.appendChild(reqTitle);
    const reqHost = document.createElement("div");
    reqHost.className = "stack";
    root.appendChild(reqHost);
    paintRequests(reqHost);
  }
  function paintDeck(body, d) {
    const m = meta();
    body.innerHTML = '<p class="muted">' + d.story + '</p>';
    d.collections.forEach(c => {
      const have = c.cards.filter(card => (m.cards[card[0]] || 0) > 0).length;
      const wrap = document.createElement("div");
      wrap.innerHTML = '<p><b>' + c.name + '</b> <span class="muted">' + have + '/' + c.cards.length + ' · ' + c.prize + '</span></p>';
      c.cards.forEach(card => {
        const count = m.cards[card[0]] || 0;
        const gold = !!card[3];
        const row = document.createElement("div");
        row.className = "slot";
        const mission = gold && !m.missions[card[4]] ? "Mission still open. " : "";
        row.innerHTML = '<div><b>' + card[1] + (gold ? ' · gold' : '') + '</b><div class="muted">You hold ' + count + '. ' + mission + card[2] + '</div></div>';
        const actions = document.createElement("div");
        const buyBtn = document.createElement("button");
        buyBtn.type = "button";
        buyBtn.textContent = gold ? "10 T3X" : "3 T3X";
        buyBtn.onclick = () => { alert(buy(card[0])); mount(document.getElementById("colRoot")); };
        actions.appendChild(buyBtn);
        if (count > 1) {
          const sendBtn = document.createElement("button");
          sendBtn.type = "button";
          sendBtn.textContent = "Send";
          sendBtn.onclick = () => {
            const code = send(card[0]);
            mount(document.getElementById("colRoot"));
            const note = document.getElementById("recvNote");
            if (note && code) note.textContent = "Send this code. You still hold one. " + code;
          };
          actions.appendChild(sendBtn);
        }
        row.appendChild(actions);
        wrap.appendChild(row);
      });
      body.appendChild(wrap);
    });
  }

  let openKind = "power";
  function countOf(id) { return (meta().cards[id] || 0); }
  function unitCount(kind) {
    if (!Game.S) return 0;
    return Object.values(Game.S.units).filter(u => u.side === "player" && u.kind === kind).length;
  }
  function useUtility(id) {
    const m = meta();
    if ((m.cards[id] || 0) < 1) return "You do not hold this card yet. Take land, or buy it.";
    const S = Game.S;
    if (!S || S.phase !== "play") return "Use this during your turn.";
    let msg = "";
    if (id === "power-ration") { S.energy.player += 8; msg = "Field Ration added 8 Energy."; }
    else if (id === "power-scrap") { S.energy.player += 20; msg = "Scrap Charge added 20 Energy."; }
    else if (id === "power-relay") {
      const n = Object.values(S.tiles).filter(t => t.relay && t.owner === "player").length;
      const g = 4 + n * 4; S.energy.player += g; msg = "Relay Tap added " + g + " Energy.";
    } else if (id === "power-oil") { S.data.player += 6; msg = "Night Oil added 6 Data."; }
    else if (id === "power-barrel") { S.energy.player += 10; msg = "Spare Barrel added 10 Energy."; }
    else if (id === "power-map") { msg = "Map Scrap: bright hexes are where you can walk. Grey land becomes yours."; }
    else if (id === "power-cloth") { S.energy.player += 4; msg = "Banner Cloth added 4 Energy."; }
    else if (id === "power-coal") { S.energy.player += 6; S.data.player += 2; msg = "Forge Coal added 6 Energy and 2 Data."; }
    else if (id === "power-flare") { S.energy.player += 2; msg = "Signal Flare added 2 Energy."; }
    else if (id === "power-medic") {
      const u = S.selectedId && S.units[S.selectedId];
      if (!u || u.side !== "player") return "Select one of your units, then use Medic Kit.";
      const st = Game.STATS[u.kind];
      u.hp = Math.min(st.hp, u.hp + 40);
      msg = "Medic Kit set " + st.name + " to " + u.hp + " health.";
    } else if (id === "power-pin") { S.energy.player += 6; msg = "Siege Pin added 6 Energy."; }
    else if (id === "power-coin") return "Oath Coin stays in the collection. It is not spent.";
    else return "This card is part of a collection. Finish the set for the prize.";
    if (id !== "power-coin") m.cards[id] -= 1;
    save(m);
    S.flash = msg;
    Game.draw();
    return msg;
  }
  function powerCards() {
    const S = Game.S;
    const m = meta();
    const cards = [
      { id: "energy", name: "Energy", kicker: "Builds units", countLabel: String(S.energy.player), ready: true, explain: "Energy pays for units. It does not repair. You collect more at the end of the turn for land and relays.", stats: [["You have", S.energy.player], ["Next payday", document.getElementById("energyNext").textContent || ""], ["Scout", "20"], ["Defender", "35"], ["Attacker", "50"], ["Artillery", "65"]], use: () => "Energy is spent when you build a unit. Pick one from the unit deck." },
      { id: "data", name: "Data", kicker: "Repairs only", countLabel: String(S.data.player), ready: true, explain: "Data is only for repairs. Select a damaged unit, then repair. It will not build anything.", stats: [["You have", S.data.player], ["Next payday", document.getElementById("dataNext").textContent || ""], ["Repair", "10 Data for 40 health"]], use: () => { if (window.Game) Game.repair(); return "Repair uses Data on the unit you selected."; } }
    ];
    utilities.forEach((u, i) => {
      const owned = i < m.utilities;
      const n = m.cards[u[0]] || 0;
      cards.push({ id: u[0], name: u[1], kicker: owned ? "Power" : "Still in the forge", countLabel: owned ? "Hold " + n : "Locked", ready: owned && n > 0, explain: u[2] + (owned ? " Using it spends one copy." : " Take more land and this card joins the deck."), stats: [["You hold", n], ["Deck", "Power"], ["Status", owned ? "Earned" : "Locked until you capture more land"]], gold: false, use: () => useUtility(u[0]) });
    });
    allCards().forEach(c => {
      const n = m.cards[c.id] || 0;
      cards.push({ id: c.id, name: c.name, kicker: c.collection, countLabel: n ? "Hold " + n : "Need", ready: n > 0, gold: c.gold, explain: c.line + " Part of " + c.collection + " in " + c.deck + "." + (c.gold ? " Gold. Earn it with a mission, or buy it for 10 T3X." : " Buy a copy for 3 T3X, or salvage it in battle."), stats: [["You hold", n], ["Deck", c.deck], ["Collection", c.collection], ["Prize", c.prize], ["Kind", c.gold ? "Gold" : "Normal"]], use: () => "Collection cards are kept, sent, or finished as a set. They are not spent on the map." });
    });
    cards.sort((a, b) => (a.ready === b.ready ? 0 : a.ready ? -1 : 1));
    return cards;
  }
  function unitCards() {
    const S = Game.S;
    return ["scout", "defender", "attacker", "artillery"].map(k => {
      const st = Object.assign({ kind: k }, Game.STATS[k]);
      const n = unitCount(k);
      const ready = S.energy.player >= st.cost && S.phase === "play";
      return { id: k, name: st.name, kicker: st.cost + " Energy", countLabel: n + " on the map", ready, explain: st.role, stats: [["You have on the map", n], ["Cost", st.cost + " Energy"], ["Health", st.hp], ["Hit", st.atk], ["Range", st.range], ["Walk", st.move]], use: () => { Game.build(k); document.getElementById("cascade").hidden = true; return "Tap your land to place the " + st.name + "."; } };
    }).sort((a, b) => (a.ready === b.ready ? 0 : a.ready ? -1 : 1));
  }
  function friendNames() {
    const m = meta();
    return (m.friends && m.friends.length) ? m.friends.slice() : ["Friend"];
  }
  function askCard(cardId, from) {
    const m = meta();
    const code = "T3X-ASK-" + cardId + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    m.requests.push({ id: code, from: from || "Friend", cardId, dir: "out", status: "open" });
    save(m);
    return code;
  }
  function addRequest(code, from) {
    const m = meta();
    const clean = (code || "").trim().toUpperCase();
    const match = clean.match(/^T3X-ASK-(.+)-([A-Z0-9]{4})$/);
    if (!match) return "That is not a request code.";
    if (m.requests.some(r => r.id === clean)) return "You already have this request.";
    const card = cardById(match[1].toLowerCase()) || utilities.find(u => u[0] === match[1].toLowerCase());
    const id = match[1].toLowerCase();
    if (!card && !utilities.some(u => u[0] === id)) return "Unknown card.";
    m.requests.push({ id: clean, from: (from || "Friend").slice(0, 24), cardId: id, dir: "in", status: "open" });
    save(m);
    return (from || "Friend") + " asked for " + (cardById(id) ? cardById(id).name : id) + ".";
  }
  function requestName(id) {
    const c = cardById(id);
    if (c) return c.name;
    const u = utilities.find(x => x[0] === id);
    return u ? u[1] : id;
  }
  function paintRequests(host) {
    host.innerHTML = "";
    const m = meta();
    const title = document.createElement("p");
    title.innerHTML = "<b>Friend requests</b>";
    host.appendChild(title);
    const incoming = (m.requests || []).filter(r => r.status === "open");
    if (!incoming.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No open requests. Ask from a card, or paste a friend's request code.";
      host.appendChild(empty);
    }
    incoming.forEach(r => {
      const row = document.createElement("div");
      row.className = "slot";
      const who = r.dir === "in" ? r.from + " wants" : "You asked for";
      row.innerHTML = "<div><b>" + who + " " + requestName(r.cardId) + "</b><div class='muted'>" + (r.dir === "in" ? "Send a spare if you hold more than one." : r.id) + "</div></div>";
      if (r.dir === "in") {
        const go = document.createElement("button");
        go.type = "button";
        go.textContent = "Send spare";
        go.onclick = () => {
          const code = send(r.cardId);
          const note = document.createElement("div");
          note.className = "muted";
          if (!code) note.textContent = "You can send only when you hold more than one.";
          else {
            r.status = "done";
            r.gift = code;
            save(meta());
            note.textContent = "Give them this code: " + code;
          }
          row.appendChild(note);
          if (code) paintRequests(host);
        };
        row.appendChild(go);
      }
      host.appendChild(row);
    });
    const form = document.createElement("div");
    form.className = "row";
    form.innerHTML = '<input id="askPaste" placeholder="Friend request code" style="flex:1;min-height:44px;border-radius:12px;border:1px solid var(--line);background:#07090c;color:inherit;padding:0 10px"><input id="askFrom" placeholder="Their name" style="width:96px;min-height:44px;border-radius:12px;border:1px solid var(--line);background:#07090c;color:inherit;padding:0 8px"><button type="button" id="askAdd">Add</button>';
    host.appendChild(form);
    form.querySelector("#askAdd").onclick = () => {
      const msg = addRequest(form.querySelector("#askPaste").value, form.querySelector("#askFrom").value);
      paintRequests(host);
      const p = document.createElement("p");
      p.className = "muted";
      p.textContent = msg;
      host.appendChild(p);
    };
  }
  function showDetail(card) {
    const box = document.getElementById("cardDetail");
    if (!box) return;
    box.hidden = false;
    box.innerHTML = "";
    const h = document.createElement("b");
    h.textContent = card.name;
    const p = document.createElement("p");
    p.textContent = card.explain;
    const note = document.createElement("p");
    note.className = "muted";
    const actions = document.createElement("div");
    actions.className = "actions";
    const use = document.createElement("button");
    use.type = "button"; use.textContent = "Use";
    use.onclick = () => { note.textContent = card.use ? card.use() : ""; };
    const view = document.createElement("button");
    view.type = "button"; view.textContent = "View";
    const stats = document.createElement("div");
    stats.className = "stats";
    stats.hidden = true;
    stats.innerHTML = card.stats.map(row => "<div class='row'><span>" + row[0] + "</span><b>" + row[1] + "</b></div>").join("");
    view.onclick = () => { stats.hidden = !stats.hidden; view.textContent = stats.hidden ? "View" : "Hide stats"; };
    actions.appendChild(use);
    actions.appendChild(view);
    if (card.id !== "energy" && card.id !== "data" && card.id !== "scout" && card.id !== "defender" && card.id !== "attacker" && card.id !== "artillery") {
      const sendBtn = document.createElement("button");
      sendBtn.type = "button"; sendBtn.textContent = "Send";
      const askBtn = document.createElement("button");
      askBtn.type = "button"; askBtn.textContent = "Ask a friend";
      const picks = document.createElement("div");
      picks.className = "asks";
      picks.hidden = true;
      sendBtn.onclick = () => {
        picks.hidden = false;
        picks.innerHTML = "";
        if (countOf(card.id) <= 1) {
          picks.textContent = "You can send only when you hold more than one.";
          return;
        }
        friendNames().forEach(name => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = name;
          b.onclick = () => {
            const code = send(card.id);
            note.textContent = code ? "Sent toward " + name + ". Give them " + code : "You need a spare.";
            openCascade(openKind);
          };
          picks.appendChild(b);
        });
      };
      askBtn.onclick = () => {
        picks.hidden = false;
        picks.innerHTML = "";
        friendNames().forEach(name => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = "Ask " + name;
          b.onclick = () => {
            const code = askCard(card.id, name);
            note.textContent = "Ask code for " + name + ": " + code + ". They add it under Friend requests.";
          };
          picks.appendChild(b);
        });
      };
      actions.appendChild(sendBtn);
      actions.appendChild(askBtn);
      box.appendChild(h); box.appendChild(p); box.appendChild(actions); box.appendChild(picks); box.appendChild(stats); box.appendChild(note);
    } else {
      box.appendChild(h); box.appendChild(p); box.appendChild(actions); box.appendChild(stats); box.appendChild(note);
    }
    const wants = (meta().requests || []).filter(r => r.status === "open" && r.dir === "in" && r.cardId === card.id);
    if (wants.length) {
      const w = document.createElement("p");
      w.className = "muted";
      w.textContent = wants.map(r => r.from + " is asking for this.").join(" ");
      box.appendChild(w);
    }
    box.scrollIntoView({ block: "nearest" });
  }
  function openCascade(kind) {
    openKind = kind;
    const sheet = document.getElementById("cascade");
    if (!sheet) return;
    sheet.hidden = false;
    sheet.innerHTML = "";
    const head = document.createElement("div");
    head.className = "row";
    head.innerHTML = "<b>" + (kind === "power" ? "Power deck" : "Unit deck") + "</b>";
    const req = document.createElement("button");
    req.className = "ghost"; req.type = "button"; req.textContent = "Requests";
    const close = document.createElement("button");
    close.className = "ghost"; close.type = "button"; close.textContent = "Close";
    close.onclick = () => { sheet.hidden = true; };
    head.appendChild(req); head.appendChild(close);
    sheet.appendChild(head);
    const detail = document.createElement("div");
    detail.className = "detail";
    detail.id = "cardDetail";
    detail.hidden = true;
    sheet.appendChild(detail);
    const reqBox = document.createElement("div");
    reqBox.className = "detail";
    reqBox.hidden = true;
    req.onclick = () => { reqBox.hidden = !reqBox.hidden; if (!reqBox.hidden) paintRequests(reqBox); };
    sheet.appendChild(reqBox);
    const grid = document.createElement("div");
    grid.className = "casgrid";
    const cards = kind === "power" ? powerCards() : unitCards();
    cards.forEach((card, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ccard fall" + (card.ready ? "" : " locked") + (card.gold ? " gold" : "");
      b.style.setProperty("--i", String(Math.min(i, 14)));
      b.innerHTML = "<b>" + card.name + "</b><span class='muted'>" + card.kicker + "</span><span class='count'>" + card.countLabel + "</span>";
      b.onclick = () => showDetail(card);
      grid.appendChild(b);
    });
    sheet.appendChild(grid);
  }

  document.getElementById("powerDeckBtn").onclick = () => openCascade("power");
  document.getElementById("unitDeckBtn").onclick = () => openCascade("units");
  const orig = Game.draw;
  Game.draw = function () {
    orig();
    const hint = document.getElementById("powerHint");
    if (hint && Game.S) hint.textContent = "Energy " + Game.S.energy.player + " · Data " + Game.S.data.player;
    stampMissions();
  };
  window.Collections = { mount: mount };
  window.DominionCards = { onCapture: onCapture, onWin: onWin };
  meta();
})();
