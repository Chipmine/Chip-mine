// ================= EDIT YOUR WEBSITE CONTENT HERE =================
const SITE_CONFIG = {
  brand: "Chip Main",
  heroTitle: "Explore the Future of Digital Assets",
  heroText: "Discover collections, explore levels and manage your account in one place.",
  countries: "0",
  registered: "0",
  aboutText: "Discover digital collectibles, explore levels and manage your account in one place.",
  accountId: "—",
  userName: "Guest",
  todayEarnings: "0.0000 APT"
};

// Chip catalog: [name, company, category, image file, model/family, description]. Images live in assets/chips.
const IMG = n => `assets/chips/${n}.jpg`;
const CO = { Qualcomm: "https://www.qualcomm.com", MediaTek: "https://www.mediatek.com", Samsung: "https://semiconductor.samsung.com", Apple: "https://www.apple.com", Google: "https://store.google.com", AMD: "https://www.amd.com", Intel: "https://www.intel.com", NVIDIA: "https://www.nvidia.com" };
const CHIPS = [
  ["Snapdragon 8 Elite Gen 5", "Qualcomm", "Mobile SoC", "qualcomm-snapdragon-8-elite-gen-5", "Snapdragon 8 Elite", "Flagship Snapdragon mobile platform from Qualcomm for premium Android smartphones."],
  ["Snapdragon 8 Elite Extreme", "Qualcomm", "Mobile SoC", "qualcomm-snapdragon-8-elite-extreme", "Snapdragon 8 Elite", "High-end Snapdragon 8 Elite variant aimed at top-tier Android devices."],
  ["Snapdragon 8 Gen 5", "Qualcomm", "Mobile SoC", "qualcomm-snapdragon-8-gen-5", "Snapdragon 8", "Snapdragon 8-series mobile platform for high-performance smartphones."],
  ["Dimensity 9600 Pro", "MediaTek", "Mobile SoC", "mediatek-dimensity-9600-pro", "Dimensity 9000 series", "Premium Dimensity mobile chip from MediaTek for flagship phones."],
  ["Dimensity 9600M", "MediaTek", "Mobile SoC", "mediatek-dimensity-9600m", "Dimensity 9000 series", "Dimensity 9000-series mobile platform from MediaTek."],
  ["Dimensity 9500", "MediaTek", "Mobile SoC", "mediatek-dimensity-9500", "Dimensity 9000 series", "Flagship-class Dimensity mobile platform from MediaTek."],
  ["Dimensity 8500", "MediaTek", "Mobile SoC", "mediatek-dimensity-8500", "Dimensity 8000 series", "Upper mid-range Dimensity mobile platform from MediaTek."],
  ["Exynos 2600", "Samsung", "Mobile SoC", "samsung-exynos-2600", "Exynos 2000 series", "Samsung's in-house Exynos mobile processor for Galaxy-class devices."],
  ["Exynos 2500", "Samsung", "Mobile SoC", "samsung-exynos-2500", "Exynos 2000 series", "Exynos mobile processor developed by Samsung's semiconductor division."],
  ["Exynos 2400", "Samsung", "Mobile SoC", "samsung-exynos-2400", "Exynos 2000 series", "Exynos flagship mobile processor from Samsung."],
  ["Apple A20 Pro", "Apple", "Mobile SoC", "apple-a20-pro", "Apple A-series", "Apple-designed A-series chip family used in iPhone."],
  ["Apple A18 Pro", "Apple", "Mobile SoC", "apple-a18-pro", "Apple A-series", "Apple-designed A-series chip used in iPhone Pro models."],
  ["Apple M6", "Apple", "Laptop / Tablet SoC", "apple-m6", "Apple M-series", "Apple-designed M-series chip family for Mac and iPad."],
  ["Google Tensor G6", "Google", "Mobile SoC", "google-tensor-g6", "Google Tensor", "Google's custom Tensor system-on-chip family built for Pixel phones."],
  ["Google Tensor G5", "Google", "Mobile SoC", "google-tensor-g5", "Google Tensor", "Google's custom Tensor system-on-chip built for Pixel phones."],
  ["Ryzen 9 9950X3D", "AMD", "Desktop CPU", "amd-ryzen-9-9950x3d", "Ryzen 9000 X3D", "AMD Ryzen desktop processor; X3D models add extra cache aimed at gaming."],
  ["Ryzen 9 9900X3D", "AMD", "Desktop CPU", "amd-ryzen-9-9900x3d", "Ryzen 9000 X3D", "AMD Ryzen desktop processor; X3D models add extra cache aimed at gaming."],
  ["Ryzen 7 9850X3D", "AMD", "Desktop CPU", "amd-ryzen-7-9850x3d", "Ryzen 9000 X3D", "AMD Ryzen desktop processor; X3D models add extra cache aimed at gaming."],
  ["Core Ultra 7 270K Plus", "Intel", "Desktop CPU", "intel-core-ultra-7-270k", "Intel Core Ultra", "Intel Core Ultra desktop processor."],
  ["Core Ultra 9 386H", "Intel", "Laptop CPU", "intel-core-ultra-9-386h", "Intel Core Ultra", "Intel Core Ultra processor for laptops."],
  ["Core Ultra 9", "Intel", "Laptop CPU", "intel-core-ultra-9", "Intel Core Ultra", "Intel Core Ultra 9 processor family."],
  ["Blackwell B200", "NVIDIA", "AI / Data Center GPU", "nvidia-blackwell-b200", "Blackwell", "NVIDIA Blackwell-architecture GPU for AI and data centers."],
  ["Blackwell B300", "NVIDIA", "AI / Data Center GPU", "nvidia-blackwell-b300", "Blackwell", "NVIDIA Blackwell-architecture GPU for AI and data centers."],
  ["GB300 Grace Blackwell", "NVIDIA", "AI / Data Center", "nvidia-gb300-grace-blackwell", "Grace Blackwell", "NVIDIA Grace Blackwell system for large-scale AI workloads."]
];
const COLLECTIONS = CHIPS.map(([name, company, category, img, model, desc]) => ({ name, company, category, model, desc, image: IMG(img), url: CO[company] }));

