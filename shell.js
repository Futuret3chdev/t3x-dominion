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
  const EARN_GOAL = 21 * 24 * 60 * 60 * 1000;
  let earnStamp = Date.now();
  function paintEarn() {
    const pct = Math.min(100, ((meta.earnMs || 0) / EARN_GOAL) * 100);
    document.querySelectorAll(".earnfill").forEach(el => { el.style.width = pct + "%"; });
    const held = meta.t3xHeld || 0;
    const label = (held ? held + " held · " : "") + pct.toFixed(1) + "%";
    document.querySelectorAll(".earnread").forEach(el => { el.textContent = label; });
  }
  function accrueEarn() {
    const now = Date.now();
    const dt = Math.min(30000, Math.max(0, now - earnStamp));
    earnStamp = now;
    if (!document.hidden && dt > 0) {
      meta.earnMs = (meta.earnMs || 0) + dt;
      if (meta.earnMs >= EARN_GOAL) {
        meta.earnMs -= EARN_GOAL;
        meta.t3xHeld = (meta.t3xHeld || 0) + 1;
        if (G && G.S) {
          G.S.flash = "1 T3X earned. It stays on this device until the vault pays it.";
          G.draw();
        }
      }
      saveMeta();
    }
    paintEarn();
  }
  window.paintEarn = paintEarn;
  setInterval(accrueEarn, 5000);
  paintEarn();
  function readSaves() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function writeSaves(rows) { localStorage.setItem(SAVE_KEY, JSON.stringify(rows)); }

  const TRACKS = [
    { src: "media/in-flight.mp3", title: "In Flight" },
    { src: "media/where-we-belong.mp3", title: "Where We Belong" },
    { src: "media/there-be-dragons.mp3", title: "There Be Dragons" }
  ];
  let music = null, track = 0;
  function playTrack(i) {
    track = ((i % TRACKS.length) + TRACKS.length) % TRACKS.length;
    if (!music) {
      music = new Audio();
      music.preload = "auto";
      music.volume = 0.55;
      music.addEventListener("ended", () => playTrack(track + 1));
    }
    music.src = TRACKS[track].src;
    music.muted = muted;
    if (paused) return;
    const pending = music.play();
    if (pending) pending.catch(function () {});
  }
  function ensureAudio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.2;
        master.connect(ctx.destination);
      }
    }
    if (ctx && ctx.state === "suspended" && !paused) ctx.resume();
    if (!music) playTrack(track);
    else if (!paused && music.paused) {
      const pending = music.play();
      if (pending) pending.catch(function () {});
    }
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
    if (master) master.gain.value = muted || paused ? 0 : 0.2;
    if (music) music.muted = muted;
    document.getElementById("muteBtn").classList.toggle("is-muted", muted);
  }
  function setPause(on) {
    paused = on;
    if (ctx) on ? ctx.suspend() : ctx.resume();
    if (master && !on) master.gain.value = muted ? 0 : 0.2;
    if (music) {
      if (on) music.pause();
      else if (!muted) {
        const pending = music.play();
        if (pending) pending.catch(function () {});
      }
    }
    document.getElementById("pauseBtn").classList.toggle("is-paused", paused);
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
    ig: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M8 5v14l12-7z"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M14 6l-6 6 6 6 1.4-1.4L10.8 12l4.6-4.6z"/></svg>',
    film: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M4 6h12v12H4zm14 2h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2zM6 8h2v2H6zm0 6h2v2H6z"/></svg>',
    save: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M5 3h11l3 3v15H5zm2 2v6h8V5zm0 10v4h10v-4z"/></svg>',
    people: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><circle cx="8" cy="9" r="2.4" fill="currentColor"/><circle cx="16" cy="9" r="2.4" fill="currentColor"/><path fill="currentColor" d="M3.5 18c.4-2.4 2.3-3.6 4.5-3.6s4.1 1.2 4.5 3.6zm8 0c.3-1.6 1.2-2.8 2.6-3.4 1.6-.2 3.3.7 3.9 3.4z"/></svg>',
    cards: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><rect x="3" y="6" width="12" height="15" rx="2" transform="rotate(-10 9 13)" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="8" y="4" width="12" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    spark: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z"/></svg>',
    cog: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm8.5 3.2l-1.8-.4a6.6 6.6 0 0 0-.8-1.8l1-1.5-1.4-1.4-1.5 1a6.6 6.6 0 0 0-1.8-.8l-.4-1.8h-2l-.4 1.8a6.6 6.6 0 0 0-1.8.8l-1.5-1-1.4 1.4 1 1.5a6.6 6.6 0 0 0-.8 1.8l-1.8.4v2l1.8.4a6.6 6.6 0 0 0 .8 1.8l-1 1.5 1.4 1.4 1.5-1a6.6 6.6 0 0 0 1.8.8l.4 1.8h2l.4-1.8a6.6 6.6 0 0 0 1.8-.8l1.5 1 1.4-1.4-1-1.5a6.6 6.6 0 0 0 .8-1.8l1.8-.4z"/></svg>',
    hall: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M4 20V10l8-6 8 6v10h-5v-6H9v6z"/></svg>',
    loop: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M7 7h9l-2-2m2 2l-2 2M17 17H8l2 2m-2-2l2-2"/></svg>'
  };
  function tile(go, label, icon, extra) {
    return '<button class="tile ' + (extra || "") + '" type="button" data-go="' + go + '" aria-label="' + label + '"><span class="ticon">' + icons[icon] + '</span><span class="tlabel">' + label + '</span></button>';
  }

  function walletSession() {
    try { return JSON.parse(localStorage.getItem("dominion-wallet") || "null"); }
    catch (e) { return null; }
  }
  function walletProvider(id) {
    const w = window;
    if (id === "phantom") return (w.phantom && w.phantom.solana) || (w.solana && w.solana.isPhantom ? w.solana : null);
    if (id === "solflare") return w.solflare || (w.solana && w.solana.isSolflare ? w.solana : null);
    if (id === "backpack") return (w.backpack && (w.backpack.solana || w.backpack)) || (w.solana && w.solana.isBackpack ? w.solana : null);
    return null;
  }
  function paintWallet(box) {
    if (!box) return;
    box.innerHTML = "";
    const note = document.createElement("p");
    note.className = "muted";
    const session = walletSession();
    if (session && session.address) {
      const who = document.createElement("p");
      who.innerHTML = "<b>" + session.name + "</b> · " + session.address.slice(0, 4) + "…" + session.address.slice(-4);
      const off = document.createElement("button");
      off.type = "button";
      off.textContent = "Disconnect";
      off.onclick = () => { localStorage.removeItem("dominion-wallet"); render("community"); };
      box.appendChild(who);
      box.appendChild(off);
    } else {
      [["phantom", "Phantom"], ["solflare", "Solflare"], ["backpack", "Backpack"]].forEach(([id, label]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.onclick = async () => {
          const provider = walletProvider(id);
          if (!provider) {
            const here = encodeURIComponent(location.href);
            const open = {
              phantom: "https://phantom.app/ul/browse/" + here + "?ref=" + here,
              solflare: "https://solflare.com/ul/v1/browse/" + here + "?ref=" + here,
              backpack: "https://backpack.app/ul/v1/browse/" + here + "?ref=" + here
            };
            window.open(open[id], "_blank", "noopener");
            note.textContent = "That wallet is not in this browser. It was opened so you can connect, then come back.";
            return;
          }
          try {
            const res = await provider.connect();
            const key = (res && res.publicKey) || provider.publicKey;
            const address = key && key.toString ? key.toString() : "";
            if (!address) throw new Error("no address");
            localStorage.setItem("dominion-wallet", JSON.stringify({ name: label, address: address }));
            render("community");
          } catch (e) {
            note.textContent = "The wallet did not connect. Try again, or open T3X Vault.";
          }
        };
        box.appendChild(b);
      });
    }
    const vault = document.createElement("a");
    vault.className = "wide";
    vault.href = "https://t3x-wallet.vercel.app/";
    vault.target = "_blank";
    vault.rel = "noreferrer";
    vault.textContent = "T3X Vault";
    box.appendChild(vault);
    box.appendChild(note);
  }

  function render(screen) {
    const body = document.getElementById("shellBody");
    const saves = readSaves();
    if (screen === "home") {
      body.innerHTML = ''
        + '<div class="kicker">Presented by Futuret3Ch</div>'
        + '<div class="row"><h2>T3X DOMINION</h2><span>'
        + '<a class="mark" href="https://futuret3ch.com.au" target="_blank" rel="noreferrer"><img src="brand/futuret3ch-mark.png" alt="Futuret3Ch"></a> '
        + '<a class="mark" href="https://t3x.futuret3ch.com.au" target="_blank" rel="noreferrer"><img src="brand/t3x-badge.png" alt="T3X"></a></span></div>'
        + '<p class="muted">Hold half the grid.</p>'
        + '<div class="iconmenu">'
        + tile("play", "Play", "play", "play")
        + (saves[0] ? tile("continue", "Continue", "loop") : "")
        + tile("trailer", "Trailer", "film")
        + tile("saves", "Saves", "save")
        + tile("multi", "Multiplayer", "people")
        + tile("cards", "Cards", "cards")
        + tile("community", "Community", "hall")
        + tile("updates", "Updates", "spark")
        + tile("settings", "Settings", "cog")
        + (G.S && G.S.phase !== "briefing" ? tile("back", "Back", "back") : "")
        + '</div><p class="menuhint" id="menuHint"></p>'
        + '<div class="earn"><span>Earn 1 T3X</span><div class="earnbar"><i class="earnfill"></i></div><b class="earnread">0%</b></div>'
        + '<p class="muted">Leave the game open. A full bar takes about three weeks. At 100% this device holds 1 T3X until the vault pays it.</p>';
    } else if (screen === "trailer") {
      body.innerHTML = '<button class="iconbtn" type="button" data-go="home" aria-label="Back">' + icons.back + '</button><h2>Trailer</h2><p class="muted">T3X Dominion, the Futuret3Ch and T3X logos, and the T3X supported ecosystem. Play it here or keep the file.</p><video class="trailer" controls playsinline src="media/trailer.mp4?v=brand"></video><p><a class="wide" style="display:inline-block" href="media/trailer.mp4?v=brand" download="t3x-dominion-trailer.mp4">Download trailer</a></p>';
    } else if (screen === "saves") {
      body.innerHTML = '<button class="iconbtn" type="button" data-go="home" aria-label="Back">' + icons.back + '</button><h2>Saves</h2><p class="muted">Three slots on this device. The newest replaces the oldest.</p><button class="wide" type="button" id="saveNow">Save this battle</button><div class="stack" id="slotList"></div>';
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
      body.innerHTML = '<button class="iconbtn" type="button" data-go="home" aria-label="Back">' + icons.back + '</button><h2>Multiplayer</h2><div class="stack"><button type="button" id="hotseat"><b>Pass and play</b><span class="muted" style="display:block">Two people, one phone. Teal, then crimson.</span></button><button type="button" disabled><b>Online rooms</b><span class="soon" style="display:block">Coming soon</span></button></div>';
      body.querySelector("#hotseat").onclick = () => newBattle(true);
    } else if (screen === "settings") {
      body.innerHTML = '<button class="iconbtn" type="button" data-go="home" aria-label="Back">' + icons.back + '</button><h2>Settings</h2><p>Music</p><p class="muted" id="nowPlaying">Playing ' + TRACKS[track].title + '. The three tracks loop.</p><div class="stack"><button type="button" id="musicToggle">Music ' + (paused ? "off" : "on") + '</button><button type="button" id="nextTrack">Next track</button><button type="button" id="muteToggle">Sound ' + (muted ? "off" : "on") + '</button></div><p>Social connect</p><div class="socials"><button type="button" data-soon="x" aria-label="X">' + icons.x + '</button><button type="button" data-soon="fb" aria-label="Facebook">' + icons.fb + '</button><button type="button" data-soon="ig" aria-label="Instagram">' + icons.ig + '</button></div><p class="soon" id="soonNote">Coming soon — connect is not live yet.</p>';
      body.querySelectorAll("[data-soon]").forEach(b => b.onclick = () => { document.getElementById("soonNote").textContent = "Coming soon. " + b.getAttribute("aria-label") + " connect is not switched on yet."; });
      body.querySelector("#musicToggle").onclick = () => { ensureAudio(); setPause(!paused); render("settings"); };
      body.querySelector("#nextTrack").onclick = () => { ensureAudio(); playTrack(track + 1); render("settings"); };
      body.querySelector("#muteToggle").onclick = () => { setMute(!muted); render("settings"); };
    } else if (screen === "community") {
      body.innerHTML = '<button class="iconbtn" type="button" data-go="home" aria-label="Back">' + icons.back + '</button><h2>Community</h2>'
        + '<h3>Freebies</h3><p class="muted">Follow Futuret3Ch. The free Scout is reserved on this phone. It is not paid on-chain until the T3X vault is connected.</p>'
        + '<div class="socials"><button type="button" aria-label="X">' + icons.x + '</button><button type="button" aria-label="Facebook">' + icons.fb + '</button><button type="button" aria-label="Instagram">' + icons.ig + '</button></div>'
        + '<p class="soon">Follow links coming soon.</p>'
        + '<button class="wide" type="button" id="reserve">' + (meta.freeUsed ? "Free Scout already used" : meta.freeScout ? "Free Scout reserved" : "Reserve free Scout") + '</button>'
        + '<h3>T3X Vault</h3><p class="muted">Choose Phantom, Solflare, or Backpack, or open T3X Vault. Every wallet will be accepted. Futuret3Ch is standing up its own chain, with bridging.</p>'
        + '<div class="stack" id="walletBox"></div>'
        + '<h3>Collections</h3><div id="colRoot"></div>'
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
      if (window.Collections) Collections.mount(document.getElementById("colRoot"));
      paintWallet(document.getElementById("walletBox"));
    } else if (screen === "updates") {
      body.innerHTML = '<button class="iconbtn" type="button" data-go="home" aria-label="Back">' + icons.back + '</button><h2>Updates</h2><div class="stack"><article class="box"><b>Now</b><p class="muted">Menu, trailer you can download, three save slots, pass-and-play, community, and the card tray.</p></article><article class="box"><b>Board</b><p class="muted">The phone map stays visible. End turn is no longer cut off.</p></article><article class="box"><b>Rules</b><p class="muted">Bright hexes are moves. Energy builds. Data repairs. 31 of 61 wins.</p></article></div>';
    } else if (screen === "cards") {
      openCards();
      closeShell();
      return;
    }
    body.querySelectorAll(".tile").forEach(b => {
      const show = () => { const h = document.getElementById("menuHint"); if (h) h.textContent = b.getAttribute("aria-label"); };
      b.onpointerenter = show;
      b.onfocus = show;
    });
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
    const units = document.getElementById("unitRow");
    const powers = document.getElementById("powerRow");
    tray.hidden = false;
    if (units.childElementCount) { if (window.DominionCards) DominionCards.sync(); return; }
    const card = (id, name, line, art) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gcard";
      btn.innerHTML = '<img alt="" src="' + art + '"><span><b>' + name + '</b><span class="muted">' + line + '</span></span>';
      btn.onclick = () => { if (window.DominionCards) DominionCards.open(id); };
      return btn;
    };
    [["scout", "Scout", "20 Energy · walks 2"], ["defender", "Defender", "35 · holds a hex"], ["attacker", "Attacker", "50 · hits for 28"], ["artillery", "Artillery", "65 · shoots 2"]].forEach(([id, name, line]) => {
      units.appendChild(card(id, name, line, "media/card-" + id + ".jpg"));
    });
    [["energy", "Energy", "Builds units", "energy"], ["data", "Data", "Repairs only", "data"], ["power-ration", "Field Ration", "Power", "ration"], ["power-scrap", "Scrap Charge", "Power", "scrap"], ["power-relay", "Relay Tap", "Power", "relay"], ["power-oil", "Night Oil", "Power", "oil"], ["power-barrel", "Spare Barrel", "Power", "barrel"], ["power-map", "Map Scrap", "Power", "map"], ["power-cloth", "Banner Cloth", "Power", "cloth"], ["power-coal", "Forge Coal", "Power", "coal"], ["power-flare", "Signal Flare", "Power", "flare"], ["power-medic", "Medic Kit", "Power", "medic"], ["power-pin", "Siege Pin", "Power", "pin"], ["power-coin", "Oath Coin", "Power", "coin"]].forEach(([id, name, line, art]) => {
      powers.appendChild(card(id, name, line, "media/card-" + art + ".jpg"));
    });
    if (window.DominionCards) DominionCards.sync();
  }

  const cog = document.getElementById("cogBtn");
  const pop = document.getElementById("cogPop");
  cog.onclick = (e) => {
    e.stopPropagation();
    pop.hidden = !pop.hidden;
    cog.classList.toggle("open", !pop.hidden);
    cog.setAttribute("aria-expanded", String(!pop.hidden));
  };
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".cogwrap")) { pop.hidden = true; cog.classList.remove("open"); cog.setAttribute("aria-expanded", "false"); }
  });
  document.getElementById("menuBtn").onclick = () => { pop.hidden = true; cog.classList.remove("open"); openShell("home"); };
  document.getElementById("cardsBtn").onclick = () => {
    const tray = document.getElementById("cards");
    if (tray.hidden) openCards(); else tray.hidden = true;
  };
  document.getElementById("cardsClose").onclick = () => { document.getElementById("cards").hidden = true; if (window.DominionCards) DominionCards.sync(); };
  document.getElementById("hudPull").onclick = () => document.querySelector(".app").classList.toggle("hudopen");
  document.getElementById("pauseBtn").onclick = () => { ensureAudio(); setPause(!paused); };
  document.getElementById("muteBtn").onclick = () => { ensureAudio(); setMute(!muted); };
  render("home");
})();
