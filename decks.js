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
    if (!m.utilities) m.utilities = 1;
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
    if (m.utilities < utilities.length && m.captures % 3 === 0) m.utilities += 1;
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

  function openCascade(kind) {
    const sheet = document.getElementById("cascade");
    if (!sheet) return;
    sheet.hidden = false;
    sheet.innerHTML = "";
    const head = document.createElement("div");
    head.className = "row";
    head.innerHTML = "<b>" + (kind === "power" ? "Power deck" : "Unit deck") + "</b>";
    const close = document.createElement("button");
    close.className = "ghost"; close.type = "button"; close.textContent = "Close";
    close.onclick = () => { sheet.hidden = true; };
    head.appendChild(close);
    sheet.appendChild(head);
    const rain = document.createElement("div");
    rain.className = "rain";
    const backs = kind === "power" ? 36 : 8;
    for (let i = 0; i < backs; i++) {
      const back = document.createElement("i");
      back.className = "back fall";
      back.style.setProperty("--i", String(i));
      back.style.setProperty("--r", ((i % 7) - 3) + "deg");
      rain.appendChild(back);
    }
    sheet.appendChild(rain);
    const grid = document.createElement("div");
    grid.className = "casgrid";
    if (kind === "power") paintPower(grid); else paintUnits(grid);
    sheet.appendChild(grid);
  }
  function paintPower(grid) {
    const m = meta();
    const S = Game.S;
    const live = [
      { name: "Energy", line: "Builds units.", num: S.energy.player, extra: "+" + (document.getElementById("energyNext").textContent || "") },
      { name: "Data", line: "Repairs only.", num: S.data.player, extra: "+" + (document.getElementById("dataNext").textContent || "") }
    ];
    live.forEach((card, i) => grid.appendChild(face(card.name, card.line, card.num + "  " + card.extra, true, i)));
    utilities.slice(0, m.utilities).forEach((u, i) => grid.appendChild(face(u[1], u[2], "Earned", true, i + 2)));
    const locked = utilities.length - m.utilities;
    const note = document.createElement("p");
    note.className = "muted";
    note.textContent = locked + " power cards are still in the forge. Capture land to earn the next one. " + (120 - m.utilities) + " sealed cards sit behind these.";
    grid.appendChild(note);
  }
  function paintUnits(grid) {
    const S = Game.S;
    const order = ["scout", "defender", "attacker", "artillery"].map(k => Object.assign({ kind: k }, Game.STATS[k])).sort((a, b) => {
      const aa = S.energy.player >= a.cost ? 0 : 1;
      const bb = S.energy.player >= b.cost ? 0 : 1;
      return aa - bb || a.cost - b.cost;
    });
    order.forEach((st, i) => {
      const ready = S.energy.player >= st.cost && S.phase === "play";
      const node = face(st.name, st.short, st.cost + " Energy", ready, i);
      node.onclick = () => { if (S.phase === "play") { Game.build(st.kind); document.getElementById("cascade").hidden = true; } };
      grid.appendChild(node);
    });
  }
  function face(name, line, foot, ready, i) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ccard fall" + (ready ? "" : " locked");
    b.style.setProperty("--i", String(i));
    b.innerHTML = "<b>" + name + "</b><span>" + line + "</span><span class='muted'>" + foot + "</span>";
    return b;
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