// Chip Level catalog. unlock = minimum balance to open the level. term = the level's single fixed
// mining duration. rate = commission % range [min,max]; an item may override with its own `rate`.
// fee = one-time APT unlock fee that makes that item buyable for the user.
const LV_IMG = n => `assets/chips/${n}.jpg`;
const LEVELS = [
  { id: 1, quality: "Normal", unlock: 1, term: { h: 72, label: "3 days" }, rate: [2, 5], items: [
    { name: "Dimensity 8500", company: "MediaTek", img: "mediatek-dimensity-8500", val: 10000 },
    { name: "Exynos 2400", company: "Samsung", img: "samsung-exynos-2400", val: 13750 },
    { name: "Core Ultra 9 386H", company: "Intel", img: "intel-core-ultra-9-386h", val: 18200, fee: 2, rate: [3, 8] },
    { name: "Snapdragon 8 Gen 5", company: "Qualcomm", img: "qualcomm-snapdragon-8-gen-5", val: 24600, fee: 2, rate: [3, 8] },
    { name: "Google Tensor G5", company: "Google", img: "google-tensor-g5", val: 31500, fee: 2, rate: [3, 8] }
  ] },
  { id: 2, quality: "Rare", unlock: 30, term: { h: 168, label: "7 days" }, rate: [5, 7], items: [
    { name: "Exynos 2500", company: "Samsung", img: "samsung-exynos-2500", val: 42000 },
    { name: "Dimensity 9500", company: "MediaTek", img: "mediatek-dimensity-9500", val: 56000 },
    { name: "Core Ultra 7 270K Plus", company: "Intel", img: "intel-core-ultra-7-270k", val: 74500 },
    { name: "Google Tensor G6", company: "Google", img: "google-tensor-g6", val: 98000 },
    { name: "Snapdragon 8 Elite Gen 5", company: "Qualcomm", img: "qualcomm-snapdragon-8-elite-gen-5", val: 132000 }
  ] },
  { id: 3, quality: "Epic", unlock: 80, term: { h: 240, label: "10 days" }, rate: [7, 14], items: [
    { name: "Exynos 2600", company: "Samsung", img: "samsung-exynos-2600", val: 175000 },
    { name: "Dimensity 9600M", company: "MediaTek", img: "mediatek-dimensity-9600m", val: 235000 },
    { name: "Snapdragon 8 Elite Extreme", company: "Qualcomm", img: "qualcomm-snapdragon-8-elite-extreme", val: 310000 },
    { name: "Apple A18 Pro", company: "Apple", img: "apple-a18-pro", val: 420000 },
    { name: "Apple M6", company: "Apple", img: "apple-m6", val: 560000 }
  ] },
  { id: 4, quality: "Mythic", unlock: 400, term: { h: 336, label: "14 days" }, rate: [9, 19], items: [
    { name: "Dimensity 9600 Pro", company: "MediaTek", img: "mediatek-dimensity-9600-pro", val: 720000 },
    { name: "Apple A20 Pro", company: "Apple", img: "apple-a20-pro", val: 950000 },
    { name: "Ryzen 7 9850X3D", company: "AMD", img: "amd-ryzen-7-9850x3d", val: 1250000 },
    { name: "Ryzen 9 9900X3D", company: "AMD", img: "amd-ryzen-9-9900x3d", val: 1650000 },
    { name: "Ryzen 9 9950X3D", company: "AMD", img: "amd-ryzen-9-9950x3d", val: 2150000 }
  ] },
  { id: 5, quality: "Legend", unlock: 850, term: { h: 720, label: "30 days" }, rate: [25, 55], items: [
    { name: "Blackwell B200", company: "NVIDIA", img: "nvidia-blackwell-b200", val: 2800000 },
    { name: "Blackwell B300", company: "NVIDIA", img: "nvidia-blackwell-b300", val: 3700000 },
    { name: "GB300 Grace Blackwell", company: "NVIDIA", img: "nvidia-gb300-grace-blackwell", val: 4900000 },
    { name: "Blackwell Ultra", company: "NVIDIA", img: "chipset-showcase-1", val: 6500000 },
    { name: "Grace Blackwell Superchip", company: "NVIDIA", img: "chipset-showcase-2", val: 8800000 }
  ] }
];
const levelRange = lv => { const v = lv.items.map(i => i.val); return `${money(Math.min(...v))} – ${money(Math.max(...v))} APT`; };
const itemRate = (lv, it) => it.rate || lv.rate;
const levelRate = lv => { const rs = lv.items.map(i => itemRate(lv, i)); return [Math.min(...rs.map(r => r[0])), Math.max(...rs.map(r => r[1]))]; };
const isUnlockedItem = id => (profile.unlockedItems || []).includes(id) || justUnlocked.has(id);
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
function calcUnlocked() {
  if (!isVerified()) return 0;
  const bal = Number(profile.balance || 0);
  if (bal <= 0) return 0;
  let lvl = 1;
  for (const l of LEVELS) if (l.id > 1 && bal >= l.unlock) lvl = l.id;
  return lvl;
}
const effectiveUnlocked = () => Math.max(Number(profile.unlockedLevel) || 0, calcUnlocked());
function renderLevels() {
  const un = effectiveUnlocked();
  $("#levelList").innerHTML = LEVELS.map(l => {
    const open = un >= l.id;
    return `<article class="level-card${open ? "" : " locked"}"${open ? ` data-level="${l.id}"` : ""}>
      <div class="level-info"><h2>Level ${l.id}</h2><p>${open ? `${l.quality} • ${l.term.label} • ${levelRange(l)}` : `Locked • need ${l.unlock} APT balance`}</p><span class="level-enter">${open ? "Click to enter" : "Locked"}</span></div>
      <span class="lock-badge">${open ? "" : "LOCKED"}</span></article>`;
  }).join("");
}

// Identity verification: documents accepted (country selection removed).
const KYC_COUNTRY = "Bangladesh"; // fixed value stored with the KYC record (keeps Firestore rules working)
const KYC_DOCS = ["National ID (NID)", "Passport", "Aadhaar Card"];
const isVerified = () => kyc?.status === "approved";
const BN = { "Mining":"মাইনিং","Withdraw":"উত্তোলন","Friends":"বন্ধু","Rank":"র‍্যাঙ্ক","Profile":"প্রোফাইল","Home":"হোম","Tasks":"টাস্ক","Recharge":"রিচার্জ","Team":"টিম","Market":"মার্কেট","Chip Market":"চিপ মার্কেট","My Profile":"আমার প্রোফাইল","CHIP Level":"চিপ লেভেল","Sign In Task":"সাইন ইন টাস্ক","Points Mall":"পয়েন্ট মল","Announcement":"ঘোষণা","Shipping Address":"ঠিকানা","Language":"ভাষা","Recommend & Share":"রেফার ও শেয়ার","Message":"মেসেজ","Change Password":"পাসওয়ার্ড পরিবর্তন","Change Payment Password":"পেমেন্ট পাসওয়ার্ড পরিবর্তন","Login / Sign Up":"লগইন / সাইন আপ","Log Out":"লগ আউট","Login":"লগইন","Available balance":"ব্যালেন্স","Amount":"পরিমাণ","Wallet address":"ওয়ালেট ঠিকানা","Recent Requests":"সাম্প্রতিক অনুরোধ","About Us":"আমাদের সম্পর্কে","Chip Details":"চিপের তথ্য","Invite your friends":"বন্ধুদের আমন্ত্রণ জানান","My Team":"আমার টিম","Total Friends":"মোট বন্ধু","Total Funds":"মোট অর্থ","Total Revenue":"মোট আয়","Today's Earnings":"আজকের আয়","Explore Levels":"লেভেল দেখুন","Edit Profile":"প্রোফাইল এডিট","Verify Identity":"পরিচয় যাচাই","Logout":"লগআউট" };
const orig = new WeakMap();
function applyLang() {
  const bn = localStorage.getItem("cm_lang") === "bn";
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const p = n.parentElement;
    if (!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.tagName)) continue;
    if (!orig.has(n)) { if (!BN[n.nodeValue.trim()]) continue; orig.set(n, n.nodeValue); }
    const o = orig.get(n), t = o.trim();
    n.nodeValue = bn && BN[t] ? o.replace(t, BN[t]) : o;
  }
}

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const escapeHtml = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const n2 = (v, d = 2) => (Number(v) || 0).toFixed(d);
const money = v => (Number(v) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const today = () => new Date().toISOString().slice(0, 10);
const when = d => d?.toDate ? d.toDate().toLocaleDateString() : "";
const sha = async s => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, "0")).join("");

let kyc = null, fb = null, user = null, profile = {}, site = { depositAddress: "", minWithdraw: 0 };
let lastWithdraw = [], rechargeTotal = 0, histTab = "recharge", wdMethod = "instant", wdAmount = 0;
let histData = { recharge: [], profit: [], withdraw: [], others: [] }, othersA = [], othersB = [];
const justUnlocked = new Set();
const WD_METHODS = { instant: { label: "Instant", fee: 0.15, eta: "within 3–5 hours" }, working: { label: "Working Day", fee: 0.0667, eta: "within 15 working days" } };
let subs = [], sheetSubs = [], activeTab = "ranking", currentPage = "home", navStack = [];
const favorites = new Set();

