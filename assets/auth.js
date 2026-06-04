const SUPABASE_URL = 'https://wvxgkadxqzftjrtxotuw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2eGdrYWR4cXpmdGpydHhvdHV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjY1NjQsImV4cCI6MjA5NjE0MjU2NH0.AT1jTT9HzLDyGRf0huj_wAzdoJjgbDFIAn8PJvVhJfo';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function requireSession(redirectTo = 'index.html') {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { location.href = redirectTo; return null; }
  return session;
}

function getRole(session)    { return session?.user?.app_metadata?.role || 'anon'; }
function getCoachId(session) { return session?.user?.app_metadata?.coach_id || null; }

async function requireRole(role) {
  const session = await requireSession();
  if (!session) return null;
  if (getRole(session) !== role) { location.href = 'journal.html'; return null; }
  return session;
}

async function logout() { await sb.auth.signOut(); location.href = 'index.html'; }

sb.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') location.href = 'index.html';
});
