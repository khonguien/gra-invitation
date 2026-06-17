# Project Status Summary

Last Updated: 2026-06-18T01:05:00+08:00

Here is the current working status and features implemented in the graduation invitation project:

### 1. Global Real-time Wishes Board (Firebase Integration)
* **Real-time Synchronization:** Migrated the guestbook wishes board from a local storage-only model to a global backend using **Firebase Realtime Database**. Notes update, move, or delete instantly across all devices.
* **Auto-Fallback:** If the Firebase config in `script.js` is left unconfigured, the wishes system gracefully falls back to using `localStorage` to ensure local development and testing never break.
* **Note Ownership:** Generates a persistent browser identifier (`graduation_wish_creator_id` in `localStorage`) so that normal guests can only edit, drag, or delete wishes they created in their current browser.
* **Admin Moderation Mode:** Added an admin bypass query parameter (`?admin=admin123`, customizable). Elevates the user to admin mode to move, clean up, or delete any wishes on the board.
* **Flicker Protection:** Prevents layout stuttering by pausing DOM updates of active wishes if a real-time update is received while the user is dragging a note.

### 2. Music Player (SoundCloud & Native Fallback)
* **SoundCloud Widget:** Replaced the large inline widget card with a floating popover menu (`#music-popup`) that loads a compact SoundCloud player iframe.
* **Disc Animation Sync:** Syncs the SoundCloud widget's playing state with the spinning button disc animation in the bottom-right using the `SC.Widget` API.
* **HTML5 Fallback:** If SoundCloud is blocked or offline, it gracefully falls back to playing a local native MP3 player (`Dream a little dream of me`).

### 3. Typography & UI Uniformity
* **Font Family:** Standardized all headings, text, and components to **Montserrat** (removing Outfit and Playfair Display overrides) to keep the scrapbook design clean and premium.
* **Tailwind Config:** Custom `sans` and `serif` Tailwind font-family overrides are routed to `'Montserrat', sans-serif` directly in `index.html`.

### 4. Countdown Timer
* **Real-time Countdown:** A countdown clock (`cd-days`, `cd-hours`, `cd-seconds`) targeting November 1st, 2026 at 18:00:00.
* **Formatting:** Pads numbers with leading zeros (e.g. `09` instead of `9`) and translates dynamically between Vietnamese and English.

### 5. Corkboard Boundaries & Cache Busting
* **Boundary Restrictions:** Drag constraints in `updatePosition` calculate borders using unrotated dimensions (`offsetWidth`/`offsetHeight`), allowing notes to be dragged extremely close to borders.
* **Size Expansion:** Expanded the corkboard minimum height to `700px` on desktop and `550px` on mobile for plenty of space.
* **Cache Busting:** Bumped stylesheet and script link parameters in `index.html` to `v=1.1.0` to force all browsers to bypass caches and immediately load the live Firebase real-time wishes board updates.