// ---------- Basics ----------
function applyConfig() {
  $$("[data-edit]").forEach(el => { if (SITE_CONFIG[el.dataset.edit] !== undefined) el.textContent = SITE_CONFIG[el.dataset.edit]; });
  $("#year").textContent = new Date().getFullYear();
}
function showToast(message) {
  const t = $("#toast"); t.textContent = message; t.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => t.classList.remove("show"), 2800);
}
function showPage(page) {
  currentPage = page;
  $$(".page").forEach(p => p.classList.toggle("active", p.id === `page-${page}`));
  $$(".nav-link,.mobile-nav button").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function goToPage(page) { if (page !== currentPage) { navStack.push(currentPage); if (navStack.length > 40) navStack.shift(); } showPage(page); }
function goBack() { showPage(navStack.pop() || "home"); }
$$("[data-page]").forEach(btn => btn.addEventListener("click", () => goToPage(btn.dataset.page)));
$$("[data-go]").forEach(btn => btn.addEventListener("click", e => { e.preventDefault(); goToPage(btn.dataset.go); }));
$("#topProfile").addEventListener("click", () => goToPage("profile"));
$("#levelList").addEventListener("click", e => { const c = e.target.closest("[data-level]"); if (c) openLevelPage(Number(c.dataset.level)); });
$("#levelItems").addEventListener("click", e => { const b = e.target.closest("[data-item]"); if (b) openItem(b.dataset.item); });

// ---------- Sheet (popup panel) ----------
function openSheet(title, html) {
  sheetSubs.forEach(f => f()); sheetSubs = [];
  $("#sheetTitle").textContent = title; $("#sheetBody").innerHTML = html;
  $("#sheet").classList.remove("hidden"); applyLang();
  return $("#sheetBody");
}
function closeSheet() { sheetSubs.forEach(f => f()); sheetSubs = []; $("#sheet").classList.add("hidden"); }
$("#sheetClose").addEventListener("click", closeSheet);
$("#sheet").addEventListener("click", e => { if (e.target.id === "sheet") closeSheet(); });

// ---------- Chips: market, about grid, detail page ----------
function renderMarket() {
  const list = COLLECTIONS.map((item, index) => ({ ...item, index })).filter(item => activeTab === "ranking" || favorites.has(item.index));
  $("#marketRows").innerHTML = list.length ? list.map(item => `
    <tr>
      <td>${item.index + 1}</td>
      <td><div class="collection-cell"><div class="collection-art tap" data-chip="${item.index}"><img src="${item.image}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:9px"></div></div></td>
      <td class="tap" data-chip="${item.index}"><span class="collection-name">${escapeHtml(item.name)}</span><span class="floor-price">${escapeHtml(item.company)}</span></td>
      <td>${escapeHtml(item.category)}</td>
      <td><button class="favorite" data-fav="${item.index}" aria-label="Toggle favorite">${favorites.has(item.index) ? "Added" : "Add"}</button></td>
    </tr>`).join("") : `<tr><td colspan="5" style="text-align:center;padding:35px;color:#9aacca">${activeTab === "favorites" ? "No favorites yet. Tap a star on a chip." : "No chips yet."}</td></tr>`;
  $("#favCount").textContent = favorites.size;
}
$("#marketRows").addEventListener("click", e => {
  const f = e.target.closest("[data-fav]");
  if (f) { const id = Number(f.dataset.fav); favorites.has(id) ? favorites.delete(id) : favorites.add(id); renderMarket(); return; }
  const c = e.target.closest("[data-chip]"); if (c) openChip(Number(c.dataset.chip));
});
$$("[data-tab]").forEach(btn => btn.addEventListener("click", () => {
  activeTab = btn.dataset.tab;
  $$("[data-tab]").forEach(b => b.classList.toggle("selected", b === btn));
  renderMarket();
}));
$("#chipGrid").innerHTML = COLLECTIONS.map((c, i) => `<button class="chip-tile" data-chip="${i}"><img src="${c.image}" alt="${escapeHtml(c.name)}" loading="lazy"><span>${escapeHtml(c.name)}</span></button>`).join("");
$("#chipGrid").addEventListener("click", e => { const c = e.target.closest("[data-chip]"); if (c) openChip(Number(c.dataset.chip)); });
function openChip(i) {
  const c = COLLECTIONS[i];
  $("#chipTitle").textContent = c.name;
  $("#chipDetail").innerHTML = `<img src="${c.image}" alt="${escapeHtml(c.name)}"><div class="chip-info"><h2>${escapeHtml(c.name)}</h2>
    <dl><div><dt>Model</dt><dd>${escapeHtml(c.model)}</dd></div><div><dt>Company</dt><dd>${escapeHtml(c.company)}</dd></div><div><dt>Category</dt><dd>${escapeHtml(c.category)}</dd></div></dl>
    <p>${escapeHtml(c.desc)}</p>
    <a class="primary-btn" href="${c.url}" target="_blank" rel="noopener noreferrer">Visit ${escapeHtml(c.company)} website</a>
    <small class="form-hint">${escapeHtml(c.url.replace("https://", ""))} • General information only — check the official website for full specifications.</small></div>`;
  goToPage("chip"); applyLang();
}
$("#chipBack").addEventListener("click", goBack);
$("#levelBack").addEventListener("click", goBack);
$("#itemBack").addEventListener("click", goBack);

// ---------- Auth UI (Firebase loads in background; site works without it) ----------
const loginView = $("#loginView");
let signupMode = false;
const openLogin = () => loginView.classList.remove("hidden");
const closeLogin = () => loginView.classList.add("hidden");
const authError = e => ({
  "auth/invalid-credential": "Wrong email or password", "auth/user-not-found": "No account found", "auth/wrong-password": "Wrong email or password",
  "auth/email-already-in-use": "Email already registered", "auth/weak-password": "Password must be at least 6 characters", "auth/invalid-email": "Invalid email",
  "auth/invalid-phone-number": "Invalid phone number (use +880...)", "auth/invalid-verification-code": "Wrong code", "auth/code-expired": "Code expired, send again",
  "auth/too-many-requests": "Too many attempts, try later", "auth/popup-closed-by-user": "Sign-in cancelled", "auth/cancelled-popup-request": "Sign-in cancelled",
  "auth/network-request-failed": "Network error", "auth/operation-not-allowed": "This login method is not enabled in Firebase Console",
  "auth/unauthorized-domain": "This domain is not authorized in Firebase Console", "auth/captcha-check-failed": "reCAPTCHA failed, try again",
  "auth/missing-phone-number": "Enter your phone number", "auth/billing-not-enabled": "Phone login needs Firebase billing (Blaze plan)", "permission-denied": "Permission denied (check Firestore rules)"
}[e.code] || e.message || "Something went wrong");
function setAuthMsg(m) { const el = $("#authMsg"); el.textContent = m || ""; if (m) showToast(m); }
async function run(fn, btn) {
  if (!fb) { setAuthMsg("Login service did not load. Check internet and reload."); return false; }
  if (btn) btn.disabled = true;
  try { await fn(); setAuthMsg(""); return true; } catch (e) { console.error(e); setAuthMsg(authError(e)); return false; } finally { if (btn) btn.disabled = false; }
}
function needLogin() {
  if (!fb) { showToast("Loading... try again in a moment"); return true; }
  if (!user) { openLogin(); setAuthMsg("Please login first"); return true; }
  if (profile.blocked) { showToast("Your account is suspended. Contact support."); return true; }
  return false;
}
function needVerified() {
  if (needLogin()) return true;
  if (isVerified()) return false;
  showToast(kyc?.status === "pending" ? "Your verification is under review" : "Verify your identity first");
  openVerify();
  return true;
}
$("#topLogin").addEventListener("click", openLogin);
$("#loginBtn").addEventListener("click", openLogin);
$("#closeLogin").addEventListener("click", closeLogin);
["#logoutBtn", "#topLogout", "#sideLogout"].forEach(id => $(id).addEventListener("click", () => run(async () => { await fb.logout(); closeSheet(); goToPage("home"); showToast("Logged out"); })));
$("#showPass").addEventListener("click", () => { const i = $("#password"); i.type = i.type === "password" ? "text" : "password"; });
$$(".auth-tab").forEach(tab => tab.addEventListener("click", () => {
  $$(".auth-tab").forEach(t => t.classList.toggle("active", t === tab));
  const email = tab.dataset.auth === "email";
  $("#emailForm").classList.toggle("hidden", !email);
  $("#phoneForm").classList.toggle("hidden", email);
  $("#refField").hidden = !(email && signupMode);
  setAuthMsg("");
}));
$("#switchMode").addEventListener("click", e => {
  e.preventDefault(); signupMode = !signupMode;
  $("#nameField").hidden = !signupMode;
  $("#refField").hidden = !signupMode;
  $("#authSubtitle").textContent = signupMode ? "Create your account" : "Sign in to continue";
  $("#emailSubmit").innerHTML = signupMode ? "Sign Up" : "Login";
  $("#switchText").textContent = signupMode ? "Already have an account?" : "New here?";
  $("#switchMode").textContent = signupMode ? "Login" : "Create account";
  $("#password").autocomplete = signupMode ? "new-password" : "current-password";
});
const refInput = $("#refCode");
refInput.value = localStorage.getItem("cm_ref") || "";
const syncRef = () => { const v = refInput.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase(); refInput.value = v; if (v) localStorage.setItem("cm_ref", v); return v; };
refInput.addEventListener("input", syncRef);
$("#emailForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = $("#email").value.trim(), pass = $("#password").value;
  if (signupMode && !syncRef()) return setAuthMsg("Referral code is required to create an account");
  run(() => signupMode ? fb.signUpEmail(email, pass, $("#regName").value.trim()) : fb.signInEmail(email, pass, $("#remember").checked), $("#emailSubmit"));
});
$("#forgotLink").addEventListener("click", e => {
  e.preventDefault();
  const email = $("#email").value.trim();
  if (!email) return setAuthMsg("Enter your email first");
  run(async () => { await fb.resetPassword(email); showToast("Password reset email sent"); });
});
let codeSent = false;
$("#phoneForm").addEventListener("submit", e => {
  e.preventDefault();
  const btn = $("#phoneSubmit");
  run(async () => {
    syncRef();
    if (!codeSent) {
      const phone = $("#phone").value.replace(/\s+/g, "");
      if (!/^\+\d{8,15}$/.test(phone)) throw { code: "auth/invalid-phone-number" };
      await fb.phoneSend(phone); codeSent = true;
      $("#codeField").classList.remove("hidden"); btn.innerHTML = "Verify"; showToast("Code sent");
    } else {
      const code = $("#otp").value.trim();
      if (code.length < 6) throw { message: "Enter the 6-digit code" };
      await fb.phoneVerify(code); codeSent = false;
    }
  }, btn);
});
$("#googleBtn").addEventListener("click", () => run(() => { syncRef(); return fb.google(); }));

