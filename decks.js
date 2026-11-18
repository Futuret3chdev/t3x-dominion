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

  const fieldUnits = [
    ["queen", "Queen", 0, 45, 70, 16, 2, 2, "banner", "Walks 2 and shoots 2. Jewel colors, hard to miss."],
    ["king", "King", 0, 85, 140, 30, 1, 1, "blade", "The crown. Health 140, hits for 30 up close."],
    ["runner", "Runner", 4, 18, 30, 8, 1, 3, "scout", "Walks 3. Faster than a Scout, and easier to lose."],
    ["squire", "Squire", 5, 25, 55, 14, 1, 1, "blade", "A short sword and a short reach. Cheap practice for the line."],
    ["pikeman", "Pikeman", 6, 30, 60, 18, 1, 1, "blade", "Holds the next hex with a longer hit than a Squire."],
    ["spotter", "Spotter", 7, 28, 35, 10, 2, 2, "gun", "Walks 2 and shoots 2. The shot is light."],
    ["bearer", "Banner Bearer", 8, 32, 50, 8, 1, 2, "banner", "Walks 2. Weak hit, hard to ignore. The line follows."],
    ["shieldman", "Shieldman", 9, 40, 130, 8, 1, 1, "wall", "Thicker than a Defender. Almost no punch."],
    ["skirmisher", "Skirmisher", 10, 38, 48, 16, 1, 2, "scout", "Walks 2 and hits harder than a Scout."],
    ["sapper", "Sapper", 12, 36, 45, 14, 1, 1, "blade", "Takes a hex apart up close. Do not leave it alone."],
    ["outrider", "Outrider", 14, 42, 55, 18, 1, 3, "horse", "Walks 3. The grab after the Runner."],
    ["crossbow", "Crossbow", 16, 48, 45, 22, 2, 1, "gun", "Shoots 2 hexes for 22. Keep a wall in front."],
    ["warden", "Warden", 18, 55, 140, 12, 1, 1, "wall", "A named wall. Health 140, a small hit."],
    ["raider", "Raider", 20, 52, 60, 24, 1, 2, "horse", "Walks 2 and hits for 24."],
    ["mortar", "Mortar", 22, 70, 40, 30, 2, 1, "gun", "Lobs 30 damage two hexes away. Fragile."],
    ["vanguard", "Vanguard", 24, 60, 80, 26, 1, 1, "blade", "The step before a Knight. Hits for 26."],
    ["medicant", "Field Chaplain", 26, 44, 50, 6, 1, 2, "banner", "Walks 2. Almost no damage. A marker you can afford to lose."],
    ["siege", "Siege Crew", 28, 75, 55, 32, 2, 1, "gun", "Shoots 32 from two hexes."],
    ["knight", "Knight", 30, 80, 100, 30, 1, 1, "blade", "Health 100, hits for 30, must stand next to them."],
    ["standard", "Standard", 33, 68, 90, 16, 1, 1, "banner", "A heavy banner. Hard to shift, modest hit."],
    ["bombard", "Bombard", 36, 90, 48, 40, 2, 1, "gun", "The loud gun. 40 damage, two hexes, thin health."],
    ["marshal", "Marshal", 40, 100, 120, 28, 1, 1, "blade", "The last field command. Health 120, hits for 28."]
  ];
  const specials = [
    ["ironwarden", "Iron Warden", 50, 80, 180, 18, 1, 1, "wall", "Bought for 50 T3X. A wall the line does not get for free."],
    ["duskrider", "Dusk Rider", 80, 70, 70, 26, 1, 3, "horse", "Bought for 80 T3X. Walks 3 and hits for 26."],
    ["glasscannon", "Glass Cannon", 120, 90, 40, 48, 2, 1, "gun", "Bought for 120 T3X. 48 damage at two hexes. It dies if they reach it."],
    ["oathknight", "Oath Knight", 200, 110, 150, 34, 1, 1, "blade", "Bought for 200 T3X. Health 150, hits for 34 up close."],
    ["siegesaint", "Siege Saint", 350, 120, 90, 42, 2, 1, "gun", "Bought for 350 T3X. A blessed gun. 42 damage, two hexes."],
    ["highgate", "Highgate Ram", 500, 140, 160, 36, 1, 1, "wall", "Bought for 500 T3X. The fortress breaker. Health 160."],
    ["dreadbreaker", "Dread Breaker", 750, 160, 140, 50, 2, 1, "gun", "Bought for 750 T3X. Shoots 50 from two hexes."],
    ["accordender", "Accord-Ender", 1000, 200, 200, 55, 2, 1, "blade", "Bought for 1000 T3X. Health 200. Hits for 55, two hexes out."]
  ];
  function rowUnit(row, special) {
    return { id: row[0], name: row[1], need: special ? 0 : row[2], t3x: special ? row[2] : 0, cost: row[3], hp: row[4], atk: row[5], range: row[6], move: row[7], glyph: row[8], role: row[9], short: row[9] };
  }
  function installUnits() {
    fieldUnits.forEach(row => {
      const u = rowUnit(row, false);
      Game.STATS[u.id] = { name: u.name, cost: u.cost, hp: u.hp, atk: u.atk, range: u.range, move: u.move, role: u.role, short: "Hold " + u.need + " hexes", glyph: u.glyph };
    });
    specials.forEach(row => {
      const u = rowUnit(row, true);
      Game.STATS[u.id] = { name: u.name, cost: u.cost, hp: u.hp, atk: u.atk, range: u.range, move: u.move, role: u.role, short: u.t3x + " T3X", glyph: u.glyph };
    });
  }
  function syncRoster() {
    const m = meta();
    if (!m.roster) m.roster = [];
    if (!m.specials) m.specials = {};
    let held = m.bestLand || 0;
    if (Game.S) held = Math.max(held, Object.values(Game.S.tiles).filter(t => t.owner === "player").length);
    m.bestLand = held;
    fieldUnits.forEach(row => {
      if (held >= row[2] && m.roster.indexOf(row[0]) < 0) {
        m.roster.push(row[0]);
        if (Game.S) Game.S.flash = row[1] + " joined the unit deck.";
      }
    });
    save(m);
  }
  function ownsUnit(id) {
    if (["scout", "defender", "attacker", "artillery"].indexOf(id) >= 0) return true;
    const m = meta();
    if (specials.some(s => s[0] === id)) return !!(m.specials && m.specials[id]);
    return ((m.roster) || []).indexOf(id) >= 0;
  }
  function buySpecial(id) {
    const row = specials.find(s => s[0] === id);
    if (!row) return "Missing unit.";
    const m = meta();
    if (!m.specials) m.specials = {};
    if (m.specials[id]) return "You already hold " + row[1] + ".";
    const cost = row[2];
    if ((m.t3xHeld || 0) < cost) return "You need " + cost + " T3X. You hold " + (m.t3xHeld || 0) + ".";
    m.t3xHeld -= cost;
    m.specials[id] = 1;
    save(m);
    if (window.paintEarn) paintEarn();
    return row[1] + " is yours. Field it for " + row[3] + " Energy.";
  }
  const shopFx = {
    ironwarden: "On the field: every other unit of yours gains 30 health.",
    duskrider: "On the field: you gain 15 Energy at once.",
    glasscannon: "The first shot hits for double, then the trick is spent.",
    oathknight: "On the field: empty ground next to it becomes yours.",
    siegesaint: "On the field: your whole line is healed 40.",
    highgate: "On the field: every enemy unit takes 25.",
    dreadbreaker: "On the field: you gain 50 Energy and 10 Data.",
    accordender: "On the field: every enemy takes 40, and empty ground within 2 hexes is yours."
  };
  function hexDist(a, b) {
    return Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs((a.q + a.r) - (b.q + b.r)));
  }
  function onDeploy(kind) {
    const S = Game.S;
    if (!S || !shopFx[kind]) return "";
    const mine = Object.values(S.units).filter(u => u.side === "player");
    const foes = Object.values(S.units).filter(u => u.side === "enemy");
    const placed = mine.filter(u => u.kind === kind).pop();
    if (kind === "ironwarden") {
      mine.forEach(u => { if (u !== placed) u.hp = Math.min(Game.STATS[u.kind].hp, u.hp + 30); });
    } else if (kind === "duskrider") S.energy.player += 15;
    else if (kind === "glasscannon" && placed) placed.burst = true;
    else if (kind === "oathknight" && placed) {
      Object.values(S.tiles).forEach(t => { if (hexDist(placed, t) === 1 && !t.unitId) t.owner = "player"; });
    } else if (kind === "siegesaint") {
      mine.forEach(u => { u.hp = Math.min(Game.STATS[u.kind].hp, u.hp + 40); });
    } else if (kind === "highgate") {
      foes.forEach(u => { u.hp -= 25; if (u.hp <= 0) { delete S.units[u.id]; const tile = S.tiles[u.q + "," + u.r]; if (tile) tile.unitId = null; } });
    } else if (kind === "dreadbreaker") { S.energy.player += 50; S.data.player += 10; }
    else if (kind === "accordender" && placed) {
      foes.forEach(u => { u.hp -= 40; if (u.hp <= 0) { delete S.units[u.id]; const tile = S.tiles[u.q + "," + u.r]; if (tile) tile.unitId = null; } });
      Object.values(S.tiles).forEach(t => { if (hexDist(placed, t) <= 2 && !t.unitId) t.owner = "player"; });
    }
    return shopFx[kind];
  }
  function forgeBurst(name) {
    const el = document.createElement("div");
    el.className = "forge";
    el.innerHTML = "<b>FORGED</b><span>" + name + "</span>";
    document.body.appendChild(el);
    const sting = new Audio("media/vid-energy.mp4?v=sound");
    sting.volume = 0.55;
    const started = sting.play();
    if (started && started.catch) started.catch(function () {});
    setTimeout(function () { el.remove(); }, 1400);
  }
  let shopTab = "units";
  let shopPick = null;
  const nftDrops = [
    ["crown-bearer", "Crown Bearer", "Win one battle. Hold 31 hexes."],
    ["king", "King's Seal", "Field the King in a battle."],
    ["coin", "Oath Coin", "Complete any collection."],
    ["highgate", "Highgate Key", "Fill the Earn bar to 100%."],
    ["cloth", "Banner Cloth", "Send a spare card to a friend."]
  ];
  function mountShop(root, redraw) {
    if (!root) return;
    const m = meta();
    const held = m.t3xHeld || 0;
    root.innerHTML = "";
    const bar = document.createElement("div");
    bar.className = "shopbar";
    bar.innerHTML = "<span>T3X held</span><b id='shopHeld'>" + held + "</b>";
    root.appendChild(bar);
    if (shopPick) { paintShopPick(root, redraw); return; }
    const filters = document.createElement("div");
    filters.className = "shopfilters";
    [["units", "Units"], ["cards", "Cards"], ["supplies", "Supplies"], ["nft", "NFT"]].forEach(function (pair) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = pair[1];
      if (shopTab === pair[0]) b.className = "on";
      b.onclick = function () { shopTab = pair[0]; redraw(); };
      filters.appendChild(b);
    });
    root.appendChild(filters);
    if (shopTab === "units") {
      const grid = document.createElement("div");
      grid.className = "shopgrid";
      specials.forEach(function (row) {
        const owned = !!(m.specials && m.specials[row[0]]);
        const tier = row[2] >= 500 ? "mythic" : row[2] >= 200 ? "rare" : "";
        const card = document.createElement("button");
        card.type = "button";
        card.className = "shopcard " + tier;
        card.innerHTML = '<img alt="" src="media/card-' + row[0] + '.jpg"><div class="cap"><b>' + row[1] + '</b><div class="' + (owned ? "ownedtag" : "price") + '">' + (owned ? "Owned" : row[2] + " T3X") + "</div></div>";
        card.onclick = function () { shopPick = { kind: "unit", id: row[0] }; redraw(); };
        grid.appendChild(card);
      });
      root.appendChild(grid);
    } else if (shopTab === "cards") {
      const grid = document.createElement("div");
      grid.className = "shopgrid";
      allCards().filter(function (c) { return c.gold; }).forEach(function (c) {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "shopcard mythic";
        card.innerHTML = '<img alt="" src="media/card-' + c.id + '.jpg"><div class="cap"><b>' + c.name + '</b><div class="price">10 T3X</div></div>';
        card.onclick = function () { shopPick = { kind: "card", id: c.id }; redraw(); };
        grid.appendChild(card);
      });
      root.appendChild(grid);
    } else if (shopTab === "nft") {
      const lead = document.createElement("p");
      lead.className = "soon";
      lead.textContent = "Coming soon";
      root.appendChild(lead);
      const note = document.createElement("p");
      note.className = "muted";
      note.textContent = "Special NFTs are not for sale. Finish a Giveaways task in Community to earn one. Claiming is not live yet.";
      root.appendChild(note);
      const grid = document.createElement("div");
      grid.className = "shopgrid";
      nftDrops.forEach(function (drop) {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "shopcard mythic";
        card.innerHTML = '<img alt="" src="media/card-' + drop[0] + '.jpg"><div class="cap"><b>' + drop[1] + '</b><div class="price">NFT · Soon</div></div>';
        card.onclick = function () { shopPick = { kind: "nft", id: drop[0] }; redraw(); };
        grid.appendChild(card);
      });
      root.appendChild(grid);
    } else {
      const grid = document.createElement("div");
      grid.className = "shopgrid";
      [["energy", "Energy cache", 20], ["data", "Data cache", 20], ["land", "Hex brand", 40]].forEach(function (g) {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "shopcard rare";
        card.innerHTML = '<img alt="" src="media/card-supply-' + g[0] + '.jpg"><div class="cap"><b>' + g[1] + '</b><div class="price">' + g[2] + " T3X</div></div>";
        card.onclick = function () { shopPick = { kind: "supply", id: g[0] }; redraw(); };
        grid.appendChild(card);
      });
      root.appendChild(grid);
    }
  }
  function paintShopPick(root, redraw) {
    const back = document.createElement("button");
    back.type = "button";
    back.className = "shopbuy";
    back.textContent = "Back to the shelf";
    back.onclick = function () { shopPick = null; redraw(); };
    root.appendChild(back);
    const note = document.createElement("p");
    note.className = "muted";
    if (shopPick.kind === "unit") {
      const row = specials.find(function (s) { return s[0] === shopPick.id; });
      const owned = !!(meta().specials && meta().specials[row[0]]);
      const st = Game.STATS[row[0]];
      const panel = document.createElement("article");
      panel.className = "shoppick";
      panel.innerHTML = '<img alt="" src="media/card-' + row[0] + '.jpg"><h3>' + row[1] + '</h3><p class="price">' + row[2] + ' T3X</p><p>' + shopFx[row[0]] + '</p><p class="muted">Field cost ' + st.cost + ' Energy. Health ' + st.hp + '. Hit ' + st.atk + '. Walks ' + st.move + '. Range ' + st.range + '.</p>';
      const buyBtn = document.createElement("button");
      buyBtn.type = "button";
      buyBtn.className = "shopbuy";
      buyBtn.textContent = owned ? "Owned. Field it from Units." : "Buy " + row[1];
      buyBtn.disabled = owned;
      buyBtn.onclick = function () {
        note.textContent = buySpecial(row[0]);
        if (meta().specials && meta().specials[row[0]]) {
          forgeBurst(row[1]);
          buyBtn.textContent = "Owned. Field it from Units.";
          buyBtn.disabled = true;
          const held = document.getElementById("shopHeld");
          if (held) held.textContent = String(meta().t3xHeld || 0);
        }
      };
      root.appendChild(panel);
      root.appendChild(buyBtn);
    } else if (shopPick.kind === "card") {
      const c = allCards().find(function (card) { return card.id === shopPick.id; });
      const panel = document.createElement("article");
      panel.className = "shoppick";
      panel.innerHTML = '<video class="shopanim" autoplay muted loop playsinline poster="media/card-' + c.id + '.jpg"><source src="media/vid-' + c.id + '.mp4" type="video/mp4"></video><h3>' + c.name + '</h3><p class="price">10 T3X</p><p>' + c.line + '</p><p class="muted">' + c.collection + " · " + c.deck + ". You hold " + (meta().cards[c.id] || 0) + ".</p>";
      const buyBtn = document.createElement("button");
      buyBtn.type = "button";
      buyBtn.className = "shopbuy";
      buyBtn.textContent = "Buy " + c.name;
      buyBtn.onclick = function () {
        const msg = buy(c.id);
        note.textContent = msg;
        if (msg.indexOf("Bought") === 0) {
          forgeBurst(c.name);
          const held = document.getElementById("shopHeld");
          if (held) held.textContent = String(meta().t3xHeld || 0);
        }
      };
      root.appendChild(panel);
      root.appendChild(buyBtn);
    } else if (shopPick.kind === "nft") {
      const drop = nftDrops.find(function (d) { return d[0] === shopPick.id; });
      const panel = document.createElement("article");
      panel.className = "shoppick";
      panel.innerHTML = '<img alt="" src="media/card-' + drop[0] + '.jpg"><h3>' + drop[1] + '</h3><p class="soon">Coming soon</p><p>' + drop[2] + '</p><p class="muted">Exclusive NFT card. Not for sale. Earn it from Community · Giveaways.</p>';
      root.appendChild(panel);
    } else {
      const goods = { energy: ["Energy cache", 20, "40 Energy. Used now if a battle is open, otherwise on the next one."], data: ["Data cache", 20, "16 Data for repairs."], land: ["Hex brand", 40, "One open hex becomes yours, if a battle is open."] };
      const g = goods[shopPick.id];
      const panel = document.createElement("article");
      panel.className = "shoppick";
      panel.innerHTML = '<video class="shopanim" autoplay muted loop playsinline poster="media/card-supply-' + shopPick.id + '.jpg"><source src="media/vid-supply-' + shopPick.id + '.mp4" type="video/mp4"></video><h3>' + g[0] + '</h3><p class="price">' + g[1] + " T3X</p><p>" + g[2] + "</p>";
      const buyBtn = document.createElement("button");
      buyBtn.type = "button";
      buyBtn.className = "shopbuy";
      buyBtn.textContent = "Buy " + g[0];
      buyBtn.onclick = function () {
        const box = meta();
        if ((box.t3xHeld || 0) < g[1]) { note.textContent = "You need " + g[1] + " T3X. You hold " + (box.t3xHeld || 0) + "."; return; }
        box.t3xHeld -= g[1];
        const S = Game.S;
        if (shopPick.id === "energy") { if (S && S.phase === "play") S.energy.player += 40; else box.bankEnergy = (box.bankEnergy || 0) + 40; }
        else if (shopPick.id === "data") { if (S && S.phase === "play") S.data.player += 16; else box.bankData = (box.bankData || 0) + 16; }
        else if (S) { const open = Object.values(S.tiles).find(function (tile) { return !tile.owner && !tile.unitId; }); if (open) open.owner = "player"; }
        save(box);
        if (window.paintEarn) paintEarn();
        if (S && Game.draw) Game.draw();
        forgeBurst(g[0]);
        note.textContent = "Bought " + g[0] + ".";
        const held = document.getElementById("shopHeld");
        if (held) held.textContent = String(box.t3xHeld || 0);
      };
      root.appendChild(panel);
      root.appendChild(buyBtn);
    }
    const clip = root.querySelector(".shopanim");
    if (clip) { const started = clip.play(); if (started && started.catch) started.catch(function () {}); }
    root.appendChild(note);
  }

  function cashBank() {
    const m = meta();
    if (!Game.S) return;
    if (m.bankEnergy) { Game.S.energy.player += m.bankEnergy; m.bankEnergy = 0; }
    if (m.bankData) { Game.S.data.player += m.bankData; m.bankData = 0; }
    save(m);
  }

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
    syncRoster();
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

  function syncHud() {
    const app = document.querySelector(".app");
    if (!app) return;
    const sheet = document.getElementById("cascade");
    const tray = document.getElementById("cards");
    const view = document.getElementById("viewer");
    const viewing = (sheet && !sheet.hidden) || (tray && !tray.hidden) || (view && !view.hidden);
    app.classList.toggle("viewing", !!viewing);
    app.classList.toggle("focuscard", !!(view && !view.hidden));
  }
  let openKind = "power";
  let deckList = [];
  function stepCard(dir) {
    if (!deckList.length) return;
    const box = document.getElementById("viewer");
    const id = box && box.dataset.id;
    let i = deckList.findIndex(c => c.id === id);
    if (i < 0) i = 0;
    showDetail(deckList[(i + dir + deckList.length) % deckList.length]);
  }
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
      { id: "energy", name: "Energy", art: "media/card-energy.jpg", video: "media/vid-energy.mp4", kicker: "Builds units", countLabel: String(S.energy.player), ready: true, explain: "Energy pays for units. It does not repair. You collect more at the end of the turn for land and relays.", stats: [["You have", S.energy.player], ["Next payday", document.getElementById("energyNext").textContent || ""], ["Scout", "20"], ["Defender", "35"], ["Attacker", "50"], ["Artillery", "65"]], use: () => "Energy is spent when you build a unit. Pick one from the unit deck." },
      { id: "data", name: "Data", art: "media/card-data.jpg", video: "media/vid-data.mp4", kicker: "Repairs only", countLabel: String(S.data.player), ready: true, explain: "Data is only for repairs. Select a damaged unit, then repair. It will not build anything.", stats: [["You have", S.data.player], ["Next payday", document.getElementById("dataNext").textContent || ""], ["Repair", "10 Data for 40 health"]], use: () => { if (window.Game) Game.repair(); return "Repair uses Data on the unit you selected."; } }
    ];
    const clips = ["ration", "scrap", "relay", "oil", "barrel", "map", "cloth", "coal", "flare", "medic", "pin", "coin"];
    utilities.forEach((u, i) => {
      const owned = i < m.utilities;
      const n = m.cards[u[0]] || 0;
      cards.push({ id: u[0], name: u[1], art: "media/card-" + clips[i] + ".jpg", video: "media/vid-" + clips[i] + ".mp4", kicker: owned ? "Power" : "Still in the forge", countLabel: owned ? "Hold " + n : "Locked", ready: owned && n > 0, explain: u[2] + (owned ? " Using it spends one copy." : " Take more land and this card joins the deck."), stats: [["You hold", n], ["Deck", "Power"], ["Status", owned ? "Earned" : "Locked until you capture more land"]], gold: false, use: () => useUtility(u[0]) });
    });
    cards.sort((a, b) => (a.ready === b.ready ? 0 : a.ready ? -1 : 1));
    return cards;
  }
  function unitCards() {
    const S = Game.S;
    const base = ["scout", "defender", "attacker", "artillery"].map(k => {
      const st = Game.STATS[k];
      return cardFrom(k, st.name, st.cost + " Energy", st.role, true, 0);
    });
    const earned = fieldUnits.map(row => {
      const own = ownsUnit(row[0]);
      return cardFrom(row[0], row[1], own ? row[3] + " Energy" : "Hold " + row[2] + " hexes", row[9], own, 0);
    });
    const bought = specials.filter(row => ownsUnit(row[0])).map(row => {
      return cardFrom(row[0], row[1], row[3] + " Energy", row[9], true, 0);
    });
    return base.concat(earned, bought).sort((a, b) => (a.ready === b.ready ? 0 : a.ready ? -1 : 1));
  }
  function cardFrom(id, name, kicker, role, own, t3x) {
    const st = Game.STATS[id];
    const n = unitCount(id);
    const ready = own && Game.S && Game.S.energy.player >= st.cost && Game.S.phase === "play";
    const art = "media/card-" + id + ".jpg";
    return {
      id, name, art, video: ["scout", "defender", "attacker", "artillery", "queen", "king"].indexOf(id) >= 0 ? "media/vid-" + id + ".mp4" : "",
      glyph: st.glyph || id, kicker, countLabel: own ? n + " on the map" : (t3x ? t3x + " T3X" : "Locked"),
      ready, explain: role, t3x,
      stats: [["On the map", n], ["Field cost", st.cost + " Energy"], ["Health", st.hp], ["Hit", st.atk], ["Range", st.range], ["Walk", st.move], ["T3X", t3x || "—"]],
      use: () => {
        if (!own && t3x) {
          const msg = buySpecial(id);
          if (ownsUnit(id)) showDetail(unitCards().find(c => c.id === id));
          return msg;
        }
        if (!own) return name + " is still in the field. Hold the hexes shown on the card.";
        Game.build(id);
        if (id === "queen" || id === "king") markRoyals(id);
        const sheet = document.getElementById("cascade");
        if (sheet) sheet.hidden = true;
        const view = document.getElementById("viewer");
        if (view) view.hidden = true;
        if (window.DominionCards) DominionCards.sync();
        return "Tap your land to place the " + name + ".";
      }
    };
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
    let box = document.getElementById("viewer");
    if (!box) {
      box = document.createElement("div");
      box.id = "viewer";
      box.className = "viewer";
      document.body.appendChild(box);
    }
    box.hidden = false;
    const sheet = document.getElementById("cascade");
    if (sheet) sheet.hidden = true;
    box.innerHTML = "";
    box.dataset.id = card.id;
    const bar = document.createElement("div");
    bar.className = "row";
    const title = document.createElement("b");
    title.textContent = card.name;
    const close = document.createElement("button");
    close.type = "button";
    close.className = "x";
    close.setAttribute("aria-label", "Close");
    close.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>';
    close.onclick = () => { box.hidden = true; syncHud(); };
    bar.appendChild(title);
    bar.appendChild(close);
    box.appendChild(bar);
    const rest = document.createElement("div");
    rest.className = "viewerest";
    if (card.video) {
      const stage = document.createElement("div");
      stage.className = "gifstage";
      const img = document.createElement("video");
      img.className = "cardgif";
      img.muted = false;
      img.defaultMuted = false;
      img.volume = 1;
      img.loop = true;
      img.autoplay = true;
      img.playsInline = true;
      img.setAttribute("playsinline", "");
      img.setAttribute("webkit-playsinline", "");
      img.poster = card.art || "";
      img.src = card.video + "?v=dance";
      const started = img.play();
      if (started && started.catch) started.catch(function () {});
      const prev = document.createElement("button");
      prev.type = "button"; prev.className = "gifnav prev"; prev.setAttribute("aria-label", "Previous card"); prev.textContent = "‹";
      const next = document.createElement("button");
      next.type = "button"; next.className = "gifnav next"; next.setAttribute("aria-label", "Next card"); next.textContent = "›";
      prev.onclick = function (e) { e.stopPropagation(); stepCard(-1); };
      next.onclick = function (e) { e.stopPropagation(); stepCard(1); };
      let startX = 0;
      stage.addEventListener("touchstart", function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
      stage.addEventListener("touchend", function (e) {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 36) stepCard(dx < 0 ? 1 : -1);
      }, { passive: true });
      stage.appendChild(img); stage.appendChild(prev); stage.appendChild(next);
      box.appendChild(stage);
    } else if (card.art) {
      const stage = document.createElement("div");
      stage.className = "gifstage";
      const img = document.createElement("img");
      img.className = "cardgif drift";
      img.alt = "";
      img.src = card.art;
      img.onerror = function () {
        img.onerror = null;
        const fall = { scout: "scout", wall: "defender", blade: "attacker", gun: "artillery", horse: "scout", banner: "defender" };
        img.src = "media/card-" + (fall[card.glyph] || "scout") + ".jpg";
      };
      const sting = new Audio("media/vid-energy.mp4?v=sound");
      sting.volume = 0.45;
      const started = sting.play();
      if (started && started.catch) started.catch(function () {});
      const prev = document.createElement("button");
      prev.type = "button"; prev.className = "gifnav prev"; prev.setAttribute("aria-label", "Previous card"); prev.textContent = "‹";
      const next = document.createElement("button");
      next.type = "button"; next.className = "gifnav next"; next.setAttribute("aria-label", "Next card"); next.textContent = "›";
      prev.onclick = function (e) { e.stopPropagation(); stepCard(-1); };
      next.onclick = function (e) { e.stopPropagation(); stepCard(1); };
      stage.appendChild(img); stage.appendChild(prev); stage.appendChild(next);
      box.appendChild(stage);
    }
    box.dataset.id = card.id;
    syncHud();
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
        const names = friendNames().filter(name => name !== "Friend");
        if (!names.length) {
          const code = askCard(card.id, "Friend");
          note.textContent = "Ask code: " + code + ". They add it under Friend requests.";
          return;
        }
        picks.hidden = false;
        picks.innerHTML = "";
        names.forEach(name => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = name;
          b.onclick = () => {
            const code = askCard(card.id, name);
            note.textContent = "Ask code for " + name + ": " + code;
            picks.hidden = true;
          };
          picks.appendChild(b);
        });
      };
      actions.appendChild(sendBtn);
      actions.appendChild(askBtn);
      rest.appendChild(p); rest.appendChild(actions); rest.appendChild(picks); rest.appendChild(stats); rest.appendChild(note);
    } else {
      rest.appendChild(p); rest.appendChild(actions); rest.appendChild(stats); rest.appendChild(note);
    }
    const wants = (meta().requests || []).filter(r => r.status === "open" && r.dir === "in" && r.cardId === card.id);
    if (wants.length) {
      const w = document.createElement("p");
      w.className = "muted";
      w.textContent = wants.map(r => r.from + " is asking for this.").join(" ");
      rest.appendChild(w);
    }
    box.appendChild(rest);
  }
  function markRoyals(who) {
    const queen = document.getElementById("unitDeckBtn");
    const king = document.getElementById("powerDeckBtn");
    if (queen) queen.classList.toggle("on", who === "queen");
    if (king) king.classList.toggle("on", who === "king");
  }
  function openCascade(kind) {
    openKind = kind;
    markRoyals(kind === "units" ? "queen" : "king");
    const sheet = document.getElementById("cascade");
    if (!sheet) return;
    sheet.hidden = false;
    syncHud();
    sheet.innerHTML = "";
    const head = document.createElement("div");
    head.className = "row";
    head.innerHTML = "<b>" + (kind === "power" ? "Power deck" : "Unit deck") + "</b>";
    const req = document.createElement("button");
    req.className = "reqbtn"; req.type = "button"; req.setAttribute("aria-label", "Requests");
    req.innerHTML = '<img alt="" src="media/icon-requests.jpg">';
    const close = document.createElement("button");
    close.className = "x"; close.type = "button"; close.setAttribute("aria-label", "Close");
    close.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>';
    close.onclick = () => { sheet.hidden = true; markRoyals(""); syncHud(); };
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
    deckList = cards;
    cards.forEach((card, i) => {
      const b = document.createElement("button");
      b.type = "button";
      const royal = card.id === "queen" || card.id === "king";
      const picked = royal && Game.S && Game.S.buildKind === card.id;
      b.className = "ccard fall" + (card.ready ? "" : " locked") + (card.gold ? " gold" : "") + (picked ? " picked" : "");
      b.style.setProperty("--i", String(Math.min(i, 14)));
      b.innerHTML = (card.art ? '<img alt="" src="' + card.art + '">' : "") + "<b>" + card.name + "</b><span class='muted'>" + card.kicker + "</span><span class='count'>" + card.countLabel + "</span>" + (picked ? "<span class='pickedtag'>Selected</span>" : "");
      b.onclick = () => {
        if (royal) {
          grid.querySelectorAll(".ccard.picked").forEach(function (n) { n.classList.remove("picked"); const tag = n.querySelector(".pickedtag"); if (tag) tag.remove(); });
          b.classList.add("picked");
          if (!b.querySelector(".pickedtag")) b.insertAdjacentHTML("beforeend", "<span class='pickedtag'>Selected</span>");
          markRoyals(card.id);
        }
        showDetail(card);
      };
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
  window.DominionCards = {
    onCapture: onCapture,
    onWin: onWin,
    open: function (id) {
      const unit = unitCards().find(c => c.id === id);
      openCascade(unit ? "units" : "power");
      const card = (unit ? unitCards() : powerCards()).find(c => c.id === id);
      if (card) showDetail(card);
      syncHud();
    },
    canField: ownsUnit,
    fieldReason: function (kind) {
      const s = specials.find(row => row[0] === kind);
      if (s && !ownsUnit(kind)) return s[1] + " costs " + s[2] + " T3X. Buy it in the shop.";
      const f = fieldUnits.find(row => row[0] === kind);
      if (f && !ownsUnit(kind)) return f[1] + " joins when you hold " + f[2] + " hexes.";
      return "Not unlocked.";
    },
    listUnits: unitCards,
    onDeploy: onDeploy,
    mountShop: mountShop,
    cashBank: cashBank,
    sync: syncHud
  };
  installUnits();
  syncRoster();
  meta();
})();
