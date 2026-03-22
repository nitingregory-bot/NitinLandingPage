// Supabase config
const SUPABASE_URL = 'https://qjpvrnlvmaeycpgpkqev.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcHZybmx2bWFleWNwZ3BrcWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODE5MDAsImV4cCI6MjA4OTY1NzkwMH0.rg6AOXN0RvJizjdmmMKrVD-sSzW9pbJq_is4Z0joMH0';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get base path (works on both localhost and GitHub Pages)
function getBasePath() {
  const path = window.location.pathname;
  return path.substring(0, path.lastIndexOf('/') + 1);
}

// Check if user is logged in
async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Redirect to login if not authenticated
async function requireAuth() {
  const session = await getSession();
  if (!session) {
    window.location.href = getBasePath() + 'login.html';
  }
  return session;
}

// Redirect to index if already authenticated
async function redirectIfLoggedIn() {
  const session = await getSession();
  if (session) {
    window.location.href = getBasePath() + 'index.html';
  }
}

// Sign out
async function signOut() {
  await supabase.auth.signOut();
  window.location.href = getBasePath() + 'login.html';
}
