import * as K from "./fb.js";
const { auth, db, storage, doc, collection, query, where, orderBy, limit, getDoc, getDocs, setDoc, updateDoc, addDoc, deleteDoc, onSnapshot, runTransaction, serverTimestamp, getAggregateFromServer, count, sum, ref, getDownloadURL } = K;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const n2 = v => (Number(v) || 0).toFixed(2);
const when = d => d?.toDate ? d.toDate().toLocaleString() : "";
const tag = s => `<span class="tag ${esc(s)}">${esc(s)}</span>`;
const view = $("#view");
const loader = () => `<p class="spin">Loading…</p>`;
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 3000); }

let me = null, admin = null;
const isOwner = () => admin?.role === "owner";
const users = new Map(), counts = {};
const audit = (action, target, detail = "") => addDoc(collection(db, "auditLogs"), { by: me.uid, email: me.email || me.phoneNumber || "", action, target, detail, createdAt: serverTimestamp() }).catch(e => console.error(e));

async function getUser(uid, fresh = false) {
  if (fresh || !users.has(uid)) { const s = await getDoc(doc(db, "users", uid)); users.set(uid, s.exists() ? { id: uid, ...s.data() } : { id: uid, name: "(deleted user)" }); }
  return users.get(uid);
}
const uname = uid => { const u = users.get(uid); return esc(u?.name || uid); };