// ---------- User state ----------
function renderAuth() {
  const p = profile || {}, name = user ? (p.name || user.displayName || user.email || user.phoneNumber || "Member") : SITE_CONFIG.userName;
  const id = user ? (p.memberId || "—") : SITE_CONFIG.accountId;
  $("#sideUser").textContent = $("#profileName").textContent = name;
  $("#accountId").textContent = id;
  $("#referralCode").textContent = user && !isVerified() ? "Verify to unlock" : (p.referralCode || "—");
  $$(".side-user .avatar, .profile-avatar").forEach(el => el.textContent = (name[0] || "G").toUpperCase());
  $("#topLogin").classList.toggle("hidden", !!user);
  $("#loginBtn").classList.toggle("hidden", !!user);
  $("#logoutBtn").classList.toggle("hidden", !user);
  $("#topLogout").classList.toggle("hidden", !user);
  $("#sideLogout").classList.toggle("hidden", !user);
  $("#topProfile").classList.toggle("hidden", false);
  const st = kyc?.status || "none";
  $("#verifyTag").textContent = { approved: "Verified", pending: "Under review", rejected: "Rejected", none: "Not verified" }[st];
  $("#verifyTag").className = `vtag ${st}`;
  $("#memberTag").textContent = st === "approved" ? "VERIFIED MEMBER" : "UNVERIFIED";
  $$("[data-kyc-notice]").forEach(el => el.classList.toggle("hidden", isVerified()));
  const v = { balance: n2(p.balance), frozen: n2(p.frozen), total: n2((p.balance || 0) + (p.frozen || 0)), totalRevenue: n2(p.totalRevenue), inviteRevenue: n2(p.inviteRevenue), todayEarnings: n2(p.todayEarnings, 4), nftCount: p.nftCount || 0 };
  $$("[data-bind]").forEach(el => { if (el.dataset.bind in v) el.textContent = v[el.dataset.bind]; });
  $("#topEarnings").textContent = `${v.todayEarnings} APT`;
  renderLevels();
  updateTaskProgress();
  if (user) { const un = effectiveUnlocked(); if (un > (Number(p.unlockedLevel) || 0)) fb.saveUser({ unlockedLevel: un }).catch(() => {}); }
  updateWithdrawInfo();
}
function renderMinings(rows) {
  const el = $("#miningList"); if (!el) return;
  el.innerHTML = rows.length ? rows.map(m => {
    const done = m.status === "done", shares = Number(m.amount ?? m.price) || 0, gain = done ? (Number(m.gain) || 0) : shares * Number(m.rate) / 100;
    return `<div class="req-row"><div><b>${escapeHtml(m.item)}</b><small>Level ${m.level} • ${n2(shares)} shares • ${escapeHtml(m.termLabel || (m.term + "h"))} • ${m.rate}%</small><small>${done ? `Credited ${n2(m.gain)} APT` : `Est. ${n2(gain)} APT • ends ${escapeHtml(when(m.maturedAt))}`}</small></div><span class="req-status ${done ? "approved" : "pending"}">${done ? "done" : "mining"}</span></div>`;
  }).join("") : `<p class="empty">No shares yet. Buy shares from CHIP Level to start mining.</p>`;
}
const minePct = m => {
  const s = m.createdAt?.toMillis?.() || 0, e = m.maturedAt?.toMillis?.() || 0;
  if (m.status === "done") return 100;
  return e > s ? Math.min(100, Math.max(0, (Date.now() - s) / (e - s) * 100)) : 0;
};
const fmtDur = ms => { ms = Math.max(0, ms); const d = Math.floor(ms / 86400000), h = Math.floor(ms % 86400000 / 3600000), mi = Math.floor(ms % 3600000 / 60000); return d ? `${d}d ${h}h` : h ? `${h}h ${mi}m` : `${mi}m`; };
function renderMiningPage(rows) {
  const el = $("#miningPageList"); if (!el) return;
  const shares = rows.reduce((s, m) => s + (Number(m.amount ?? m.price) || 0), 0);
  const profit = rows.reduce((s, m) => s + (Number(m.gain) || 0), 0);
  const active = rows.filter(m => m.status !== "done").length;
  const sa = $("#mineActive"), ss = $("#mineShares"), sp = $("#mineProfit");
  if (sa) sa.textContent = active; if (ss) ss.textContent = money(shares); if (sp) sp.textContent = money(profit);
  el.innerHTML = rows.length ? rows.map(m => {
    const done = m.status === "done", sh = Number(m.amount ?? m.price) || 0, gain = done ? (Number(m.gain) || 0) : sh * Number(m.rate) / 100;
    const s = m.createdAt?.toMillis?.() || 0, e = m.maturedAt?.toMillis?.() || 0, pct = minePct(m);
    const left = done ? "" : fmtDur(e - Date.now()) + " left";
    return `<div class="content-card mine-card">
      <div class="mine-head"><img src="${LV_IMG(m.img)}" alt="" loading="lazy"><div><b>${escapeHtml(m.item)}</b><small>Level ${m.level}${m.quality ? " • " + escapeHtml(m.quality) : ""} • ${escapeHtml(m.termLabel || (m.term + "h"))}</small></div><span class="req-status ${done ? "approved" : "pending"}">${done ? "done" : "mining"}</span></div>
      <div class="mine-meta"><div><small>Shares</small><b>${n2(sh)} APT</b></div><div><small>Rate</small><b>${m.rate}%</b></div><div><small>${done ? "Credited" : "Est. profit"}</small><b>${n2(gain)} APT</b></div></div>
      <div class="mine-bar-wrap"><div class="mine-bar" data-mine-bar data-start="${s}" data-end="${e}" data-done="${done ? 1 : 0}"><span style="width:${pct.toFixed(1)}%"></span></div><div class="mine-bar-info"><b data-mine-pct>${pct.toFixed(0)}%</b><small data-mine-time>${done ? "Completed" : "ends in " + escapeHtml(left.replace(" left", ""))}</small></div></div>
    </div>`;
  }).join("") : `<p class="empty">No shares yet. Buy shares from CHIP Level to start mining.</p>`;
}
setInterval(() => {
  $$("[data-mine-bar]").forEach(bar => {
    const s = +bar.dataset.start, e = +bar.dataset.end, done = bar.dataset.done === "1";
    const pct = done ? 100 : (e > s ? Math.min(100, Math.max(0, (Date.now() - s) / (e - s) * 100)) : 0);
    bar.firstChild.style.width = pct.toFixed(1) + "%";
    const info = bar.parentElement.querySelector("[data-mine-pct]"); if (info) info.textContent = pct.toFixed(0) + "%";
    const t = bar.parentElement.querySelector("[data-mine-time]");
    if (t && !done) { const left = e - Date.now(); t.textContent = left > 0 ? "ends in " + fmtDur(left) : "finishing…"; }
  });
}, 1000);

const reqRows = (rows, label, key) => rows.length ? rows.slice(0, 10).map(r => `<div class="req-row"><div><b>${n2(r.amount ?? r.points)} ${r.points && !r.amount ? "pts" : "APT"}</b><small>${label}: ${escapeHtml(String(r[key] ?? r.title ?? "").slice(0, 28))} · ${escapeHtml(when(r.createdAt))}</small></div><span class="req-status ${escapeHtml(r.status)}">${escapeHtml(r.status)}</span></div>`).join("") : `<p class="empty">No requests yet.</p>`;
function renderTeam(rows) {
  $("#teamList").innerHTML = rows.length ? rows.map(r => `<div class="req-row"><div>${escapeHtml(r.name)}<small>Joined ${escapeHtml(when(r.createdAt))}</small></div></div>`).join("") : `<p class="empty">No friends yet. Share your referral link to invite people.</p>`;
  $$('[data-bind="friendCount"]').forEach(el => el.textContent = rows.length);
}
function onUser(u, p) {
  if (!u && p && p._authError) { openLogin(); setAuthMsg(p._authError); }
  user = u; profile = p || {}; if (!u) kyc = null; renderAuth();
  subs.forEach(f => f()); subs = [];
  if (u) {
    closeLogin();
    subs.push(
      fb.watchKyc(d => { kyc = d; renderAuth(); }),
      fb.watchMine("withdrawals", rows => { lastWithdraw = rows; histData.withdraw = rows; $("#withdrawList").innerHTML = reqRows(rows, "To", "address"); updateWithdrawInfo(); if (histTab === "withdraw") renderHistory(); }),
      fb.watchMine("deposits", rows => { histData.recharge = rows; rechargeTotal = rows.filter(r => r.status === "approved").reduce((s, r) => s + (Number(r.amount) || 0), 0); updateWithdrawInfo(); if (histTab === "recharge") renderHistory(); }),
      fb.watchMine("redemptions", rows => { othersA = rows; syncOthers(); }),
      fb.watchMine("levelRequests", rows => { othersB = rows; syncOthers(); }),
      fb.watchTeam(renderTeam),
      fb.watchMinings(rows => { renderMinings(rows); renderMiningPage(rows); histData.profit = rows; if (histTab === "profit") renderHistory(); fb.claimMatured(rows).then(n => { if (n) showToast(`${n} chip${n > 1 ? "s" : ""} matured — commission added`); }).catch(() => {}); })
    );
  } else { $("#withdrawList").innerHTML = reqRows([], ""); renderTeam([]); renderMinings([]); renderMiningPage([]); histData = { recharge: [], profit: [], withdraw: [], others: [] }; othersA = othersB = []; renderHistory(); }
}
import("./firebase.js").then(m => {
  fb = m; fb.init(onUser);
  fb.watchSite(s => { site = { ...site, ...s }; $("#withdrawHint").textContent = `Withdrawals are reviewed before they are sent.${site.minWithdraw ? ` Minimum: ${site.minWithdraw} APT.` : ""}`; });
}).catch(e => { console.error(e); showToast("Login service could not load"); });

