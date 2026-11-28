import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence, updateProfile } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, collection, query, where, onSnapshot, writeBatch, serverTimestamp, increment, arrayUnion } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAlhd_KZ0mDCLTqdTPTQOcAldZd2hgI2YI",
  authDomain: "chipmain.firebaseapp.com",
  projectId: "chipmain",
  storageBucket: "chipmain.firebasestorage.app",
  messagingSenderId: "407318397626",
  appId: "1:407318397626:web:8fd760fd806358819b7883"
};
const app = initializeApp(firebaseConfig), auth = getAuth(app), db = getFirestore(app);
const sha = async s => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, "0")).join("");
let pendingName = "", pendingPayPin = "";
const uid = () => auth.currentUser.uid;
const sortNew = rows => rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
const err = e => console.error(e.code || "", e.message || e);

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const genCode = () => Array.from({ length: 8 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
export const cleanCode = v => String(v || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();

async function backfillCode(uidVal) {
  for (let i = 0; i < 5; i++) {
    const myCode = genCode(), b = writeBatch(db);
    b.update(doc(db, "users", uidVal), { referralCode: myCode });
    b.set(doc(db, "referralCodes", myCode), { uid: uidVal });
    try { await b.commit(); return; } catch (e) { if (i === 4 || e.code !== "permission-denied") throw e; }
  }
}

async function ensureUser(user) {
  const snap = await getDoc(doc(db, "users", user.uid));
  if (snap.exists()) { if (!snap.data().referralCode) { try { await backfillCode(user.uid); } catch {} } return; }
  const ref = cleanCode(localStorage.getItem("cm_ref"));
  let referrerUid = null;
  if (ref) { try { const r = await getDoc(doc(db, "referralCodes", ref)); if (r.exists() && r.data().uid !== user.uid) referrerUid = r.data().uid; } catch {} }
  if (!referrerUid) throw { code: "app/ref-required", message: "A valid referral code is required to create an account" };
  const name = (pendingName || user.displayName || user.email?.split("@")[0] || "Member").slice(0, 40);
  const payPinHash = pendingPayPin ? await sha(user.uid + pendingPayPin) : null; pendingPayPin = "";
  for (let i = 0; i < 5; i++) {
    const memberId = String(Math.floor(1000000 + Math.random() * 9000000)), myCode = genCode(), b = writeBatch(db);
    b.set(doc(db, "users", user.uid), { name, email: user.email || null, phone: user.phoneNumber || null, memberId, referralCode: myCode, referredBy: referrerUid, balance: 0, frozen: 0, points: 0, totalRevenue: 0, inviteRevenue: 0, todayEarnings: 0, nftCount: 0, payPinHash, createdAt: serverTimestamp() });
    b.set(doc(db, "referralCodes", myCode), { uid: user.uid });
    try { await b.commit(); if (referrerUid) { try { await setDoc(doc(db, "referrals", user.uid), { referrerUid, name, code: myCode, createdAt: serverTimestamp() }); } catch {} } return; } catch (e) { if (i === 4 || e.code !== "permission-denied") throw e; }
  }
}

export function init(onUser) {
  let unsub = null;
  onAuthStateChanged(auth, async user => {
    unsub?.(); unsub = null;
    if (!user) return onUser(null, null);
    try { await ensureUser(user); }
    catch (e) { err(e); try { await signOut(auth); } catch {} return onUser(null, { _authError: e.message || "Could not create account" }); }
    unsub = onSnapshot(doc(db, "users", user.uid), s => onUser(user, s.data() || {}), e => { err(e); onUser(user, {}); });
  });
}

export const signInEmail = async (email, pass, remember) => { await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence); return signInWithEmailAndPassword(auth, email, pass); };
export const signUpEmail = async (email, pass, name, payPin) => {
  await setPersistence(auth, browserLocalPersistence); pendingName = name || ""; pendingPayPin = payPin || "";
  const c = await createUserWithEmailAndPassword(auth, email, pass);
  if (name) await updateProfile(c.user, { displayName: name });
  return c;
};
export const resetPassword = email => sendPasswordResetEmail(auth, email);
export const logout = () => signOut(auth);

export const updateName = async name => { await updateProfile(auth.currentUser, { displayName: name }); await updateDoc(doc(db, "users", uid()), { name }); };
export const saveUser = fields => updateDoc(doc(db, "users", uid()), fields);
export const addRequest = (kind, data) => addDoc(collection(db, kind), { uid: uid(), ...data, status: "pending", createdAt: serverTimestamp() });
// Withdrawal holds the amount in `frozen` until admin pays out or rejects. Only the part the
// liquid balance can cover is deducted (profit may exceed balance if the user spent principal).
export function requestWithdraw(data) {
  const b = writeBatch(db), amt = Number(data.amount) || 0, debit = Math.min(Number(data.debit) || 0, amt);
  b.set(doc(collection(db, "withdrawals")), { uid: uid(), ...data, debit, status: "pending", createdAt: serverTimestamp() });
  b.update(doc(db, "users", uid()), { balance: increment(-debit), frozen: increment(amt) });
  return b.commit();
}
export const sendMessage = text => addDoc(collection(db, "messages"), { uid: uid(), from: "user", text, createdAt: serverTimestamp() });

export const watchMine = (kind, cb) => onSnapshot(query(collection(db, kind), where("uid", "==", uid())), s => cb(sortNew(s.docs.map(d => ({ id: d.id, ...d.data() })))), err);
export const watchAll = (name, cb) => onSnapshot(collection(db, name), s => cb(sortNew(s.docs.map(d => ({ id: d.id, ...d.data() })))), err);
export const watchSite = cb => onSnapshot(doc(db, "settings", "site"), s => cb(s.data() || {}), err);
export const watchTeam = cb => onSnapshot(query(collection(db, "referrals"), where("referrerUid", "==", uid())), s => cb(s.docs.map(d => d.data())), err);

// ---------- Identity verification (KYC) ----------
export const watchKyc = cb => onSnapshot(doc(db, "kyc", uid()), s => cb(s.exists() ? s.data() : null), err);
const IMGBB_KEY = "5c2514e109aceede8ec393481e57c849";
async function uploadImgBB(blob) {
  const fd = new FormData();
  fd.append("image", blob, "kyc.jpg");
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body: fd });
  const j = await res.json().catch(() => null);
  if (!res.ok || !j?.success) throw new Error(j?.error?.message || "Image upload failed");
  return j.data.url;
}
export async function submitKyc(meta, files) {
  const [front, back, selfie] = await Promise.all(["front", "back", "selfie"].map(k => uploadImgBB(files[k])));
  await setDoc(doc(db, "kyc", uid()), { uid: uid(), ...meta, front, back, selfie, status: "pending", note: "", createdAt: serverTimestamp() });
}

