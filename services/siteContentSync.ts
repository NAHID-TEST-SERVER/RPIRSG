
// @ts-ignore
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
// @ts-ignore
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/**
 * BINDING SYSTEM:
 * Automatically connects DOM elements with [data-fb] to Firebase paths.
 */
export const initSiteContentSync = () => {
  console.log("🚀 Firebase Live Update Engine Active");
  
  // Initial scan
  scanAndBind();

  // Watch for DOM changes (React updates)
  const observer = new MutationObserver((mutations) => {
    scanAndBind();
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

function scanAndBind() {
  const elements = document.querySelectorAll('[data-fb]:not([data-fb-bound])');
  elements.forEach(el => {
    const path = el.getAttribute('data-fb');
    const type = el.getAttribute('data-type') || 'text';

    if (path) {
      el.setAttribute('data-fb-bound', 'true');
      onValue(ref(db, path), (snapshot) => {
        const value = snapshot.val();
        // Fallback: Only apply if data exists in Firebase
        if (value !== null && value !== undefined) {
          applyValue(el, value, type);
        }
      });
    }
  });
}

function applyValue(el: Element, value: any, type: string) {
  try {
    if (type === 'text') {
      el.textContent = value;
    } else if (type === 'html') {
      el.innerHTML = value;
    } else if (type === 'src') {
      el.setAttribute('src', value);
    } else if (type === 'href') {
      el.setAttribute('href', value);
    } else if (type.startsWith('attr:')) {
      const attrName = type.split(':')[1];
      el.setAttribute(attrName, value);
    }
  } catch (e) {
    console.error("Firebase Sync: Error applying value", e);
  }
}

/**
 * REACT STATE SYNC:
 * Helper to sync a Firebase path directly to a React state setter.
 */
export const syncFirebasePathToState = (path: string, callback: (data: any) => void) => {
  onValue(ref(db, path), (snapshot) => {
    const data = snapshot.val();
    if (data !== null && data !== undefined) {
      callback(data);
    }
  }, (error) => {
    console.error(`Firebase State Sync Error for ${path}:`, error);
  });
};

/**
 * WRITE TO FIREBASE:
 * Helper to update a path in Firebase.
 */
export const updateFirebasePath = async (path: string, value: any) => {
  // @ts-ignore
  const { getDatabase, ref, set } = await import("https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js");
  const db = getDatabase();
  try {
    await set(ref(db, path), value);
    console.log(`✅ Firebase Update Success: ${path}`);
  } catch (error) {
    console.error(`❌ Firebase Update Error for ${path}:`, error);
    throw error;
  }
};