// ---------- Actions (everything that used to say "coming soon") ----------
const formRow = (label, id, attrs = "") => `<label class="form-label" for="${id}">${label}</label><input class="standard-input" id="${id}" ${attrs}>`;
function openRecharge() {
  if (needVerified()) return;
  const b = openSheet("Recharge", `<div class="withdraw-balance"><small>Send APT to this address</small><strong style="font-size:13px;word-break:break-all">${escapeHtml(site.depositAddress || "Not available yet")}</strong></div>
    ${formRow("Amount sent (APT)", "depAmount", 'type="number" min="0" step="any" inputmode="decimal" placeholder="Enter amount"')}${formRow("Transaction ID (TXID)", "depTx", 'placeholder="Paste transaction ID"')}
    <button class="primary-btn full-btn" id="depSubmit">Submit Recharge Request</button><p class="form-hint">Your balance is updated after the transfer is verified.</p><h3>Recent Requests</h3><div id="depList" class="req-list"></div>`);
  sheetSubs.push(fb.watchMine("deposits", rows => { b.querySelector("#depList").innerHTML = reqRows(rows, "TXID", "txid"); }));
  $("#depSubmit").addEventListener("click", () => {
    const amount = Number($("#depAmount").value), txid = $("#depTx").value.trim();
    if (!(amount > 0) || txid.length < 8) return showToast("Enter a valid amount and TXID");
    run(async () => { await fb.addRequest("deposits", { amount, txid }); $("#depAmount").value = $("#depTx").value = ""; showToast("Request submitted"); }, $("#depSubmit"));
  });
}
function openMall() {
  if (needLogin()) return;
  const b = openSheet("Points Mall", `<div class="withdraw-balance"><small>Your points</small><strong>${n2(profile.points)}</strong></div><div id="mallList" class="req-list"></div>`);
  sheetSubs.push(fb.watchAll("mall", rows => {
    b.querySelector("#mallList").innerHTML = rows.length ? rows.map(r => `<div class="req-row"><div><b>${escapeHtml(r.title)}</b><small>${n2(r.points)} pts</small></div><button class="outline-btn" data-redeem="${escapeHtml(r.id)}" data-t="${escapeHtml(r.title)}" data-p="${Number(r.points) || 0}">Redeem</button></div>`).join("") : `<p class="empty">No items available yet.</p>`;
  }));
  b.addEventListener("click", e => {
    const r = e.target.closest("[data-redeem]"); if (!r || needVerified()) return;
    const points = Number(r.dataset.p);
    if (points > (profile.points || 0)) return showToast("Not enough points");
    run(async () => { await fb.addRequest("redemptions", { itemId: r.dataset.redeem, title: r.dataset.t, points }); showToast("Redeem request sent"); });
  });
}
function openAnnouncements() {
  const b = openSheet("Announcement", `<div id="annList" class="req-list"><p class="empty">Loading...</p></div>`);
  if (!fb) return;
  sheetSubs.push(fb.watchAll("announcements", rows => {
    b.querySelector("#annList").innerHTML = rows.length ? rows.map(r => `<div class="req-row"><div><b>${escapeHtml(r.title)}</b><small style="white-space:normal">${escapeHtml(r.text || "")}</small><small>${escapeHtml(when(r.createdAt))}</small></div></div>`).join("") : `<p class="empty">No announcements.</p>`;
  }));
}
function openAddress() {
  if (needLogin()) return;
  const a = profile.address || {};
  openSheet("Shipping Address", `${formRow("Full name", "adName", `value="${escapeHtml(a.name || "")}" maxlength="60"`)}${formRow("Phone", "adPhone", `type="tel" value="${escapeHtml(a.phone || "")}" maxlength="20"`)}${formRow("Address", "adLine", `value="${escapeHtml(a.line || "")}" maxlength="200"`)}<button class="primary-btn full-btn" id="adSave">Save Address</button>`);
  $("#adSave").addEventListener("click", () => {
    const address = { name: $("#adName").value.trim(), phone: $("#adPhone").value.trim(), line: $("#adLine").value.trim() };
    if (!address.name || !address.line) return showToast("Enter name and address");
    run(async () => { await fb.saveUser({ address }); showToast("Address saved"); closeSheet(); });
  });
}
function openLanguage() {
  const cur = localStorage.getItem("cm_lang") === "bn" ? "bn" : "en";
  openSheet("Language", `<div class="req-list"><button class="req-row lang-opt" data-lang="en">English ${cur === "en" ? "(selected)" : ""}</button><button class="req-row lang-opt" data-lang="bn">বাংলা ${cur === "bn" ? "(selected)" : ""}</button></div>`);
  $$(".lang-opt").forEach(b => b.addEventListener("click", () => { localStorage.setItem("cm_lang", b.dataset.lang); applyLang(); closeSheet(); }));
}
async function shareReferral() {
  if (needVerified()) return;
  const url = `${location.origin}${location.pathname}?ref=${profile.referralCode || ""}`, text = `Join ${SITE_CONFIG.brand}`;
  try { if (navigator.share) await navigator.share({ title: SITE_CONFIG.brand, text, url }); else { await navigator.clipboard.writeText(url); showToast("Referral link copied"); } }
  catch (e) { if (e.name !== "AbortError") { try { await navigator.clipboard.writeText(url); showToast("Referral link copied"); } catch { showToast(url); } } }
}
function openMessages() {
  if (needLogin()) return;
  const b = openSheet("Message", `<div id="msgList" class="req-list"></div><label class="form-label" for="msgText">Write to support</label><textarea class="standard-input" id="msgText" rows="3" maxlength="1000" placeholder="Type your message"></textarea><button class="primary-btn full-btn" id="msgSend">Send</button>`);
  sheetSubs.push(fb.watchMine("messages", rows => {
    b.querySelector("#msgList").innerHTML = rows.length ? [...rows].reverse().map(r => `<div class="req-row"><div><b>${r.from === "admin" ? "Support" : "You"}</b><small style="white-space:normal;font-size:12px;color:inherit">${escapeHtml(r.text)}</small><small>${escapeHtml(when(r.createdAt))}</small></div></div>`).join("") : `<p class="empty">No messages yet.</p>`;
  }));
  $("#msgSend").addEventListener("click", () => {
    const text = $("#msgText").value.trim(); if (!text) return;
    run(async () => { await fb.sendMessage(text); $("#msgText").value = ""; }, $("#msgSend"));
  });
}
function changePassword() {
  if (needLogin()) return;
  const email = user.email;
  if (!email) return showToast("Password change is only for email accounts");
  run(async () => { await fb.resetPassword(email); showToast("Password reset email sent"); });
}
function openPayPin() {
  if (needLogin()) return;
  const has = !!profile.payPinHash;
  openSheet("Payment Password", `${has ? formRow("Current payment password", "pinOld", 'type="password" inputmode="numeric" maxlength="6"') : ""}${formRow("New payment password (4–6 digits)", "pinNew", 'type="password" inputmode="numeric" maxlength="6"')}${formRow("Confirm", "pinNew2", 'type="password" inputmode="numeric" maxlength="6"')}<button class="primary-btn full-btn" id="pinSave">Save</button>`);
  $("#pinSave").addEventListener("click", async () => {
    const n = $("#pinNew").value;
    if (!/^\d{4,6}$/.test(n)) return showToast("Use 4–6 digits");
    if (n !== $("#pinNew2").value) return showToast("Passwords do not match");
    if (has && (await sha(user.uid + $("#pinOld").value)) !== profile.payPinHash) return showToast("Current password is wrong");
    run(async () => { await fb.saveUser({ payPinHash: await sha(user.uid + n) }); showToast("Payment password saved"); closeSheet(); });
  });
}
function openEditProfile() {
  if (needLogin()) return;
  openSheet("Edit Profile", `${formRow("Name", "epName", `value="${escapeHtml(profile.name || "")}" maxlength="40"`)}<button class="primary-btn full-btn" id="epSave">Save</button>`);
  $("#epSave").addEventListener("click", () => {
    const name = $("#epName").value.trim(); if (!name) return;
    run(async () => { await fb.updateName(name); showToast("Name updated"); closeSheet(); });
  });
}
function openLevelPage(id) {
  const lv = LEVELS.find(l => l.id === id); if (!lv) return;
  const rr = levelRate(lv);
  $("#levelEyebrow").textContent = `LEVEL ${lv.id} • ${lv.quality.toUpperCase()}`;
  $("#levelTitle").textContent = `Level ${lv.id}`;
  $("#levelBrief").innerHTML = `<div class="level-brief-row"><div><small>Quality</small><strong>${lv.quality}</strong></div><div><small>Duration</small><strong>${lv.term.label}</strong></div><div><small>Price range</small><strong>${levelRange(lv)}</strong></div></div><h3 class="term-title">Commission (mining)</h3><div class="term-list"><div><span>${lv.term.label}</span><b>${rr[0]}–${rr[1]}%</b></div></div>`;
  $("#levelItems").innerHTML = lv.items.map((it, i) => { const lock = it.fee && !isUnlockedItem(`${lv.id}:${i}`); return `<button type="button" class="level-item" data-item="${lv.id}:${i}"><img src="${LV_IMG(it.img)}" alt="${escapeHtml(it.name)}" loading="lazy"><b>${escapeHtml(it.name)}</b><small>${escapeHtml(it.company)}${lock ? ` • unlock ${it.fee} APT` : ""}</small><strong>${money(it.val)} APT</strong></button>`; }).join("");
  goToPage("level");
}
function openItem(ref) {
  const [lid, idx] = ref.split(":").map(Number);
  const lv = LEVELS.find(l => l.id === lid); if (!lv) return;
  const it = lv.items[idx]; if (!it) return;
  const itemId = `${lid}:${idx}`, r = itemRate(lv, it), term = lv.term, PRESETS = [10, 30, 50, 100, 200, 500], bal = Number(profile.balance) || 0;
  const locked = !!it.fee && !isUnlockedItem(itemId);
  $("#itemTitle").textContent = it.name;
  $("#itemBody").innerHTML = `<div class="item-detail"><img class="item-img" src="${LV_IMG(it.img)}" alt="${escapeHtml(it.name)}" loading="lazy"><div class="item-info">
    <span class="eyebrow">LEVEL ${lv.id} • ${lv.quality.toUpperCase()}</span><h2>${escapeHtml(it.name)}</h2>
    <div class="item-price"><small>Chip value</small><strong>${money(it.val)} <em>APT</em></strong></div>
    <dl class="item-meta"><div><dt>Company</dt><dd>${escapeHtml(it.company)}</dd></div><div><dt>Level</dt><dd>Level ${lv.id} — ${lv.quality}</dd></div><div><dt>Duration</dt><dd>${term.label}</dd></div><div><dt>Commission</dt><dd>${r[0]}–${r[1]}%</dd></div></dl>
    ${locked ? `<p class="form-hint">This chip is locked. Pay a one-time <b>${it.fee} APT</b> unlock fee to make it buyable.</p>` : `<p class="form-hint">You buy shares of this chip with APT (1 APT = 1 share). Profit is paid automatically when the term ends.</p>`}
    <h3 class="term-title">Shares to buy</h3>
    <div class="share-pick" id="sharePick">${PRESETS.map(v => `<button type="button" class="share-opt" data-share="${v}">${v}</button>`).join("")}<button type="button" class="share-opt" data-share="all">All</button></div>
    <div class="buy-line"><div><small>Shares</small><b><span id="shareAmt">0.00</span> APT</b></div><div><small>Est. profit</small><b><span id="shareGain">0.00</span> APT</b></div></div>
    <button class="primary-btn full-btn" id="itemBuy" disabled>Buy Now</button>
    <p class="form-hint">Balance: ${money(bal)} APT. APT is deducted now; profit is added automatically when the term ends.</p>
  </div></div>`;
  goToPage("item");
  let amount = 0;
  const refresh = () => {
    $("#shareAmt").textContent = money(amount);
    $("#shareGain").textContent = amount ? `${n2(amount * r[0] / 100)}–${n2(amount * r[1] / 100)}` : "0.00";
    const btn = $("#itemBuy");
    if (locked) { btn.textContent = `Unlock chip — ${it.fee} APT`; btn.disabled = bal < it.fee; }
    else { btn.textContent = "Buy Now"; btn.disabled = !(amount > 0); }
  };
  $$("#sharePick .share-opt").forEach(o => o.addEventListener("click", () => {
    amount = o.dataset.share === "all" ? bal : Number(o.dataset.share);
    $$("#sharePick .share-opt").forEach(x => x.classList.remove("selected"));
    if (amount > bal) { amount = 0; showToast(`Not enough balance — you have ${money(bal)} APT`); }
    else o.classList.add("selected");
    refresh();
  }));
  refresh();
  $("#itemBuy").addEventListener("click", () => {
    if (needVerified()) return;
    if (locked) {
      if (bal < it.fee) return showToast(`You need ${it.fee} APT to unlock this chip`);
      return run(async () => {
        await fb.unlockItem(itemId, it.fee);
        justUnlocked.add(itemId);
        showToast(`${it.name} unlocked`);
        openItem(ref);
      }, $("#itemBuy"));
    }
    const amt = amount;
    if (!(amt > 0)) return showToast("Choose how many shares to buy");
    if (amt > (Number(profile.balance) || 0)) return showToast("Not enough balance");
    const rate = randInt(r[0], r[1]), gain = +(amt * rate / 100).toFixed(4);
    const maturedAt = new Date(Date.now() + term.h * 3600 * 1000);
    run(async () => {
      await fb.buyChip({ item: it.name, company: it.company, img: it.img, level: lv.id, quality: lv.quality, amount: amt, chipValue: it.val, term: term.h, termLabel: term.label, rate, gain, maturedAt });
      showToast(`Bought ${n2(amt)} shares — +${n2(gain)} APT in ${term.label}`);
      goToPage("levels");
    }, $("#itemBuy"));
  });
}

