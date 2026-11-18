(function () {
  const SAVE_KEY = "dominion-saves-v1";
  const META_KEY = "dominion-meta-v1";
  const G = window.Game;
  let ctx = null, master = null, muted = false, paused = false;
  const meta = loadMeta();
  const shell = document.createElement("div");
  shell.className = "shell";
  shell.innerHTML = '<div class="shell-inner" id="shellBody"></div>';
  document.body.appendChild(shell);

  function loadMeta() {
    try { return Object.assign({ friends: [], freeScout: false, freeUsed: false }, JSON.parse(localStorage.getItem(META_KEY) || "{}")); }
    catch (e) { return { friends: [], freeScout: false, freeUsed: false }; }
  }
  function saveMeta() { localStorage.setItem(META_KEY, JSON.stringify(meta)); }
  function readSaves() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function writeSaves(rows) { localStorage.setItem(SAVE_KEY, JSON.stringify(rows)); }

  function ensureAudio() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.07;
    master.connect(ctx.destination);
    const a = ctx.createOscillator();
    const b = ctx.createOscillator();
    const g = ctx.createGain();
    a.type = "sine"; b.type = "triangle";
    a.frequency.value = 92; b.frequency.value = 138;
    g.gain.value = 0.35;
    a.connect(g); b.connect(g); g.connect(master);
    a.start(); b.start();
  }
  window.sfx = function (kind) {
    if (!ctx || muted || paused) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = kind === "hit" ? "square" : "sine";
    o.frequency.value = kind === "hit" ? 160 : kind === "move" ? 320 : 540;
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
    o.connect(g); g.connect(master);
    o.start(); o.stop(ctx.currentTime + 0.18);
  };
  function setMute(on) {
    muted = on;
    if (master) master.gain.value = muted || paused ? 0 : 0.07;
    document.getElementById("muteBtn").textContent = muted ? "×" : "♪";
  }
  function setPause(on) {
    paused = on;
    if (ctx) on ? ctx.suspend() : ctx.resume();
    if (master && !on) master.gain.value = muted ? 0 : 0.07;
    document.getElementById("pauseBtn").textContent = paused ? "▶" : "II";
  }

  function snapshot() {
    const S = G.S;
    const copy = JSON.parse(JSON.stringify(S));
    copy.flash = null; copy.script = []; copy.scriptIndex = 0; copy.attention = null;
    if (copy.phase === "briefing" || copy.phase === "handoff" || copy.phase === "enemy") copy.phase = "play";
    return copy;
  }
  function summary(S) {
    const c = G.counts();
    return "Turn " + S.turn + " · You " + c.player + " / Enemy " + c.enemy;
  }
  function saveSlot(name) {
    const rows = readSaves();
    const S = G.S;
    const row = { id: Date.now(), name: name || "Battle", at: new Date().toISOString(), blurb: summary(S), data: snapshot() };
    rows.unshift(row);
    writeSaves(rows.slice(0, 3));
    window.sfx && window.sfx("ui");
  }
  function loadSlot(id) {
    const row = readSaves().find(r => r.id === id);
    if (!row) return;
    row.data.hotseat = !!row.data.hotseat;
    row.data.control = row.data.control || "player";
    G.setS(row.data);
    G.draw();
    closeShell();
  }
  function deleteSlot(id) { writeSaves(readSaves().filter(r => r.id !== id)); render("saves"); }

  function grantFree() {
    if (!meta.freeScout || meta.freeUsed) return;
    const S = G.S;
    const tile = Object.values(S.tiles).find(t => t.owner === "player" && !t.unitId);
    if (!tile) return;
    const id = "free-scout";
    S.units[id] = { id, kind: "scout", side: "player", q: tile.q, r: tile.r, hp: 40, acted: false };
    tile.unitId = id;
    S.log.unshift("Free Scout is on the map. Reserved on this device only.");
    meta.freeUsed = true;
    saveMeta();
    G.draw();
  }
  function newBattle(hotseat) {
    ensureAudio();
    if (ctx && ctx.state === "suspended") ctx.resume();
    G.create();
    G.S.hotseat = !!hotseat;
    G.S.control = "player";
    G.S.phase = "play";
    grantFree();
    G.draw();
    closeShell();
  }
  function closeShell() { shell.hidden = true; }
  function openShell(screen) { shell.hidden = false; render(screen || "home"); }

  const icons = {
    x: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 4h4.2l3.3 4.6L15.6 4H20l-6.2 7.6L20.4 20h-4.2l-3.6-5-4.2 5H4.2l6.6-7.8z"/></svg>',
    fb: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor"/></svg>'
  };

  function render(screen) {
    const body = document.getElementById("shellBody");
    const saves = readSaves();
    if (screen === "home") {
      body.innerHTML = ''
        + '<div class="kicker">Presented by Futuret3Ch</div>'
        + '<div class="row"><h2>T3X DOMINION</h2><span>'
        + '<a class="mark" href="https://futuret3ch.com.au" target="_blank" rel="noreferrer"><img src="brand/futuret3ch-mark.png" alt="Futuret3Ch"></a> '
        + '<a class="mark" href="https://t3x.futuret3ch.com.au" target="_blank" rel="noreferrer"><img src="brand/t3x-badge.png" alt="T3X"></a></span></div>'
        + '<p class="muted">Hold half the grid. Teal at the bottom. Crimson at the top.</p>'
        + '<div class="menu-actions">'
        + '<button class="go" type="button" data-go="play">Play</button>'
        + (saves[0] ? '<button type="button" data-go="continue">Continue · ' + saves[0].blurb + '</button>' : '')
        + '<button type="button" data-go="trailer">Trailer</button>'
        + '<button type="button" data-go="saves">Save, load, delete</button>'
        + '<button type="button" data-go="multi">Multiplayer</button>'
        + '<button type="button" data-go="cards">Cards</button>'
        + '<button type="button" data-go="community">Community</button>'
        + '<button type="button" data-go="updates">Updates</button>'
        + '<button type="button" data-go="settings">Settings</button>'
        + (G.S && G.S.phase !== "briefing" ? '<button type="button" data-go="back">Back to battle</button>' : '')
        + '</div>';
    } else if (screen === "trailer") {
      body.innerHTML = '<button class="ghost" type="button" data-go="home">Back</button><h2>Trailer</h2><p class="muted">No watermark. Play it here or keep the file.</p><video class="trailer" controls playsinline src="media/trailer.mp4"></video><p><a class="wide" style="display:inline-block" href="media/trailer.mp4" download="t3x-dominion-trailer.mp4">Download trailer</a></p>';
    } else if (screen === "saves") {
      body.innerHTML = '<button class="ghost" type="button" data-go="home">Back</button><h2>Saves</h2><p class="muted">Three slots on this device. The newest replaces the oldest.</p><button class="wide" type="button" id="saveNow">Save this battle</button><div class="stack" id="slotList"></div>';
      const list = body.querySelector("#slotList");
      if (!saves.length) list.innerHTML = '<p class="muted">No saves yet.</p>';
      saves.forEach(row => {
        const el = document.createElement("div");
        el.className = "slot";
        el.innerHTML = '<div><b>' + row.name + '</b><div class="muted">' + row.blurb + '</div></div><div><button type="button" data-load="' + row.id + '">Load</button> <button type="button" data-del="' + row.id + '">Delete</button></div>';
        list.appendChild(el);
      });
      body.querySelector("#saveNow").onclick = () => { saveSlot("Battle"); render("saves"); };
    } else if (screen === "multi") {
      body.innerHTML = '<button class="ghost" type="button" data-go="home">Back</button><h2>Multiplayer</h2><div class="stack"><button type="button" id="hotseat"><b>Pass and play</b><span class="muted" style="display:block">Two people, one phone. Teal, then crimson.</span></button><button type="button" disabled><b>Online rooms</b><span class="soon" style="display:block">Coming soon</span></button></div>';
      body.querySelector("#hotseat").onclick = () => newBattle(true);
    } else if (screen === "settings") {
      body.innerHTML = '<button class="ghost" type="button" data-go="home">Back</button><h2>Settings</h2><p>Social connect</p><div class="socials"><button type="button" data-soon="x" aria-label="X">' + icons.x + '</button><button type="button" data-soon="fb" aria-label="Facebook">' + icons.fb + '</button><button type="button" data-soon="ig" aria-label="Instagram">' + icons.ig + '</button></div><p class="soon" id="soonNote">Coming soon — connect is not live yet.</p><div class="stack"><button type="button" id="musicToggle">Music ' + (paused ? "off" : "on") + '</button><button type="button" id="muteToggle">Sound ' + (muted ? "off" : "on") + '</button></div>';
      body.querySelectorAll("[data-soon]").forEach(b => b.onclick = () => { document.getElementById("soonNote").textContent = "Coming soon. " + b.getAttribute("aria-label") + " connect is not switched on yet."; });
      body.querySelector("#musicToggle").onclick = () => { setPause(!paused); render("settings"); };
      body.querySelector("#muteToggle").onclick = () => { setMute(!muted); render("settings"); };
    } else if (screen === "community") {
      body.innerHTML = '<button class="ghost" type="button" data-go="home">Back</button><h2>Community</h2>'
        + '<h3>Freebies</h3><p class="muted">Follow Futuret3Ch. The free Scout is reserved on this phone. It is not paid on-chain until the T3X vault is connected.</p>'
        + '<div class="socials"><button type="button" aria-label="X">' + icons.x + '</button><button type="button" aria-label="Facebook">' + icons.fb + '</button><button type="button" aria-label="Instagram">' + icons.ig + '</button></div>'
        + '<p class="soon">Follow links coming soon.</p>'
        + '<button class="wide" type="button" id="reserve">' + (meta.freeUsed ? "Free Scout already used" : meta.freeScout ? "Free Scout reserved" : "Reserve free Scout") + '</button>'
        + '<h3>T3X Vault</h3><p class="muted">One vault. Connect is coming soon. Every wallet will be accepted — Futuret3Ch is standing up its own chain, with bridging.</p>'
        + '<a class="wide" href="https://t3x-wallet.vercel.app/" target="_blank" rel="noreferrer">T3X Vault</a>'
        + '<h3>My friends</h3><p class="muted">Names stay on this device. Invites are coming soon.</p>'
        + '<div class="row"><input id="friendName" placeholder="Name" style="flex:1;min-height:44px;border-radius:12px;border:1px solid var(--line);background:#07090c;color:inherit;padding:0 10px"><button type="button" id="addFriend">Add</button></div>'
        + '<div class="stack" id="friendList"></div>'
        + '<h3>Leaderboard</h3><p class="soon">Coming soon</p>';
      body.querySelector("#reserve").onclick = () => { meta.freeScout = true; saveMeta(); render("community"); };
      body.querySelector("#addFriend").onclick = () => {
        const name = body.querySelector("#friendName").value.trim();
        if (!name) return;
        meta.friends.unshift(name.slice(0, 24));
        meta.friends = meta.friends.slice(0, 12);
        saveMeta();
        render("community");
      };
      const list = body.querySelector("#friendList");
      meta.friends.forEach((name, i) => {
        const row = document.createElement("div");
        row.className = "slot";
        row.innerHTML = "<b>" + name.replace(/[&<>]/g, "") + '</b><button type="button">Remove</button>';
        row.querySelector("button").onclick = () => { meta.friends.splice(i, 1); saveMeta(); render("community"); };
        list.appendChild(row);
      });
    } else if (screen === "updates") {
      body.innerHTML = '<button class="ghost" type="button" data-go="home">Back</button><h2>Updates</h2><div class="stack"><article class="box"><b>Now</b><p class="muted">Menu, trailer you can download, three save slots, pass-and-play, community, and the card tray.</p></article><article class="box"><b>Board</b><p class="muted">The phone map stays visible. End turn is no longer cut off.</p></article><article class="box"><b>Rules</b><p class="muted">Bright hexes are moves. Energy builds. Data repairs. 31 of 61 wins.</p></article></div>';
    } else if (screen === "cards") {
      openCards();
      closeShell();
      return;
    }
    body.querySelectorAll("[data-go]").forEach(b => b.onclick = () => {
      const go = b.getAttribute("data-go");
      if (go === "play") newBattle(false);
      else if (go === "continue") loadSlot(saves[0].id);
      else if (go === "back") closeShell();
      else render(go);
    });
    body.querySelectorAll("[data-load]").forEach(b => b.onclick = () => loadSlot(Number(b.getAttribute("data-load"))));
    body.querySelectorAll("[data-del]").forEach(b => b.onclick = () => deleteSlot(Number(b.getAttribute("data-del"))));
  }

  function openCards() {
    const tray = document.getElementById("cards");
    const row = document.getElementById("cardRow");
    tray.hidden = false;
    if (row.childElementCount) return;
    [["scout", "Scout", "20 Energy · walks 2"], ["defender", "Defender", "35 · holds a hex"], ["attacker", "Attacker", "50 · hits for 28"], ["artillery", "Artillery", "65 · shoots 2"]].forEach(([kind, name, line]) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gcard";
      btn.innerHTML = '<img alt="" src="media/card-' + kind + '.jpg"><span><b>' + name + '</b><span class="muted">' + line + '</span></span>';
      btn.onclick = () => { if (G.S.phase === "play") G.build(kind); };
      row.appendChild(btn);
    });
  }

  document.getElementById("menuBtn").onclick = () => openShell("home");
  document.getElementById("cardsBtn").onclick = () => {
    const tray = document.getElementById("cards");
    if (tray.hidden) openCards(); else tray.hidden = true;
  };
  document.getElementById("cardsClose").onclick = () => { document.getElementById("cards").hidden = true; };
  document.getElementById("pauseBtn").onclick = () => { ensureAudio(); setPause(!paused); };
  document.getElementById("muteBtn").onclick = () => { ensureAudio(); setMute(!muted); };
  render("home");
})();