// ---------- UI helpers ----------
function modal(title, body) {
  const m = document.createElement("div"); m.className = "modal";
  m.innerHTML = `<div class="mcard"><div class="mhead"><b>${esc(title)}</b><button class="x" aria-label="Close">✕</button></div><div class="mbody">${body}</div></div>`;
  m.querySelector(".x").onclick = () => m.remove();
  m.addEventListener("click", e => { if (e.target === m) m.remove(); });
  document.body.appendChild(m); return m;
}
function lightbox(url) {
  const m = document.createElement("div"); m.className = "lightbox";
  m.innerHTML = `<img src="${esc(url)}" alt=""><button class="x" aria-label="Close">✕</button>`;
  m.querySelector(".x").onclick = () => m.remove();
  m.addEventListener("click", e => { if (e.target === m) m.remove(); });
  document.body.appendChild(m);
}
function askForm(title, fields, ok = "Save") {
  return new Promise(res => {
    const body = fields.map(f => `<label class="lbl">${esc(f.label)}</label>` + (f.type === "select"
      ? `<select id="f_${f.id}">${f.options.map(o => `<option ${o === f.value ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`
      : f.type === "textarea" ? `<textarea id="f_${f.id}" rows="4" placeholder="${esc(f.placeholder || "")}">${esc(f.value || "")}</textarea>`
      : `<input id="f_${f.id}" type="${f.type || "text"}" step="any" value="${esc(f.value ?? "")}" placeholder="${esc(f.placeholder || "")}">`)).join("") + `<button class="btn primary full" id="f_ok">${esc(ok)}</button>`;
    const m = modal(title, body);
    m.querySelector(".x").addEventListener("click", () => res(null));
    m.querySelector("#f_ok").onclick = () => {
      const v = {};
      for (const f of fields) { v[f.id] = m.querySelector("#f_" + f.id).value.trim(); if (f.required && !v[f.id]) return toast(`${f.label} is required`); }
      m.remove(); res(v);
    };
  });
}
function csv(name, rows, cols) {
  const e = v => { let s = typeof v?.toDate === "function" ? v.toDate().toISOString() : String(v ?? ""); if (/^[=+\-@]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
  const t = [cols.join(","), ...rows.map(r => cols.map(c => e(r[c])).join(","))].join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([t], { type: "text/csv" })); a.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
}
const tabsHtml = (opts, cur) => `<div class="tabs">${opts.map(o => `<button class="btn sm ${o === cur ? "on" : ""}" data-tab="${o}">${o[0].toUpperCase() + o.slice(1)}</button>`).join("")}</div>`;

// ---------- Auth ----------
const show = id => ["login", "denied", "shell"].forEach(x => $("#" + x).classList.toggle("hidden", x !== id));
const authErr = e => ({ "auth/invalid-credential": "Wrong email or password", "auth/user-not-found": "No account found", "auth/wrong-password": "Wrong email or password", "auth/too-many-requests": "Too many attempts, try later", "auth/popup-closed-by-user": "Cancelled", "auth/operation-not-allowed": "Login method not enabled in Firebase", "auth/unauthorized-domain": "Domain not authorized in Firebase" }[e.code] || e.message);
$("#loginForm").addEventListener("submit", async e => { e.preventDefault(); $("#loginMsg").textContent = ""; try { await K.signInWithEmailAndPassword(auth, $("#email").value.trim(), $("#password").value); } catch (err) { $("#loginMsg").textContent = authErr(err); } });
$("#googleBtn").addEventListener("click", async () => { try { await K.signInWithPopup(auth, new K.GoogleAuthProvider()); } catch (err) { $("#loginMsg").textContent = authErr(err); } });
$("#forgot").addEventListener("click", async e => { e.preventDefault(); const em = $("#email").value.trim(); if (!em) return ($("#loginMsg").textContent = "Enter your email first"); try { await K.sendPasswordResetEmail(auth, em); toast("Reset email sent"); } catch (err) { $("#loginMsg").textContent = authErr(err); } });
["#outBtn", "#deniedOut"].forEach(s => $(s).addEventListener("click", () => K.signOut(auth)));
$("#copyUid").addEventListener("click", () => navigator.clipboard?.writeText($("#uidBox").textContent).then(() => toast("UID copied")));

let started = false;
K.onAuthStateChanged(auth, async u => {
  me = u; if (!u) { admin = null; return show("login"); }
  try {
    const s = await getDoc(doc(db, "admins", u.uid));
    if (!s.exists()) { $("#uidBox").textContent = u.uid; return show("denied"); }
    admin = s.data();
  } catch (e) { console.error(e); $("#uidBox").textContent = u.uid; return show("denied"); }
  show("shell"); start();
});

// ---------- Navigation ----------
const NAV = [
  ["dashboard", "▦ Dashboard"], ["grp", "REVIEW"], ["kyc", "✔ Verifications"], ["deposits", "＋ Deposits", 1], ["withdrawals", "↗ Withdrawals", 1], ["redemptions", "★ Redemptions", 1], ["levelRequests", "◉ Level requests", 1],
  ["grp", "PEOPLE"], ["users", "☺ Users"], ["messages", "✉ Messages"], ["grp", "CONTENT"], ["announcements", "📣 Announcements"], ["mall", "🛍 Points mall"],
  ["grp", "SYSTEM"], ["settings", "⚙ Settings", 1], ["admins", "🛡 Admins", 1], ["audit", "☰ Audit log", 1]
];
const TITLES = Object.fromEntries(NAV.filter(n => n[0] !== "grp").map(n => [n[0], n[1].replace(/^\S+\s/, "")]));
function buildNav() {
  $("#nav").innerHTML = NAV.filter(n => !n[2] || isOwner()).map(([id, label]) => id === "grp" ? `<div class="grp">${label}</div>` : `<a href="#${id}" data-id="${id}">${label}<span class="badge hidden" id="b_${id}"></span></a>`).join("");
}
function badges() { for (const k of ["kyc", "deposits", "withdrawals", "redemptions", "levelRequests"]) { const b = $("#b_" + k); if (b) { b.textContent = counts[k] || 0; b.classList.toggle("hidden", !counts[k]); } } }
function start() {
  $("#meBox").textContent = me.email || me.phoneNumber || me.uid; $("#roleTag").textContent = admin.role; $("#roleTag").className = "tag " + admin.role;
  buildNav();
  if (!started) {
    started = true;
    window.addEventListener("hashchange", route);
    $("#menuBtn").onclick = () => toggleDrawer(true); $("#backdrop").onclick = () => toggleDrawer(false);
  }
  const kinds = ["kyc"].concat(isOwner() ? ["deposits", "withdrawals", "redemptions", "levelRequests"] : []);
  kinds.forEach(k => onSnapshot(query(collection(db, k), where("status", "==", "pending")), s => { counts[k] = s.size; badges(); }, console.error));
  route();
}
const toggleDrawer = o => { $("#drawer").classList.toggle("open", o); $("#backdrop").classList.toggle("open", o); };
async function route() {
  toggleDrawer(false); $$(".modal").forEach(m => m.remove());
  let id = location.hash.slice(1) || "dashboard";
  if (!TITLES[id] || (NAV.find(n => n[0] === id)?.[2] && !isOwner())) id = "dashboard";
  $$("#nav a").forEach(a => a.classList.toggle("active", a.dataset.id === id));
  $("#pageTitle").textContent = TITLES[id]; view.onclick = null; view.innerHTML = loader(); window.scrollTo(0, 0);
  try { await VIEWS[id](id); } catch (e) { console.error(e); view.innerHTML = `<p class="empty">Could not load: ${esc(e.message)}<br><small>${esc(e.code || "")}</small></p>`; }
}
const refresh = () => route();

// ---------- Dashboard ----------
async function vDashboard() {
  const [agg, ver, dep, wd, logs] = await Promise.all([
    getAggregateFromServer(collection(db, "users"), { n: count(), bal: sum("balance"), frz: sum("frozen"), pts: sum("points") }).then(r => r.data()).catch(() => ({})),
    getAggregateFromServer(query(collection(db, "kyc"), where("status", "==", "approved")), { n: count() }).then(r => r.data().n).catch(() => 0),
    isOwner() ? getDocs(query(collection(db, "deposits"), orderBy("createdAt", "desc"), limit(300))) : null,
    isOwner() ? getDocs(query(collection(db, "withdrawals"), orderBy("createdAt", "desc"), limit(300))) : null,
    isOwner() ? getDocs(query(collection(db, "auditLogs"), orderBy("createdAt", "desc"), limit(8))) : null
  ]);
  const rows = s => s ? s.docs.map(d => d.data()) : [];
  const D = rows(dep), W = rows(wd), approved = r => r.filter(x => x.status === "approved").reduce((a, x) => a + (Number(x.amount) || 0), 0);
  const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toDateString(); });
  const per = (r, d) => r.filter(x => x.status === "approved" && x.createdAt?.toDate && x.createdAt.toDate().toDateString() === d).reduce((a, x) => a + (Number(x.amount) || 0), 0);
  const dv = days.map(d => per(D, d)), wv = days.map(d => per(W, d)), mx = Math.max(1, ...dv, ...wv);
  const stat = (l, v) => `<div class="stat"><small>${l}</small><b>${v}</b></div>`;
  view.innerHTML = `<div class="grid">${stat("Users", agg.n ?? "—")}${stat("Verified users", ver)}${stat("Pending verifications", counts.kyc || 0)}
    ${isOwner() ? stat("Pending deposits", counts.deposits || 0) + stat("Pending withdrawals", counts.withdrawals || 0) + stat("Pending redemptions", counts.redemptions || 0) : ""}
    ${stat("Total user balance", n2(agg.bal) + " USDT")}${stat("Frozen", n2(agg.frz) + " USDT")}${stat("Points issued", n2(agg.pts))}
    ${isOwner() ? stat("Approved deposits*", n2(approved(D)) + " USDT") + stat("Approved withdrawals*", n2(approved(W)) + " USDT") : ""}</div>
    ${isOwner() ? `<div class="card"><h3>Last 7 days (approved)</h3><div class="muted">■ deposits &nbsp; <span style="color:var(--warn)">■</span> withdrawals</div>
    <div class="bars">${days.map((d, i) => `<div><span><i class="d" style="height:${dv[i] / mx * 100}%"></i><i class="w" style="height:${wv[i] / mx * 100}%"></i></span>${d.slice(4, 10)}</div>`).join("")}</div><p class="muted">*based on the latest 300 requests</p></div>
    <div class="card"><h3>Recent admin activity</h3>${rows(logs).map(l => `<div class="row"><span>${esc(l.action)} <span class="muted">${esc(l.detail)}</span></span><span class="muted">${esc(when(l.createdAt))}</span></div>`).join("") || `<p class="muted">No activity yet.</p>`}</div>` : ""}`;
}

// ---------- Money / request queues ----------
const REQ = {
  deposits: { amt: r => `${n2(r.amount)} USDT`, info: r => `TXID: <code>${esc(r.txid)}</code>`, cols: ["id", "uid", "amount", "txid", "status", "note", "createdAt"] },
  withdrawals: { amt: r => `${n2(r.amount)} USDT`, info: r => `To: <code>${esc(r.address)}</code>`, cols: ["id", "uid", "amount", "address", "status", "note", "createdAt"] },
  redemptions: { amt: r => `${n2(r.points)} pts`, info: r => esc(r.title || ""), cols: ["id", "uid", "title", "points", "status", "note", "createdAt"] },
  levelRequests: { amt: r => esc(r.level), info: () => "", cols: ["id", "uid", "level", "status", "note", "createdAt"] }
};
const filt = { deposits: "pending", withdrawals: "pending", redemptions: "pending", levelRequests: "pending", kyc: "pending" };
const STATUSES = ["pending", "approved", "rejected", "all"];
const ledgerEntry = (tx, uid, type, field, amount, after, refId) => tx.set(doc(collection(db, "ledger")), { uid, type, field, amount, after, ref: refId, by: me.uid, createdAt: serverTimestamp() });

async function decide(kind, row, approve) {
  if (!isOwner()) return toast("Owner only");
  let note = "";
  if (!approve) { const v = await askForm("Reject request", [{ id: "note", label: "Reason (stored in the record)", type: "textarea" }], "Reject"); if (!v) return; note = v.note; }
  else if (kind === "withdrawals") { const v = await askForm("Approve withdrawal", [{ id: "note", label: "Payout TXID / note (optional)" }], "Approve payout (release frozen)"); if (!v) return; note = v.note; }
  else if (!confirm(kind === "deposits" ? `Approve and credit ${n2(row.amount)} USDT?` : "Approve this request?")) return;
  try {
    await runTransaction(db, async tx => {
      const rRef = doc(db, kind, row.id), uRef = doc(db, "users", row.uid);
      const r = await tx.get(rRef); if (!r.exists() || r.data().status !== "pending") throw new Error("Already processed");
      const u = await tx.get(uRef); if (approve && !u.exists()) throw new Error("User no longer exists");
      const d = r.data(), ud = u.data() || {}, bal = Number(ud.balance) || 0, frz = Number(ud.frozen) || 0, pts = Number(ud.points) || 0;
      if (approve) {
        if (kind === "deposits") { tx.update(uRef, { balance: bal + d.amount }); ledgerEntry(tx, row.uid, "deposit", "balance", d.amount, bal + d.amount, row.id); }
        if (kind === "withdrawals") { if (frz < d.amount) throw new Error(`Frozen (${n2(frz)}) is lower than the amount`); tx.update(uRef, { frozen: frz - d.amount }); ledgerEntry(tx, row.uid, "withdrawal", "frozen", -d.amount, frz - d.amount, row.id); }
        if (kind === "redemptions") { if (pts < d.points) throw new Error("User has fewer points than required"); tx.update(uRef, { points: pts - d.points }); ledgerEntry(tx, row.uid, "redeem", "points", -d.points, pts - d.points, row.id); }
        if (kind === "levelRequests") tx.update(uRef, { level: d.level });
      } else if (kind === "withdrawals" && u.exists()) {
        const back = Number(d.debit ?? d.amount) || 0;
        tx.update(uRef, { balance: bal + back, frozen: Math.max(0, frz - d.amount) });
        ledgerEntry(tx, row.uid, "withdrawal-refund", "balance", back, bal + back, row.id);
      }
      tx.update(rRef, { status: approve ? "approved" : "rejected", note, reviewedBy: me.uid, reviewedAt: serverTimestamp() });
    });
    users.delete(row.uid);
    audit(approve ? "approve" : "reject", `${kind}/${row.id}`, `${row.uid} ${REQ[kind].amt(row).replace(/<[^>]+>/g, "")}`);
    toast(approve ? "Approved" : "Rejected"); refresh();
  } catch (e) { console.error(e); toast(e.message); }
}

async function vRequests(kind) {
  const cfg = REQ[kind];
  const snap = await getDocs(query(collection(db, kind), orderBy("createdAt", "desc"), limit(300)));
  const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  await Promise.all([...new Set(rows.map(r => r.uid))].map(u => getUser(u)));
  let q = "";
  view.innerHTML = `<div class="row" style="margin-bottom:10px"><input id="q" placeholder="Search name, member ID, UID, TXID, address…" style="margin:0;flex:1;min-width:180px"><button class="btn sm" id="exp">Export CSV</button></div><div id="tabs"></div><div id="sum" class="muted" style="margin-bottom:8px"></div><div id="list"></div>`;
  const draw = () => {
    const list = rows.filter(r => (filt[kind] === "all" || r.status === filt[kind]) && (!q || JSON.stringify([users.get(r.uid)?.name, users.get(r.uid)?.memberId, users.get(r.uid)?.email, r.uid, r.txid, r.address, r.title]).toLowerCase().includes(q)));
    $("#tabs").innerHTML = tabsHtml(STATUSES, filt[kind]);
    const tot = list.reduce((a, r) => a + (Number(r.amount ?? r.points) || 0), 0);
    $("#sum").textContent = `${list.length} request(s)` + (kind === "deposits" || kind === "withdrawals" ? ` • total ${n2(tot)} USDT` : "");
    $("#list").innerHTML = list.length ? list.map(r => `<div class="card"><div class="row"><b><a href="#" data-user="${esc(r.uid)}">${uname(r.uid)}</a></b>${tag(r.status)}</div>
      <div class="row" style="margin-top:6px"><span style="font-size:18px;font-weight:800">${cfg.amt(r)}</span><span class="muted">${esc(when(r.createdAt))}</span></div>
      <div class="muted" style="margin-top:4px">${cfg.info(r)}</div>${r.note ? `<div class="muted">Note: ${esc(r.note)}</div>` : ""}
      ${r.status === "pending" ? `<div class="row start" style="margin-top:10px"><button class="btn ok sm" data-act="approve" data-id="${esc(r.id)}">Approve</button><button class="btn bad sm" data-act="reject" data-id="${esc(r.id)}">Reject</button></div>` : ""}</div>`).join("") : `<p class="empty">Nothing here.</p>`;
  };
  draw();
  $("#q").oninput = e => { q = e.target.value.toLowerCase(); draw(); };
  $("#exp").onclick = () => csv(kind, rows, cfg.cols);
  view.onclick = e => {
    const t = e.target.closest("[data-tab]"); if (t) { filt[kind] = t.dataset.tab; return draw(); }
    const a = e.target.closest("[data-act]"); if (a) return decide(kind, rows.find(r => r.id === a.dataset.id), a.dataset.act === "approve");
    const u = e.target.closest("[data-user]"); if (u) { e.preventDefault(); openUser(u.dataset.user); }
  };
}

// ---------- Identity verification ----------
async function vKyc() {
  const snap = await getDocs(query(collection(db, "kyc"), orderBy("createdAt", "desc"), limit(300)));
  const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  await Promise.all(rows.map(r => getUser(r.uid)));
  let q = "";
  view.innerHTML = `<input id="q" placeholder="Search name, document number, UID…"><div id="tabs"></div><div id="list"></div>`;
  const draw = () => {
    const list = rows.filter(r => (filt.kyc === "all" || r.status === filt.kyc) && (!q || JSON.stringify([r.fullName, r.docNumber, r.uid, r.country, users.get(r.uid)?.name]).toLowerCase().includes(q)));
    $("#tabs").innerHTML = tabsHtml(STATUSES, filt.kyc);
    const isUrl = v => /^https?:|^data:/.test(String(v || ""));
    const vsrc = v => isUrl(v) ? esc(v) : "";
    const tbox = "display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0";
    const timg = "width:100%;height:104px;object-fit:cover;border-radius:10px;display:block;background:#000;border:1px solid var(--line)";
    const tbtn = "background:none;border:0;padding:0;cursor:zoom-in;color:var(--muted);font-size:11px;text-align:center";
    const tph = "display:flex;align-items:center;justify-content:center;height:104px;border-radius:10px;border:1px dashed var(--line);color:var(--muted);font-size:10px;text-align:center;padding:4px";
    $("#list").innerHTML = list.length ? list.map(r => {
      const thumbs = ["Front", "Back", "Selfie"].map((l, i) => {
        const v = [r.front, r.back, r.selfie][i];
        return vsrc(v) ? `<button type="button" data-img="${vsrc(v)}" style="${tbtn}"><img src="${vsrc(v)}" alt="${l}" loading="lazy" style="${timg}"><span>${l}</span></button>` : `<span style="${tph}">${l}: not a link</span>`;
      }).join("");
      return `<div class="card"><div class="row"><b>${esc(r.fullName)}</b>${tag(r.status)}</div>
      <div class="muted">${esc(r.country)} • ${esc(r.docType)} • <code>${esc(r.docNumber)}</code></div><div class="muted">Account: ${uname(r.uid)} • ${esc(when(r.createdAt))}</div>
      <div style="${tbox}">${thumbs}</div>
      <div class="row start" style="margin-top:10px"><button class="btn primary sm" data-review="${esc(r.id)}">View / Review</button></div></div>`;
    }).join("") : `<p class="empty">Nothing here.</p>`;
  };
  draw();
  $("#q").oninput = e => { q = e.target.value.toLowerCase(); draw(); };
  view.onclick = e => { const t = e.target.closest("[data-tab]"); if (t) { filt.kyc = t.dataset.tab; return draw(); } const im = e.target.closest("[data-img]"); if (im) return lightbox(im.dataset.img); const r = e.target.closest("[data-review]"); if (r) reviewKyc(rows.find(x => x.id === r.dataset.review)); };
}
async function reviewKyc(r) {
  const urls = await Promise.all(["front", "back", "selfie"].map(k => {
    const v = r[k]; if (!v) return "";
    return /^https?:|^data:/.test(String(v)) ? String(v) : getDownloadURL(ref(storage, v)).catch(() => "");
  }));
  const m = modal("Review verification", `<div class="row"><b>${esc(r.fullName)}</b>${tag(r.status)}</div>
    <dl class="kv"><dt>Country</dt><dd>${esc(r.country)}</dd><dt>Document</dt><dd>${esc(r.docType)}</dd><dt>Number</dt><dd>${esc(r.docNumber)}</dd><dt>Account</dt><dd>${uname(r.uid)}</dd><dt>Submitted</dt><dd>${esc(when(r.createdAt))}</dd>${r.note ? `<dt>Note</dt><dd>${esc(r.note)}</dd>` : ""}</dl>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0">${["Front", "Back", "Live selfie"].map((l, i) => urls[i] ? `<button type="button" data-img="${esc(urls[i])}" style="background:none;border:0;padding:0;cursor:zoom-in;color:var(--muted);font-size:11px;text-align:center"><img src="${esc(urls[i])}" alt="${l}" style="width:100%;height:120px;object-fit:cover;border-radius:10px;display:block;background:#000;border:1px solid var(--line)"><span>${l}</span></button>` : `<span class="muted">${l}: unavailable</span>`).join("")}</div>
    <p class="muted">Tap an image to open it full size. Check the name/number match the document and that the selfie matches the photo.</p>
    <div class="row start">${r.status !== "approved" ? `<button class="btn ok" id="kOk">Approve</button>` : `<button class="btn bad" id="kBad">Revoke</button>`}${r.status === "pending" ? `<button class="btn bad" id="kBad">Reject</button>` : ""}<button class="btn" id="kUser">Open user</button></div>`);
  const set = async status => {
    let note = "";
    if (status === "rejected") { const v = await askForm(r.status === "approved" ? "Revoke verification" : "Reject verification", [{ id: "note", label: "Reason (user can see this)", type: "textarea", required: true }], "Confirm"); if (!v) return; note = v.note; }
    try { await updateDoc(doc(db, "kyc", r.uid), { status, note, reviewedBy: me.uid, reviewedAt: serverTimestamp() }); audit(status === "approved" ? "kyc-approve" : "kyc-reject", `kyc/${r.uid}`, r.fullName); toast("Updated"); m.remove(); refresh(); } catch (e) { toast(e.message); }
  };
  m.querySelector("#kOk")?.addEventListener("click", () => set("approved"));
  m.querySelector("#kBad")?.addEventListener("click", () => set("rejected"));
  m.querySelector("#kUser").onclick = () => openUser(r.uid);
  m.addEventListener("click", e => { const im = e.target.closest("[data-img]"); if (im) lightbox(im.dataset.img); });
}

// ---------- Users ----------
const FIELDS = ["balance", "frozen", "points", "totalRevenue", "inviteRevenue", "todayEarnings", "nftCount"];
async function vUsers() {
  const [us, ks] = await Promise.all([getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"), limit(300))), getDocs(query(collection(db, "kyc"), orderBy("createdAt", "desc"), limit(500)))]);
  const rows = us.docs.map(d => ({ id: d.id, ...d.data() })); rows.forEach(u => users.set(u.id, u));
  const kmap = Object.fromEntries(ks.docs.map(d => [d.id, d.data().status]));
  let q = "", f = "all";
  view.innerHTML = `<div class="row" style="margin-bottom:10px"><input id="q" placeholder="Search name, member ID, email, phone, UID…" style="margin:0;flex:1;min-width:180px"><select id="f" style="margin:0;width:auto"><option>all</option><option>verified</option><option>unverified</option><option>blocked</option><option>has balance</option></select><button class="btn sm" id="exp">Export CSV</button></div><div id="sum" class="muted" style="margin-bottom:8px"></div><div id="list"></div>`;
  const draw = () => {
    const list = rows.filter(u => (!q || JSON.stringify([u.name, u.memberId, u.email, u.phone, u.id]).toLowerCase().includes(q)) &&
      (f === "all" || (f === "verified" && kmap[u.id] === "approved") || (f === "unverified" && kmap[u.id] !== "approved") || (f === "blocked" && u.blocked) || (f === "has balance" && u.balance > 0)));
    $("#sum").textContent = `${list.length} of ${rows.length} loaded (latest 300)`;
    $("#list").innerHTML = list.length ? list.map(u => `<div class="card" data-user="${esc(u.id)}" style="cursor:pointer"><div class="row"><b>${esc(u.name)}</b><span>${u.blocked ? tag("blocked") : ""} ${tag(kmap[u.id] === "approved" ? "approved" : kmap[u.id] || "unverified")}</span></div>
      <div class="muted">ID ${esc(u.memberId || "—")} • ${esc(u.email || u.phone || u.id.slice(0, 10))}</div><div class="row" style="margin-top:6px"><span>Balance <b>${n2(u.balance)}</b> USDT</span><span class="muted">${esc(when(u.createdAt))}</span></div></div>`).join("") : `<p class="empty">No users.</p>`;
  };
  draw();
  $("#q").oninput = e => { q = e.target.value.toLowerCase(); draw(); };
  $("#f").onchange = e => { f = e.target.value; draw(); };
  $("#exp").onclick = () => csv("users", rows.map(u => ({ ...u, kyc: kmap[u.id] || "none" })), ["id", "name", "email", "phone", "memberId", "balance", "frozen", "points", "totalRevenue", "inviteRevenue", "blocked", "kyc", "createdAt"]);
  view.onclick = e => { const c = e.target.closest("[data-user]"); if (c) openUser(c.dataset.user); };
}
async function openUser(id) {
  const u = await getUser(id, true);
  const [kS, rS, lS] = await Promise.all([getDoc(doc(db, "kyc", id)), getDocs(query(collection(db, "referrals"), where("referrerUid", "==", id))), getDocs(query(collection(db, "ledger"), where("uid", "==", id), limit(60)))]);
  const k = kS.exists() ? kS.data() : null, friends = rS.docs.map(d => d.data());
  const led = lS.docs.map(d => d.data()).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  const by = u.referredBy ? await getUser(u.referredBy) : null;
  const own = isOwner();
  const m = modal(u.name || "User", `<div class="row"><span>${u.blocked ? tag("blocked") : tag("ok")} ${tag(k?.status || "unverified")}</span><span class="muted">${esc(u.memberId || "")}</span></div>
    <div class="grid" style="margin-top:10px">${FIELDS.map(f => `<div class="stat"><small>${f}</small><b>${f === "nftCount" ? Number(u[f]) || 0 : n2(u[f])}</b></div>`).join("")}</div>
    <dl class="kv"><dt>UID</dt><dd>${esc(id)}</dd><dt>Email</dt><dd>${esc(u.email || "—")}</dd><dt>Phone</dt><dd>${esc(u.phone || "—")}</dd><dt>Level</dt><dd>${esc(u.level || "—")}</dd><dt>Joined</dt><dd>${esc(when(u.createdAt))}</dd><dt>Referred by</dt><dd>${by ? esc(by.name) : "—"}</dd><dt>Friends invited</dt><dd>${friends.length}</dd>${u.address ? `<dt>Address</dt><dd>${esc([u.address.name, u.address.phone, u.address.line].join(", "))}</dd>` : ""}${u.adminNote ? `<dt>Admin note</dt><dd>${esc(u.adminNote)}</dd>` : ""}</dl>
    <div class="row start" style="margin:10px 0">${own ? `<button class="btn primary sm" data-a="adjust">Adjust wallet</button><button class="btn sm" data-a="level">Set level</button><button class="btn sm" data-a="rename">Rename</button><button class="btn sm" data-a="note">Note</button><button class="btn ${u.blocked ? "ok" : "bad"} sm" data-a="block">${u.blocked ? "Unblock" : "Suspend"}</button>` : ""}<button class="btn sm" data-a="msg">Message</button>${k ? `<button class="btn sm" data-a="kyc">View verification</button>` : ""}</div>
    ${friends.length ? `<h3>Friends</h3>${friends.map(f => `<div class="row muted"><span>${esc(f.name)}</span><span>${esc(when(f.createdAt))}</span></div>`).join("")}` : ""}
    <h3>Wallet history</h3>${led.length ? led.map(l => `<div class="row" style="padding:6px 0;border-bottom:1px solid var(--line)"><span>${esc(l.type)} <span class="muted">${esc(l.field)} ${esc(l.reason || "")}</span></span><span style="color:${l.amount < 0 ? "#ff9aa8" : "#7dffc0"}">${l.amount > 0 ? "+" : ""}${n2(l.amount)}</span></div>`).join("") : `<p class="muted">No wallet changes yet.</p>`}`);
  m.addEventListener("click", async e => {
    const a = e.target.closest("[data-a]")?.dataset.a; if (!a) return;
    if (a === "msg") { m.remove(); return openThread(id); }
    if (a === "kyc") { m.remove(); return reviewKyc({ id, ...k }); }
    if (a === "adjust") { if (await adjustUser(id)) { m.remove(); openUser(id); } return; }
    const upd = async (fields, label) => { try { await updateDoc(doc(db, "users", id), fields); audit(label, `users/${id}`, u.name); toast("Saved"); m.remove(); openUser(id); } catch (err) { toast(err.message); } };
    if (a === "block") { if (confirm(u.blocked ? "Unblock this user?" : "Suspend this user? They will not be able to make requests.")) upd({ blocked: !u.blocked }, u.blocked ? "unblock" : "suspend"); }
    if (a === "rename") { const v = await askForm("Rename", [{ id: "name", label: "Name", value: u.name, required: true }]); if (v) upd({ name: v.name.slice(0, 40) }, "rename"); }
    if (a === "level") { const v = await askForm("Set level", [{ id: "level", label: "Level (e.g. Level 2, blank to clear)", value: u.level || "" }]); if (v) upd({ level: v.level }, "set-level"); }
    if (a === "note") { const v = await askForm("Admin note", [{ id: "n", label: "Private note", type: "textarea", value: u.adminNote || "" }]); if (v) upd({ adminNote: v.n }, "note"); }
  });
}
async function adjustUser(id) {
  const v = await askForm("Adjust wallet", [{ id: "field", label: "Field", type: "select", options: FIELDS, value: "balance" }, { id: "mode", label: "Action", type: "select", options: ["add", "subtract", "set"] }, { id: "amount", label: "Amount", type: "number", required: true }, { id: "reason", label: "Reason (required, saved in history)", required: true }], "Apply");
  if (!v) return false;
  const amt = Number(v.amount); if (!(amt >= 0)) { toast("Invalid amount"); return false; }
  try {
    await runTransaction(db, async tx => {
      const uRef = doc(db, "users", id), s = await tx.get(uRef); if (!s.exists()) throw new Error("User not found");
      const cur = Number(s.data()[v.field]) || 0, next = v.mode === "add" ? cur + amt : v.mode === "subtract" ? cur - amt : amt;
      if (next < 0) throw new Error("Result cannot be negative");
      tx.update(uRef, { [v.field]: next });
      if (["balance", "frozen", "points"].includes(v.field)) tx.set(doc(collection(db, "ledger")), { uid: id, type: "adjustment", field: v.field, amount: next - cur, after: next, reason: v.reason, by: me.uid, createdAt: serverTimestamp() });
    });
    audit("adjust", `users/${id}`, `${v.field} ${v.mode} ${amt} — ${v.reason}`); toast("Wallet updated"); return true;
  } catch (e) { console.error(e); toast(e.message); return false; }
}

// ---------- Messages ----------
async function vMessages() {
  const snap = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(500)));
  const threads = new Map();
  snap.docs.forEach(d => { const m = d.data(); if (!threads.has(m.uid)) threads.set(m.uid, { uid: m.uid, last: m, n: 0 }); threads.get(m.uid).n++; });
  const list = [...threads.values()];
  await Promise.all(list.map(t => getUser(t.uid)));
  view.innerHTML = list.length ? list.map(t => `<div class="card" data-thread="${esc(t.uid)}" style="cursor:pointer"><div class="row"><b>${uname(t.uid)}</b>${t.last.from === "user" ? tag("pending") : tag("approved")}</div><div class="muted">${esc(t.last.from === "user" ? "" : "You: ")}${esc(String(t.last.text).slice(0, 90))}</div><div class="muted">${t.n} message(s) • ${esc(when(t.last.createdAt))}</div></div>`).join("") : `<p class="empty">No messages yet.</p>`;
  view.innerHTML = `<p class="muted">Yellow = waiting for your reply.</p>` + view.innerHTML;
  view.onclick = e => { const c = e.target.closest("[data-thread]"); if (c) openThread(c.dataset.thread); };
}
async function openThread(uid) {
  await getUser(uid);
  const s = await getDocs(query(collection(db, "messages"), where("uid", "==", uid)));
  const msgs = s.docs.map(d => d.data()).sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
  const m = modal(`Chat — ${users.get(uid)?.name || uid}`, `<div style="max-height:46vh;overflow:auto">${msgs.map(x => `<div class="msg ${x.from === "admin" ? "admin" : "user"}">${esc(x.text)}<small>${esc(when(x.createdAt))}</small></div>`).join("") || `<p class="muted">No messages yet.</p>`}</div>
    <textarea id="reply" rows="3" maxlength="1000" placeholder="Write a reply" style="margin-top:10px"></textarea><button class="btn primary full" id="send">Send reply</button>`);
  m.querySelector("#send").onclick = async () => {
    const text = m.querySelector("#reply").value.trim(); if (!text) return;
    try { await addDoc(collection(db, "messages"), { uid, from: "admin", text, by: me.uid, createdAt: serverTimestamp() }); audit("reply", `messages/${uid}`, text.slice(0, 40)); m.remove(); openThread(uid); } catch (e) { toast(e.message); }
  };
}

// ---------- Content (announcements, mall) ----------
function crud(col, label, fields, card) {
  return async () => {
    const snap = await getDocs(query(collection(db, col), orderBy("createdAt", "desc"), limit(200)));
    const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    view.innerHTML = `<button class="btn primary" id="new" style="margin-bottom:10px">＋ New ${label}</button>` + (rows.length ? rows.map(r => `<div class="card"><div class="row"><div>${card(r)}</div><div class="row start"><button class="btn sm" data-e="${esc(r.id)}">Edit</button><button class="btn bad sm" data-d="${esc(r.id)}">Delete</button></div></div></div>`).join("") : `<p class="empty">Nothing yet.</p>`);
    const edit = async row => {
      const v = await askForm(row ? `Edit ${label}` : `New ${label}`, fields.map(f => ({ ...f, value: row?.[f.id] ?? "" })), "Save"); if (!v) return;
      const data = {}; fields.forEach(f => data[f.id] = f.type === "number" ? Number(v[f.id]) || 0 : v[f.id]);
      try { if (row) await updateDoc(doc(db, col, row.id), data); else await addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() }); audit(row ? "edit" : "create", col, data.title || ""); toast("Saved"); refresh(); } catch (e) { toast(e.message); }
    };
    $("#new").onclick = () => edit(null);
    view.onclick = async e => {
      const ed = e.target.closest("[data-e]"), de = e.target.closest("[data-d]");
      if (ed) edit(rows.find(r => r.id === ed.dataset.e));
      if (de && confirm("Delete this item?")) { await deleteDoc(doc(db, col, de.dataset.d)); audit("delete", `${col}/${de.dataset.d}`); toast("Deleted"); refresh(); }
    };
  };
}
const vAnnouncements = crud("announcements", "announcement", [{ id: "title", label: "Title", required: true }, { id: "text", label: "Text", type: "textarea", required: true }], r => `<b>${esc(r.title)}</b><div class="muted" style="white-space:pre-wrap">${esc(r.text)}</div><div class="muted">${esc(when(r.createdAt))}</div>`);
const vMall = crud("mall", "item", [{ id: "title", label: "Item name", required: true }, { id: "points", label: "Points cost", type: "number", required: true }], r => `<b>${esc(r.title)}</b><div class="muted">${n2(r.points)} points</div>`);

// ---------- Settings / Admins / Audit ----------
async function vSettings() {
  const s = await getDoc(doc(db, "settings", "site")), d = s.exists() ? s.data() : {};
  view.innerHTML = `<div class="card"><h3>Site settings</h3><label class="lbl">Deposit wallet address (shown on Recharge)</label><input id="s_addr" value="${esc(d.depositAddress || "")}" placeholder="TRC20 wallet address">
    <label class="lbl">Minimum withdrawal (USDT)</label><input id="s_min" type="number" step="any" min="0" value="${esc(d.minWithdraw ?? 0)}"><button class="btn primary" id="s_save">Save settings</button></div>`;
  $("#s_save").onclick = async () => { try { await setDoc(doc(db, "settings", "site"), { depositAddress: $("#s_addr").value.trim(), minWithdraw: Number($("#s_min").value) || 0 }, { merge: true }); audit("settings", "settings/site"); toast("Saved"); } catch (e) { toast(e.message); } };
}
async function vAdmins() {
  const s = await getDocs(collection(db, "admins")), rows = s.docs.map(d => ({ id: d.id, ...d.data() }));
  view.innerHTML = `<button class="btn primary" id="new" style="margin-bottom:10px">＋ Add admin</button><p class="muted">Add by Firebase UID (the person signs in once and copies the UID from the "No admin access" screen). Owner = full access, Staff = verifications, messages and content.</p>` +
    rows.map(r => `<div class="card"><div class="row"><div><b>${esc(r.label || "Admin")}</b> ${tag(r.role)}<div class="muted"><code>${esc(r.id)}</code></div></div>${r.id !== me.uid ? `<button class="btn bad sm" data-d="${esc(r.id)}">Remove</button>` : `<span class="muted">you</span>`}</div></div>`).join("");
  $("#new").onclick = async () => {
    const v = await askForm("Add admin", [{ id: "uid", label: "User UID", required: true }, { id: "label", label: "Name / label", required: true }, { id: "role", label: "Role", type: "select", options: ["staff", "owner"] }], "Add");
    if (!v) return; try { await setDoc(doc(db, "admins", v.uid), { role: v.role, label: v.label, createdAt: serverTimestamp() }); audit("add-admin", `admins/${v.uid}`, v.role); toast("Added"); refresh(); } catch (e) { toast(e.message); }
  };
  view.onclick = async e => { const d = e.target.closest("[data-d]"); if (d && confirm("Remove this admin?")) { await deleteDoc(doc(db, "admins", d.dataset.d)); audit("remove-admin", `admins/${d.dataset.d}`); toast("Removed"); refresh(); } };
}
async function vAudit() {
  const s = await getDocs(query(collection(db, "auditLogs"), orderBy("createdAt", "desc"), limit(200)));
  const rows = s.docs.map(d => d.data());
  view.innerHTML = rows.length ? rows.map(l => `<div class="card"><div class="row"><b>${esc(l.action)}</b><span class="muted">${esc(when(l.createdAt))}</span></div><div class="muted">${esc(l.target)} ${esc(l.detail)}</div><div class="muted">by ${esc(l.email || l.by)}</div></div>`).join("") : `<p class="empty">No activity yet.</p>`;
}

const VIEWS = { dashboard: vDashboard, kyc: vKyc, deposits: vRequests, withdrawals: vRequests, redemptions: vRequests, levelRequests: vRequests, users: vUsers, messages: vMessages, announcements: vAnnouncements, mall: vMall, settings: vSettings, admins: vAdmins, audit: vAudit };