// ---------- Identity verification ----------
async function toJpeg(src, max = 1280, q = 0.8) {
  const bmp = src instanceof Blob ? await createImageBitmap(src) : src;
  const w = bmp.width || bmp.videoWidth, h = bmp.height || bmp.videoHeight, s = Math.min(1, max / Math.max(w, h));
  const c = document.createElement("canvas"); c.width = Math.round(w * s); c.height = Math.round(h * s);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res, rej) => c.toBlob(b => b ? res(b) : rej(new Error("Image error")), "image/jpeg", q));
}
function openVerify() {
  if (needLogin()) return;
  const st = kyc?.status;
  if (st === "approved") return openSheet("Verify Identity", `<div class="kyc-status ok"><b>Verified</b><small>${escapeHtml(kyc.docType)}</small></div><p class="form-hint">Your identity is verified. Recharge, withdraw, trade and referrals are unlocked.</p>`);
  if (st === "pending") return openSheet("Verify Identity", `<div class="kyc-status"><b>Under review</b><small>Submitted ${escapeHtml(when(kyc.createdAt))}</small></div><p class="form-hint">We are reviewing your documents. Features unlock once you are approved.</p>`);
  const note = st === "rejected" ? `<div class="kyc-status bad"><b>Rejected</b><small>${escapeHtml(kyc.note || "Please resubmit clear photos.")}</small></div>` : "";
  const pic = (k, label) => `<label class="form-label">${label}</label><div class="kyc-pic"><button type="button" class="outline-btn" id="kb_${k}">Choose / take photo</button><img id="kp_${k}" hidden alt=""></div><input type="file" id="k_${k}" accept="image/*" hidden>`;
  const b = openSheet("Verify Identity", `${note}<p class="form-hint">Verification is required before you can recharge, withdraw, trade or use referrals. Your documents are used only for identity checks.</p>
    <label class="form-label" for="kDoc">Document type</label><select class="standard-input" id="kDoc"><option value="">Select document</option>${KYC_DOCS.map(d => `<option>${escapeHtml(d)}</option>`).join("")}</select>
    ${formRow("Full name (as on document)", "kName", 'maxlength="60" autocomplete="name"')}${formRow("Document number", "kNum", 'maxlength="24" autocapitalize="characters"')}
    ${pic("front", "Front side")}${pic("back", "Back side (passport: back / last page)")}
    <label class="form-label">Live selfie</label>
    <div class="kyc-cam"><video id="kVideo" playsinline muted hidden></video><img id="kSelfie" hidden alt=""><button type="button" class="outline-btn" id="kCamStart">Open camera</button><button type="button" class="primary-btn" id="kCapture" hidden>Capture</button></div>
    <p class="form-hint hidden" id="kCamNote">The camera needs a secure connection (open the site over HTTPS, or from localhost). You can upload a selfie photo instead.</p>
    <button type="button" class="outline-btn hidden" id="kUpBtn">Upload selfie instead</button>
    <input type="file" id="kSelfieUp" accept="image/*" capture="user" hidden>
    <label class="check"><input type="checkbox" id="kConsent"> I confirm these documents are mine and agree to their use for identity verification.</label>
    <button class="primary-btn full-btn" id="kSubmit">Submit for Verification</button>`);
  const files = { front: null, back: null, selfie: null };
  let stream = null;
  const stopCam = () => { stream?.getTracks().forEach(t => t.stop()); stream = null; };
  sheetSubs.push(stopCam);
  const showUpload = () => { $("#kCamStart").hidden = true; $("#kCamNote").classList.remove("hidden"); $("#kUpBtn").classList.remove("hidden"); };
  const camOk = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  if (!camOk) showUpload();
  ["front", "back"].forEach(k => {
    const inp = $(`#k_${k}`);
    $(`#kb_${k}`).addEventListener("click", () => inp.click());
    inp.addEventListener("change", async () => {
      const f = inp.files[0]; if (!f) return;
      try { files[k] = await toJpeg(f, 800, 0.68); const p = $(`#kp_${k}`); p.src = URL.createObjectURL(files[k]); p.hidden = false; }
      catch { files[k] = null; showToast("Could not read this image, try a JPG/PNG photo"); }
    });
  });
  $("#kCamStart").addEventListener("click", async () => {
    try {
      stopCam(); files.selfie = null;
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      const v = $("#kVideo"); v.srcObject = stream; await v.play(); v.hidden = false;
      $("#kSelfie").hidden = true; $("#kCamStart").hidden = true; $("#kCapture").hidden = false;
    } catch (e) { console.error(e); showUpload(); showToast("Camera unavailable — upload a selfie instead"); }
  });
  $("#kCapture").addEventListener("click", async () => {
    const v = $("#kVideo"); if (!v.videoWidth) return showToast("Camera is not ready yet");
    try { files.selfie = await toJpeg(v, 640, 0.68); } catch { return showToast("Capture failed, try again"); }
    stopCam(); v.hidden = true;
    const p = $("#kSelfie"); p.src = URL.createObjectURL(files.selfie); p.hidden = false;
    $("#kCapture").hidden = true; $("#kCamStart").hidden = false; $("#kCamStart").textContent = "Retake selfie";
  });
  const selfieUp = $("#kSelfieUp");
  $("#kUpBtn").addEventListener("click", () => selfieUp.click());
  selfieUp.addEventListener("change", async () => {
    const f = selfieUp.files[0]; if (!f) return;
    try { files.selfie = await toJpeg(f, 640, 0.68); const p = $("#kSelfie"); p.src = URL.createObjectURL(files.selfie); p.hidden = false; showToast("Selfie added"); }
    catch { files.selfie = null; showToast("Could not read this image"); }
  });
  $("#kSubmit").addEventListener("click", () => {
    const docType = $("#kDoc").value, fullName = $("#kName").value.trim(), docNumber = $("#kNum").value.replace(/\s+/g, "");
    if (!docType) return showToast("Select a document type");
    if (fullName.length < 3) return showToast("Enter your full name");
    const ok = docType === "Aadhaar Card" ? /^\d{12}$/.test(docNumber)
      : docType === "Passport" ? /^[A-Za-z0-9]{6,12}$/.test(docNumber) : /^[A-Za-z0-9-]{6,20}$/.test(docNumber);
    if (!ok) return showToast(docType === "Aadhaar Card" ? "Aadhaar number must be 12 digits" : "Enter a valid document number");
    if (!files.front || !files.back) return showToast("Add both front and back photos");
    if (!files.selfie) return showToast(camOk ? "Take a live selfie with the camera" : "Add a selfie photo");
    if (!$("#kConsent").checked) return showToast("Please tick the confirmation");
    const btn = $("#kSubmit"); btn.textContent = "Uploading...";
    run(async () => { await fb.submitKyc({ country: KYC_COUNTRY, docType, fullName, docNumber }, files); showToast("Submitted for review"); closeSheet(); }, btn).finally(() => { btn.textContent = "Submit for Verification"; });
  });
}

