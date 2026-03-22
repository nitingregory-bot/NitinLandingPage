// Supabase config
const SUPABASE_URL = 'https://qjpvrnlvmaeycpgpkqev.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcHZybmx2bWFleWNwZ3BrcWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODE5MDAsImV4cCI6MjA4OTY1NzkwMH0.rg6AOXN0RvJizjdmmMKrVD-sSzW9pbJq_is4Z0joMH0';

// Create client - avoid naming collision with global 'supabase'
var sb;
try {
  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  console.error('Supabase init failed:', e);
}

// Get base path (works on GitHub Pages subfolders)
function getBasePath() {
  var path = window.location.pathname;
  return path.substring(0, path.lastIndexOf('/') + 1);
}

// Get session with 3s timeout
function getSession() {
  return new Promise(function(resolve) {
    if (!sb) { resolve(null); return; }
    var done = false;
    var timer = setTimeout(function() {
      if (!done) { done = true; resolve(null); }
    }, 3000);
    sb.auth.getSession().then(function(result) {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve(result.data.session);
      }
    }).catch(function() {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve(null);
      }
    });
  });
}

// Redirect to login if not authenticated
function requireAuth() {
  return getSession().then(function(session) {
    if (!session) {
      window.location.replace(getBasePath() + 'login.html');
      return null;
    }
    return session;
  });
}

// Redirect to index if already logged in
function redirectIfLoggedIn() {
  return getSession().then(function(session) {
    if (session) {
      window.location.replace(getBasePath() + 'index.html');
    }
  });
}

// Sign out
function signOut() {
  if (!sb) {
    window.location.replace(getBasePath() + 'login.html');
    return;
  }
  sb.auth.signOut().catch(function(){}).then(function() {
    window.location.replace(getBasePath() + 'login.html');
  });
}