// ---------- Chip mining (buy now, auto-start, auto-credit) ----------
export const watchMinings = cb => onSnapshot(query(collection(db, "minings"), where("uid", "==", uid())), s => cb(sortNew(s.docs.map(d => ({ id: d.id, ...d.data() })))), err);

// One-time fee that unlocks a chip so it becomes buyable for this user.
export function unlockItem(itemId, cost) {
  return writeBatch(db).update(doc(db, "users", uid()), { balance: increment(-Number(cost)), unlockedItems: arrayUnion(itemId) }).commit();
}

export function buyChip(m) {
  const b = writeBatch(db);
  b.update(doc(db, "users", uid()), { balance: increment(-Number(m.amount)), nftCount: increment(1) });
  b.set(doc(collection(db, "minings")), { uid: uid(), ...m, status: "mining", createdAt: serverTimestamp() });
  return b.commit();
}

export function claimCheckin(day, points) {
  return writeBatch(db).update(doc(db, "users", uid()), { points: increment(points), lastCheckin: day }).commit();
}
// prize: { type: "apt" | "points" | "trx" | "ton", amount } — spin costs `cost` points. spin = { count, start } tracks the 12h window.
export function spinWin(cost, prize, spin) {
  const delta = prize.type === "points" ? (Number(prize.amount) - cost) : -cost;
  const u = { points: increment(delta) };
  if (prize.type === "apt") { u.balance = increment(Number(prize.amount)); u.totalRevenue = increment(Number(prize.amount)); }
  if (spin) { u.spinCount = spin.count; u.spinWindowStart = spin.start; }
  return writeBatch(db).update(doc(db, "users", uid()), u).commit();
}

const claiming = new Set();
export function claimMatured(rows) {
  const now = Date.now(), b = writeBatch(db);
  let gain = 0, n = 0;
  for (const m of rows) {
    const end = m.maturedAt?.toMillis ? m.maturedAt.toMillis() : Number(m.maturedAt) || 0;
    if (m.status !== "mining" || end > now || claiming.has(m.id)) continue;
    b.update(doc(db, "minings", m.id), { status: "done", claimedAt: serverTimestamp() });
    claiming.add(m.id); gain += Number(m.gain) || 0; n++;
  }
  if (!n) return Promise.resolve(0);
  b.update(doc(db, "users", uid()), { balance: increment(gain), totalRevenue: increment(gain), todayEarnings: increment(gain) });
  return b.commit().then(() => n).catch(e => { for (const m of rows) claiming.delete(m.id); throw e; });
}