// ---------- Spin the Wheel ----------
const SPIN_COST = 5, SPIN_WINDOW_MS = 12 * 3600 * 1000, SPIN_PER_WINDOW = 5;
// 8 segments. TRX/TON and 100 Points are intentionally ultra-rare; TRX/TON are paid out by admin, not auto-credited.
const SPIN_PRIZES = [
  { label: "0.0023 APT", type: "apt", amount: 0.0023, weight: 300, color: "#1f6b4a" },
  { label: "9 Points", type: "points", amount: 9, weight: 300, color: "#0F1D16" },
  { label: "0.0009 TRX", type: "trx", amount: 0.0009, weight: 5, color: "#3a2f12" },
  { label: "25 Points", type: "points", amount: 25, weight: 250, color: "#1f6b4a" },
  { label: "2 APT", type: "apt", amount: 2, weight: 130, color: "#0F1D16" },
  { label: "100 Points", type: "points", amount: 100, weight: 10, color: "#3a2f12" },
  { label: "0.000598 TON", type: "ton", amount: 0.000598, weight: 2, color: "#1f6b4a" },
  { label: "1 TRX", type: "trx", amount: 1, weight: 3, color: "#0F1D16" }
];
const spinWindow = () => {
  const now = Date.now(), start = Number(profile.spinWindowStart) || 0, cnt = Number(profile.spinCount) || 0;
  const active = start && now - start < SPIN_WINDOW_MS;
  return { now, start, active, used: active ? cnt : 0, left: SPIN_PER_WINDOW - (active ? cnt : 0) };
};
const fmtLeft = ms => `${Math.floor(ms / 3600000)}h ${Math.floor(ms % 3600000 / 60000)}m`;
function openSpin() {
  if (needLogin()) return;
  const total = SPIN_PRIZES.reduce((s, p) => s + p.weight, 0);
  const b = openSheet("Spin the Wheel", `<div class="spin-top"><div><small>Your points</small><b id="spinPoints">${n2(profile.points, 0)}</b></div><div><small>Cost / spin</small><b>${SPIN_COST} pts</b></div><div><small>Spins left (12h)</small><b id="spinLeft">0/${SPIN_PER_WINDOW}</b></div></div>
    <div class="wheel-box"><div class="wheel-pointer"></div><div class="wheel" id="wheel"><div class="wheel-labels" id="wheelLabels"></div></div><button class="wheel-hub" id="spinBtn">SPIN<small>${SPIN_COST} pts</small></button></div>
    <p class="form-hint">Each spin costs ${SPIN_COST} points. ${SPIN_PER_WINDOW} spins per 12 hours (${SPIN_PER_WINDOW * 2}/day). Daily check-in gives 15 points.</p><p class="spin-result" id="spinResult"></p>`);
  const wheel = b.querySelector("#wheel"), out = b.querySelector("#spinResult"), btn = b.querySelector("#spinBtn");
  const setLeft = left => b.querySelector("#spinLeft").textContent = `${Math.max(0, left)}/${SPIN_PER_WINDOW}`;
  setLeft(spinWindow().left);
  wheel.style.background = `conic-gradient(${SPIN_PRIZES.map((p, i) => `${p.color} ${i * 45}deg ${(i + 1) * 45}deg`).join(",")})`;
  b.querySelector("#wheelLabels").innerHTML = SPIN_PRIZES.map((p, i) => `<div class="wheel-label" style="transform:rotate(${i * 45 + 22.5}deg)"><span>${escapeHtml(p.label)}</span></div>`).join("");
  let rot = 0, spinning = false;
  const spin = () => {
    if (spinning) return;
    const w = spinWindow();
    if (w.left <= 0) return showToast(`Spin limit reached — next 5 spins in ${fmtLeft(w.start + SPIN_WINDOW_MS - w.now)}`);
    if ((Number(profile.points) || 0) < SPIN_COST) return showToast(`You need ${SPIN_COST} points to spin`);
    let r = Math.random() * total, acc = 0, prize = SPIN_PRIZES[0], idx = 0;
    for (let i = 0; i < SPIN_PRIZES.length; i++) { acc += SPIN_PRIZES[i].weight; if (r < acc) { prize = SPIN_PRIZES[i]; idx = i; break; } }
    const patch = { count: w.used + 1, start: w.active ? w.start : w.now };
    spinning = true; btn.disabled = true; out.textContent = "";
    const base = rot - (rot % 360);
    rot = base + 360 * 5 + ((360 - (idx * 45 + 22.5)) % 360) + (Math.random() * 28 - 14);
    wheel.style.transition = "transform 4.2s cubic-bezier(.17,.67,.16,1)";
    wheel.style.transform = `rotate(${rot}deg)`;
    setTimeout(() => {
      run(async () => {
        await fb.spinWin(SPIN_COST, prize, patch);
        const newPts = (Number(profile.points) || 0) - SPIN_COST + (prize.type === "points" ? Number(prize.amount) : 0);
        b.querySelector("#spinPoints").textContent = n2(newPts, 0);
        setLeft(SPIN_PER_WINDOW - patch.count);
        const msg = (prize.type === "trx" || prize.type === "ton") ? `You won ${prize.label} — admin will credit it manually.` : `You won ${prize.label}!`;
        out.textContent = msg; showToast(msg);
      }).finally(() => { spinning = false; btn.disabled = false; });
    }, 4300);
  };
  btn.addEventListener("click", spin);
}

