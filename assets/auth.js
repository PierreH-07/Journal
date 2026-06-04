const SUPABASE_URL = 'https://bpdxdljctybdmtemubjh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwZHhkbGpjdHliZG10ZW11YmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NzA2MTgsImV4cCI6MjA5NTU0NjYxOH0.b5GKWWTWTsrYPGmVPvexLWqAiQvkMl43Pzo96mz6lQw';
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
