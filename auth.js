// Supabase config
const SUPABASE_URL = 'https://qjpvrnlvmaeycpgpkqev.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcHZybmx2bWFleWNwZ3BrcWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODE5MDAsImV4cCI6MjA4OTY1NzkwMH0.rg6AOXN0RvJizjdmmMKrVD-sSzW9pbJq_is4Z0joMH0';

let supabase;
try {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  console.error('Failed to create Supabase client:', e);
}

// Get base path
function getBasePath() {
  const path = window.location.pathname;
  return path.substring(0, path.lastIndexOf('/') + 1);
}

// Check session with timeout
function getSession() {
  return new Promise((resolve) => {
    // 3 second timeout - if Supabase hangs, resolve null
    const timer = setTimeout(() => resolve(null), 3000);

    if (!supabase) {
      clearTimeout(timer);
      resolve(null);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      clearTimeout(timer);
      resolve(data.session);
    }).catch(() => {
      clearTimeout(timer);
      resolve(null);
    });
  });
}

// Redirect to login if not authenticated
async function requireAuth() {
  const session = await getSession();
  if (!session) {
    window.location.replace(getBasePath() + 'login.html');
    return null;
  }
  return session;
}

// Redirect to index if already authenticated
async function redirectIfLoggedIn() {
  const session = await getSession();
  if (session) {
    window.location.replace(getBasePath() + 'index.html');
  }
}

// Sign out
async function signOut() {
  if (supabase) {
    try { await supabase.auth.signOut(); } catch(e) {}
  }
  window.location.replace(getBasePath() + 'login.html');
}