const ACTIONS = {
  "Verify": openVerify,
  "Recharge": openRecharge, "Withdraw": () => goToPage("withdraw"), "Team": () => goToPage("friends"), "Sign In Task": () => goToPage("tasks"),
  "Points Mall": openMall, "Spin the Wheel": openSpin, "Announcement": openAnnouncements, "Shipping Address": openAddress, "Language": openLanguage,
  "Recommend & Share": shareReferral, "Message": openMessages, "Change Password": changePassword, "Change Payment Password": openPayPin, "Edit Profile": openEditProfile,
  "History": () => goToPage("history")
};
$$("[data-action]").forEach(btn => btn.addEventListener("click", e => {
  e.preventDefault();
  const a = btn.dataset.action;
  (ACTIONS[a] || (() => showToast(`${a} is not available`)))();
}));

// ---------- Withdraw ----------
function updateWdSummary() {
  const el = $("#wdSummary"), btn = $("#withdrawPreview"); if (!el) return;
  const amount = Number(wdAmount) || 0, m = WD_METHODS[wdMethod];
  const fee = amount * m.fee, net = amount - fee;
  el.innerHTML = amount > 0
    ? `<div><small>Amount</small><b>${n2(amount)} APT</b></div><div><small>Fee (${(m.fee * 100).toFixed(2)}%)</small><b>−${n2(fee)} APT</b></div><div><small>You receive</small><b>${n2(net)} APT</b></div><p class="form-hint">Payout ${m.eta}.</p>`
    : `<p class="form-hint">Select an amount above to continue.</p>`;
  if (btn) btn.disabled = !(amount > 0);
}
const wdAvail = () => Math.max(0, (Number(profile.totalRevenue) || 0) - lastWithdraw.filter(r => r.status !== "rejected").reduce((s, r) => s + (Number(r.amount) || 0), 0));
function updateWithdrawInfo() {
  const avail = wdAvail();
  const vals = { withdrawable: n2(avail), recharge: n2(rechargeTotal), withdrawn: n2(lastWithdraw.filter(r => r.status !== "rejected").reduce((s, r) => s + (Number(r.amount) || 0), 0)), balance: n2(profile.balance) };
  $$("[data-bind]").forEach(el => { if (el.dataset.bind in vals) el.textContent = vals[el.dataset.bind]; });
  $$("#wdPresets .share-opt").forEach(b => { const off = Number(b.dataset.wd) > avail; b.disabled = off; if (off && b.classList.contains("selected")) { b.classList.remove("selected"); wdAmount = 0; } });
  updateWdSummary();
}
$$("#wdPresets [data-wd]").forEach(b => b.addEventListener("click", () => { wdAmount = Number(b.dataset.wd) || 0; $$("#wdPresets .share-opt").forEach(x => x.classList.toggle("selected", x === b)); updateWdSummary(); }));
$$("#wdMethods [data-wd-method]").forEach(b => b.addEventListener("click", () => { wdMethod = b.dataset.wdMethod; $$("#wdMethods .term-opt").forEach(x => x.classList.toggle("selected", x === b)); updateWdSummary(); }));
$("#withdrawPreview").addEventListener("click", async () => {
  if (needVerified()) return;
  const amount = Number(wdAmount), address = $("#withdrawAddress").value.trim(), pin = $("#withdrawPin").value, m = WD_METHODS[wdMethod];
  if (!(amount > 0)) return showToast("Select an amount first");
  if (address.length < 20) return showToast("Enter a valid wallet address");
  if (site.minWithdraw && amount < site.minWithdraw) return showToast(`Minimum withdrawal is ${site.minWithdraw} APT`);
  if (amount > wdAvail()) return showToast("Amount exceeds your withdrawable profit");
  if (!profile.payPinHash) { showToast("Set a payment password first"); return openPayPin(); }
  const pinHash = await sha(user.uid + pin);
  if (pinHash !== profile.payPinHash) return showToast("Wrong payment password");
  const fee = amount * m.fee, net = amount - fee;
  run(async () => {
    await fb.requestWithdraw({ amount, address, pinHash, method: wdMethod, feeRate: m.fee, fee, net, eta: m.eta, debit: Math.min(Number(profile.balance) || 0, amount) });
    $("#withdrawAddress").value = $("#withdrawPin").value = ""; wdAmount = 0;
    $$("#wdPresets .share-opt").forEach(x => x.classList.remove("selected")); updateWdSummary();
    showToast(`Withdrawal submitted — ${n2(net)} APT ${m.eta}`);
  }, $("#withdrawPreview"));
});

// ---------- History ----------
function renderHistory() {
  const el = $("#historyList"); if (!el) return;
  const rows = histData[histTab] || [];
  if (!rows.length) { el.innerHTML = `<p class="empty">No ${histTab} records yet.</p>`; return; }
  el.innerHTML = rows.slice(0, 60).map(r => {
    const status = escapeHtml(r.status || "pending");
    if (histTab === "recharge") return `<div class="req-row"><div><b>+${n2(r.amount)} APT</b><small>Recharge${r.txid ? " • " + escapeHtml(String(r.txid).slice(0, 18)) : ""} · ${escapeHtml(when(r.createdAt))}</small></div><span class="req-status ${status}">${status}</span></div>`;
    if (histTab === "profit") { const done = r.status === "done", gain = done ? (Number(r.gain) || 0) : (Number(r.amount ?? r.price) || 0) * Number(r.rate) / 100; return `<div class="req-row"><div><b>+${n2(gain)} APT</b><small>${escapeHtml(r.item || "Mining")}${r.termLabel || r.term ? " • " + escapeHtml(r.termLabel || r.term + "h") : ""} · ${escapeHtml(when(r.claimedAt || r.createdAt))}</small></div><span class="req-status ${done ? "approved" : "pending"}">${done ? "credited" : "mining"}</span></div>`; }
    if (histTab === "withdraw") return `<div class="req-row"><div><b>−${n2(r.amount)} APT</b><small>${escapeHtml((WD_METHODS[r.method] || WD_METHODS.instant).label)}${r.net ? ` • receive ${n2(r.net)} APT` : ""} · ${escapeHtml(when(r.createdAt))}</small></div><span class="req-status ${status}">${status}</span></div>`;
    return `<div class="req-row"><div><b>${escapeHtml(r.title || r.item || r.docType || "Request")}</b><small>${r.points ? escapeHtml(r.points + " pts") : "—"} · ${escapeHtml(when(r.createdAt))}</small></div><span class="req-status ${status}">${status}</span></div>`;
  }).join("");
}
const syncOthers = () => {
  histData.others = [...othersA, ...othersB].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  if (histTab === "others") renderHistory();
};
$$("[data-hist]").forEach(b => b.addEventListener("click", () => { histTab = b.dataset.hist; $$("[data-hist]").forEach(x => x.classList.toggle("selected", x === b)); renderHistory(); }));
const copyText = (t, msg) => navigator.clipboard?.writeText(t).then(() => showToast(msg)).catch(() => showToast(t));
$("#copyAccount").addEventListener("click", () => copyText($("#accountId").textContent, "Account ID copied"));
$("#copyId").addEventListener("click", () => copyText($("#accountId").textContent, "Account ID copied"));
$("#copyReferral").addEventListener("click", () => { if (needVerified()) return; copyText($("#referralCode").textContent, "Referral code copied"); });

// ---------- Tasks (saved per day on this device) ----------
const taskKey = `cm_tasks_${today()}`;
const completedTasks = new Set(JSON.parse(localStorage.getItem(taskKey) || "[]"));
const CHECKIN_POINTS = 15;
function updateTaskProgress() {
  if (user && profile.lastCheckin === today()) completedTasks.add(0);
  $("#taskCount").textContent = `${completedTasks.size} / 4`;
  $("#taskProgress").style.width = `${completedTasks.size * 25}%`;
  $$("[data-task]").forEach(b => { if (completedTasks.has(Number(b.dataset.task))) { b.textContent = "Done"; b.disabled = true; } });
}
$$("[data-task]").forEach(button => button.addEventListener("click", () => {
  const id = Number(button.dataset.task);
  if (id === 0 && user && profile.lastCheckin !== today()) {
    return run(async () => {
      await fb.claimCheckin(today(), CHECKIN_POINTS);
      showToast(`+${CHECKIN_POINTS} points for daily check-in`);
    }, button).then(ok => { if (ok) { completedTasks.add(0); localStorage.setItem(taskKey, JSON.stringify([...completedTasks])); updateTaskProgress(); } });
  }
  completedTasks.add(id);
  localStorage.setItem(taskKey, JSON.stringify([...completedTasks]));
  updateTaskProgress(); showToast(id === 0 ? "Already checked in today" : "Task completed");
}));

// ---------- Start ----------
const refParam = new URLSearchParams(location.search).get("ref");
if (refParam) localStorage.setItem("cm_ref", refParam.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 12));
applyConfig(); renderMarket(); renderAuth(); updateTaskProgress(); applyLang();
if (window.lucide) window.lucide.createIcons();
