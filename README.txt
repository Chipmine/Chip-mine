# NFT Dashboard — Frontend Template

This is a responsive HTML/CSS/JavaScript frontend inspired by the screenshots you supplied.

## Run it
1. Extract the ZIP.
2. Open `index.html` in a browser.
3. For local development, open the folder in VS Code and use the Live Server extension if installed.

## Customize
- **Text, brand, account values:** edit `SITE_CONFIG` at the top of `app.js`.
- **Market rows:** edit the `COLLECTIONS` array in `app.js`.
- **Colors, fonts, spacing, layout:** edit CSS variables at the top of `style.css`.
- **NFT pictures:** put image files in `assets/`, then set an item's `image: "assets/my-image.jpg"` in `COLLECTIONS`. Remove or change the `icon` if you prefer.
- **Level card pictures:** replace the emoji in each `.level-thumb` in `index.html`, or use an `<img>` element with your own asset path.
- **Login logo:** replace the `✦` inside `.brand-mark` in `index.html` with your logo image.

## Setup (Firebase project: chipmain)
1. Authentication -> Sign-in method: enable Email/Password, Phone, Google. Settings -> Authorized domains: add your site domain.
2. Firestore Database -> create database, then paste firestore.rules in Rules and Publish.
3. Host over HTTPS (Firebase Hosting). ES modules/login do not work from file://.
4. Phone login sends real SMS and needs the Blaze (billing) plan; add test numbers in the console while testing.

## ADMIN PANEL  (open: https://YOUR-SITE/admin/)
First-time setup (once):
1. Open /admin/ and sign in with the email/Google account you want as owner. You will see "No admin access" and your UID - tap Copy UID.
2. Firebase Console -> Firestore -> Start collection "admins" -> Document ID = that UID -> field role (string) = owner -> Save.
3. Reload /admin/. Add more admins later from Admin panel -> Admins (role owner = everything, staff = verifications, messages, announcements, points mall).
4. Publish the new firestore.rules and storage.rules. When Storage rules ask to allow cross-service access to Firestore, accept it (needed so admins can view ID photos).
What the panel does:
- Dashboard: users, verified users, balances, pending queues, 7-day deposit/withdraw chart, recent admin activity.
- Verifications: view front/back/live selfie, approve, reject (with reason), revoke.
- Deposits: approve = credits user balance atomically (+ ledger entry). Withdrawals: approve = checks and debits balance atomically, optional payout TXID note. Redemptions (points) and Level requests: approve/reject.
- Users: search/filter, wallet adjust (add/subtract/set any field with a required reason + history), suspend/unblock, rename, set level, private note, referrals, wallet history, CSV export.
- Messages: reply to users. Announcements and Points mall: create/edit/delete. Settings: deposit address, minimum withdrawal.
- Audit log of every admin action (owner only). All money actions are owner-only and also enforced by the Firestore rules.
Limits: lists load the newest 300 records (search works inside those); the main site needs no change for the panel.

## Identity verification (KYC)
- Profile -> Verify Identity. Countries: Bangladesh, India, Nepal (edit KYC_COUNTRIES in app.js). Documents: NID/Aadhaar + Passport, front and back photos, plus a LIVE camera selfie (no upload for selfie).
- Until approved, a user cannot recharge, withdraw, redeem/upgrade (trade) or use referrals. This is enforced in firestore.rules, not just the UI.
- Firebase Console -> Storage -> Get started, then paste storage.rules and Publish. (Storage needs the Blaze plan.)
- Review: Firestore kyc/{uid} has country, docType, fullName, docNumber. Images are in Storage at kyc/{uid}/front.jpg, back.jpg, selfie.jpg.
- Approve in the Admin panel (Verifications) or set kyc/{uid}.status to "approved" (or "rejected" + note: the user can then resubmit).
- Referral signups count only if the referrer was already verified when the friend joined.
- These are sensitive personal documents: keep Storage/Firestore rules locked, limit who can open the console, and follow local data-protection law.

## Firestore content you manage (console)
- settings/site: depositAddress (string), minWithdraw (number)
- announcements/{id}: title, text, createdAt
- mall/{id}: title, points (number)
- users/{uid}: balance, frozen, points, totalRevenue, inviteRevenue, todayEarnings, nftCount (users cannot edit these; you set them)
- Requests from users appear in: deposits, withdrawals, redemptions, levelRequests, messages. Set status to approved/rejected; reply to a user by adding a messages doc {uid, from:"admin", text, createdAt}.

## Notes
- No login needed to browse. Login: Profile -> Login / Sign Up (Email, Phone, Google).
- Withdrawals need a Payment Password (Profile menu). Requests do not lock funds; check balance when approving.
- Chips: edit CHIPS in app.js; images in assets/chips/. Language switch (English/Bangla) is in the Profile menu.
