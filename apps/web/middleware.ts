import { auth as middleware } from "./lib/auth";

export default middleware((req, ctx) => {
  const isLoggedIn = !!req.auth;
  const { pathname, origin } = req.nextUrl;

  // Define route checks
  const isApiAuthRoute = pathname.startsWith("/api/auth");
  const isAuthRoute = pathname.startsWith("/auth");
  const isDashboardRoute = pathname.startsWith("/chat");

  // Allow API and public auth routes without redirection
  if (isApiAuthRoute) {
    return; // Return void instead of null
  }

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(`${origin}/chat`);
  }

  // Redirect unauthenticated users from dashboard to login
  if (!isLoggedIn && isDashboardRoute) {
    return Response.redirect(`${origin}/auth/login`);
  }

  // Return void explicitly for paths that require no redirection
  return;
});
