
// @ts-ignore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
// @ts-ignore
import { getDatabase, ref, onValue, set, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

/**
 * ADVANCED REAL-TIME CLOUD SYNC ENGINE
 * 
 * This module is completely isolated. It hooks into the browser's storage
 * to broadcast changes to all other connected devices via Firebase.
 */

const firebaseConfig = {
  apiKey: "AIzaSyBPGD0QVNForPbJha-FojihJ-Ajl3err5A",
  authDomain: "rpirsg-520b5.firebaseapp.com",
  databaseURL: "https://rpirsg-520b5-default-rtdb.firebaseio.com",
  projectId: "rpirsg-520b5",
  storageBucket: "rpirsg-520b5.firebasestorage.app",
  messagingSenderId: "233215807291",
  appId: "1:233215807291:web:972c04bb9dbd7f4fa6b11e",
  measurementId: "G-6PQ1JVQ6J2"
};

// Initialize
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const SYNC_PATH = "rpirsg_global_v2";

const syncKeys = [
  'rover_org_messages',
  'rover_org_stats',
  'rover_org_logo',
  'rover_org_banners',
  'rover_org_about_image',
  'rover_org_about_content',
  'rover_org_members',
  'rover_org_info_sections',
  'rover_org_accounts',
  'rover_org_activity_logs'
];

let isSyncingFromCloud = false;

/**
 * INITIAL BOOTSTRAP:
 * Pull all cloud data immediately on startup so new devices 
 * have accounts/data ready for login.
 */
const bootstrapSync = async () => {
  try {
    const snapshot = await get(child(ref(db), SYNC_PATH));
    if (snapshot.exists()) {
      const data = snapshot.val();
      isSyncingFromCloud = true;
      let updated = false;
      
      syncKeys.forEach(key => {
        const sanitizedKey = key.replace(/[.#$[\]/]/g, '_');
        if (data[sanitizedKey] && data[sanitizedKey].payload !== localStorage.getItem(key)) {
          if (data[sanitizedKey].payload === null) {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, data[sanitizedKey].payload);
          }
          updated = true;
        }
      });
      
      isSyncingFromCloud = false;
      if (updated) {
        console.log("Sync Engine: Initial cloud data localized.");
        // No reload here to avoid infinite loops on startup, 
        // the app components will read these values on their first useEffect.
      }
    }
  } catch (e) {
    console.warn("Sync Engine: Bootstrap failed (Check Database Rules).");
  }
};

bootstrapSync();

/**
 * REAL-TIME LISTENER:
 * React to changes made on other devices instantly.
 */
onValue(ref(db, SYNC_PATH), (snapshot) => {
  const remoteData = snapshot.val();
  if (!remoteData || isSyncingFromCloud) return;

  let needsRefresh = false;
  isSyncingFromCloud = true;

  syncKeys.forEach(key => {
    const sanitizedKey = key.replace(/[.#$[\]/]/g, '_');
    const remoteValue = remoteData[sanitizedKey]?.payload;
    const localValue = localStorage.getItem(key);

    if (remoteValue !== undefined && remoteValue !== localValue) {
      if (remoteValue === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, remoteValue);
      }
      needsRefresh = true;
    }
  });

  isSyncingFromCloud = false;

  if (needsRefresh) {
    console.log("Sync Engine: Real-time update detected. Local storage updated.");
    // window.location.reload(); // Disabled as per user request to stop auto-refreshing
  }
}, (error) => {
  if (error.message.includes("PERMISSION_DENIED")) {
    console.warn("Cloud Sync: Read access denied. Real-time updates disabled.");
  }
});

/**
 * INTERCEPTOR:
 * Automatically push every local save to the cloud.
 */
const originalSetItem = Storage.prototype.setItem;
Storage.prototype.setItem = function(key: string, value: string) {
  originalSetItem.apply(this, [key, value]);

  if (!isSyncingFromCloud && syncKeys.includes(key)) {
    const sanitizedKey = key.replace(/[.#$[\]/]/g, '_');
    set(ref(db, `${SYNC_PATH}/${sanitizedKey}`), {
      payload: value,
      ts: Date.now()
    }).catch(err => {
      if (err.message.includes("PERMISSION_DENIED")) {
        // Silent fail or warning - Database rules are likely expired or locked
        console.warn("Cloud Sync: Database is currently in read-only mode or locked. Changes will remain local.");
      } else {
        console.error("Cloud Sync Error:", err);
      }
    });
  }
};

const originalRemoveItem = Storage.prototype.removeItem;
Storage.prototype.removeItem = function(key: string) {
  originalRemoveItem.apply(this, [key]);

  if (!isSyncingFromCloud && syncKeys.includes(key)) {
    const sanitizedKey = key.replace(/[.#$[\]/]/g, '_');
    set(ref(db, `${SYNC_PATH}/${sanitizedKey}`), {
      payload: null,
      ts: Date.now()
    });
  }
};

console.log("✅ RPIRSG Cloud Sync Active (RTDB V2)");
